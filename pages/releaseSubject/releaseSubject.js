// pages/releaseSubject/releaseSubject.js
import { formatTime,randomString } from '../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    chooseImgs: [],
    tempImgFiles: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  // 点击 “+” 选择图片
  handleChooseImg() {
    // 2 调用小程序内置的选择图片api
      wx.chooseImage({
        // 同时选中的图片的数量
        count: 9,
        // 图片的格式  原图  压缩
        sizeType: ['original', 'compressed'],
        // 图片的来源  相册  照相机
        sourceType: ['album', 'camera'],
        success: (result) => {
            wx.setStorageSync('objImages', result.tempFilePaths)
            // console.log(result,'图片')
            this.setData({
              // 图片数组 进行拼接 
              chooseImgs: [...this.data.chooseImgs, ...result.tempFilePaths]
            })
        }
      });
  },
  // 点击 自定义图片组件
  handleRemoveImg(e) {
    // 2 获取被点击的组件的索引
    const { index } = e.currentTarget.dataset;
    // 3 获取data中的图片数组
    let { chooseImgs } = this.data;
    // 4 删除元素
    chooseImgs.splice(index, 1);
    this.setData({
      chooseImgs
    })
  },
  // 话题发布
  objectSubmit(e) {
    console.log(e,'话题')
    let {title,announcementContent} = e.detail.value
    const {nickName,avatarUrl} = wx.getStorageSync('userInfo')
    const imagesArr = []
    const content = []
    // 临时存储文件路径
    const tempImgFiles = wx.getStorageSync('objImages')
    console.log(tempImgFiles)
    announcementContent = announcementContent.split(/[\n]/)
    announcementContent.forEach(item => {
      content.push({p: item})
    })
    for(let item of tempImgFiles){
      let cloudPath = 'activity_object/' + randomString(10)  //云存储路径
      wx.cloud.uploadFile({
        cloudPath,
        filePath: item,
        success(res){
          const fileID = res.fileID
          imagesArr.push({path: fileID})
        },
        fail: (err) => {
          console.log('文件添加失败')
        }
      }) 
    }
    wx.cloud.callFunction({
      name: 'addActivityObject',
      data: {
        user_name: nickName,
        user_img_url: avatarUrl,
        title: title,
        img_url:tempImgFiles,
        content
      }
    }).then(res => {
      wx.showToast({
        title: '发布成功',
        icon: 'success'
      })
      this.setData({
        inputValue: "",
        chooseImgs: []
      })
    })
    // wx.redirectTo({
    //   url: '/pages/topic/topic',
    // })
    wx.navigateBack()
    wx.removeStorageSync('objImages')
  }
})