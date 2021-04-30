Page({
  /**
   * 页面的初始数据
   */
  data: {
    task: []
  },

  toListDetail(event) {
    let idx = event.currentTarget.dataset.idx;

    wx.navigateTo({
      url: '../listDetail/listDetail?' + "task=" + JSON.stringify(this.data.task[idx]),
    })
  },

  toAddTask() {
    wx.navigateTo({
      url: '../addTask/addTask',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 向云服务器请求数据
    wx.showLoading({
      title: '加载中',
    })
    let that = this;
    //t_takeDelivery为表名
    wx.cloud.database().collection('t_takeDelivery').get({
      success: function (res) {
        that.setData({
          task:res.data
        })
        wx.hideLoading()
      }
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