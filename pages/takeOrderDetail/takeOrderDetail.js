// pages/takeOrderDetail/takeOrderDetail.js
const db = wx.cloud.database()
const app = getApp();
const timeutil = require('../../utils/util.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    orderInfo:'',
    orderMoney:2

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let orderInfo = JSON.parse(options.orderInfo);


this.setData({
  orderInfo:JSON.parse(options.orderInfo)
})


  },
  takeOrder(){
    let that = this;
    // 更新数据库状态为已接单
    console.log(this.data.orderInfo._id)
    db.collection('t_order').doc(this.data.orderInfo._id).update({
      data:{
        orderStatus:"正在进行",
        takeOrderUserId:app.globalData.openid,
      }
    })
    .then( res =>{
      wx.cloud.callFunction({
        name:"OperateDatabase",
        data:{
          opr:'add',
          tablename:'t_pay_record',
          data:{
            _openid:app.globalData.openid,
            userId:app.globalData.openid,
            orderNo:that.data.orderInfo._id,
            orderMoney:that.data.orderMoney,
            orderTime:timeutil.formatTime(new Date()),
            orderType:'电车接乘-接单奖励',
            // 判断为支出或者收入，true为支出，false为收入
            expense:false
          }
        }
      })
      console.log(that.data.id)  
      wx.navigateTo({
        url: '../order/order',
      })
      console.log(res)
    })
  },

  overOrder(){
       // 更新数据库状态为已完成
       console.log(this.data.orderInfo._id)
       db.collection('t_order').doc(this.data.orderInfo._id).update({
         data:{
           orderStatus:"已完成",
         }
       })
wx.navigateTo({
  url: '../order/order',
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