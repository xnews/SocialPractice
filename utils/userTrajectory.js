function initUserTrajectory() {
  var that = this;

  // 获取用户操作轨迹
  that.getUserTrajectory = function(opType, opEvent, opEventId, opnEventDetail) {
    //userTrajectoryArr = '用户轨迹数组',opTime = '操作的时间戳', pagePath = '页面路径'
    //opType = '操作类型', opEvent = '操作事件',opEventId = '操作事件ID',opnEventDetail = '操作事件详情'

    let pagePath = getCurrentPages()[getCurrentPages().length - 1].route;
    let itemObj = {
      opTime: new Date().getTime(),
      pagePath,
      opType,
      opEvent,
      opEventId,
      opnEventDetail
    };
    // console.log('itemObj', itemObj)


    // 用户操作轨迹插入到缓存
    let userTrajectoryArr = wx.getStorageSync('userTrajectoryArr') ? wx.getStorageSync('userTrajectoryArr') : [];
    userTrajectoryArr.push(itemObj);
    wx.setStorageSync('userTrajectoryArr', userTrajectoryArr);

    if (that.rUTPromise) {
      that.rUTPromise.then(function(resolve) {
        that.funcRUTPromise(); //网络请求阻塞
      })
    } else {
      that.funcRUTPromise(); //网络请求阻塞
    }

  };

  //网络请求阻塞
  that.funcRUTPromise = function() {
    let nowTime = new Date().getTime();
    let userTrajectoryStartTime = wx.getStorageSync('userTrajectoryStartTime');

    return that.rUTPromise = new Promise((resolve) => {

      // 缓存长度大于等于10就提交到后端
      if (wx.getStorageSync('userTrajectoryArr').length >= 10) {
        that.requestUserTrajectory(resolve);
        return;
      }

      // 判断缓存时间，超过两分钟就提交到后端
      if (userTrajectoryStartTime) {
        if (nowTime - userTrajectoryStartTime > 2 * 60 * 1000) {
          console.log('用户轨迹缓存时间，超过两分钟');
          that.requestUserTrajectory(resolve);
        } else {
          resolve(true);
        }
      } else {
        wx.setStorageSync('userTrajectoryStartTime', nowTime);
        resolve(true);
      }
    })
  };
  // 提交用户操作轨迹
  that.requestUserTrajectory = function(resolve) {
    // intoId = '进入小程序的场景值ID', originId = '来源ID',userToken = '用户标识',upTime = '上传信息的时间戳',
    let appOption = wx.getLaunchOptionsSync();
    let intoId = appOption.scene;
    let originId;
    let userToken = wx.getStorageSync('openId');
    let upTime = new Date().getTime();

    // 获取来源ID
    if (appOption.referrerInfo && appOption.referrerInfo.extraData && appOption.referrerInfo.extraData.originId) {
      originId = appOption.referrerInfo.extraData.originId;
    }

    let data = {
      intoId,
      originId,
      userToken,
      upTime,
      userTrajectoryArr: []
    };
    let utArr = wx.getStorageSync('userTrajectoryArr'); //当前的用户轨迹缓存数组
    data.userTrajectoryArr = JSON.stringify(utArr);
    console.log('用户轨迹:', data);
    return data
    // wx.request({
    //   url: config.reqUrl + '/v1/trajectory/save.do',
    //   // url: 'http://192.168.0.103:17011/v1/trajectory/save.do',
    //   method: 'POST',
    //   header: {
    //     "Content-Type": "application/x-www-form-urlencoded"
    //   },
    //   data: data,
    //   success: function(res) {
    //     wx.setStorageSync('userTrajectoryArr', that.arrayWeightRemoval(utArr, wx.getStorageSync('userTrajectoryArr')));
    //     wx.setStorageSync('userTrajectoryStartTime', new Date().getTime());
    //     console.log('save.do-res', res);
    //     resolve(res);
    //   },
    //   fail: function(err) {
    //     console.log('save.do-err', err);
    //     resolve(err);
    //   }
    // })

  };

  // 数据去重
  that.arrayWeightRemoval = function(array1, array2) {

    //临时数组存放
    var tempArray1 = []; //临时数组1
    var tempArray2 = []; //临时数组2

    for (var i = 0; i < array2.length; i++) {
      tempArray1[array2[i]] = true; //将数array2 中的元素值作为tempArray1 中的键，值为true；
    }

    for (var i = 0; i < array1.length; i++) {
      if (!tempArray1[array1[i]]) {
        tempArray2.push(array1[i]); //过滤array1 中与array2 相同的元素；
      }
    }
    return tempArray2;
  }
}

module.exports = {
  initUserTrajectory: initUserTrajectory
}