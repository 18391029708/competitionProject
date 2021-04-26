const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl:"cloud://data-base-1g3n115z3df553d0.6461-data-base-1g3n115z3df553d0-1304215882/defult.jpg",
    itemTypes: ["菜鸟驿站", "圆通快递", "顺丰快递", "中通快递","百世快递","其他快递"],
    typeShow: false,
    itemType: "",
    itemTimes: ["2021-12-11", "2021-12-12", "2021-12-13", "2021-12-14","2021-12-15","2021-12-16"],
    timeShow: false,
    itemTime: "",
    phone: "",
    taskCode:"",
    startPlace:"",
    userPlace:"",
    profit: 6,
    isNick: 0,
    userName:"匿名"
  },

  typeConfirm(event) {
    this.setData({
      itemType: event.detail.value,
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

  timeConfirm(event) {
    this.setData({
      itemTime: event.detail.value,
      timeShow: false
    })
  },

  showTimePopup() {
    this.setData({
      timeShow: true
    })
  },

  closeTimePopup() {
    this.setData({
      timeShow: false
    })
  },

  profitChange(event) {
    this.setData({
      profit: event.detail,
    })
  },

  addDsp(e) {
    this.setData({
      description: e.detail.value,
    })
  },

  niming(e) {
    if (e.detail.value[0] === "是否匿名") {
      this.setData({
        isNick: 1
      })
    } else {
      this.setData({
        isNick: 0
      })
    }
  },

  uploadMessage() {
    const db = wx.cloud.database();
    let that = this;
    let time = new Date().toLocaleString();

    if(that.data.isNick === 0){
      that.data.userName = app.globalData.userInfo.nickName;
      that.data.avatarUrl = app.globalData.userInfo.avatarUrl;
    }

    db.collection('t_takeDelivery').add({
      data: {
        task:{
          "taskType": that.data.itemType,
          "taskStatus": "新任务",
          "taskProfit": that.data.profit,
          "description": that.data.description,
          "taskDemand": that.data.itemTime,
          "taskPlace": that.data.taskPlace,
          "taskCode": that.data.taskCode,
          "userPlace":  that.data.userPlace
        },
        avatarUrl: that.data.avatarUrl,
        userName: that.data.userName,
        userPhone: that.data.phone,
        isNick: that.data.isNick,
        addTime: time
      },
      success: function (res) {
        console.log(res)
        wx.navigateTo({
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