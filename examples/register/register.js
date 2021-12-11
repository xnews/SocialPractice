// examples/register/register.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // form_list:[
    //   {tagname: "用户名",name:"nickname"},
    //   {tagname: "学校",name:"school"},
    //   {tagname: "学号",name:"stuNum"},
    //   {tagname:"姓名",name:"name"},
    //   {tagname:"性别",name:"sex"},
    //   {tagname:"所属院系",name:"departments"},
    //   {tagname:"年级",name:"grade"},
    //   {tagname:"专业",name:"professional"},
    //   {tagname:"班级",name:"class"},
    //   {tagname: "联系方式",name:"contact"},
    //   {tagname: "邮箱",name:"email"},
    //   {tagname: "密码",name:"password"},
    //   {tagname: "确认密码",name:"compassword"}
    // ],
    schoolRange: [],
    depRange: [],
    gradeRange: [],
    proRange: [],
    departmentsInfo: [],
    professionalInfo: [],
    school_list: [
      {tagname: "学校",name:"school"},
      {tagname:"所属院系",name:"departments"},
      {tagname:"年级",name:"grade"},
      {tagname:"专业",name:"professional"}
    ],
    form_list:[
      {tagname: "用户名",name:"nickname"},
      {tagname: "学号",name:"stuNum"},
      {tagname:"姓名",name:"name"},
      {tagname:"性别",name:"sex"},
      {tagname:"班级",name:"class"},
      {tagname: "联系方式",name:"contact"},
      {tagname: "邮箱",name:"email"},
      {tagname: "密码",name:"password"},
      {tagname: "确认密码",name:"compassword"}
    ]
  },
  onShow() {
    this.getSchoolInfo()
  },
  // 输入空信息提示
  handleInput(e) {
    console.log('失去焦点',e)
    let index = e.currentTarget.dataset.index;
    let name = this.data.form_list[index].tagname;
    if(index !== "") {
      let inputValue = e.detail.value;
      if(inputValue==""||inputValue=='None') {
        wx.showToast({
          title: name + '不为空',
          icon: 'error'
        })
      }
    }
  },
  // 注册按钮提交信息
  regisSubmit(e) {
    console.log('表单提交',e)
    const stuInfo = e.detail.value;
    console.log(stuInfo,'学生信息')
    const db = wx.cloud.database().collection("stuInfo");
    // 验证输入是否为空
    if(stuInfo.nickname==""||stuInfo.school==""||stuInfo.stuNum==""||stuInfo.name==""||stuInfo.sex==""||stuInfo.departments==""||stuInfo.grade==""||stuInfo.professional==""||stuInfo.class==""||stuInfo.contact==""||stuInfo.email==""||stuInfo.password==""||stuInfo.compassword==""){
      wx.showToast({
        title: '请填写空项',
        icon: 'error'
      })
    }else{
      if(stuInfo.password !== stuInfo.compassword) {
        wx.showToast({
          title: '密码不一致',
          icon: 'error'
        })
      } else {
        wx.showToast({
          title: '注册成功',
          icon: 'success',
          success: () => {
            wx.redirectTo({
              url: '/examples/login/login'
            })
            getApp().getUserTrajectory(1, 'Require', 'examples/register/register', '用户注册');//获取用户轨迹
          }
        })
        // 添加学生注册信息
        db.add({
          data: {
            nickName: stuInfo.nickname,
            school: stuInfo.school,
            stuNum: stuInfo.stuNum,
            name: stuInfo.name,
            sex: stuInfo.sex,
            departments: stuInfo.departments,
            grade: stuInfo.grade,
            professional: stuInfo.professional,
            class: stuInfo.class,
            contact: stuInfo.contact,
            email: stuInfo.email,
            password: stuInfo.password,
          }
        })
      }
    }
  },
  // 获取学校信息
  getSchoolInfo() {
    wx.cloud.callFunction({
      name: 'getSchoolInfo'
    }).then(res =>{
      console.log(res, '学校信息')
      const {departments,grades,professional,school} = res.result.data[0]
      const departmentsInfo = Object.assign({},departments)
      const professionalInfo = Object.assign({},professional)
      const depRange = []
      const gradeRange= []
      const schoolRange = []
      depRange.push(departments.arts,departments.economics,departments.electrical,departments.foreignLanguages,departments.lifeSciences,departments.marxism,departments.medicine,departments.music,departments.sportsInstitute)
      // depRange.push(...departments)
      gradeRange.push(...grades)
      schoolRange.push(school)
      // proRange.push()
      this.setData({
        schoolRange,depRange,gradeRange,departmentsInfo,professionalInfo
      })
    })
  },
  // 选择学校
  chooseSchoolValue(e) {
    const {value} = e.detail
    this.setData({
      schoolValue: value
    })
  },
  // 选择院系
  chooseDepValue(e) {
    const {value} = e.detail
    const departmentsInfo = this.data.departmentsInfo
    const proValue = this.findkey(departmentsInfo, this.data.depRange[value])
    const professionalInfo = this.data.professionalInfo
    const professional = professionalInfo[proValue]
    const proRange= []
    proRange.push(...professional)
    this.setData({
      depValue: value,
      proRange
    })
  },
  // 选择年级
  chooseGraValue(e) {
    const {value} = e.detail
    this.setData({
      graValue: value
    })
  },
  // 选择专业
  chooseProValue(e) {
    const {value} = e.detail
    this.setData({
      proValue: value
    })
  },
  //创建一个方法，返回value值对应的key
  findkey (obj,value, compare = (a, b) => a === b) {
    return Object.keys(obj).find(k => compare(obj[k], value))
  }
})