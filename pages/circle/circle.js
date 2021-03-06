// pages/circle/circle.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height:0,
    curActiveTab:0
  },
  tabbarChange(e){
    console.log(e);
    const {index} = e.detail;
    this.setData({
      curActiveTab:index
    })
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
    wx.getSystemInfo({
      success: (result) => {
        let h = result.windowHeight-80-result.statusBarHeight;
        // console.log(result.screenHeight,result.windowHeight,result.statusBarHeight);
        this.setData({
          height:h
        })
      },
    })
  },
  logThis:function(e){
    console.log("父组件：",e);
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