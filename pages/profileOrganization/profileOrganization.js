// pages/profileOrganization/profileOrganization.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activityNav:["审核中","未通过","已通过"],
    indexNav: 0,
    organiseInfo: []
  },
  onShow() {
    const stuNum = wx.getStorageSync('stuNum')
    const status = this.data.activityNav[0]
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name: 'getOrganiseInfo',
      data: {
        stuNum,
        status
      }
    }).then( res => {
      wx.hideLoading()
      const organiseInfo = res.result.data
      for(let item of organiseInfo) {
        const time = item.time.split(" ")[0]
        item.time = time
      }
      this.setData({
        organiseInfo
      })
    })
  },
  ClickNav(e) {
    console.log(e.currentTarget.dataset.status)
    const stuNum = wx.getStorageSync('stuNum')
    const status = e.currentTarget.dataset.status
    wx.cloud.callFunction({
      name: 'getOrganiseInfo',
      data: {
        stuNum,
        status
      }
    }).then( res => {
      const organiseInfo = res.result.data
      for(let item of organiseInfo) {
        const time = item.time.split(" ")[0]
        item.time = time
      }
      this.setData({
        organiseInfo
      })
    })
    this.setData({
      indexNav: e.currentTarget.dataset.index
    })
  }
})