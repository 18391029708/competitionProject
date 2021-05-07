// pages/takeOrder/takeOrder.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    takeOrderLists:[{"_id":"28ee4e3e606db8cf0e77ab51549b3b5b","create_time":"2021/04/07 21:51:13","end_position":"西南科技大学国家大学科技园(涪城区)","scheduling":"等待接单","specifyGender":"","start_position":"四川省绵阳市涪城区二环路北段","update_time":"2021/04/07 21:51:13","userId":"o75dQ5ZDFiQUvvDZQid66XskWpWU","way_status":"正在进行"}]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.cloud.callFunction({
      name:'OperateDatabase',
      data:{
        opr:'query',
        tablename:'t_order',
        data:{
            // userId:app.globalData.openid
            orderStatus:"等待接单",
           
        }
      },
      success:res =>{
        console.log(res)
        console.log("返回查询接单数据：" + res.result)
        console.log(JSON.stringify(res.result.data))
        this.setData({
          takeOrderLists:res.result.data
        })
        console.log("这是订单列表lists:" + this.data.takeOrderLists)
        for(let i = 0;i<this.data.takeOrderLists.length;i++){
          console.log("订单列表：" + this.data.takeOrderLists[i]);
          console.log(JSON.stringify(this.data.takeOrderLists[i]));
        }
      

      }
    })
    
    console.log("查询结束")

  },
  confirmTakeOredr(e){
    console.log(this.data.takeOrderLists[e.currentTarget.id])
    let str = JSON.stringify(this.data.takeOrderLists[e.currentTarget.id])
    console.log(str)
    console.log( "接单：", e);
    wx.navigateTo({
      url: "../takeOrderDetail/takeOrderDetail?orderInfo="+ str,
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