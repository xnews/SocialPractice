// pages/profile/profile.js
const app = getApp()
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
    const userInfo = wx.getStorageSync('userInfo')
    if(userInfo) {
      this.setData({
        userInfo: userInfo,
        hasUserInfo: true
      })
    }
    else({
      hasUserInfo: false
    })
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
  // 退出登录事件
  handleCancellation() {
    const that = this
    wx.showModal({
      content: '是否退出登录',
      success (res) {
        getApp().getUserTrajectory(2, 'navigate', 'pages/profile/profile', '用户退出登录');//获取用户轨迹
        if (res.confirm) {
          console.log('用户点击确定')
          that.upOperationLog()
          wx.reLaunch({
            url: '/pages/loginType/loginType'
          })
          wx.removeStorageSync('userInfo')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // 上传用户操作日志
  upOperationLog() {
    const data = app.requestUserTrajectory()
    let utArr = wx.getStorageSync('userTrajectoryArr'); //当前的用户轨迹缓存数组
    const userTrajectoryArr = data.userTrajectoryArr.match(/{[^}{]*?}/g)
    console.log(userTrajectoryArr)
    wx.cloud.callFunction({
      name: 'addOperationLogs',
      data: {
        intoId: data.intoId,
        upTime: data.upTime,
        userToken: data.userToken,
        userTrajectoryArr
      }
    }).then(res =>{
        console.log(res,'操作日志')
        wx.setStorageSync('userTrajectoryArr', app.arrayWeightRemoval(utArr, wx.getStorageSync('userTrajectoryArr')));
        wx.setStorageSync('userTrajectoryStartTime', new Date().getTime());
    }).catch(err =>{
      console.log(err)
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
  },
  swithToFeedback() {
    wx.navigateTo({
      url: '/pages/feedback/feedback',
    })
  }
})