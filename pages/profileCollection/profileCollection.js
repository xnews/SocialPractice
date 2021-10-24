// pages/profileActivity/profileActivity.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: []
  },
  onLoad() {
    // const activities = wx.getStorageSync('profileActivity')
    const stuNum = wx.getStorageSync('stuNum')
    // 获取个人活动信息
    wx.cloud.callFunction({
      name: 'getProfileActivity',
      data: {
        stuNum
      }
    }).then(res => {
      const data = res.result.data
      console.log(data)
      this.setData({
        data
      })
    })
  },
  switchToEventDetail() {
    wx.navigateTo({
      url: '/pages/eventdetail/eventdetail',
    })
  }
})