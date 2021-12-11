// pages/topic/topic.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topicList: [],
    isShowImg: false
  },

  /**
   * 生命周期函数--监听页面加载 
   */
  onLoad(options) {
    wx.showLoading({
      title: '',
    })
    wx.cloud.callFunction({
      name: 'getActivityTopic'
    }).then(res =>{
      // console.log(res.result.data,'111')
      const topicList = res.result.data
      for(let item of topicList) {
        item.img_url = item.img_url[0]
      }
      console.log(topicList)
      wx.setStorageSync('topicList', topicList)
      this.setData({
      topicList
    })
    wx.hideLoading()
    })
  },
  switchToContent(e) {
    let id = e.currentTarget.dataset.id
    wx.setStorageSync('topicId', id)
    wx.navigateTo({
      url: '/pages/topicContent/topicContent',
    })
  },
  switchToTopicContent() {
    wx.navigateTo({
      url: '/pages/releaseSubject/releaseSubject',
    })
  }
})