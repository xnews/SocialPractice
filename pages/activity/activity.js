// pages/activity/activity.js
var util= require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activityNav:["推荐","全部"],
    indexNav: 0,
    activities: []
  },
  onShow() {
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
  ClickNav(e) {
    this.setData({
      indexNav: e.currentTarget.dataset.index
    })
  },
  switchToAcDesc(e) {
    let activityId = e.currentTarget.dataset.id
    wx.setStorageSync('activityId', activityId)
    wx.navigateTo({
      url: '/pages/eventdetail/eventdetail',
    })
  }
})