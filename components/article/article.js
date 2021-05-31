// components/article/article.js
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

  /**
   * 组件的初始数据
   */
  data: {

  },
  options:{
    addGlobalClass:true
  },
  /**
   * 组件的方法列表
   */
  methods: {
    trigEvent:function(e){
      console.log(e);
      this.triggerEvent('logMyProp',"detail可以让父组件看见");
    }
  }
})
