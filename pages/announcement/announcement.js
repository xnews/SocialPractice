const date = require('../../utils/util.js')
console.log(date.formatDate(new Date))
Page({

  /**
   * 页面的初始数据
   */
  data: {
    browseNum: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    const browseNum = wx.getStorageSync('browseNum')
    this.setData({
      browseNum
    })
  },
  onUnload() {
    let browseNum = this.data.browseNum += 1
    wx.setStorageSync('browseNum', browseNum)
    this.setData({
      browseNum
    })
  }
})