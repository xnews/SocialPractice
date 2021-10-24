// pages/dynamicContent/dynamicContent.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dynamicObj: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const id = wx.getStorageSync('dynamicId')
    wx.cloud.callFunction({
      name: 'getDynamiContent',
      data: {
        id
      }
    }).then( res => {
      console.log(res,'111')
      this.setData({
        dynamicObj: res.result.data
      })
    }).catch( err=> {
      console.log(err)
    })
  }
})