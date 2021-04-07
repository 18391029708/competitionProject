// pages/orderConfirm/orderConfirm.js
const timeutil = require('../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    EndPosition: '999',
    position:'o',
    confirmData:"",
    openid:'',
    orderType:"电车搭乘",
    orderMoney:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
   let that = this;
    const eventChannel = this.getOpenerEventChannel()
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('acceptDataFromOpenerPage', function(data) {
      console.log(data)
      that.setData({
        EndPosition: data.data.EndPosition,
        position:data.data.position
      })
    })
 
    console.log(1)
    console.log(this.data)   //this 可以使用
    
  },
  //订单支付,调用云函数
  payMent:function(){
    wx.showToast({
      title: "请稍等...",
      icon: 'loading',
      // duration: 4000
    });
    let that = this;
    var timestamp = Date.parse(new Date());
    console.log(timestamp)
    timestamp = timestamp / 1000;
    // var outTradeNo = timestamp+timestamp+timestamp+'abc';
    wx.cloud.callFunction({
      name:'pay',
      data: {
        money:that.data.orderMoney,
        outTradeNo:timestamp+timestamp+timestamp+'abc'
      },
      success: res => {
        console.log(res)
        const payment = res.result.payment
    wx.requestPayment({
      ...payment,
      success(res) {
        console.log('pay success', res)
        console.log("支付页用户基本信息：" + app.globalData.openid);
     
        wx.cloud.callFunction({
          name:'OperateDatabase',
          data:{
            opr:'add',
            tablename:'t_order',
            data:{
              create_time: timeutil.formatTime(new Date()),
              update_time: timeutil.formatTime(new Date()),
            //  specifyGender:'',
            orderType:that.data.orderType,
              userId:app.globalData.openid,
              end_position: that.data.EndPosition,
              // 订单分为等待接单，正在进行，已完成，三个状态
              orderStatus: '等待接单',
              start_position: that.data.position ,
              orderMoney:that.data.orderMoney
            }
          }
        })
        wx.showToast({
          title: "你最帅",
          icon: 'loading',
          duration: 4000
        });
        setTimeout(function(){
          wx.switchTab({
            url:'../order/order',
          })  
        },3000)
      },
      fail: console.error
    })
  },
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