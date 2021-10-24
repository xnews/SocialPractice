// pages/profile/profile.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activityCount: 0,
    collectCount: 0,
    organiseCount: 0,
    userInfo: {},
    hasUserInfo: false
  },
  onShow() {
    this.activityCount()
    this.collectCount()
    this.organiseCount()
  },
  onUnload() {
  },
  // 获取我的活动数量
  activityCount() {
    const stuNum = wx.getStorageSync('stuNum')
    wx.cloud.callFunction({
      name: 'getProfileActivity',
      data: {
        stuNum
      }
    }).then(res => {
      const activityCount = res.result.data[0].activity.length
      this.setData({
        activityCount
      })
    })
  },
  // 获取我的收藏数量
  collectCount() {
    const stuNum = wx.getStorageSync('stuNum')
    wx.cloud.callFunction({
      name: 'getProfileActivity',
      data: {
        stuNum
      }
    }).then(res => {
      const collectCount = res.result.data[0].collection.length
      this.setData({
        collectCount
      })
    })
  },
  // 获取我的组织数量
  organiseCount() {
    const stuNum = wx.getStorageSync('stuNum')
    wx.cloud.callFunction({
      name: 'getProfileActivity',
      data: {
        stuNum
      }
    }).then(res => {
      const organiseCount = res.result.data[0].organization.length
      this.setData({
        organiseCount
      })
    })
  },
  handleUserLogin() {
    wx.getUserProfile({
      desc: '是否同意获取您的用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        wx.setStorageSync('userInfo', res.userInfo)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  switchToProfileActivity() {
    wx.navigateTo({
      url: '/pages/profileActivity/profileActivity',
    })
  },
  switchToProfileOrganization() {
    wx.navigateTo({
      url: '/pages/profileOrganization/profileOrganization',
    })
  },
  switchToProfileCollection() {
    wx.navigateTo({
      url: '/pages/profileCollection/profileCollection',
    })
  },
  switchToPersonalAccount() {
    wx.navigateTo({
      url: '/pages/personalAccount/personalAccount',
    })
  },
  switchToActiveList() {
    wx.navigateTo({
      url: '/pages/activeList/activeList',
    })
  },
  switchToContribute() {
    wx.navigateTo({
      url: '/pages/contribute/contribute',
    })
  },
  switchToDraftBox() {
    wx.navigateTo({
      url: '/pages/draftBox/draftBox',
    })
  }
})