import { randomString } from '../../utils/util.js'
Page({
  data: {
    tabs: [
      {
        id: 0,
        value: "体验问题",
        isActive: true
      },
      {
        id: 1,
        value: "活动投诉",
        isActive: false
      }
    ],
    // 被选中的图片路径 数组
    chooseImgs: [],
    // 文本域的内容
    textVal: "",
    tabIndex: 0,
    inputValue: ""
  },
  upLoadImages:[], //定义上传图片数组
  handleTabsItemChange(e) {
    // 1 获取被点击的标题索引
    const { index } = e.detail;
    // console.log(index,'索引')
    // 2 修改源数组
    let { tabs } = this.data;
    console.log(tabs,'66')
    wx.setStorageSync('feedbackType', tabs[index].value)
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    // 3 赋值到data中
    this.setData({
      tabs,
      tabIndex:index
    })
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
  // 文本域的输入的事件
  handleTextInput(e) {
    this.setData({
      textVal: e.detail.value
    })
  },
  // 活动名称输入的事件
  handlenameInput(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  // 提交按钮的点击
  handleFormSubmit() {
    // 1 获取文本域的内容 图片数组
    const { textVal, chooseImgs,inputValue } = this.data;
    const feedbackType = wx.getStorageSync('feedbackType')
    const stuNum = wx.getStorageSync('stuNum')
    // 2 合法性的验证
    if (!textVal.trim()) {
      // 不合法
      wx.showToast({
        title: '输入不合法',
        icon: 'none',
        mask: true
      });
      return;
    }
    // 3 准备上传图片 到专门的图片服务器 
    // 上传文件的 api 不支持 多个文件同时上传  遍历数组 挨个上传 
    // 显示正在等待的图片
    wx.showLoading({
      title: "正在上传中",
      mask: true
    });

    // 判断有没有需要上传的图片数组
    if (chooseImgs.length != 0) {
      let promiseArr = []
      chooseImgs.forEach((v, i) => {
        let cloudPath = 'feedback/' + randomString(10) //云储存路径
        promiseArr.push(new Promise((resolve,reject) =>{
          wx.cloud.uploadFile({
            // 图片要上传到哪里
            cloudPath,
            // 被上传的文件的路径
            filePath: v,
            success:res => {
              resolve(res.fileID)
              // 所有的图片都上传完毕了才触发  
              if (i === chooseImgs.length - 1) {
                wx.hideLoading();
                //  提交都成功了
                wx.showToast({
                  title: '提交成功',
                })
                // 重置页面
                this.setData({
                  textVal: "",
                  chooseImgs: [],
                  inputValue: ""
                })
              }
            }
          });
        }))
      })
      Promise.all(promiseArr).then(res =>{
        wx.cloud.callFunction({
            name: 'addFeedback',
            data: {
              content: textVal,
              images: res,
              activityName: inputValue,
              type: feedbackType,
              stuNum,
              time: new Date()
            }
          }).then(res =>{
            console.log(res)
          })
      })
    }else{
      // console.log("只是提交了文本");
      wx.cloud.callFunction({
        name: 'addFeedback',
        data: {
          content: textVal,
          images: [],
          activityName: inputValue,
          type: feedbackType,
          stuNum,
          time: new Date()
        }
      }).then(res =>{
        console.log(res)
        getApp().getUserTrajectory(6, 'Require', 'pages/feedback/feedback', '用户发起反馈请求');//获取用户轨迹
        wx.showToast({
          title: '提交成功',
          icon: 'success'
        })
      })
      wx.hideLoading();
      this.setData({
        textVal: "",
        chooseImgs: [],
        inputValue: ""
      })
    }
  },
  funcProblem() {
    // console.log(e)
    wx.setStorageSync('feedbackType','功能建议')
  },
  actProblem() {
    wx.setStorageSync('feedbackType','活动问题')
  },
  perProblem() {
    wx.setStorageSync('feedbackType','性能问题')
  },
  otherProblem() {
    wx.setStorageSync('feedbackType','其他问题')
  }
})