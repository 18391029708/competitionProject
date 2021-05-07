// pages/order/order.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    start_position:'宿舍楼',
    end_position:'大石头',
    create_time:'12:23:09',
    orderStatus:'正在进行',
    orderType:'电车搭乘',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app.globalData)
    console.log("订单页加载的用户openid;" + app.globalData.openid)
    wx.cloud.callFunction({
      name:'OperateDatabase',
      data:{
        opr:'query',
        tablename:'t_order',
        data:{
            userId:app.globalData.openid,
            orderStatus:'正在进行'
        }
      },
      // 查询已接单列表
      success:res =>{
        console.log(res)
        console.log("返回查询订单数据：" + res.result)
        console.log(JSON.stringify(res.result.data))
        this.setData({
          lists:res.result.data
        })
        console.log("这是订单列表lists:" + this.data.lists)
        for(let i = 0;i<this.data.lists.length;i++){
          console.log("订单列表：" + this.data.lists[i]);
          console.log(JSON.stringify(this.data.lists[i]));
        }
      }
    })
    console.log("查询结束")
    wx.cloud.callFunction({
      name:"OperateDatabase",
      data:{
        opr:'query',
        tablename:'t_user_info',
        data:{
          takeOrderUserId:app.globalData.openid,
          orderStatus:'正在进行'
        }
      },
      success: res =>{
        console.log("返回查询司机接单数据：" + res.result)
        console.log(JSON.stringify(res.result))
        this.setData({
          takeOrderLists:res.result.data
        })
      }
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
        // 获取当前用户选择的身份状态,确定展现车手接单页还是普通订单页
        this.setData({
          orderType:app.globalData.selectStatus
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