// pages/listDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userPhone: "152****1003",
    userMoney: 10,
    taskType: "其他任务",
    taskDemond: "不限性别",
    description: "谁有旧的一卡通，东三自习室只能用旧一卡通，就是没换过那种。10元买一张",
    taskShow: false,
    steps: [
      {
        text: '步骤一',
        desc: '描述信息',
      },
      {
        text: '步骤二',
        desc: '描述信息',
      },
      {
        text: '步骤三',
        desc: '描述信息',
      },
      {
        text: '步骤四',
        desc: '描述信息',
      },
    ],
},

closeTaskPopup(){
  this.setData({
    taskShow: false
  })
},
showTaskCard(){
  this.setData({
    taskShow: true
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