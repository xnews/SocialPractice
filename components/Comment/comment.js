// components/Comment/comment.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    inputValue: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleInput(e) {
      this.triggerEvent('commentinput',e)
    },
    handleComment(e) {
      this.setData({
        inputValue: ''
      })
      this.triggerEvent('submitcomment',e)
    }
  }
})
