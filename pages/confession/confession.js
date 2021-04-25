// pages/confession.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLike: false,
    confessions:[]
  },
  // 事件
  handleLike(e){
    console.log(e);
    this.setData({
      isLike:!this.data.isLike
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.cloud.callFunction({
    //   name:'OperateDatabase', // 云函数名称
    //   data:{
    //     opr:'add',
    //     tablename:"t_confession",
    //     data:{
    //       content:"测试",
    //       userId:"shasigei",
    //       createTime:"2220/20/20"
    //     }
    //   },
    //   complete:res=>{
    //     console.log("云函数启用成功",res);
    //   }
    // })
    wx.cloud.callFunction({
      name:"OperateDatabase",
      data:{
        opr:'query',
        tablename:"t_confession",
        data:{

        }
      },
      complete:(res)=>{
        console.log("confessions:",res);
        this.setData({
          confessions:res.result.data
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