// pages/login/login.js
const app = getApp()
App.Page({
  useStore: true,
  useProp: ["loginStatus"],
  /**
   * 页面的初始数据
   */
  data: {
    queryActivityInfo: false
  },
  // 查询个人活动信息表
  queryProfileActivity(name,stuNum,openId,professional) {
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
        that.addProfileActivityInfo(name,stuNum,openId,professional)
      }
    })

  },
  // 添加个人活动信息表
  addProfileActivityInfo(name,stuNum,openId,professional) {
    wx.cloud.callFunction({
      name: 'addProfileActivityInfo',
      data: {
        activity: [],
        organization: [],
        collection: [],
        practiceTime: 0,
        name,
        stuNum,
        openId,
        professional
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
          const {name, stuNum, _openid,professional} = res.result.data[0]
          wx.setStorageSync('name', name)
          app.store.setState({
            loginStatus: 1
          })
          // 调用查询个人活动信息表函数
          this.queryProfileActivity(name,stuNum,_openid,professional)
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
          app.store.setState({
            loginStatus: 0
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
          app.store.setState({
            loginStatus: 1
          })
          wx.showToast({
            title: '登录成功',
            icon: 'success'
          }).then(() =>{
            getApp().getUserTrajectory(1, 'navigate', 'examples/login/login', '用户登录');//获取用户轨迹
            setTimeout(
              that.switchTab,2000)
          })
        }else{
          wx.showToast({
            title: '登录失败',
            icon: 'error'
          })
          app.store.setState({
            loginStatus: 0
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
  },
  profileInfo() {
    wx.getUserProfile({
      desc: '是否同意获取您的用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        wx.setStorageSync('userInfo', res.userInfo)
      }
    })
  },
  getProfileInfo(e) {
    const that = this
    let { loginStatus } = app.store.getState()
    if(loginStatus === 0) {
      return
    }else{
      that.profileInfo() 
    }
  }
})