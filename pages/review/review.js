// pages/review/review.js
// import hotChart from '../../echarts/activityHot.js'
import getOptions from '../../echarts/activityHot.js'
import detailChart from '../../echarts/activityDetail.js'
import typeChart from '../../echarts/activityType.js'
var util= require('../../utils/util.js')
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
    passIndex: null,
    optionsType: [{
      type_id: '1',
      type_name: '志愿服务'
    }, {
      type_id: '2',
      type_name: '支教服务'
    }, {
      type_id: '4',
      type_name: '社会调研'
    }, {
      type_id: '5',
      type_name: '公益宣传'
    }, {
      type_id: '6',
      type_name: '参观学习'
    }, {
      type_id: '7',
      type_name: '学术科研'
    }, {
      type_id: '8',
      type_name: '文艺下乡'
    }],
    // optionsNum: [{
    //   team_id: '1',
    //   team_num: '个人'
    // },{
    //   team_id: '2',
    //   team_num: '2-5人'
    // },{
    //   team_id: '3',
    //   team_num: '6-9人'
    // },{
    //   team_id: '4',
    //   team_num: '10-15人'
    // },{
    //   team_id: '5',
    //   team_num: '15人以上'
    // }],
    selected: {},
    fileId: "",
    registradateValue: "选择日期",
    registratimeValue: "选择时间",
    deadlinedateValue: "选择日期",
    deadlinetimeValue: "选择时间",
    inputValue: "",
    // activityHot: {
    //   onInit: init_chart
    // },
    activityDetail: {
      onInit: detailChart
    },
    activityType: {
      onInit: typeChart
    },
    activityName: "",
    activityTime: "",
    option: {}
  },
  onShow() {
    wx.showLoading({
      title: '加载中',
    })
    this.showReviewOrganiseInfo()
    this.showReviewContributeInfo()
    wx.hideLoading()
  },
  onReady() {
    this.getData()
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
    try {
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
                that.setData({
                  passIndex: index
                })
              }).catch(err=>{
                console.log('更新失败')
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      })  
    } catch (error) {
      console.log(error)
    }
    },
  // 活动未通过事件
  hanleOrganiseUnqualify(e) {
    const that = this
    const index = e.currentTarget.dataset.index
    try {
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
    } catch (error) {
      console.log(error)
    }
   },
  // 活动发布
  handleOrganiseRelease(e) {
    const that = this
    const index = e.currentTarget.dataset.index
    const passIndex = this.data.passIndex
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
              const deadline = new Date(time.setDate(time.getDate()-2)) 
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
                wx.showToast({
                  title: '发布成功',
                  icon: 'success'
                })
              reviewInfo.splice(index,1)
              that.showReviewOrganiseInfo()
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
    try {
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
              }).catch(err =>{
                console.log('更新失败')
              })
              that.setData({
                passIndex: index
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      })
    
    } catch (error) {
      console.log(error)
    }
   },
  // 投稿审核未通过事件
  handleContributeUnqualify(e) {
    const that = this
    const index = e.currentTarget.dataset.index
    try {
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
    } catch (error) {
      console.log(error)
    }
  },
  // 投稿发布事件
  handleContributeRelease(e) {
    const that = this
    const index = e.currentTarget.dataset.index
    wx.showModal({
      content: '是否确认发布',
      success (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          that.getContributeInfo().then(res =>{
            const data = res[index]
            console.log(data)
            const contributeInfo = res
            const title = data.title
            const articleContent = data.articleContent
            const name = data.name
            const stuNum = data.stuNum
            const time = data.time
            const images = data.images
            const type = data.type
            const content = []
            for(let i of articleContent){
              content.push({text: i})
            }
            for(let i=0;i<articleContent.length;i++) {
              for(let j of images) {
                content[i]["content_img_url"] = j.path
              }
            }
            console.log(content)
            wx.cloud.callFunction({
              name: 'addDynamicInfo',
              data: {
                img_url: images[0].path,
                time: time,
                title: title,
                type: type,
                content,
                content_time: time,
                content_title: title
              }
            }).then(res =>{
              console.log('投稿发布成功')
              contributeInfo.splice(index,1)
              that.showReviewContributeInfo()
            }).catch(()=>{
              console.log('投稿发布失败')
            })
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // 点击更多事件
  hanleMore(e) {
    const contributeIndex = e.currentTarget.dataset.index
    wx.setStorageSync('contributeIndex', contributeIndex)
    wx.navigateTo({
      url: '/pages/reviewContribution/reviewContribution',
    })
  },
  changeType(e) {
    this.setData({
      selected: { ...e.detail }
    })
    // 缓存活动类型
    wx.setStorageSync('changeType', e.detail.name)
  },
  // changeNum(e){
  //   this.setData({
  //     selected: { ...e.detail }
  //   })
  //   // 缓存团队人数
  //   wx.setStorageSync('changeNum', e.detail.name)
  // },
  close () {
    // 关闭select
    this.selectComponent('#select').close()
  },
    // 提交表单数据
  organiseSubmit(e) {
    const that = this
    const acReleaseInfo = e.detail.value;
    let type = wx.getStorageSync('changeType')
    // let number = wx.getStorageSync('changeNum')
    acReleaseInfo['type'] = type
    // acReleaseInfo['number'] = number
    console.log(acReleaseInfo,'活动信息')
    const activityName = acReleaseInfo.activityName
    const certification = acReleaseInfo.host
    const deadline = new Date(acReleaseInfo.deadlinedate+" "+acReleaseInfo.deadlinetime)
    const heat = {"browseNum":0,"collectNum":0,"commentNum":0,"thumbupNum":0}
    const manager = acReleaseInfo.principal
    const site = acReleaseInfo.place
    const teacher = acReleaseInfo.adviser
    const time = new Date(acReleaseInfo.registradate+" "+acReleaseInfo.registratime)
    wx.showModal({
      content: '是否确认发布',
      success (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.cloud.callFunction({
            name: 'addActivityDetail',
            data: {
              activityName,certification,deadline,heat,manager,site,teacher,time,type
            }
          })
          that.setData({
            inputValue: "",
            registradateValue: "选择日期",
            registratimeValue: "选择时间",
            deadlinedateValue: "选择日期",
            deadlinetimeValue: "选择时间",
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // 选择报名日期事件
  chooseRegistraDate(e) {
    const {value} = e.detail
    this.setData({
      registradateValue: value
    })
  },
  // 选择报名时间
  chooseRegistraTime(e) {
    const {value} = e.detail
    this.setData({
      registratimeValue: value
    })
  },
    // 选择截止日期事件
    chooseDeadlineDate(e) {
      const {value} = e.detail
      this.setData({
        deadlinedateValue: value
      })
    },
    // 选择截止报名时间
    chooseDeadlineTime(e) {
      const {value} = e.detail
      this.setData({
        deadlinetimeValue: value
      })
    },
  // 清空表单信息
  emptyFormInfo() {
    this.setData({
      registradateValue: "选择日期",
      registratimeValue: "选择时间",
      deadlinedateValue: "选择日期",
      deadlinetimeValue: "选择时间"
    })
  },
  // 搜索活动
  searchActivity(e) {
    console.log(e,'搜索活动')
    let {activityName,time} = e.detail
    time = util.formatTime(new Date(time))
    this.setData({
      activityName,
      activityTime: time
    })
  },
  getData() {
     const data = [
      { value: 1048, name: '浏览量' },
      { value: 735, name: '点赞量' },
      { value: 580, name: '评论量' },
      { value: 484, name: '收藏量' }
    ]
    const option = getOptions(data)
    this.setData({
      option
    })
  }
})