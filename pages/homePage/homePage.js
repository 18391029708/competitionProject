// pages/homePage/homePage.js
const app = getApp();

const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    background:['../../icons/campus1.png','../../icons/campus2.png','../../icons/campus3.png'],
    homePageVehicleArea:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("登录页用户信息openid：" + app.globalData.openid)
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
      url: '../takeVehicle/takeVehicle',
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

  //跳转到失物招领页面
  jumpToLostFound(){
    wx.navigateTo({
      url: '../lostFound/lostFound',
    })
  },

  toDetial(){
    wx.navigateTo({
      url: '../webview/webview?url='+'http://news.swust.edu.cn',
    })
  },

  // 校园热点
  campusNews(){
    wx.navigateTo({
      url: '../webview/webview?url='+'http://news.swust.edu.cn/2021/0525/c294a134366/page.htm',
    })
  },
  campusNews2(){
    wx.navigateTo({
      url: '../webview/webview?url='+'http://news.swust.edu.cn/2021/0521/c294a134270/page.htm',
    })
  },
  campusNews3(){
    wx.navigateTo({
      url: '../webview/webview?url='+'http://news.swust.edu.cn/2021/0520/c295a134232/page.htm',
    })
  },
  campusNews4(){
    wx.navigateTo({
      url: '../webview/webview?url='+'http://news.swust.edu.cn/2021/0524/c295a134336/page.htm',
    })
  },
  campusNews5(){
    wx.navigateTo({
      url: '../webview/webview?url='+'http://news.swust.edu.cn/2021/0525/c295a134380/page.htm',
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