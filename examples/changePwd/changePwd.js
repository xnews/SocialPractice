// examples/changePwd/changePwd.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    form_list:[
      {tagname: "账号",name:"account"},
      {tagname: "新密码",name:"password"},
      {tagname: "确认新密码",name:"compassword"}
    ],
    inputValue: ""
  },
  // 提交确认信息
  changePwdSubmit(e) {
    const {account, password, compassword} = e.detail.value    
    const that = this
    this.verifyCount(account).then(res =>{
      if(res.length===0){
        wx.showToast({
          title: '账号不存在',
          icon: 'error'
        })
      }else{
        if(password!==compassword) {
          wx.showToast({
            title: '密码不一致',
            icon: 'error'
          })
        }else{
          that.changePassword(account,password)
          this.setData({
            inputValue: ""
          })
        }
      }
    })
  },
  // 验证账号是否存在
  verifyCount(count,password) {
    return new Promise((resolve,reject) =>{
      wx.cloud.callFunction({
        name: 'getStuInfo',
        data: {
          stuNum: count
        }
      }).then(res =>{
        resolve(res.result.data)
    })

    })
  },
  // 修改密码
  changePassword(account,password) {
    wx.cloud.callFunction({
      name: 'updateStuPassword',
      data: {
        stuNum: account,
        password
      },
      success: (res) =>{
        wx.showToast({
          title: '密码修改成功',
          icon: 'success'
        })
      },
      fail: (err) =>{
        console.log('密码修改失败')
      }
    })
  }
})