// pages/organization/organization.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
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
    optionsNum: [{
      team_id: '1',
      team_num: '个人'
    },{
      team_id: '2',
      team_num: '2-5人'
    },{
      team_id: '3',
      team_num: '6-9人'
    },{
      team_id: '4',
      team_num: '10-15人'
    }],
    selected: {},
    fileId: "",
    dateValue: "选择日期",
    timeValue: "选择时间"
  },
  changeType(e) {
    this.setData({
      selected: { ...e.detail }
    })
    // 缓存活动类型
    wx.setStorageSync('changeType', e.detail.name)
  },
  changeNum(e){
    this.setData({
      selected: { ...e.detail }
    })
    // 缓存团队人数
    wx.setStorageSync('changeNum', e.detail.name)
  },
  close () {
    // 关闭select
    this.selectComponent('#select').close()
  },
  // 校验文件格式
  checkFileName(str){
    const strRegex = "(.doc|.docx)$"; //用于验证文件扩展名的正则表达式
    let re= new RegExp(strRegex);
    if (re.test(str.toLowerCase())){
        return true;
    } else{
      return false
    }
  },
  // 提交表单数据
  organiseSubmit(e) {
    const stuNum = wx.getStorageSync('stuNum')
    const acOrInfo = e.detail.value;
    let type = wx.getStorageSync('changeType')
    let number = wx.getStorageSync('changeNum')
    acOrInfo['type'] = type
    acOrInfo['number'] = number
    const uploadFile = wx.getStorageSync('uploadOrgniseFile')
    wx.cloud.callFunction({
      name: 'addOrganizationInfo',
      data:{
        stuNum,
        place: acOrInfo.place,
        time:  acOrInfo.date + ' ' + acOrInfo.time,
        activityName: acOrInfo.activityName,
        type: acOrInfo.type,
        teamName: acOrInfo.teamName,
        number: acOrInfo.number,
        principal: acOrInfo.principal,
        adviser: acOrInfo.adviser,
        uploadFile: uploadFile,
        noteInfo: acOrInfo.noteInfo,
        status: "审核中"
      }
    }).then((res) => {
      console.log(res,'11')
      wx.showToast({
        title: '提交成功待审核',
        icon: 'success'
      })
    })
    console.log(acOrInfo,'组织信息')
    const {place,time,activityName,teamName,principal,adviser,noteInfo} = acOrInfo
    let profileAcOrganise = []
    profileAcOrganise.push({place,time,activityName,type,teamName,number,principal,adviser,uploadFile,noteInfo})
    wx.cloud.callFunction({
      name: 'updateProfileOrganization',
      data: {
        stuNum,
        organization: profileAcOrganise[0]
      }
    })
    wx.setStorageSync('profileAcOrganise', profileAcOrganise)
  },
  // 文件上传事件
  handleuploadFile() {
    wx.chooseMessageFile({
      count: 1,
      type: "file"
    }).then(res =>{
      // 临时存储文件路径
      const tempFilePaths = res.tempFiles[0].path
      const filename = res.tempFiles[0].name
      const cloudPath = 'activity_organization/' + filename //云存储路径
      let result = this.checkFileName(tempFilePaths)
      if(result){
        wx.cloud.uploadFile({
          cloudPath,
          filePath: tempFilePaths,
          success: res => {
            wx.setStorageSync('uploadOrgniseFile', {
              fileName: filename,
              fileId: res.fileID
            })
            wx.showToast({
              title: '文件添加成功',
              icon: 'success'
            })
          },
          fail: () => {
            wx.showToast({
              title: '文件添加失败',
              icon: 'success'
            })
          }
        })
      }else{
        wx.showToast({
          title: "文件名不合法",
          icon: 'error'
        })
      }
    })
    
  },
  // 选择日期事件
  chooseDate(e) {
    const {value} = e.detail
    this.setData({
      dateValue: value
    })
  },
  // 选择时间
  chooseTime(e) {
    const {value} = e.detail
    this.setData({
      timeValue: value
    })
  },
  emptyFormInfo() {
    const that = this
    wx.showModal({
      content: '是否清空所有信息',
      success (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          const select = that.selectComponent('.Select')
          // 向子组件传递数据
          that.setData({
            dateValue: "选择日期",
            timeValue: "选择时间"
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
})