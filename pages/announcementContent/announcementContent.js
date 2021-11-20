// pages/dynamicContent/dynamicContent.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    announcementObj: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const id = wx.getStorageSync('announcementId')
    this.addBrowseNum(id)
    wx.cloud.callFunction({
      name: 'getAnnouncementInfo',
      data: {
        announcementId: id
      }
    }).then( res => {
      this.setData({
        announcementObj: res.result.data[0]
      })
    }).catch( err=> {
      console.log(err)
    })
  },
  addBrowseNum(id) {
    wx.cloud.callFunction({
      name: 'addAnnouncementbrowseNum',
      data:{
        id
      }
    }).then(res => {
      console.log('更新成功')
    }).catch(() => {
      console.log('更新失败')
    })
  },
  onUnload() {
    wx.removeStorageSync('announcementId')
  }
})