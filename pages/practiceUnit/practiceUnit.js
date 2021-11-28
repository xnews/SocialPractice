// pages/practiceUnit/practiceUnit.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    unitInfo: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUnitData()
  },
  getUnitData() {
    wx.cloud.callFunction({
      name: 'getUnitInfoAll'
    }).then(res =>{
      this.setData({
        unitInfo: res.result.data
      })
    })
  },
  handleUnitApply(e) {
    console.log(this.data.unitInfo)
    const _id = e.currentTarget.dataset.id
    const name = wx.getStorageSync('name')
    const unitInfo = this.data.unitInfo
    const target = unitInfo.find(item => item._id === _id)
    const flag = target.applicant.findIndex(item => item === name)
    if(flag===-1) {
      wx.showModal({
        content: '请确定是否向该实践单位发出实践申请？',
        success: res =>{
          if(res.confirm) {
            wx.cloud.callFunction({
              name: 'addUnitInfoApply',
              data: {
                _id,
                name
              }
            }).then(() =>{
              wx.showToast({
                title: '申请成功',
                icon: 'success'
              }).then(() =>{
                setTimeout(()=>{
                  wx.navigateBack({
                    delta: 1
                  })
                },2000)
              })
            }).catch(error =>{
              wx.showToast({
                title: '申请失败',
                icon: 'error'
              })
            })
          }
        }
      })
    }else {
      wx.showToast({
        title: '请勿重复申请',
        icon: 'error'
      })
    }
  }
})