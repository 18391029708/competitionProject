// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    openid:'',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName') // 如需尝试获取用户信息可改为false
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  // 获取用户信息出调用查询数据库中是否有数据
  intent(){
    wx.cloud.callFunction({
      name:"OperateDatabase",
      data:{
        opr:'query',
        tablename:'t_user_info',
        data:{
          userId:app.globalData.openid
        }
      },
      success:res =>{
        console.log("用户基本信息已经存在数据库用户表中" + JSON.stringify(res.result) )
        if(res.result.data.length == 0){
          wx.cloud.callFunction({
            name:"OperateDatabase",
            data:{
              opr:"add",
              tablename:"t_user_info",
              data:{
                _openid:app.globalData.openid,
                userId:app.globalData.openid,
                userInfo:this.data.userInfo,
                // aaa:'',
                // _openid:app.globalData.openid,
              }
            },
            success:res =>{
              wx.showToast({
                title: '数据存储成功',
                icon:"success",
                duration:2000,
              })
            }
          })           
        }else{//基本信息表中没有用户数据
            // 将用户基本信息上传到用户表里
            console.log("用户信息已经添加")
        }
  
        },
        complete: res =>{
          //跳转tabar页面
           wx.switchTab({
           url: '../homePage/homePage',
   })
      }
    })
 
    console.log("用户基本信息：" + this.data.userInfo)
    console.log(JSON.stringify(this.data.userInfo))
    // 将用户基本信息存储全局
    app.globalData.userInfo = this.data.userInfo
  },
  getPhoneNumber(event){
    console.log("云coloudID：" + JSON.stringify(event))
    console.log(event.detail.encryptedData)
    let cloudID = event.detail.cloudID
    if(!cloudID){
      wx.showToast({
        title: '用户未授权',
      })
      return
    }
     
        wx.cloud.callFunction({
          name: 'getPhone',
          data: {
            cloudID:cloudID
          }
        
        }).then(res => {
          console.log("获取成功：" + res)
          // app.hideLoading()
          let phone = res.result.list[0].data.phoneNumber
    
            this.setData({
              phone: phone
            })
   
        }).catch(error => {
          console.log('获取失败',error)
  
          
        })
  },
  onLoad() {
  
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
    // 通过云函数获取用户openid
    wx.cloud.callFunction({
      name:"openapi",
      data:{
        action:"getOpenData"
      },
      success: res =>{
        console.log("获取到openid:" + res)
        console.log(JSON.stringify(res))
        app.globalData.openid = res.result.openid
      }
    })
  
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        console.log("登录用户信息：" + res.userInfo)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        this.intent();
        this.saveMarketUserInfo();
      }
    })
  },

  //将该用户openid，nickName,avatarUrl保存到user表中
  saveMarketUserInfo(){
    //调用云函数，拿到openid
    wx.cloud.callFunction({
      name:'getOpenid'
    })
    .then(res => {
      console.log("获取openid成功",res)
      this.setData({
        openid:res.result.openid
      })

      //获取商城用户，判断该用户是否已经存储在user表中
      wx.cloud.callFunction({
        name:"getMarketUserInfo"
      })
      .then(res => {
        console.log("获取商城用户信息成功",res)
        let MarketUser = res.result.data
        let isExist = MarketUser.findIndex(item => item.openid !== this.data.openid)
        if(isExist === -1){
          //将该用户的信息存储到user表中
          wx.cloud.callFunction({
            name:'saveMarketUserInfo',
            data:{
              openid:this.data.openid,
              nickName:this.data.userInfo.nickName,
              avatarUrl:this.data.userInfo.avatarUrl
            }
          })
          .then(res => {
            console.log("保存商城用户信息成功",res)
          })
          .then(err => {
            console.log("保存商城用户信息失败",err)
          })
        }
      })
      .catch(err => {
        console.log("获取商城用户信息失败",err)
      })
    })
    .catch(err => {
      console.log("获取openid成功",err)
    })
  },

  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    console.log(e)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
