const db = wx.cloud.database()
const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    deliveryOrder: [],
    takeCarOrder:[],
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
  onLoad: function (options) {
    console.log(app.globalData)
    console.log(app.globalData.selectStatus)
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
    console.log("订单类型："+this.orderType)
    console.log(app.globalData.selectStatus)
    this.setData({
      orderType:app.globalData.selectStatus
    })
    // 向云服务器请求数据
    wx.showLoading({
      title: '加载中',
    })
    const that = this;

    db.collection('t_delivery_order').where({
      _openid: app.globalData.openid
    }).get().then(res => {
      console.log(res.data);
      that.setData({
        deliveryOrder:res.data
      })
      wx.hideLoading();
    }).catch(err => {
      console.log(err);
    })

    // 电车订单查询
    db.collection('t_order').where({
      _openid: app.globalData.openid
    }).orderBy('create_time','desc').get().then(res => {
      console.log(res.data);
      that.setData({
        carOrder:res.data
      })
      wx.hideLoading();
    }).catch(err => {
      console.log(err);
    })
        // 司机接单订单查询
        db.collection('t_order').where({
          takeOrderUserId: app.globalData.openid,
          // orderStatus:'正在进行',
        }).orderBy('create_time','desc').get().then(res => {
          console.log(res.data);
          that.setData({
            takeCarOrder:res.data
          })
          wx.hideLoading();
        }).catch(err => {
          console.log(err);
        })
  
  },
  // 结束订单
  overOrder(e){
    console.log(e)
    let idx = e.currentTarget.dataset.idx;
    this.data.takeCarOrder[idx]['overOrder']=true
    let str = JSON.stringify(this.data.takeCarOrder[idx])
    console.log(str)
    wx.navigateTo({
      url: "../takeOrderDetail/takeOrderDetail?orderInfo="+ str,
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