// components/topic/topic.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    height:{
      type:Number,
      value:0
    },
    curActiveTab:{
     type:Number,
     value:0
   }
  },
  options:{
    addGlobalClass:true
  },
  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    handNavigateTo:function (params) {
      console.log(params);
      wx.navigateTo({
        url: params.currentTarget.dataset.url,
      })
    }
  }
})
