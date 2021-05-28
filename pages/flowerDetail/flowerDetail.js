let id = '' //商品的id

Page({
  data: {
    openid:'',
    _id:'', //用户id
    flower:{},
    contact:['sunflower','四川省成都市郫都区','18181599195'],
    collectFlag:false  //用于切换收藏标志
  },

  onLoad(options) {
    id = options.id

    //调用云函数getOpenid获取用户的openid
    wx.cloud.callFunction({
      name:'getOpenid'
    })
    .then(res => {
      console.log("获取openid成功",res)
      this.setData({
        openid:res.result.openid
      })
    })
    .catch(err => {
      console.log("获取openid失败",err)
    })

    //访问云函数getFlowerById，根据花的id获取花的信息
    wx.cloud.callFunction({
      name:'getFlowerById',
      data:{
        id:id
      }
    })
    .then(res => {
      console.log("根据id请求花成功",res)
      this.setData({
        flower:res.result.data
      })
    })
    .catch(err => {
      console.log("根据id请求花失败",err)
    })
    
    //访问云函数getuserIdByOpenid，根据openid拿到_id
    wx.cloud.callFunction({
      name:'getUseridByOpenid',
    })
    .then(res => {
      console.log('根据openid获取_id成功',res);
      this.setData({
        _id:res.result.data[0]._id
      })
    })
    .catch(err => {
      console.log("根据openid获取_id失败",err);
    })
    
    //根据openid获取到该用户的收藏属性
    wx.cloud.callFunction({
      name:'getUserFoodsByOpenid'
    })
    .then(res => {
      if(res.result.data[0].collection.find(item => item === id) !== undefined){
        //说明用户已经收藏过该商品
        this.setData({
          collectFlag: true
        })
      }
    })
    .catch(err => {
      console.log("判断成功",err)
    })
  },

  //点击按钮进行分享
  onShareAppMessage() {
    return {
      title: "顺哒校园",
      path:'../market/market'
    }
  },

  //跳转到home页面
  jumpToHome(){
    wx.reLaunch({
      url: '/pages/market/market'
    })
  },

  //点击收藏图标
  collect(){
    //获取collection
    wx.cloud.callFunction({
      name:'getUserFoodsByOpenid'
    })
    .then(res => {
      let collection = res.result.data[0].collection

      if(this.data.collectFlag){
        //取消收藏
        collection.splice(collection.findIndex(item => item === id), 1)
  
        wx.cloud.callFunction({
          name:'deleteCollect',
          data:{
            _id:this.data._id,
            collection: collection
          }
        })
        .then(res => {
          console.log("取消收藏成功",res)

          wx.showToast({
            title: '取消收藏成功',
            duration:2000
          })

          this.setData({
            collectFlag:false
          })
        })
        .catch(err => {
          console.log("取消收藏失败",err)
        })
      }else{
        //点击收藏
        wx.cloud.callFunction({
          name:'saveCollect',
          data:{
            _id:this.data._id,
            flowerId: id
          }
        })
        .then(res => {
          console.log("收藏成功",res)

          wx.showToast({
            title: '收藏成功',
            duration:2000
          })

          this.setData({
            collectFlag:true
          })
        })
        .catch(err => {
          console.log("收藏失败",err)
        })
      }
    })
    .catch(err => {
      console.log(err)
    })
  },

  //点击加入购物车
  addToCart(){
    let cart = {}
    cart._id = id
    cart.num = 1

    wx.cloud.callFunction({
      name:'saveCart',
      data:{
        _id:this.data._id,
        cart:cart
      }
    })
    .then(res => {
      console.log("添加购物车成功",res)
      wx.showToast({
        title: '添加购物车成功',
        duration:2000
      })
    })
    .catch(err => {
      console.log("添加购物车失败",err)
    })
  },

  //点击立即购买
  buy(){
    wx.navigateTo({
      url:'../account/account?goods=' + JSON.stringify([{flower: this.data.flower, num: 1}])
    })
  }
})