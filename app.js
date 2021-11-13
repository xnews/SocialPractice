// app.js
var QQMapWX = require('/utils/qqmap-wx-jssdk.min.js')
let store = require("./utils/store.js")
App({
  store: store,
  onLaunch() {
    if(!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else{
      wx.cloud.init({
        env: "cloud-8gy1484h4171152a"
      })
    }
  },
  onShow() {
    wx.cloud.callFunction({
      name: 'getOpenId',
    }).then( res => {
      // console.log(res,'openid')
      wx.setStorageSync('openId', res.result.event.userInfo.openId)
    })
  },
  globalData: {
    userInfo: null,
     // ..其他全局变量..
     patrolForm: null,
     // 实例化API核心类
     qqmapsdk: new QQMapWX({
       key: 'G7DBZ-OYC62-OKKUB-CVCND-YTXFV-QXBU2' // 必填
     }),
    //  路线规划插件
     showRoute(name,latitude,longitude) {
      let key = 'G7DBZ-OYC62-OKKUB-CVCND-YTXFV-QXBU2';  //使用在腾讯位置服务申请的key
      let referer = '腾讯位置服务路线规划';   //调用插件的app的名称
      let endPoint = JSON.stringify({  //终点
        'name': name,
        'latitude': latitude,
        'longitude': longitude
      });
      wx.navigateTo({
        url: 'plugin://routePlan/index?key=' + key + '&referer=' + referer + '&endPoint=' + endPoint
      });
     },
     chooseLocation(latitude,longitude) {
      const key = 'G7DBZ-OYC62-OKKUB-CVCND-YTXFV-QXBU2'; //使用在腾讯位置服务申请的key
      const referer = '腾讯位置服务地图选点'; //调用插件的app的名称
      const location = JSON.stringify({
        latitude: latitude,
        longitude: longitude
      });
      const category = '活动监控';
       
      wx.navigateTo({
        url: 'plugin://chooseLocation/index?key=' + key + '&referer=' + referer + '&location=' + location + '&category=' + category
      });
     }
  }
})
