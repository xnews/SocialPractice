// pages/dynamic/dynamic.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentIndex:0,
    tabName:[
      {type:'社会调研',isShowLine: false},
      {type:'志愿服务',isShowLine: false},
      {type:'公益宣传',isShowLine: false},
      {type:'参观学习',isShowLine: false},
      {type:'文艺下乡',isShowLine: false},
      {type:'科技服务',isShowLine: false},
      {type:'义务支教',isShowLine: false},
      {type:'实习实训',isShowLine: false},
      {type:'创新创业',isShowLine: false},
      {type:'勤工助学',isShowLine: false}
    ],
    dynamicList: []
  },
  onShow(){
    const type = this.data.tabName[0].type
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name: 'getActivityDynamic',
      data: {
        type
      }
    }).then(res => {
      wx.hideLoading()
      this.setData({
        dynamicList: res.result.data
      })
    })
  },
  handletab(e) {
    const type = e.currentTarget.dataset.type
    wx.cloud.callFunction({
      name: 'getActivityDynamic',
      data: {
        type
      }
    }).then(res => {
      this.setData({
        dynamicList: res.result.data
      })
    })
    this.setData({
      currentIndex: e.currentTarget.dataset.index
    })
},
  switchToDynamicContent(e) {
    let dynamicId = e.currentTarget.dataset.id
    wx.setStorageSync('dynamicId', dynamicId)
    wx.navigateTo({
      url: '/pages/dynamicContent/dynamicContent',
    })
  }
})