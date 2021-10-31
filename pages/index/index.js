var util= require('../../utils/util.js')
const db = wx.cloud.database();
const app = getApp();
App.Page({
  useStore: true,
  useProp: ["activity"],
  /**
   * 页面的初始数据
   */
  data: {
    swiper_image: [],
    activities: [],
    activitiesHeat: []
  }, 

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.addActivityStatus().then(res =>{
      app.store.setState({
        activities: res
      })
    })
    // 获取轮播图图片地址
    db.collection('swiper_image').get({
      success: res => {
        this.setData({
          swiper_image: res.data
        })
      }
    })
    // const activities = wx.getStorageSync('activities')
    // this.setData({
    //   activities
    // })
    wx.cloud.callFunction({
      name: 'getActivityDetailAll'
    }).then(res => {
      let activities = res.result.data;
      // 转换数据库时间格式
      for(let i=0;i < activities.length;i++) {
        activities[i].time = util.formatTime(new Date(activities[i].time))
        activities[i].deadline = util.formatTime(new Date(activities[i].deadline))
      }  
      this.setData({
        activities
      })
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  switchToAcDesc(e) {
    let activityId = e.currentTarget.dataset.id
    wx.cloud.callFunction({
      name: 'getActivityDetail',
      data: {
        id: activityId
      }
    }).then(res => {
      wx.setStorageSync('activities', res.result.data)
    })
    wx.setStorageSync('activityId', activityId)
    wx.navigateTo({
      url: '/pages/eventdetail/eventdetail',
    })
  }
})