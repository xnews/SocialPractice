// location_check_in/location_check_in.js
const util = require('../../utils/_util')
const app = getApp()
const urlList = require("../../utils/api.js");  // 根据实际项目自己配置
var intTime;
// 实例化API核心类
const qqmapsdk = app.globalData.qqmapsdk

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
    clickStatus: 0,
    points: [],
    pointsDest: [],
    polyline: []
  },
  addActivityIn() {
    const {_id,site} = wx.getStorageSync('activities')[0]
    const {latitude,longitude} = wx.getStorageSync('poiDest')
    const stuNum = wx.getStorageSync('stuNum')
    wx.cloud.callFunction({
      name: "addActivityIn",
      data: {
        stuNum,activityId: _id,site,time: 0,location:{latitude,longitude}
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
        wx.setStorageSync('Mypoints', points[points.length-1])
        that.setData({ // 设置markers属性和地图位置poi，将结果在地图展示
          markers,
          // poi: {
          //   latitude: res.location.lat,
          //   longitude: res.location.lng
          // },
          points
        });
      },
      fail: function(error) {
        console.error(error);
      }
    })
  },
  getSite(){
    const {_id,site} = wx.getStorageSync('activities')[0]
    const markers = this.data.markers;
    const points = this.data.points;
    const _this = this;
    // 获取活动场地信息
    wx.cloud.callFunction({
      name: 'getActivitySite',
      data: {
        id: _id
      }
    }).then(res => {
      console.log(res, '获取成功')
    }).catch(err => {
      console.log(err)
    })
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
          height: 35,
        });
        points.push({            
          latitude: res.location.lat,
          longitude: res.location.lng
        });
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
        if (time == 0) {
          // 页面跳转后，要把定时器清空掉，免得浪费性能
          clearInterval(that.data.timer)
        }
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
    console.log(stuNum)
    const profileActivityId = wx.getStorageSync('profileActivityId')
    console.log(profileActivityId)
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
      console.log(activities)
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
  addPracticeTime() {
    setInterval(()=>{
      this.updatePracticeTime
    },1000)
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
    wx.showModal({
      title: '请确认位置信息',
      // content: '请确认待整改项已整改完毕！',
      content: `地点：${this.data.addressName}\n时间：${nowTime}`,  // 开发者工具上没有换行，真机调试时会有的
      confirmText: '确认',
      success (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          that.addActivityIn()
          wx.showToast({
            title: '签到成功'
          }).then(()=> {
            that.start()
            that.updateProfileActivityStatus('签退')
          })
          // wx.setStorageSync('clickStatus', 1)
          that.updateAcitvityInStatus(1)

          
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
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
    let that = this
    that.stop()
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
          wx.cloud.callFunction({
            name: 'UpdatePracticeTime',
            data: {
              stuNum: stuNum,
              practice_time
            }
          })
          that.Reset()
          that.updateProfileActivityStatus('活动已结束')
          // wx.setStorageSync('clickStatus', -1)
          that.updateAcitvityInStatus(-1)
          that.setData({
            canClick: false
          })
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
  onLoad: function (options) {
    var that = this
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
    that.getPracticeTime().then(res=>{
      const practiceTime = res
      const hour = Number(practiceTime.split(':')[0]);
      const minute = Number(practiceTime.split(':')[1]);
      const second = Number(practiceTime.split(':')[2]);
      that.getAcitvityInStatus().then(res =>{
        const clickStatus = res
        console.log(clickStatus,'clickStatus')
  
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
  },
  onReady(){
    // this.getRoute()
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onUnload: function () {
    wx.redirectTo({
      url: '/pages/profileActivity/profileActivity',
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
      }else if(clickStatus==-1) {
        clearInterval(this.data.timer)
        console.log("定时器已被清除")
        this.setData({
          clickStatus
        })
      }
    })

  }
})