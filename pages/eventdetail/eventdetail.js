var util= require('../../utils/util.js')
const db = wx.cloud.database()
const app = getApp();
App.Page({
  /**
   * 页面的初始数据
   */
  useStore: true, //当前页面使用状态管理
  useProp: ["registrationTips","isClickreRistra","activity"],
  data: {
    isClickLike: false,
    isClickCollect: false,
    activities: {},
    activitiesHeat: {},
    registrationTips: true,
    // isClickreRistra: false
  }, 
  onLoad() {
    // 获取活动详情数据  
    const activityId = wx.getStorageSync('activityId')
    // const {registrationTips} = wx.getStorageSync('activities')[0]
    const Index = Number(activityId)
    let { registrationTips, isClickreRistra, activities, activityIndex } = app.store.getState();
    let _activities = activities.find(item => item._id === activityId)
    const deadline = new Date(_activities.deadline).getTime()
    const applytime = new Date(_activities.time).getTime()
    const newTime = new Date().getTime()
    // 判断是否截止报名
    if(newTime>deadline){
      console.log('true')
      _activities.registrationTips = -1
    }else if(newTime < applytime){
      console.log('false')
      _activities.registrationTips = -2
    }
    _activities.time = util.formatTime(new Date(_activities.time))
    _activities.deadline = util.formatTime(new Date(_activities.deadline))
    activityIndex = Index
    this.setData({
      activities: _activities,
      isClickLike: _activities.isClickLike,
      isClickCollect: _activities.isClickCollect,
      registrationTips: _activities.registrationTips
    })
    app.store.setState({
      activity: _activities
    })
  }, 
  onShow() {   
    // 是否点赞、收藏 
    // let isClickLike = wx.getStorageSync('isClickLike');
    // let isClickCollect = wx.getStorageSync('isClickCollect')
    // 获取活动信息
    // let activities = wx.getStorageSync('activities')
          // 获取活动的id值
    // const _id = activities.map(v => v['_id']);
    const _id = wx.getStorageSync('activityId')
    // 获取活动热度信息
    wx.cloud.callFunction({
      name: 'getActivityHeat',
      data: { 
        id: _id
      } 
    }).then(res => {
      let {heat} = res.result.data
      this.setData({
        activitiesHeat: heat
      })
    })
    // 获取活动热度 
    // this.setData({isClickLike,isClickCollect})
  },
  onUnload() {
    // const [activitiesHeat] = this.data.activitiesHeat
    // const {_id} = activitiesHeat
    const _id = wx.getStorageSync('activityId')
    // 调用浏览数量增加云函数
    wx.cloud.callFunction({
      name: 'addBrowseNum',
      data: {
        id: _id
      }
    })
  },  
  // 更新报名人数
  updateApplyNum(applyNum) {
    const activityId = wx.getStorageSync('activityId')
    wx.cloud.callFunction({
      name: 'updateApplyNum',
      data: {
        _id: activityId,
        applyNum
      }
    })
  },
  // 处理截止报名
  deadlineApply(activityId){
    let { registrationTips, isClickreRistra, activities } = app.store.getState();
    let _activities = activities.find(item => item._id === activityId)
    console.log(_activities)
  },
  // 点击报名事件
  handleapply() {
    const {_id,activityName,site,time,type,certification} = wx.getStorageSync('activities')[0]
    const activityId = wx.getStorageSync('activityId')
    const profileActivity = []
    const stuNum = wx.getStorageSync('stuNum')
    profileActivity.push({activityName,site,time,type,_id,certification})
    wx.setStorageSync('profileActivity', profileActivity)
    const activity = profileActivity[0]
    activity.status = '签到'
    let { registrationTips, isClickreRistra, activities } = app.store.getState();
    let _activities = activities.find(item => item._id === activityId)
    let registip = !_activities.isClickreRistra
    const activityIndex = Number(activityId)
    // 指定报名成员
    const stuName = wx.getStorageSync('name')
    const specifiedNumber = _activities.specifiedNumber
    const parttern = new RegExp(stuName)
    const specified = parttern.test(specifiedNumber)
    if(specified) {
      if(registip){    
        getApp().getUserTrajectory(3, 'Require', 'pages/eventdetail/eventdetail', '用户报名活动');//获取用户轨迹
        wx.showToast({
        title: '报名成功',
        icon:'success'
        })
        this.onLoad()
        this.updateApplyNum(1)
        // 添加我的活动信息
        wx.cloud.callFunction({
          name: 'updateProfileActivity',
          data: {
            stuNum,
            activity: activity
          }
        })
        _activities.registrationTips = 1,
        _activities.isClickreRistra = true
        activities.splice(activityIndex,1,_activities)
        app.store.setState({
          activities
        })
        this.setData({
          registrationTips:1
        })
      }else{
        wx.showToast({
          title: '取消成功',
          icon:'success'
          })
        this.onLoad()
        this.updateApplyNum(-1)
        wx.cloud.callFunction({
          name: 'removeProfileActivity',
          data: {
            stuNum,
            id: _id
          }
        }).then(res => {
          console.log(res,'删除成功')
        })
        _activities.registrationTips = 0,
        _activities.isClickreRistra = false
        activities.splice(activityIndex,1,_activities)
        app.store.setState({
          activities
        })
        this.setData({
          registrationTips:0
        })
      }
    } else {
      wx.showModal({
        title: '提示',
        content: '该活动仅支持指定成员报名'
      })
    }
  },
  // 调用更新点赞数量云函数
  updateThumbup(num) {
    const _id = wx.getStorageSync('activityId')
    wx.cloud.callFunction({
      name: 'addThumbupNum',
      data: { 
        id:_id,
        thumbupNum: num
      }
    }).then(res => {
      console.log(res,'shujiu')
    })
    },
    // 调用更新收藏数量云函数
  updateCollect(num) {
    const _id = wx.getStorageSync('activityId')
    wx.cloud.callFunction({
      name: 'addCollectNum',
      data: {
        id:_id,
        collectNum: num
      }
    })
    },
  // 点赞
  handleLike() {
    let that = this
    let activitiesHeat = this.data.activitiesHeat
    // wx.setStorageSync('isClickLike', isClickLike)
    let { activities } = app.store.getState()
    const activityId = wx.getStorageSync('activityId')
    const activityIndex = Number(activityId)
    let _activities = activities.find(item => item._id === activityId)
    let isClickLike = !_activities.isClickLike
    if(isClickLike) {
      activitiesHeat.thumbupNum += 1
      that.updateThumbup(activitiesHeat.thumbupNum)
      _activities.isClickLike = true
      activities.splice(activityIndex,1,_activities)
      app.store.setState({
        activities
      })
    }else{
      activitiesHeat.thumbupNum -= 1
      that.updateThumbup(activitiesHeat.thumbupNum)
      _activities.isClickLike = false
      activities.splice(activityIndex,1,_activities)
      app.store.setState({
        activities
      })
    }
    this.setData({
      activitiesHeat,
      isClickLike
    })
    console.log(activitiesHeat,'q')
  },
  // 收藏  
  handleCollect() {
    let that = this
    const stuNum = wx.getStorageSync('stuNum')
    let activitiesHeat = this.data.activitiesHeat
    // let isClickCollect = !this.data.isClickCollect
    // wx.setStorageSync('isClickCollect', isClickCollect)
    let {_id,activityName,site,time,type,certification}  = wx.getStorageSync('activities')[0]
    let { activities } = app.store.getState()
    const activityId = wx.getStorageSync('activityId')
    const activityIndex = Number(activityId)
    let _activities = activities.find(item => item._id === activityId)
    let isClickCollect = !_activities.isClickCollect
    const profileCollect = []
    profileCollect.push({activityName,site,time,type,_id,certification})
    if(isClickCollect) {
      console.log(profileCollect)
      activitiesHeat.collectNum += 1
      that.updateCollect(activitiesHeat.collectNum)
      // wx.setStorageSync('profileCollect', profileCollect)
      _activities.isClickCollect = true
      activities.splice(activityIndex,1,_activities)
      app.store.setState({
        activities
      })
      // 添加我的收藏
      wx.cloud.callFunction({
        name: 'updateProfileCollection',
        data: {
          stuNum,
          collection: profileCollect[0]
        }
      })
    }else{ 
      activitiesHeat.collectNum -= 1
      that.updateCollect(activitiesHeat.collectNum)
      _activities.isClickCollect = false
      activities.splice(activityIndex,1,_activities)
      app.store.setState({
        activities
      })
      // 删除我的收藏
      wx.cloud.callFunction({
        name: 'removeProfileCollection',
        data: {
          stuNum,
          id: profileCollect[0]._id
        }
      }).then(res =>{
        console.log(res)
      }).catch(err => {
        console.log(err)
      })
      // profileCollect.splice(0,1)
      // wx.setStorageSync('profileCollect', profileCollect)
    }
    this.setData({
      activitiesHeat,
      isClickCollect
    })
  },
  // // 报名跳转页面
  // registrate() {
  //   wx.navigateTo({
  //     url: '/pages/activityIn/activityIn',
  //   })
  // },

  // 查询活动评价表
  queryActivityComment() {
    const that = this
    const id = wx.getStorageSync('activityId')
    wx.cloud.callFunction({
      name: 'getActivityComment',
      data: {
        id
      }
    }).then( res => {
      if(res.result.data.length){
        console.log('活动评价表已添加')
      }else{
        that.addActivityComment(id)
      }
    })
  },
  // 添加活动评价表
  addActivityComment(id) {
    wx.cloud.callFunction({
      name: 'addActivityComment',
      data: {
        activityId: id
      }
    })
  },
  // 点击评价事件
  clickEvaluate() {
    this.queryActivityComment()
    wx.navigateTo({
      url: '/pages/comment/comment'
    })
  }
})