var util= require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cateActivies: []
  },
  onLoad() {
    wx.showLoading({
      title: '加载中',
    })
    const cateType = wx.getStorageSync('cateType')
    wx.cloud.callFunction({
      name: 'getActivityDetailBytype',
      data: {
        type: cateType
      }
    }).then(res => {
      const cateActivies = res.result.data
      cateActivies[0].time = util.formatTime(new Date(cateActivies[0].time))
      cateActivies[0].deadline = util.formatTime(new Date(cateActivies[0].deadline))
      this.setData({
        cateActivies
      })
      wx.hideLoading()
    })
    wx.setNavigationBarTitle({
      title: cateType,
    })
  },
  onShow: function (options) {
  },
  switchToAcDesc(e) {
    let activityId = e.currentTarget.dataset.id
    wx.setStorageSync('activityId', activityId)
    wx.navigateTo({
      url: '/pages/eventdetail/eventdetail',
    })
  }
})