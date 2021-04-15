const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    itemTypes: ["学习用品", "生活用品", "电子产品", "其他类型"],
    typeShow: false,
    itemType: "",
    phone: "",
    sexDemand: "",
    profit: 6,
    description: "",
    isNike: 0
  },

  typeConfirm(event) {
    this.setData({
      itemType: event.detail.value,
      typeShow: false
    })
  },

  typeCancel() {
    this.setData({
      typeShow: false
    })
  },

  showTypePopup() {
    this.setData({
      typeShow: true
    })
  },

  closeTypePopup() {
    this.setData({
      typeShow: false
    })
  },

  profitChange(event) {
    this.setData({
      profit: event.detail,
    })
  },

  sexChange(e) {
    this.setData({
      sexDemand: e.detail.value,
    })
    console.log(this.data.sexDemand);
  },

  addDsp(e) {
    this.setData({
      description: e.detail.value,
    })
  },

  niming(e) {
    if (e.detail.value === "") {
      this.setData({
        isNike: 0
      })
    } else {
      this.setData({
        isNike: 1
      })
    }
  },

  uploadMessage() {
    const db = wx.cloud.database()
    var that = this;
    var time = new Date().toLocaleString();

    db.collection('t_takeDelivery').add({
      data: {
        task:{
          "taskType": that.data.itemType,
          "taskStatus": "新任务",
          "taskProfit": that.data.profit,
          "description": that.data.description,
          "taskDemand": that.data.sexDemand,
        },
        userName: app.globalData.userInfo.nickName,
        userPhone: that.data.phone,
        isNike: that.data.isNike,
        addTime: time
      },
      success: function (res) {
        console.log(res)
        wx.redirectTo({
          url: '../takeDelivery/takeDelivery',
        })
      },
      fail: console.error
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