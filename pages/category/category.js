// pages/category/category.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    category: [{
      id: 1,
      type: "志愿服务",
      image: "cloud://cloud-8gy1484h4171152a.636c-cloud-8gy1484h4171152a-1306324510/images/category/cate1.png"
    },{
      id: 2,
      type: "支教服务",
      image: "cloud://cloud-8gy1484h4171152a.636c-cloud-8gy1484h4171152a-1306324510/images/category/cate2.png"
    },{
      id: 3,
      type: "社会调研",
      image: "cloud://cloud-8gy1484h4171152a.636c-cloud-8gy1484h4171152a-1306324510/images/category/cate3.png"
    },{
      id: 4,
      type: "公益宣传",
      image: "cloud://cloud-8gy1484h4171152a.636c-cloud-8gy1484h4171152a-1306324510/images/category/cate4.png"
    },{
      id: 5,
      type: "参观学习",
      image: "cloud://cloud-8gy1484h4171152a.636c-cloud-8gy1484h4171152a-1306324510/images/category/cate5.png"
    },{
      id: 6,
      type: "学术科研",
      image: "cloud://cloud-8gy1484h4171152a.636c-cloud-8gy1484h4171152a-1306324510/images/category/cate6.png"
    },{
      id: 7,
      type: "文艺下乡",
      image: "cloud://cloud-8gy1484h4171152a.636c-cloud-8gy1484h4171152a-1306324510/images/category/cate7.png"
    },{
      id: 8,
      type: "专业实践",
      image: "cloud://cloud-8gy1484h4171152a.636c-cloud-8gy1484h4171152a-1306324510/images/category/cate8.png"
    },]
  },
  switchTocate(e) {
    const cateType = e.currentTarget.dataset.type
    wx.setStorageSync('cateType', cateType)
    console.log(cateType)

    wx.navigateTo({
      url: '/pages/categoryContent/categoryContent',
    })
  }
})