Page({
  data: {
    openid:'',
    types:["告白墙","失物招领","电车搭乘","快递代取"],
    confessionFlag:true,
    lostFlag:false,
    vehicleFlag:false,
    expressageFlag:false,
    type:"告白墙",
    lostList:[] //失物招领列表
  },

  onLoad: function (options) {
    //默认获取告白墙的信息
    this.getListByType(this.data.type)

    //获取该用户的openid
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
  },

  //点击 展示某一类型的详情
  showLostRecoeds(e){
    this.setData({
      type:this.data.types[e.currentTarget.dataset.index]
    })

   this.getListByType(this.data.type)
  },

  //根据类型("告白墙","失物招领","电车搭乘","快递代取")获取该用户的发布历史
  getListByType(type){
    if(type === "告白墙"){
        this.setData({
          confessionFlag:true,
          lostFlag:false,
          vehicleFlag:false,
          expressageFlag:false
        })
      
    }else if(type === "失物招领"){
      //访问云函数
      wx.cloud.callFunction({
        name:'getAllLostByOpenid'
      })
      .then(res => {
        console.log("根据openid获取该用户的失物招领成功",res)
     
        this.setData({
          lostList:res.result.data
        })
        
        this.setData({
          lostFlag:true,
          confessionFlag:false,
          vehicleFlag:false,
          expressageFlag:false
        })
      })
      .catch(err => {
        console.log("根据openid获取该用户的失物招领失败",err)
      })
    }else if(type === "电车搭乘"){
      this.setData({
        lostFlag:false,
        confessionFlag:false,
        vehicleFlag:true,
        expressageFlag:false
      })
    }else if(type === "快递代取"){
      this.setData({
        lostFlag:false,
        confessionFlag:false,
        vehicleFlag:false,
        expressageFlag:true
      })
    }
  },

  //改变失物招领的状态 未完成--已完成
  changeStatus(e){
    let currentIndex = e.currentTarget.dataset.index
    let newStatus = `lostList[` + currentIndex + `].status`
    if(this.data.lostList[currentIndex].status === '未完成'){
      //将该项的状态改为已经完成
      this.setData({
        [newStatus]:"已完成"
      })

      wx.showToast({
        title: '已改变',
        duration:2000
      })
    }else{
      wx.showToast({
        title: '不能将状态从【已完成】改为【未完成】',
        duration:2000
      })
    }
  }
})