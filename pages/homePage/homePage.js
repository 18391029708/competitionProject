// pages/homePage/homePage.js
const app = getApp();

const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    background:['../../icons/1.jpg','../../icons/2.jpg','../../icons/3.jpg'],
    // backgrounc:['../../icons/3.jpg'],
    homePageVehicleArea:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("登录页用户信息openid：" + app.globalData.openid)
    // db.collection('t_user_info').doc('cbddf0af6075a896014caa445d944008').update({
    //   data:{
    //     aaa:"woshi"
    //   }
    // }).then(res=> {
    //   console.log("我是首页数据：" ,res)
      
    
    // })

  },
  web1(){
    wx.navigateTo({
      url: '../webview/webview?url='+'https://www.bilibili.com/',
    })
  },

  web2(){
    wx.navigateTo({
      url: '../webview/webview?url='+'http://www.swust.edu.cn/48/list.htm',
    })
  },
  web3(){
    wx.navigateTo({
      url: '../webview/webview?url='+'http://www.swust.edu.cn/496/list.htm',
    })
  },
  toTakeVehicle(){
    wx.navigateTo({
      url: '../takeVehicle/takeVehicle?url='+'http://www.swust.edu.cn/89/list.htm',
    })
  },

  toTakeOrder(){
    wx.navigateTo({
      url: '../takeOrder/takeOrder',
    })
  },
  
  toTakeDelivery(){
    wx.navigateTo({
      url: '../takeDelivery/takeDelivery',
    
    })
  },
  toTakeDelivery(){
    wx.navigateTo({
      url: '../takeDelivery/takeDelivery',
    
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 获取当前用户选择的身份状态
    this.setData({
      homePageVehicleArea:app.globalData.selectStatus
    })
    

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})