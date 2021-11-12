// components/Search/search.js
const { request } = require('../../request/index.js')
import regeneratorRuntime from '../../lib/runtime/runtime';
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
    // 防抖  
  TimeId:-1,
  data: {
    isFocus:false,
    inputValue:"",
    activities: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleInput(e) {
      // 获取输入框的值
      const {value} = e.detail;
      // 检测合法性
      if(!value.trim()){
        this.setData({
          activities:[],
          isFocus:false
        })
        // 值不合法
        return;
      }
      // 准备发送数据
      this.setData({
        isFocus:true
      })
      clearTimeout(this.TimeId);
      this.TimeId=setTimeout(() => {
        this.qsearch(value.toString());
      }, 1000);
    },
      // 发送请求获取搜索建议 数据
     async qsearch(query){
      // wx.request({
      //   url: 'http://192.168.1.29:8080/activities',
      //   method: "GET",
      //   success: res => {
      //     console.log('请求成功')
      //     console.log(res.data)
      //   },
      //   fail: err => {
      //     console.log(err,'请求失败')
      //   }
      // })
      const res = await request({url:'/activities?query='+ query})
      console.log(res)
      console.log(res.data)
      if(res.data) {
        this.setData({
          activities:res.data
        })
      }else{
        wx.showToast({
          title: '找不到活动',
          icon: 'error'
        })
        this.setData({
          activities: []
        })
      }
      },
    // 点击 取消按钮
    handleCancel() {
      this.setData({
        inputValue:"",
        isFocus:false,
        activities: []
      })
    },
    chooseActivity(e) {
      let activityId = e.currentTarget.dataset.id
      wx.cloud.callFunction({
        name: 'getActivityDetail',
        data: {
          id: activityId
        }
      }).then(res =>{
        this.triggerEvent("search",...res.result.data)
      })
      this.setData({
        inputValue:"",
        isFocus:false,
        activities: []
      })
    }
  }
})
