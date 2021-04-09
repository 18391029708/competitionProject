// pages/homePage/homePage.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    homePageVehicleArea:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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