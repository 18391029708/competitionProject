Page({
  data: {
    type:"", //花类型
    flowerList:[]  //花列表
  },

  onLoad (options) {
    this.setData({
      type:options.type
    })

    wx.cloud.callFunction({
      name:'getFlowerListByType',
      data:{
        type:this.data.type
      }
    })
    .then(res => {
      console.log("根据type获取花列表成功",res)
      this.setData({
        flowerList:res.result.data
      })
    })
    .catch(err => {
      console.log("根据type获取花列表失败",err)
    })
  },

  //跳转到花的详情页
  jumpToFlowerDetail(e){
    wx.navigateTo({
      url: '/pages/flowerDetail/flowerDetail?id=' + e.currentTarget.dataset.item._id,
    })
  }
  
})