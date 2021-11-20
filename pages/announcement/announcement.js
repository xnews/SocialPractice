const date = require('../../utils/util.js')
console.log(date.formatDate(new Date))
Page({

  /**
   * 页面的初始数据
   */
  data: {
    browseNum: 0,
    announcementList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.getAnnouncementInfo()
    const browseNum = wx.getStorageSync('browseNum')
    this.setData({
      browseNum
    })
  },
  getAnnouncementInfo() {
    const announcementList = this.data.announcementList
    wx.cloud.callFunction({
      name: 'getAnnouncememtInfoAll'
    }).then(res => {
      console.log(res, '公告信息')
      this.setData({
        announcementList: res.result.data
      })
    })
  },
  switchToAnnouncementContent(e){
    const announcementId = e.currentTarget.dataset.announcementid
    wx.setStorageSync('announcementId', announcementId)
    wx.navigateTo({
      url: '/pages/announcementContent/announcementContent',
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