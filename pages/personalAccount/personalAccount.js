// pages/personalAccount/personalAccount.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    form_list:[
      {tagname: "用户名",name:"nickName"},
      {tagname: "学校",name:"school"},
      {tagname: "学号",name:"stuNum"},
      {tagname:"姓名",name:"name"},
      {tagname:"性别",name:"sex"},
      {tagname:"所属院系",name:"departments"},
      {tagname:"年级",name:"grade"},
      {tagname:"专业",name:"professional"},
      {tagname:"班级",name:"class"},
      {tagname: "联系方式",name:"contact"},
      {tagname: "邮箱",name:"email"}
    ],
    stuInfo: {}
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 根据学号获取学生信息
    const stuNum = wx.getStorageSync('stuNum')
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name: 'getStuInfo',
      data: {
        stuNum
      }
    }).then( res => {
      this.setData({
        stuInfo: res.result.data[0]
      })
      wx.hideLoading()
    })
  },
  // 取消按钮
  handleSwitchback() {
    wx.navigateBack({
      delta: 1
    })
  }
})