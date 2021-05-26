const util = require('../../utils/util.js')
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
    avatarUrl:'',
    nickName:'',
    currentTime:util.formatTime(new Date())
  },

  /**
   * 组件的方法列表
   */
  methods: {
    created(){
      wx.getUserInfo({
        success:function(res){
          this.setData({
            avatarUrl: res.userInfo.avatarUrl,
            nickName:res.userInfo.nickName
          })
        }
      })
    },


  }
})
