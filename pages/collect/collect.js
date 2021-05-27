let flowerListTemp = [] //全局变量 临时存储花列表
let app = getApp()
Page({
  data: {
    flowerList:[],  //花列表
    _id:''
  },

  onLoad(options) {
    //调用云函数getUserFoodsByOpenid去拿到用户的collection属性
    wx.cloud.callFunction({
      name:'getUserFoodsByOpenid'
    })
    .then(res => {
      console.log("根据openid获取用户收藏成功",res)
      let collectionIds = res.result.data[0].collection
      flowerListTemp = []
      collectionIds.forEach(collectionId => {
        //根据花的id去查找花的详情
        wx.cloud.callFunction({
          name:'getFlowerById',
          data:{
            id:collectionId
          }
        })
        .then(res => {
          console.log("查找花的详情成功",res);
          flowerListTemp.push(res.result.data)
          this.setData({
            flowerList:flowerListTemp
          })
        })
        .catch(err => {
          console.log("查找花的详情失败",err);
        })
      })
    })
    .catch(err => {
      console.log("根据openid获取用户收藏失败",err)
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
  },

  //点击删除收藏项
  deleteCollect(e){
    let id = e.currentTarget.dataset.item._id

    wx.cloud.callFunction({
      name:'getUserFoodsByOpenid'
    })
    .then(res => {
      let collection = res.result.data[0].collection 
      //取消收藏
      collection.splice(collection.findIndex(item => item === id), 1)
  
      wx.cloud.callFunction({
        name:'deleteCollect',
        data:{
          _id:this.data._id, //user表的_id
          collection: collection
        }
      })
      .then(res => {
        console.log("取消收藏成功",res)
        app.globalData.collectionChangedFlag = true

        //调用云函数getUserByOpenid去拿到用户的collection属性
        wx.cloud.callFunction({
          name:'getUserFoodsByOpenid'
        })
        .then(res => {
          console.log("根据openid获取用户收藏成功",res)
          wx.showToast({
            title: '删除收藏成功',
            duration:2000
          })
          flowerListTemp = []
          let collectionIds = res.result.data[0].collection
          collectionIds.forEach(collectionId => {
            //根据花的id去查找花的详情
            wx.cloud.callFunction({
              name:'getFlowerById',
              data:{
                id:collectionId
              }
            })
            .then(res => {
              console.log("查找花的详情成功",res);
              
              flowerListTemp.push(res.result.data)
              this.setData({
                flowerList:flowerListTemp
              })
            })
            .catch(err => {
              console.log("查找花的详情失败",err);
            })
          })
        })
        .catch(err => {
          console.log("根据openid获取用户收藏失败",err)
        })

      })
      .catch(err => {
        console.log("取消收藏失败",err)
      })

      console.log("获取用户收藏成功",res)
    })
    .catch(err => {
      console.log("获取用户收藏失败",err)
    })

  }
})