// pages/review/review.js
// import hotChart from '../../echarts/activityHot.js'
import getHotOptions from '../../echarts/activityHot.js'
import getDetailOptions from '../../echarts/activityDetail.js'
import getProcessOptions from '../../echarts/activityProcess.js'
var util= require('../../utils/util.js')
// 实例化API核心类
const app = getApp()
const qqmapsdk = app.globalData.qqmapsdk
var EARTH_RADIUS = 6378.137; //地球半径
function rad(d) {
    return d * Math.PI / 180.0;
}
function getDistance(lng1, lat1, lng2, lat2) {
  var radLat1 = rad(lat1);
  var radLat2 = rad(lat2);
  var a = radLat1 - radLat2;
  var b = rad(lng1) - rad(lng2);
  var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2)
    + Math.cos(radLat1) * Math.cos(radLat2)
    * Math.pow(Math.sin(b / 2), 2)));
  s = s * EARTH_RADIUS;
  s = Math.round(s * 10000) / 10000;
  return s;//返回数值单位：公里
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    activityNav:["活动审核","投稿审核","活动发布","活动分析","活动监控","公告发布","意见反馈"],
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
    activityName: "",
    activityTime: "",
    optionHot: {},
    optionProcess: {},
    optionDetail: {},
    timer: "",
    data1: 0,
    data2: [
      {value: 0,name:"浏览量"},
      {value: 0,name:"点赞量"},
      {value: 0,name:"评论量"},
      {value: 0,name:"收藏量"}
    ],
    markers: [],
    poiDest: {
      latitude: '',
      longitude: ''
    },
    points: [],
    circles: [],
    adviserArray: [],
    index: null,
    height:""
  },
  onLoad() {
    this.getData()
    var _this = this;
    this.getData()
    // this.setData({                    //每隔10s刷新一次数据
    //   timer: setInterval(function () {
    //     _this.getData()
    // }, 10000)
    // })
    wx.cloud.callFunction({
      name: 'getTeaInfo'
    }).then(res => {
      // console.log(res)
      const data = res.result.data
      const teaName = data.map(item => item.name)
      // console.log(teaName)
      this.setData({
        adviserArray: teaName
      })
    })
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
    // this.includePoints();
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
    // console.log(index)
    if(index===0) {
      this.showReviewOrganiseInfo()
    }else if(index===1) {
      this.showReviewContributeInfo()
    }else if(index===5) {
      // let id = "#textareawrap";
      // let query = wx.createSelectorQuery();//创建查询对象
      // query.select(id).boundingClientRect();//获取view的边界及位置信息
      // query.exec(res => {
      //   console.log(res)
      //   this.setData({
      //     height: res[0].height + "px"
      //   });
      // });
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
            index: null
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
  // 搜索活动分析
  activityAnalyse(e) {
    // console.log(e,'搜索活动')
    const that = this
    let {activityName,time,deadline,heat} = e.detail
    time = util.formatTime(new Date(time))
    deadline = util.formatTime(new Date(deadline))
    const totalTime = new Date(time) - new Date(deadline)
    const name2 = ["浏览量","点赞量","评论量","收藏量"]
    const data2 = [
      {value: heat.browseNum,name:name2[0]},
      {value: heat.collectNum,name:name2[1]},
      {value: heat.commentNum,name:name2[2]},
      {value: heat.thumbupNum,name:name2[3]}
    ]
    // console.log(data2,'data2')
    this.setData({                    //每隔10s刷新一次
      timer: setInterval( ()=> {
        const processTime = new Date() - new Date(time)
        let data1 = -(processTime/totalTime).toFixed(4)*100 
        data1 = Number(data1.toFixed(2))
        that.setData({
          data1
        })
        that.onLoad()
    }, 1000),
      activityName,
      activityTime: time,
      data2
    })
  },
  // 获取图表数据
  getData() {
    const data1 = this.data.data1
    // console.log(data1)
    const data2 = this.data.data2
    // console.log(data2,'data2')
    const optionProcess = getProcessOptions(data1)
    const optionHot = getHotOptions(data2)
    const optionDetail = getDetailOptions()
    this.setData({
      optionProcess,
      optionHot,
      optionDetail
    })
  },
  // 搜索活动监控
  activityMonitor(e) {
    let {_id,site} = e.detail
    // 标记活动目的地
    const markers = this.data.markers;
    const points = this.data.points
    const circles = this.data.circles
    const _this = this;
    qqmapsdk.geocoder({
      address: site,
      success: function(res) {//成功后的回调
        var res = res.result;
        let poiDest = {
          latitude: res.location.lat,
          longitude: res.location.lng
        }
        console.log(poiDest,'目的地')
        //根据地址解析在地图上标记解析地址位置
        markers.push({ // 获取返回结果，放到mks数组中
          title: res.title,
          id: 999,
          latitude: res.location.lat,
          longitude: res.location.lng,
          iconPath: '../../images/hdqd/destination.png', // 图标路径
          width: 35,
          height: 35
        });
        _this.circleRange(res.location.lat,res.location.lng)
        _this.setData({ // 获取返回结果，放到markers及poi中，并在地图展示
          markers,poiDest
        });
      },
      fail: function(error) {
        console.error(error);
      }
    })
    // 获取用户的实时定位信息
    wx.cloud.callFunction({
      name: 'getActivityIn',
      data: {
        activityId: _id
      }
    }).then(res=>{
      const data = res.result.data
      let newArr = data.map((item,index) =>{
        return {
          id: index,
          latitude: item.location.latitude,
          longitude: item.location.longitude,
          iconPath: '../../images/hdqd/'+'myPosition.png', // 图标路径
          width: 20,
          height: 30,
          callout: {
            content: item.name,
            color: '#ffffff',
            bgColor: 'rgb(0, 102, 255)',
            fontSize: 15,
            borderRadius: 50,
            borderWidth: 5,
            display: 'ALWAYS',
            anchorY: 2
          }
        }
      })
      markers.push(...newArr)
      _this.setData({
        markers
      })
    })
    this.calcDistance()
  },
  // 点击标记点对应的气泡时触
  callouttap(e) {
    const {markerId} = e.detail
    console.log(markerId)
  },
  // 签到范围
  circleRange(lat,lng) {
    const mapCtx = wx.createMapContext('myMap',this);
    const that = this
    mapCtx.getRegion({
      success: function(res) {
        let lng1 = res.northeast.longitude;
        let lat1 = res.northeast.latitude;
        let lng2 = res.southwest.longitude;
        let lat2 = res.southwest.latitude;
        let longitude = lng1 - lng2;
        let latitude = lat1 - lat2;
        let flag = longitude>latitude?true:false;
        let radius = 0;
        let circles = that.data.circles
        //计算得到短边，然后再通过*1000转变为m，除2得到半径，*0.8优化显示，让圈圈只占界面的80%
        if(flag){
            radius= getDistance(lng1,lat1,lng1,lat2)*1000/3.05*0.8;
        }else{
            radius= getDistance(lng1,lat1,lng2,lat1)*1000/3.05*0.8;
        }
        console.log(radius,'半径')
        circles = [{
          "radius":radius,
          "latitude":lat,
          "longitude":lng,
          "color": '#0066ff',
          "strokeWidth": 4
        }]
       that.setData({
          circles
       });
      }
    }
  )
  },
  // 缩放视野以包含所有给定的坐标点
  // includePoints() {
  //   const points = this.data.points
  //     points.push({
  //       latitude: 26.659328,
  //       longitude: 119.588789
  //   },
  //     {
  //       latitude: 26.651292,
  //       longitude: 119.588725
  //   },
  //     {
  //       latitude: 26.652788,
  //       longitude: 119.59675
  //   },
  //     {
  //       latitude: 26.659289,
  //       longitude: 119.598488
  //   }
  // )
  //   this.setData({
  //     points
  //   })
  // }
  // 计算距离
  calcDistance() {
    qqmapsdk.calculateDistance({
      mode: 'straight',
      from: {
        latitude: 26.66185488457434,
        longitude: 119.56872497488098
        },
      to: [{
        latitude: 26.661032,
        longitude: 119.568321
      }],
      success: (res) =>{
        const distance = res.result.elements[0].distance
        console.log(distance,'距离')
      }
    })
  },
  // 获取经纬度信息
  getLocation(e) {
    console.log(e,'地理位置')
  },
  chooseAdviser(e) {
    const {value} = e.detail
    console.log(value)
    this.setData({
      index: value
    })
  },
  // 提交公告信息
  announcementSubmit(e) {
    console.log(e,'公告信息')
    const {announcementContent,publisher,publishdate,title} = e.detail.value
    const content = {}
    content.paragraph = announcementContent.split(/[\n]/)
    console.log(content,'文章')
    wx.cloud.callFunction({
      name: 'addActivityAnnouncement',
      data: {
        content,
        publisher,
        time: publishdate,
        title,
        browseNum: 0
      }
    }).then(() =>{
      wx.showToast({
        title: '发布成功',
        icon: 'success'
      }).then(() => {
        this.setData({
          inputValue: "",
          registradateValue: "选择日期"
        })
      })
    })
  }
})