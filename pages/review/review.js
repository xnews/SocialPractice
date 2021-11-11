// pages/review/review.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activityNav:["活动审核","投稿审核","活动发布","活动分析","公告管理","意见反馈"],
    indexNav: 0,
    reviewInfo: [],
    filePath: "",
    contributeInfo: [],
    passIndex: null
  },
  onShow() {
    wx.showLoading({
      title: '加载中',
    })
    this.showReviewOrganiseInfo()
    this.showReviewContributeInfo()
    wx.hideLoading()
  },
  // 获取活动审核所有信息
  getReviewOrganiseInfo() {
    const teaName = wx.getStorageSync('teaName')
    return new Promise(resolve => {
      wx.cloud.callFunction({
        name: 'getReviewOrganiseInfo',
        data: {
          name: teaName
        }
      }).then(res =>{
        resolve(res.result.data)
      })
    })
  },
  // 显示活动审核所有信息
  showReviewOrganiseInfo() {
    this.getReviewOrganiseInfo().then(res =>{
      const reviewInfo = res
      for(let item of reviewInfo) {
        const time = item.time.split(" ")[0]
        item.time = time
      }
      this.setData({
        reviewInfo
      })
    })

  },
  ClickNav(e) {
    const index = e.currentTarget.dataset.index
    console.log(index)
    if(index===0) {
      this.showReviewOrganiseInfo()
    }else if(index===1) {
      this.showReviewContributeInfo()
    }
    this.setData({
      indexNav: index
    })
  },
  // 文件预览事件
  handleDownloadFile(e) {
    const that = this
    const index = e.currentTarget.dataset.index
    this.getReviewOrganiseInfo().then(res =>{
      const fileID = res[index].uploadFile.fileId
      const fileName = res[index].uploadFile.fileName
      console.log(fileName)
      console.log(res[index])
      wx.cloud.downloadFile({
          fileID
      }).then(res => {
        console.log(res.tempFilePath)
        // wx.downloadFile({
        //   url: res.tempFilePath,
        //   success(res){
        //     console.log(res)
        //     const filePath = fileName
        //     console.log(filePath)
        //     that.setData({
        //       filePath
        //     })
            // wx.getFileSystemManager().saveFile({
            //   tempFilePath: res.tempFilePath,
            //   filePath: wx.env.USER_DATA_PATH + that.data.filePath,
            //   success(res) {
            //     console.log('save ->', res) // 上传文件结果
            //     wx.showToast({
            //       title: '文件已保存至：' + res.savedFilePath,
            //       icon: 'none',
            //       duration: 1500
            //     })
                wx.openDocument({
                  // filePath: res.savedFilePath,
                  filePath: res.tempFilePath,
                 success(res) {
                   console.log('打开文档成功')
                 }
               })
              }
            // })
          // }
        // })
      // }
      ).catch(error => {
        console.log(error)
      })
    })

  },
  // 活动通过事件
  handleOrganisePass(e) {
    const that = this
    const index = e.currentTarget.dataset.index
    this.getReviewOrganiseInfo().then(res =>{
      const reviewInfo = res
      const data = res[index]
      const activityName = data.activityName
      const adviser = data.adviser
      const noteInfo = data.noteInfo
      const number = data.number
      const place = data.place
      const principal = data.principal
      const teamName = data.teamName
      const time = data.time
      const type = data.type
      const uploadFile = data.uploadFile
      wx.showModal({
        title: '提示',
        content: '请确认通过',
        success (res) {
          if (res.confirm) {
            wx.cloud.callFunction({
              name: 'updateOrganiseStatus',
              data: {
                activityName,adviser,noteInfo,number,place,principal,teamName,time,type,uploadFile,
                status: "已通过"
              }
            }).then(res =>{
              console.log('更新成功')
              // reviewInfo.splice(index,1)
              // that.showReviewOrganiseInfo()

            }).catch(err=>{
              console.log('更新失败')
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
            that.setData({
              passIndex: index
            })
          }
        }
      })
    })
  },
  // 活动未通过事件
  hanleOrganiseUnqualify(e) {
    const that = this
    const index = e.currentTarget.dataset.index
    this.getReviewOrganiseInfo().then(res =>{
      const reviewInfo = res
      const data = res[index]
      const activityName = data.activityName
      const adviser = data.adviser
      const noteInfo = data.noteInfo
      const number = data.number
      const place = data.place
      const principal = data.principal
      const teamName = data.teamName
      const time = data.time
      const type = data.type
      const uploadFile = data.uploadFile
      wx.showModal({
        title: '提示',
        content: '请确认未通过',
        success (res) {
          if (res.confirm) {
            wx.cloud.callFunction({
              name: 'updateOrganiseStatus',
              data: {
                activityName,adviser,noteInfo,number,place,principal,teamName,time,type,uploadFile,
                status: "未通过"
              }
            }).then(res =>{
              console.log('更新成功')
              reviewInfo.splice(index,1)
              that.showReviewOrganiseInfo()
            }).catch(err=>{
              console.log('更新失败')
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    })
  },
  // 活动发布
  handleOrganiseRelease(e) {
    const that = this
    const index = e.currentTarget.dataset.index
    const passIndex = this.data.passIndex
    console.log(passIndex,'通过情况')
    console.log(index,'索引')
    if(index===passIndex) {
      wx.showModal({
        content: "请确认是否发布",
        success (res) {
          if (res.confirm) {
            console.log('用户确定发布')
            that.getReviewOrganiseInfo().then(res=>{
              const reviewInfo = res
              const data = res[index]
              const activityName = data.activityName
              const adviser = data.adviser
              const noteInfo = data.noteInfo
              const number = data.number
              const place = data.place
              const principal = data.principal
              const teamName = data.teamName
              const type = data.type
              const uploadFile = data.uploadFile
              const time = new Date(data.time)
              console.log(time)
              const deadline = new Date(time.setDate(time.getDate()-2)) 
              console.log(deadline)
              wx.cloud.callFunction({
                name: 'addActivityDetail',
                data: {
                  activityName,
                  certification: teamName,
                  deadline,
                  heat: {"browseNum": 0,"collectNum": 0,"commentNum": 0,"thumbupNum": 0},
                  manager: principal,
                  site: place,
                  teacher: adviser,
                  time,
                  type
                }
              }).then(()=>{
                console.log('添加成功')
              }).catch(()=>{
                console.log('添加失败')
              })
            })

          } else if (res.cancel) {
            console.log('用户取消发布')
          }
        }
      })
    }
  },
  // 获取投稿所有信息
  getContributeInfo() {
    return new Promise(resolve =>{
      wx.cloud.callFunction({
        name: 'getActivityContribute'
      }).then(res => {
        resolve(res.result.data)
      }).catch(err =>{
        console.log(err)
      })
    })
  },
    // 显示投稿审核所有信息
  showReviewContributeInfo() {
    this.getContributeInfo().then(res =>{
      const contributeInfo = res
      for(let item of contributeInfo) {
        const time = item.time.split(" ")[0]
        item.time = time
      }
      this.setData({
        contributeInfo
      })
    })
  },
  // 投稿审核通过事件
  hanleContributePass(e) {
    const that = this
    const index = e.currentTarget.dataset.index
    this.getContributeInfo().then(res =>{
      const data = res[index]
      console.log(data)
      const contributeInfo = res
      const title = data.title
      const articleContent = data.articleContent
      const name = data.name
      const stuNum = data.stuNum
      const time = data.time
      const images = data.images
      wx.showModal({
        title: '提示',
        content: '请确认通过',
        success (res) {
          if (res.confirm) {
            wx.cloud.callFunction({
              name: 'updateContributeStatus',
              data: {
                title,articleContent,name,stuNum,time,images,
                status: "已通过"
              }
            }).then(res =>{
              console.log('更新成功')
              contributeInfo.splice(index,1)
              that.showReviewContributeInfo()
            }).catch(err =>{
              console.log('更新失败')
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    })
  },
  // 投稿审核未通过事件
  handleContributeUnqualify(e) {
    const that = this
    const index = e.currentTarget.dataset.index
    this.getContributeInfo().then(res =>{
      const data = res[index]
      const contributeInfo = res
      const title = data.title
      const articleContent = data.articleContent
      const name = data.name
      const stuNum = data.stuNum
      const time = data.time
      const images = data.images
      wx.showModal({
        title: '提示',
        content: '请确认未通过',
        success (res) {
          if (res.confirm) {
            wx.cloud.callFunction({
              name: 'updateContributeStatus',
              data: {
                title,articleContent,name,stuNum,time,images,
                status: "未通过"
              }
            }).then(res =>{
              console.log('更新成功')
              contributeInfo.splice(index,1)
              that.showReviewContributeInfo()
            }).catch(err =>{
              console.log('更新失败')
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    })
  },
  // 点击更多事件
  hanleMore(e) {
    const contributeIndex = e.currentTarget.dataset.index
    wx.setStorageSync('contributeIndex', contributeIndex)
    wx.navigateTo({
      url: '/pages/reviewContribution/reviewContribution',
    })
  }
})