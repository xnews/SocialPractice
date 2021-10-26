import Store from "wxministore";
module.exports = new Store({
  openPart: true,
  state: {
    activities: [],
    activity: {},
  },
  methods: {
    addActivityStatus() {
      let activities = []
      return new Promise(resolve =>{
        wx.cloud.callFunction({
          name: 'getActivityDetailAll',
          success(res) {
            activities = res.result.data
            for(let i of activities) {
              i.registrationTips = true
              i.isClickreRistra = false,
              i.isClickLike = false,
              i.isClickCollect = false,
              i.activityInStatus = 0,
              i.practiceTime = '00:00:00'
            }
            resolve(activities)
          }
      })
    })
  }
  }
})