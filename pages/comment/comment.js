const time = require('../../utils/_util.js')
const nowTime = time.formatTime(new Date())
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isClickLike: false,
    activityComment: [],
    commentCount: 0,
    time: null,
    showInput: false,
    inputValue: null,
    thumbupIndex: 0,
    ReplyIndex: null
  },
  onShow() {
    // 获取活动评价数据
    const openId = wx.getStorageSync('openId')
    const activityId = wx.getStorageSync('activityId')
    wx.cloud.callFunction({
      name: 'getActivityComment',
      data: {
        id: activityId
      }
    }).then(res => {
      console.log(res)
      const activityComment = res.result.data[0].detail
      console.log(typeof activityComment)
      const commentCount = activityComment.length
      this.setData({
        activityComment,
        commentCount
      })
    }).catch(err => {
      console.log(err)
      this.setData({
        activityComment: []
      })
    })
    // 评价总数
    // db.collection('activity_comment').count().then(res => {
    //   this.setData({
    //     commentCount: res.total + 1
    //   })
    // }).catch(e => {console.log(e)}) 
  },
  // 更新点赞数量
  updateThumbup(id,num) {
    wx.cloud.callFunction({
      name: 'addCommentThumbup',
      data: {
        id,
        thumbup: num
      }
    })
  },
  // 处理点赞
  handleLike(e) {
    let activityComment = this.data.activityComment
    const ReplyIndex = e.currentTarget.dataset.index
    // console.log(ReplyIndex,'ww')
    let thumbupIndex = e.currentTarget.dataset.index
    let index = activityComment.findIndex((item,index) => index ===ReplyIndex)
    console.log(index,'1')
    // console.log(activityComment)
    // console.log(currentIndex,'66')
    // if(currentIndex) {
    // for(let i in activityComment){
    let isClickLike = !this.data.isClickLike;
      if(isClickLike){
        const id = activityComment[index]._id
        activityComment[index].thumbup += 1
        this.updateThumbup(id,activityComment[index].thumbup)
        activityComment[index].status = 1
      }else{
        const id = activityComment[index]._id
        activityComment[index].thumbup -= 1
        this.updateThumbup(id,activityComment[index].thumbup)
        activityComment[index].status = 0
      }
  
    this.setData({
      isClickLike,
      activityComment,
      thumbupIndex
    })
  // }

    
  },
  // 点击回复评论事件
  handleReplybtn(e) {
    const ReplyIndex = e.currentTarget.dataset.index
    console.log(ReplyIndex)
  //   wx.setStorageSync('ReplyIndex', ReplyIndex)
    // console.log(ReplyIndex,'index')
    let showInput = !this.data.showInput
    this.setData({
      showInput,
      ReplyIndex
    })
  },
  // 输入回复评论事件
  handleReplyInput(e) {
    // console.log(e,'11')
    const activityId = wx.getStorageSync('activityId')
    const ReplyIndex = e.currentTarget.dataset.index
    // const ReplyIndex = wx.getStorageSync('ReplyIndex')
    // console.log(ReplyIndex,'index')
    const activityComment = this.data.activityComment
    const { nickName } = wx.getStorageSync('userInfo')
    let value = e.detail.value
    // for(let i in activityComment){
    const replyInfoArr = activityComment[ReplyIndex].replyInfo
    // 回复评论
    console.log(activityComment)
    replyInfoArr.push({nickName:nickName,value:value})
    // const replyInfo = replyInfoArr[replyInfoArr.length-1]
    // const id = activityComment[ReplyIndex]['_id']
    // wx.cloud.callFunction({
    //   name:'addReplyInfo',
    //   data: {
    //     id,
    //     replyInfo
    //   }
    // })
    wx.cloud.callFunction({
      name: 'updateActivityComment',
      data: {
        activityId,
        detail: activityComment
      }
    })
    this.setData({
      activityComment,
      inputValue: ''
      })
    // }
  },
  submitcomment(e) {
    const activityId = wx.getStorageSync('activityId')
    const content = e.detail.detail.value.content
    const activityComment = this.data.activityComment
    const openId = wx.getStorageSync('openId')
    // console.log(content,'数据')
    const { nickName, avatarUrl } = wx.getStorageSync('userInfo')
    activityComment.push({activityId:activityId,content:content,thumbup:0,replyInfo:[],userInfo: {nickName,avatarUrl,openId},time:nowTime})
    console.log(activityComment,'activityComment')
    this.setData({
      activityComment
    })
    // this.setData({
      
    // })
    wx.cloud.callFunction({
      name: 'updateActivityComment',
      data: {
        activityId,
        detail: activityComment
      }
    })
  }
})