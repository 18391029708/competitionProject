Page({
  data: {
    classificationImgList:[], //分类图片和标题
    flowerList:[],  //花
    cartFlag:false,
    flowerId:'' //该花的_id
  },

  onLoad (options){
    //访问云函数，拿到分类图片和标题
    wx.cloud.callFunction({
      name:'getClassificationImgList'
    })
    .then(res => {
      this.setData({
        classificationImgList:res.result.data
      })
      console.log("获取分类图片成功",res)
    })
    .catch(err => {
      console.log("获取分类图片失败",err)
    })

    //访问云函数getFlowerList，拿到花的列表
    wx.cloud.callFunction({
      name:'getFlowerList'
    })
    .then(res => {
      console.log("获取花列表成功",res)
      this.setData({
        flowerList:res.result.data
      })
    })
    .catch(err => {
      console.log("获取花列表失败",err)
    })
  
  },

  //根据花的分类跳转去分类展示的具体页面
  jumpToClassificationDetail(e){
    wx.navigateTo({
      url: '/pages/classificationDeatil/classificationDeatil?type=' + e.currentTarget.dataset.type
    })
  },

  //跳转到花的详情页
  jumpToFlowerDetail(e){
    wx.navigateTo({
      url: '/pages/flowerDetail/flowerDetail?id=' + e.currentTarget.dataset.item._id,
    })
  },

  //点击展示购物车组件
  showCart(e){
    this.setData({
      cartFlag:true
    })

    this.setData({
      flowerId:e.currentTarget.dataset.item._id
    })
  },

  //处理关闭购物车组件
  closeCart(){
    this.setData({
      cartFlag:false
    })
  }

})