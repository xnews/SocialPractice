// pages/draftBox/draftBox.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    draftInfo: [],
    showBgcImg: true
  },
  onLoad() {
    const draftInfo = wx.getStorageSync('contributeInfo')
    if(draftInfo.length===0) {
      this.setData({
        showBgcImg: false
      })
    }
    this.setData({
      draftInfo
    })
  },
  // 草稿编辑
  handleDraftEditor() {
    wx.navigateTo({
      url: '/pages/contribute/contribute',
    })
  },
  // 草稿删除
  hanleDraftDelete() {
    wx.showModal({
      title: '提示',
      content: '请确认是否删除',
      success: res => {
        if(res.confirm) {
        wx.removeStorageSync('contributeInfo')
        this.onLoad()
        wx.showToast({
          title: '删除成功',
          icon: 'success'
        })
        }
      }
    })
  }
})