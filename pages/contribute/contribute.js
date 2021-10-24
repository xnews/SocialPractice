// pages/contribute/contribute.js
// 导入时间格式
import { formatTime,randomString } from '../../utils/util.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    height:"",
    inputValue: {},
    tempImgFiles: []
  },
  onShow() {
    let id = "#textareawrap";
    let query = wx.createSelectorQuery();//创建查询对象
    query.select(id).boundingClientRect();//获取view的边界及位置信息
    query.exec(res => {
      this.setData({
        height: res[0].height + "px"
      });
    });
    const contributeInfo =  wx.getStorageSync('contributeInfo')[0]
    if(contributeInfo) {
      const inputValue = {}
      inputValue.title = contributeInfo.title
      inputValue.articleContent = contributeInfo.articleContent
      console.log(inputValue)
      this.setData({
        inputValue
      })
    }
  },
  // 判断对象的属性值除图片是否为空
  objectValueAllEmpty(obj){
      return Object.keys(obj).length == Object.values(obj).filter(val => val != '').length;
  },
  // 判断图片的属性值是否为空
  objectValueImgEmpty(obj){
    return Object.values(obj).some(val => val != [])
  },
  // 添加投稿数据
  addContributeInfo(data) {
    const that = this
    wx.cloud.callFunction({
      name: 'addActivityContribute',
      data
    }).then(res =>{
      wx.showToast({
        title: '投稿成功',
        icon: 'success',
        success() {
          const tempImgFiles = []
          const inputValue = {}
          that.setData({
            tempImgFiles,
            inputValue
          })
        }
      })
      wx.removeStorageSync('contributeInfo')
    })
  },
  // 投稿表单提交
  handleContribute(e) {
    const contributeInfo = e.detail.value
    contributeInfo.stuNum = wx.getStorageSync('stuNum')
    contributeInfo.name = wx.getStorageSync('name')
    contributeInfo.time = formatTime(new Date)
    contributeInfo.images = this.data.tempImgFiles
    if(e.detail.target.dataset.type == 1) {
      this.handleSaveDrafts(contributeInfo,contributeInfo.title,contributeInfo.articleContent,contributeInfo.images)
    }else if(e.detail.target.dataset.type == 2) {
      this.handleSaveSubmit(contributeInfo,contributeInfo.title,contributeInfo.articleContent,contributeInfo.images)
    }
  },
  // 处理保存草稿事件
  handleSaveDrafts(data,title,content,images) {
    if(this.objectValueAllEmpty(data)) {
      const dataArr = []
      dataArr.push(data)
      wx.setStorageSync('contributeInfo', dataArr)
      wx.showToast({
        title: '保存成功',
        icon: 'success'
      })
    }else if(images == ""&&title != ''&&content!= '') {
      const dataArr = []
      dataArr.push(data)
      console.log(dataArr)
      wx.setStorageSync('contributeInfo', dataArr)
      wx.showToast({
        title: '保存成功',
        icon: 'success'
      })
    }else if(title == ""||content ==""){
      wx.showToast({
        title: '请填写空项',
        icon: 'error'
      })
    }
  },
  // 处理保存投稿事件
  handleSaveSubmit(data,title,content,images) {
    const that = this
    const imagesArr = []
    if(this.objectValueAllEmpty(data)) {
          // 临时存储文件路径
      const tempImgFiles = images
      for(let item of tempImgFiles){
        let cloudPath = 'activity_contribute/' + randomString(10)  //云存储路径
        wx.cloud.uploadFile({
          cloudPath,
          filePath: item.path,
          success(res){
            const fileID = res.fileID
            imagesArr.push({path: fileID})
          },
          fail: (err) => {
            console.log('文件添加失败')
          }
        }) 
      }
      data.images = imagesArr
      // 设置定时器确保图片path添加成功
      setTimeout(() =>{
        // 添加投稿数据函数
        that.addContributeInfo(data)
      },3000)
    }else if(images == ""&&title != ''&&content!= '') {
      wx.showToast({
        title: '请上传图片',
        icon: 'error'
      })
    }else if(title == ""||content ==""){
      wx.showToast({
        title: '请填写空项',
        icon: 'error'
      })
    }
  },
  // 处理图片上传事件
  handleuploadimg() {
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        this.setData({
          tempImgFiles: res.tempFiles
        })
      },
      fail: err => {
        wx.showToast({
          title: '图片上传失败',
          icon: 'error'
        })
      }
    })
  },
  // 清空表单数据
  resetForm() {
    wx.showModal({
      title: '提示',
      content: '是否清空信息',
      success: res => {
        const tempImgFiles = []
        const inputValue = {}
        if(res.confirm) {
          this.setData({
            tempImgFiles,
            inputValue
          })
        }
      }
    })
  }
})