// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    queryActivityInfo: false
  },
  // 查询个人活动信息表
  queryProfileActivity(name,stuNum,openId) {
    const that = this
    wx.cloud.callFunction({
      name: 'getProfileActivity',
      data: {
        stuNum
      }
    }).then( res => {
      if(res.result.data.length){
        console.log('活动信息表已添加')
      }else{
        that.addProfileActivityInfo(name,stuNum,openId)
      }
    })

  },
  // 添加个人活动信息表
  addProfileActivityInfo(name,stuNum,openId) {
    wx.cloud.callFunction({
      name: 'addProfileActivityInfo',
      data: {
        activity: [],
        organization: [],
        collection: [],
        practiceTime: 0,
        name,
        stuNum,
        openId
      }
    })
  },
  // 登录信息
  handlelogin(e) {
    let loginInfo = e.detail.value;
    let that = this;
    let userType = wx.getStorageSync('userType')
    // 学号密码信息验证
    if(userType==="学生"){
      wx.cloud.callFunction({
        name: 'getStuInfoLogin',
        data: {
          stuNum: loginInfo.zhanghao,
          password: loginInfo.mima
        }
      }).then(res => {
        if(res.result.data.length){
          wx.setStorageSync('stuNum', loginInfo.zhanghao)
          const {name, stuNum, _openid} = res.result.data[0]
          wx.setStorageSync('name', name)
          // 调用查询个人活动信息表函数
          this.queryProfileActivity(name,stuNum,_openid)
          wx.showToast({
            title: '登录成功',
            icon: 'success'
          }).then(() =>{
            setTimeout(
              that.switchTab,2000)
          })
        }else{
          wx.showToast({
            title: '登录失败',
            icon: 'error'
          })
        }
      }).catch(console.error)
    }else if(userType==="教师") {
      wx.cloud.callFunction({
        name: 'getTeaInfoLogin',
        data: {
          teaNum: loginInfo.zhanghao,
          password: loginInfo.mima
        }
      }).then(res =>{
        if(res.result.data.length){
          wx.setStorageSync('teaName', res.result.data[0].name)
          wx.setStorageSync('teaNum', loginInfo.zhanghao)
          wx.showToast({
            title: '登录成功',
            icon: 'success'
          }).then(() =>{
            setTimeout(
              that.switchTab,2000)
          })
        }else{
          wx.showToast({
            title: '登录失败',
            icon: 'error'
          })
        }
      })
    }

  },
  // 跳转到首页
  switchTab() {
    let userType = wx.getStorageSync('userType')
    if(userType==="学生"){
      wx.switchTab({
        url: '/pages/index/index'
      })
    }else if(userType==="教师"){
      wx.navigateTo({
        url: '/pages/review/review',
      })
    }
  }
})