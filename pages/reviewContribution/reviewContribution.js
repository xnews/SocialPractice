// pages/reviewContribution/reviewContribution.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    contributeInfo: {},
    imgList: []
  },
  onShow() {
    this.showContributeInfo()
  },
  showContributeInfo() {
    const contributeIndex = wx.getStorageSync('contributeIndex')
    wx.cloud.callFunction({
      name: 'getActivityContribute'
    }).then(res => {
      const contributeInfo = res.result.data[contributeIndex]
      contributeInfo.time = contributeInfo.time.split(" ")[0]
      this.setData({
        contributeInfo,
        imgList: contributeInfo.images
      })
    })
  },
  // 预览放大图片
  previewImg(e) {
    let currentUrl = e.currentTarget.dataset.src
    const imgList = this.data.imgList
    const _imgList = []
    for(let item of imgList){
      _imgList.push(item.path)
    }
    wx.previewImage({
      current: currentUrl, // 当前显示图片的http链接
      urls: _imgList // 需要预览的图片http链接列表
    }).then(res=>{
      console.log('图片预览成功')
    })
  }
})