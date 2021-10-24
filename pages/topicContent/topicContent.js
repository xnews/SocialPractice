// pages/topicContent/topicContent.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topicObj: {}
  },
  onShow() {
    const topicList = wx.getStorageSync('topicList')
    const topicId = wx.getStorageSync('topicId')
    const topicObj = topicList.find(v => v._id===topicId)
    this.setData({
      topicObj
    })
  }
})