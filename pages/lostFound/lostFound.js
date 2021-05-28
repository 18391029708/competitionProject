Page({
  data: {
    typeArr:['校园卡','手机','身份证','银行卡','钥匙','照相机','书籍','其他'],
    typeImgs:['../../icons/campusCard.png','../../icons/phone.png','../../icons/idCard.png','../../icons/bankCard.png','../../icons/key.png','../../icons/camera.png','../../icons/book.png','../../icons/others.png'],
    lostType:"校园卡",
    index:0,
    goodsList:[]

  },

  onReady() {
    this.getGoodsByType(this.data.lostType)
  },

  //点击物品事件
  chickGoods(e){
    this.setData({
      index:e.currentTarget.dataset.index 
    })

    this.setData({
      lostType:this.data.typeArr[this.data.index]
    })

    this.getGoodsByType(this.data.lostType)
  },

  //根据类型获取失物招领列表
  getGoodsByType(type){
    //调用云函数getLostFound，根据事务类型获取物品列表
    wx.cloud.callFunction({
      name:'getLostFound',
      data:{
        type:this.data.lostType
      }
    })
    .then(res => {
      console.log("根据类型获取物品列表成功",res)
      this.setData({
        goodsList:res.result.data
      })

      if(this.data.goodsList){
        this.data.goodsList.forEach(goods => {
          //该用户的openid
          let openid = goods['openid']
          //调用云函数，根据openid去获取该用户的头像和昵称
          wx.cloud.callFunction({
            name:'getUserByOpenid',
            data:{
              openid:openid
            }
          })
          .then(res => {
            console.log("获取用户信息成功",res)
            goods.avatarUrl = res.result.data[0].userInfo.avatarUrl
            goods.nickName = res.result.data[0].userInfo.nickName 

            this.setData({
              goodsList:this.data.goodsList
            })

          })
          .catch(err => {
            console.log("获取用户信息成功",err)
          })
        })
      }
    })
    .catch(err => {
      console.log("根据类型获取物品列表失败",err)
    })

  },

  //点击发布图标进行失物招领的发布
  addLostFound(){
    wx.navigateTo({
      url: '../addLostFound/addLostFound',
    })
  }
  
})