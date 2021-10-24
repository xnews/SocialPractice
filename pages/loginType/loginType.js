// pages/loginType/loginType.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  switToStuLogin() {
    wx.setStorageSync('userType', "学生")
    wx.navigateTo({
      url: '/examples/login/login',
    })
  },
  switToTeaLogin() {
    wx.setStorageSync('userType', "教师")
    wx.navigateTo({
      url: '/examples/login/login',
    })
  }
})