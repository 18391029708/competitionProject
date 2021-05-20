// pages/takeOrderDetail/takeOrderDetail.js
const db = wx.cloud.database()
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    orderInfo:''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let orderInfo = JSON.parse(options.orderInfo);
    // let myDate = new Date();
    // console.log(myDate.getDate())
    // orderInfo.creat_time = orderInfo.creat_time.substring(0,5)
    // console.log('0001:'+orderInfo)

this.setData({
  orderInfo:JSON.parse(options.orderInfo)
})


  },
  takeOrder(){
    // 更新数据库状态为已接单
    console.log(this.data.orderInfo._id)
    // db.collection('t_order').doc(this.data.orderInfo._id).get()
    db.collection('t_order').doc(this.data.orderInfo._id).update({
      data:{
        orderStatus:"正在进行",
        takeOrderUserId:app.globalData.openid,
      }
    })
    .then( res =>{
      wx.switchTab({
        url: '../order/order',
      })
      console.log(res)
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