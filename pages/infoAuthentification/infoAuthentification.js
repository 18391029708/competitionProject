// pages/infoAuthentification/infoAuthentification.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardType:[{title:"学生认证",tip:"未完善"},{title:"实名认证",tip:"未完善"},{title:"车手认证",tip:"未完善"}]

  },
  authentification(e){
    // 跳转到认证细节页面，根据传值进行渲染页面显示
    // 展示学生认证信息
    if(e.currentTarget.id == 0){
      wx.navigateTo({
        // 跳转传参方式
        url: '../authentificationDetail/authentificationDetail?studentInfoShow='+true,
      })
    }else  if(e.currentTarget.id == 1){
      wx.navigateTo({
        url: '../authentificationDetail/authentificationDetail?realInfoShow='+true,
      })
      // 展示车手认证信息
    }else  if(e.currentTarget.id == 2){
      wx.navigateTo({
        url: '../authentificationDetail/authentificationDetail?vehicleInfoShow='+true,   
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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