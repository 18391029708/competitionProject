// components/taskCard/taskCard.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    task:Object
  },
  
  /**
   * 组件的初始数据
   */
  data: {
    colorList:{
      "完成":"#65c294"	,
      "创建":"#33a3dc",
      "进行中":"#e0861a",
      "已取消":"#ed1941"
  },
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
