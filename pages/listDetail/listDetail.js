Page({
  /**
   * 页面的初始数据
   */
  data: {
    userPhone: "",
    task: {},
    taskShow: false,
    ruleShow: false,
    active: 0,
    steps: [
      {
        text: '新任务',
      },
      {
        text: '已接单',
      },
      {
        text: '已完成',
      },
    ],
},

closeRulesPopup(){
  this.setData({
    rulesShow: false
  })
},

showRulesCard(){
  this.setData({
    rulesShow: true
  })
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

toPay(){
  console.log("跳转付款");
},

/**
 * 生命周期函数--监听页面加载
 */
onLoad: function (options) {
  let jsondata = JSON.parse(options.task);
  let nikePhone = jsondata.userPhone.replace(/^(\d{3})\d{4}/,"$1****");
  jsondata["nikePhone"] = nikePhone;

  let status;
  if(jsondata.task.taskStatus === "新任务"){
    status = 0;
  }else if(jsondata.task.taskStatus === "已接单"){
    status = 1;
  }else{
    status = 2;
  }
  this.setData({
    task: jsondata,
    active: status
  });
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