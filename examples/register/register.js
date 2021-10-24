// examples/register/register.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    form_list:[
      {tagname: "用户名",name:"nickname"},
      {tagname: "学校",name:"school"},
      {tagname: "学号",name:"stuNum"},
      {tagname:"姓名",name:"name"},
      {tagname:"性别",name:"sex"},
      {tagname:"所属院系",name:"departments"},
      {tagname:"年级",name:"grade"},
      {tagname:"专业",name:"professional"},
      {tagname:"班级",name:"class"},
      {tagname: "联系方式",name:"contact"},
      {tagname: "邮箱",name:"email"},
      {tagname: "密码",name:"password"},
      {tagname: "确认密码",name:"compassword"}
    ]
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
    const db = wx.cloud.database().collection("stuInfo");
    // 验证输入是否为空
    for(let key in stuInfo){
      if(stuInfo[key]==""||stuInfo[key]=='None'){
        wx.showToast({
          title: '请填写空项',
          icon: 'error'
        })
      } else{
        wx.showToast({
          title: '注册成功',
          icon: 'success',
          success: () => {
            wx.redirectTo({
              url: '/examples/login/login'
            })
          }
        })
      }
    }
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
})