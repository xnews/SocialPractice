import Store from "wxministore";
module.exports = new Store({
  openPart: true,
  state: {
    activities: [],
    activity: {},
    loginStatus: 1,
    organise: [],
    organiseReleaseStatus: 0
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
              i.registrationTips = 0
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
  },
    getOrganiseInfo() {
      let organise = []
      return new Promise(resolve => {
        wx.cloud.callFunction({
          name: 'getReviewOrganiseInfo',
          success(res) {
            organise = res.result.data
            for(let i of organise) {
              if(i.status === '已通过'){
                i.organiseReleaseStatus = 1
              }else{
                i.organiseReleaseStatus = 0
              }
            }
          }
        })
      })
    }
  }
})