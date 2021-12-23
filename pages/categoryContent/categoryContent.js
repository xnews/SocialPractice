var util= require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cateActivies: []
  },
  onLoad() {
    wx.showLoading({
      title: '加载中',
    })
    const cateType = wx.getStorageSync('cateType')
    wx.cloud.callFunction({
      name: 'getActivityDetailBytype',
      data: {
        type: cateType
      }
    }).then(res => {
      const cateActivies = res.result.data
      console.log(cateActivies)
      if(cateActivies.length!==0) {
        for(let i=0;i < cateActivies.length;i++) {
          cateActivies[i].time = util.formatTime(new Date(cateActivies[i].time).toString())
          cateActivies[i].deadline = util.formatTime(new Date(cateActivies[i].deadline))
        }  
        this.setData({
          cateActivies
        })
      } else{
        this.setData({
          cateActivies: []
        })
      }
      wx.hideLoading()
    })
    wx.setNavigationBarTitle({
      title: cateType,
    })
  },
  onShow: function (options) {
  },
  switchToAcDesc(e) {
    let activityId = e.currentTarget.dataset.id
    wx.setStorageSync('activityId', activityId)
    wx.navigateTo({
      url: '/pages/eventdetail/eventdetail',
    })
  }
})