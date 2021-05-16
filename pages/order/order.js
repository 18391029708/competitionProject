const db = wx.cloud.database()
const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    deliveryOrder: [],
    carOrder: [],
    active: 0,
  },

  toListDetail(event) {
    let idx = event.currentTarget.dataset.idx;

    wx.navigateTo({
      url: '../listDetail/listDetail?' + "task=" + JSON.stringify(this.data.deliveryOrder[idx]),
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    // 向云服务器请求数据
    // wx.showLoading({
    //   title: '加载中',
    // })
    const that = this;

    db.collection('t_delivery_order').where({
      _openid: app.globalData.openid
    }).get().then(res => {
      // console.log(res.data);
      that.setData({
        deliveryOrder:res.data
      })
    }).catch(err => {
      console.log(err);
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