// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    motto: '进入首页',
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
  //跳转登录页
  homePage(){
   
  //跳转tabar页面
    wx.switchTab({
      url: '../homePage/homePage',
    })
    console.log("用户基本信息：" + this.data.userInfo)
    console.log(JSON.stringify(this.data.userInfo))
    // 将用户基本信息存储全局
    app.globalData.userInfo = this.data.userInfo
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
     
      }
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
