// pages/activeList/activeList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ActivityInfo: [],
    rank: 0,
    practiceTime: 0
  },
  onLoad() {
    const profileActivity = wx.getStorageSync('profileActivity')
    const profileOrganization = wx.getStorageSync('profileAcOrganise')
    const profileCollection = wx.getStorageSync('profileCollect')
    const stuNum = wx.getStorageSync('stuNum')
    const openId = wx.getStorageSync('openId')
    this.getProfileActivity()
  },
  // 获取个人活动信息表
  getProfileActivity() {
    const stuNum = wx.getStorageSync('stuNum')
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name: 'getProfileActivityAll'
    }).then( res => {
      // console.log(res.result.data)
      const ActivityInfo = res.result.data
      // 对数组中的实践时长进行排序
      ActivityInfo.sort(this.compare('practiceTime'))
      for(let item of ActivityInfo){
        const time =  item.practiceTime/3600
        item.practiceTime = time.toFixed(2)
      }
      const rank = ActivityInfo.findIndex(item => item.stuNum === stuNum)
      const practiceTime = ActivityInfo[rank].practiceTime
      this.setData({
        ActivityInfo,
        rank,
        practiceTime
      })
      wx.hideLoading()
    })
  },
  compare(key){ //这是比较函数
    return function(m,n){
        var a = m[key];
        var b = n[key];
        return b - a; //降序
    }
}
})
