// location_check_in/location_check_in.js
const util = require('../../utils/_util')
const utilSign = require('../../utils/util')
const app = getApp()
const urlList = require("../../utils/api.js");  // 根据实际项目自己配置
var intTime;
var addTime;
// 实例化API核心类
const qqmapsdk = app.globalData.qqmapsdk

var EARTH_RADIUS = 6378.137; //地球半径
function rad(d) {
    return d * Math.PI / 180.0;
}
function getDistance(lng1, lat1, lng2, lat2) {
  var radLat1 = rad(lat1);
  var radLat2 = rad(lat2);
  var a = radLat1 - radLat2;
  var b = rad(lng1) - rad(lng2);
  var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2)
    + Math.cos(radLat1) * Math.cos(radLat2)
    * Math.pow(Math.sin(b / 2), 2)));
  s = s * EARTH_RADIUS;
  s = Math.round(s * 10000) / 10000;
  return s;//返回数值单位：公里
}

// 时间格式
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
App.Page({
  useStore: true, //当前页面使用状态管理
  useProp: ["activities"],
  data: {
    markers: [],
    poi: {
      latitude: '',
      longitude: ''
    },
    poiDest: {
      latitude: '',
      longitude: ''
    },
    addressName: '',
    time: '',
    timer: '',
    timer2: '',  // 用来每个一段时间自动刷新一次定位
    canClick: true,
    hour: 0,
    minute: 0,
    second: 0,
    timecount: '00:00:00',
    clickStatus: null,
    points: [],
    pointsDest: [],
    polyline: [],
    circles: [],
    distance: 0,
    signInTime: "",
    signBackTime: ""
  },
  // 个人签到信息
  // getProfileActivityIn() {
  //   const that = this
  //   const stuNum = wx.getStorageSync('stuNum')
  //   return new Promise((resolve,reject)=> {
  //     const profileActivityId = wx.getStorageSync('profileActivityId')
  //     wx.cloud.callFunction({
  //       name: 'getActivityDetail',
  //       data: {
  //         id:profileActivityId
  //       }
  //     }).then(res => {
  //       const {signInTime,signBackTime} = res.result.data[0]
  //       resolve(signInTime)
  //       reject(signBackTime)
  //     })
  //   })
  // },
  // 添加签到人数
  addSignInNum (profileActivityId) {
    wx.cloud.callFunction({
      name: 'updateSignIn',
      data: {
        _id: profileActivityId
      }
    })
  },
  // 添加签退人数
  addSignBackNum(profileActivityId) {
    wx.cloud.callFunction({
      name: 'updateSignBackNum',
      data: {
        _id: profileActivityId
      }
    })
  },
  // 获取个人活动更新签到状态
  getProfileActivityStatus() {
    const that = this
    const stuNum = wx.getStorageSync('stuNum')
    const profileActivityId = wx.getStorageSync('profileActivityId')
    wx.cloud.callFunction({
      name: 'getProfileActivity',
      data: {
        stuNum
      }
    }).then(res => {
      // console.log(res,'个人活动')
      const {activity} = res.result.data[0]
      const myactivity = activity.find(item => item._id === profileActivityId)
      // console.log(myactivity,'个人活动')
      const {status} = myactivity
      if(status === "签到"){
        that.setData({
          clickStatus: 0
        })
      }else if(status === "签退"){
        that.setData({
          clickStatus: 1
        })
      }else if(status === "活动结束"){
        that.setData({
          clickStatus: -1
        })
      }
    })
  },
  // 获取签到的活动
  getActivity() {
    const profileActivityId = wx.getStorageSync('profileActivityId')
    // const index = Number(profileActivityId)
    let { activities } = app.store.getState();
    // console.log(activities)
    const activity = activities.find(item => item._id === profileActivityId)
    return activity
    // console.log(activity,'活动')
  },
  // 获取签到信息
  getActivitySign() {
    const activity = this.getActivity()
    const signInTime = utilSign.formatTime(new Date(activity.signInTime))
    const signBackTime = utilSign.formatTime(new Date(activity.signBackTime))
    // console.log(deadline,'截止时间')
    this.setData({
      signInTime,
      signBackTime
    })
  },
  addActivityIn(poi) {
    const site = wx.getStorageSync('site')
    // const {latitude,longitude} = wx.getStorageSync('Mypoints')
    const _id = wx.getStorageSync('profileActivityId')
    const name = wx.getStorageSync('name')
    const stuNum = wx.getStorageSync('stuNum')
    wx.cloud.callFunction({
      name: "addActivityIn",
      data: {
        stuName:name,activityId: _id,site,location: poi,stuNum
      }
    })
  },
  updateActivityIn(poi) {
    const site = wx.getStorageSync('site')
    // const {latitude,longitude} = wx.getStorageSync('Mypoints')
    const _id = wx.getStorageSync('profileActivityId')
    const name = wx.getStorageSync('name')
    const stuNum = wx.getStorageSync('stuNum')
    wx.cloud.callFunction({
      name: 'updateActivityIn',
      data: {
        stuNum,activityId: _id,location: poi
      }
    })
  },
  getAddress(e) {
    var that = this;
    const markers = this.data.markers;
    const points = this.data.points;
    qqmapsdk.reverseGeocoder({
      //位置坐标，默认获取当前位置，非必须参数
      /**
       * 
        location: {
          latitude: 39.984060,
          longitude: 116.307520
        },
      */
      // 成功后的回调      
      success: function(res) {
        // console.log(res,'初始位置');
        that.setData({
          addressName: res.result.address
        })
        var res = res.result;
        //当get_poi为0时或者为不填默认值时，检索目标位置，按需使用
        markers.push({ // 获取返回结果，放到mks数组中
          title: res.address,
          id: 0,
          latitude: res.location.lat,
          longitude: res.location.lng,
          iconPath: '../../images/hdqd/myPosition.png', // 图标路径
          width: 21,
          height: 28,
          // callout: { //在markers上展示地址名称，根据需求是否需要
          //   content: res.address,
          //   color: '#000',
          //   display: 'ALWAYS'
          // }
        });
        points.push({            
          latitude: res.location.lat,
          longitude: res.location.lng
        });
        that.getRoute(points[points.length-1])
        // that.addActivityIn(points[points.length-1])
        that.updateActivityIn(points[points.length-1])  //更新地理位置
        wx.setStorageSync('Mypoints', points[points.length-1])
        that.setData({ // 设置markers属性和地图位置poi，将结果在地图展示
          markers,
          poi: {
            latitude: res.location.lat,
            longitude: res.location.lng
          },
          points
        });
      },
      fail: function(error) {
        console.error(error);
      }
    })
  },
  // 标记活动目的地
  getSite(){
    // const {_id,site} = wx.getStorageSync('activities')[0]
    const id = wx.getStorageSync('profileActivityId')
    let { activities } = app.store.getState();
    // 活动场地
    let { site } = activities.find(item => item._id === id)
    wx.setStorageSync('site', site)
    const markers = this.data.markers;
    const points = this.data.points;
    const _this = this;
    qqmapsdk.geocoder({
      address: site,
      success: function(res) {//成功后的回调
        var res = res.result;
        let poiDest = {
          latitude: res.location.lat,
          longitude: res.location.lng
        }
        // console.log(poiDest,'123')
        wx.setStorageSync('poiDest', poiDest)
        //根据地址解析在地图上标记解析地址位置
        markers.push({ // 获取返回结果，放到mks数组中
          title: res.title,
          id: 1,
          latitude: res.location.lat,
          longitude: res.location.lng,
          iconPath: '../../images/hdqd/destination.png', // 图标路径
          width: 35,
          height: 35
        });
        points.push({            
          latitude: res.location.lat,
          longitude: res.location.lng
        });
        _this.circleRange(res.location.lat,res.location.lng)
        _this.setData({ // 获取返回结果，放到markers及poi中，并在地图展示
          markers,points,poiDest
          // 'poiDest.latitude': res.location.lat.toString(),
          // 'poiDest.longitude': res.location.lng.toString()
        });
        // console.log(poiDest,'6666')

      },
      fail: function(error) {
        console.error(error);
      }
    })
    },
    // 获取规划路线
  getRoute(poi) {
    var _this = this;
    const poiDest = wx.getStorageSync('poiDest')
    // console.log('路线规划')
    qqmapsdk.direction({
      // mode: '',  //路线模式
      from: poi,
      to: poiDest,
      success: function (res) {
        // console.log(res);
        var ret = res;
        var coors = ret.result.routes[0].polyline, pl = [];
        //坐标解压（返回的点串坐标，通过前向差分进行压缩）
        var kr = 1000000;
        for (var i = 2; i < coors.length; i++) {
          coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr;
        }
        //将解压后的坐标放入点串数组pl中
        for (var i = 0; i < coors.length; i += 2) {
          pl.push({ latitude: coors[i], longitude: coors[i + 1] })
        }
        // console.log(pl)
        //设置polyline属性，将路线显示出来,将解压坐标第一个数据作为起点
        _this.setData({
          // latitude:pl[0].latitude,
          // longitude:pl[0].longitude,
          polyline: [{
            points: pl,
            color: '#2c84ff',
            width: 6,
            borderColor: '#0058e5',
            borderWidth: 2
          }]
        })
      },
      fail: function (error) {
        console.error(error);
      }
      // complete: function (res) {
      //   console.log(res);
      // }
    });
  },
  // 开始获取实时地理位置变化事件
  startLoc() {
    let self = this
    // 开启小程序进入前台时接收位置消息
    wx.startLocationUpdate({
      success: (res) => {
        console.log('success---', res)
        self.getLocationSecond()
      },
      fail: (res) => {
        console.log('fail==',res)
        wx.stopLocationUpdate({success: (res) => {}})
        // 取消监听实时地理位置变化事件
        wx.offLocationChange((result) => {})
      }
    })
  },
  getLocationSecond() { // 获取定位信息
    // 监听实时地理位置变化事件
    const that = this
    wx.onLocationChange((res) => {
      console.log('success-onLocationChange---', res)
      let poi = that.data.poi
      poi = {
        latitude: res.latitude,
        longitude: res.longitude
      }
      console.log(poi,'poi')
      that.getRoute(poi)
      that.setData({
      //   latitude: res.latitude,
      //   longitude: res.longitude,
        poi
      })
    });
  },
  getTime: function () {
    let that = this
    let time = that.data.time
    that.setData({
      timer: setInterval(function () {
        time = util.formatTime(new Date())
        that.setData({
          time: time.substr(-8)
        });
        // if (time == 0) {
        //   // 页面跳转后，要把定时器清空掉，免得浪费性能
        //   clearInterval(that.data.timer)
        // }
      }, 1000)
    })
  },
  rePosition: function () {
    console.log('用户点了重新定位')
    this.getAddress()
  },
  // 更新活动状态
  updateProfileActivityStatus(status) {
    const stuNum = wx.getStorageSync('stuNum')
    const profileActivityId = wx.getStorageSync('profileActivityId')
    wx.cloud.callFunction({
      name: 'updateProfileActivityStatus',
      data: {
        stuNum,
        _id: profileActivityId,
        status: status
      }
    }).then(res => {
      console.log('更新成功',res)
    }).catch(err=> {
      console.log(err)
    })
  },
  // 更新签到状态
  updateAcitvityInStatus(status) {
    const profileActivityId = wx.getStorageSync('profileActivityId')
    const index = Number(profileActivityId)
    let { activities } = app.store.getState();
    console.log(activities)
    const activity = activities.find(item => item._id === profileActivityId)
    activity.activityInStatus = status
    activities.splice(index,1,activity)
    app.store.setState({
      activities
    })
    this.setData({
      clickStatus: status
    })
  },
  // 获取签到状态
  getAcitvityInStatus() {
    return new Promise(resolve => {
      const profileActivityId = wx.getStorageSync('profileActivityId')
      // const index = Number(profileActivityId)
      let { activities } = app.store.getState();
      // console.log(activities)
      const activity = activities.find(item => item._id === profileActivityId)
      let { activityInStatus } = activity
      resolve(activityInStatus)
    })
  },
  // 更新实践时长
  updatePracticeTime(time) {
    const profileActivityId = wx.getStorageSync('profileActivityId')
    let { activities } = app.store.getState();
    const activity = activities.find(item => item._id === profileActivityId)
    activity.practiceTime = time
    app.store.setState({
      activities
    })
  },
  // 获取实践时长
  getPracticeTime() {
    return new Promise(resolve => {
      const profileActivityId = wx.getStorageSync('profileActivityId')
      let { activities } = app.store.getState();
      const activity = activities.find(item => item._id === profileActivityId)
      let { practiceTime } = activity
      resolve(practiceTime)
    })
  },
  // 用户签到事件
  checkIn: function () {
    console.log('用户点击了签到')
    var that = this
    var nowTime = util.formatTime(new Date())
    const timeout = this.data.timecount
    const profileActivityId = wx.getStorageSync('profileActivityId')
    this.calcDistance()
    console.log(this.data.distance,'距离')
    this.getActivitySign()
    const signInTime = new Date(this.data.signInTime).getTime()
    const signBackTime = new Date(this.data.signBackTime).getTime()
    if(new Date().getTime()<signInTime) {
      wx.showToast({
        title: '活动未开始',
        icon: 'error'
      })
    }else if(this.data.distance>100){
      wx.showToast({
        title: '超出签到范围',
        icon: 'error'
      })
    }
    else {
      wx.showModal({
        title: '请确认位置信息',
        // content: '请确认待整改项已整改完毕！',
        content: `地点：${this.data.addressName}\n时间：${nowTime}`,  // 开发者工具上没有换行，真机调试时会有的
        confirmText: '确认',
        success (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            that.addActivityIn({latitude:26.657949,longitude:119.591517}) //添加默认的签到表
            wx.showToast({
              title: '签到成功'
            }).then(()=> {
              getApp().getUserTrajectory(5, 'Require', 'pages/activityIn/activityIn', '用户签到活动');//获取用户轨迹
              that.start()
              that.updateProfileActivityStatus('签退')
              that.addSignInNum(profileActivityId) //添加签到人数
            })
            // wx.setStorageSync('clickStatus', 1)
            that.updateAcitvityInStatus(1)
  
            
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }

  },
  // 签到时间转化为秒
  transformTime(time) {
    const hours = Number(time.split(':')[0])
    const minutes = Number(time.split(':')[1])
    const second = Number(time.split(':')[2])
    return second + minutes*60 + hours*3600
  },
  // 用户签退事件
  checkOut() {
    // console.log('用户点击了签签退')
    const {_id,site} = wx.getStorageSync('activities')[0]
    const stuNum = wx.getStorageSync('stuNum')
    const profileActivityId = wx.getStorageSync('profileActivityId')
    let that = this
    that.stop()
    this.getActivitySign()
    const signBackTime = new Date(this.data.signBackTime).getTime()
    wx.showModal({
      title: '请确认签退信息',
      content: `实践时长: ${this.data.timecount}`,
      confirmText: '确认',
      success(res) {
        if(res.confirm) {
          // console.log('用户确定签退')
          console.log(that.data.timecount,'that.data.timecount')
          // wx.setStorageSync('practiceTime', that.data.timecount)
          const practice_time = that.transformTime(that.data.timecount)
          if(practice_time<3600) {
            wx.showModal({
              title: '提示',
              content: '实践时长不少于1小时',
              confirmText: '确认',
            })
          }else if(new Date().getTime() > signBackTime) {
            wx.showToast({
              title: '超时签退失败',
              icon: 'error'
            }).then(() => {
              that.updateProfileActivityStatus('活动结束')
              that.updateAcitvityInStatus(-1)
              that.Reset()
              that.setData({
                canClick: false
              })
            })
          } else{
            wx.cloud.callFunction({
              name: 'UpdatePracticeTime',
              data: {
                stuNum: stuNum,
                practice_time
              }
            }).then(res =>{
              console.log('添加时长成功')
              getApp().getUserTrajectory(5, 'Require', 'pages/activityIn/activityIn', '用户签退活动');//获取用户轨迹
              wx.showToast({
                title: '签退成功',
                icon: 'success'
              })
            }).catch(err =>{
              console.log(err)
            })
            that.addSignBackNum(profileActivityId) //添加签退人数
            that.Reset()
            that.updateProfileActivityStatus('活动结束')
            // wx.setStorageSync('clickStatus', -1)
            that.updateAcitvityInStatus(-1)
            that.setData({
              canClick: false
            })
          }
        }else if(res.cancel) {
          // console.log('用户取消签退')
          that.Restart()
        }
      }
    })
  },

  // realyCheckIn: function() { 
  //   // 获取缓存中的活动id
  //   const {site} = wx.getStorageSync('activities')[0]
  //   const _id = wx.getStorageSync('activityId')
  //   console.log(_id,'11')
  //   const time = wx.getStorageSync('practiceTime')
  //   const poi = wx.getStorageSync('Mypoints')
  //   // console.log('id',_id)
  //   // 添加活动位置信息
  //   wx.cloud.callFunction({
  //     name: 'addActivityIn',
  //     data: {
  //       activityId: _id,
  //       site: site,
  //       time,
  //       location: poi
  //     }
  //   })
  // },
  // 开始计时
  start() {
    var that = this;
    //停止（暂停）
    clearInterval(intTime);
    //时间重置
    that.setData({
      hour: 0,
      minute: 0,
      second: 0
    })
    intTime = setInterval(function () { that.timer() }, 1000);
  },
  // 暂停计时
  stop() {
    clearInterval(intTime);
  },
  // 继续计时
  Restart() {
    var that = this;
    intTime = setInterval(function () { that.timer() }, 1000);
  },
    //停止计时
  Reset: function () {
    var that = this
    clearInterval(intTime);
    that.setData({
      hour: 0,
      minute: 0,
      second: 0,
      timecount: '00:00:00',
    })
  },
  // 增加时间
  timer() {
    var that = this;
    let hour = that.data.hour;
    let minute = that.data.minute;
    let second = that.data.second;
    that.setData({
      second: second + 1
    })
    if (second >= 60) {
      that.setData({
        second: 0,
        minute: minute + 1
      })
    }

    if (minute >= 60) {
      that.setData({
        minute: 0,
        hour: hour + 1
      })
    }
    that.setData({
      timecount: [hour, minute, second].map(formatNumber).join(':')
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  // 增加后台时间
  addContinue() {
    this.getPracticeTime().then(res =>{
      let timeout = res
      let hours = Number(timeout.split(":")[0])
      let minutes = Number(timeout.split(":")[1])
      let second = Number(timeout.split(":")[2])
      if(second < 60){
        second ++
      }
      if(second >= 60) {
        minutes = minutes + 1
        second = 0
      }
      if(minutes >= 60) {
        hours = hours + 1
        hours = 0
      }
      timeout =  [hours, minutes, second].map(formatNumber).join(':')
      // console.log(timeout,typeof timeout)
      this.updatePracticeTime(timeout)
    })

  },
  // 后台计时器
  continueTime() {
    const that = this
    clearInterval(addTime)
    addTime = setInterval(function () {
      that.addContinue()
    },1000)
  },
  // 签到范围
  circleRange(lat,lng) {
    const mapCtx = wx.createMapContext('myMap',this);
    const that = this
    mapCtx.getRegion({
      success: function(res) {
        let lng1 = res.northeast.longitude;
        let lat1 = res.northeast.latitude;
        let lng2 = res.southwest.longitude;
        let lat2 = res.southwest.latitude;
        let longitude = lng1 - lng2;
        let latitude = lat1 - lat2;
        let flag = longitude>latitude?true:false;
        let radius = 0;
        let circles = that.data.circles
        //计算得到短边，然后再通过*1000转变为m，除2得到半径，*0.8优化显示，让圈圈只占界面的80%
        if(flag){
            radius= getDistance(lng1,lat1,lng1,lat2)*1000/3.082*0.8;
        }else{
            radius= getDistance(lng1,lat1,lng2,lat1)*1000/3.082*0.8;
        }
        console.log(radius,'半径')
        circles = [{
          "radius":radius,
          "latitude":lat,
          "longitude":lng,
          "color": '#0066ff',
          "strokeWidth": 4
        }]
       that.setData({
          circles
       });
      }
    }
  )
  },
  // // 计算我的位置与目的地的距离
  calcDistance() {
    const myPoi = this.data.poi //我的位置
    const poiDest = wx.getStorageSync('poiDest') //目的地
    // let distance = getDistance(myPoi.latitude,myPoi.longitude,poiDest.latitude,poiDest.longitude) * 1000
    // console.log(distance,'距离')
    qqmapsdk.calculateDistance({
      mode: 'straight',
      from: {
        latitude: myPoi.latitude,
        longitude: myPoi.longitude
        },
      to: [{
        latitude: poiDest.latitude,
        longitude: poiDest.longitude
      }],
      success: (res) =>{
        const distance = res.result.elements[0].distance
        console.log(distance,'距离')
        this.setData({
          distance
        })
      }
    })
    // return distance
  },
  // 获取经纬度信息
  getLocation(e) {
    console.log(e,'经纬度')
  },
  onLoad: function (options) {
    this.getProfileActivityStatus() //更新签到状态
    var that = this
    clearInterval(addTime) //清除后台定时器
    that.getAddress()
    that.getSite()
    that.getTime()
    // let self = this
    // 获取定位授权设置
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success () {
              that.startLoc()
              console.log('-----开始监听')
            },
            fail(res) {
              that.startLoc()
            }
          })
        } else {
          that.startLoc()
        }
      }
    })
    that.setData({
      canClick: true, // 允许用户点击，防止多次提交
      timer2: setInterval(function () {
        that.getAddress()
      }, 60000)  // 每60秒刷新一次定位
    })
    // const clickStatus = wx.getStorageSync('clickStatus')
    // const practiceTime = wx.getStorageSync('practiceTime')
    console.log(this.data.timecount)
    that.getPracticeTime().then(res=>{
      const practiceTime = res
      const hour = Number(practiceTime.split(':')[0]);
      const minute = Number(practiceTime.split(':')[1]);
      const second = Number(practiceTime.split(':')[2]);
      that.getAcitvityInStatus().then(res =>{
        const clickStatus = res
        // console.log(clickStatus,'clickStatus')
  
        if(clickStatus == 1) {
          that.setData({
            hour,
            minute,
            second,
            clickStatus,
            timecount: practiceTime
          })
          that.Restart()
        }else if(clickStatus==-1) {
          // clearInterval(this.data.timer)
          // clearInterval(this.data.timer2)
          // console.log("定时器已被清除")
          // wx.removeStorageSync('practiceTime')
          that.setData({
            clickStatus
          })
        }
      })
    })

    // 判断活动状态
    // clickStatus==1 签退
    // clickStatus==-1 活动结束


  },
  onShow(){
    // this.getActivity()
    this.getActivitySign()
  },
  onReady(){
    // this.getRoute()
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onUnload: function () {
    const that = this
    wx.removeStorageSync('poiDest')
    wx.navigateBack({
      delta: 1
    })
    clearInterval(this.data.timer2)
    // const clickStatus = this.data.clickStatus
    // console.log(clickStatus)
    // wx.setStorageSync('practiceTime', this.data.timecount)
    // 判断活动状态
    // clickStatus==1 签退
    // clickStatus==-1 活动结束
    this.getAcitvityInStatus().then(res =>{
      const clickStatus = res
      if(clickStatus == 1) {
        this.Restart()
        const time = this.data.timecount
        this.updatePracticeTime(time)
        this.continueTime()
      }else if(clickStatus==-1) {
        clearInterval(this.data.timer)
        clearInterval(addTime)
        console.log("定时器已被清除")
        this.setData({
          clickStatus
        })
      }
    })
    wx.stopLocationUpdate({success: (res) => {}})
    // 取消监听实时地理位置变化事件
    wx.offLocationChange((result) => {})
  }
})