// pages/profileActivity/profileActivity.js
var util= require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: []
  },
  onShow() {
    // const activities = wx.getStorageSync('profileActivity')
    this.getProfileActivity()
  },
  getProfileActivity() {
    const stuNum = wx.getStorageSync('stuNum')
    // 获取个人活动信息
    wx.cloud.callFunction({
      name: 'getProfileActivity',
      data: {
        stuNum
      }
    }).then(res => {
      const data = res.result.data
      for(let i=0;i < data[0].activity.length;i++) {
        data[0].activity[i].time = util.formatTime(new Date(data[0].activity[i].time))
        data[0].activity[i].deadline = util.formatTime(new Date(data[0].activity[i].deadline))
      } 
      console.log(data)
      this.setData({
        data
      })
    })
  },
  switchToActivityIn(e) {
    const profileActivityId = e.currentTarget.dataset.id
    wx.setStorageSync('profileActivityId', profileActivityId)
    wx.navigateTo({
      url: '/pages/activityIn/activityIn',
    })
  }
})