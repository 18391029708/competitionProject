// pages/personal/personal.js
const db = wx.cloud.database()
var app = getApp();
Page({
  data: {
    userInfo:'',
    switch1Checked:false,
    chooseBtn:true,
    hidden2:app.globalData.globalData,
    
   
    uname:'',
    usex:'',
    utx:'',
    utype:0,
    uphone:''
  },
  // changeSwitchChecked:function(){
  //   app.globalData.switchChecked='true';
  // },
  // {
  //   console.log(app.globalData.loginState),
  //   app.globalData.loginState=true,
  // },
 

  /**
   * 生命周期函数--监听页面加载
   */
  aa:function(event){
    console.log(event)
    app.globalData.hidden2=event.detail.value;
    console.log(app.globalData.hidden2,this.data.switch1Checked);
    console.log(event)
  },
  onLoad: function (options) {
    var that=this;
// 从全局数据获取用户基本信息
    this.setData({userInfo:app.globalData.userInfo}) ;
    console.log("我的页面用户信息"+ this.userInfo)
    console.log(this.data.chooseBtn)
    // 获取用户车辆认证信息为真则显示按钮
    db.collection('common_userInfo_list').where({_openid:app.globalData.openid,'vehicleInformation.have' :'true'}).get({
      success: function(res) {
        // res.data 包含该记录的数据
        console.log(res.data)
        for(var i = 0; i < res.data.length; i++){
        // for(const iterator of res.data){
          if(res.data[i].realName!=undefined && res.data[i].idCardNo!=undefined ){
            that.setData({
              chooseBtn:false
            })
          }
        }
        console.log(that.data.chooseBtn)
      }
    })
      // app.globalData.hidden2=this.data.switch1Checked;
    // console.log(app.globalData.hidden2,this.data.switch1Checked);
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
    // var userName = app.globalData.
    // if(this.data.userName!='' && this.data.idNo!=''){
    //   var pages = getCurrentPages();
    //   var currPages =pages[pages.length - 1];
    //   var prevPage = pages[pages.length - 3];
    //   prevPage.setData({
    //     chooseBtn:false

    // })
    // console.log(prevPage.data.chooseBtn)
    
  // }
    // console.log(this.data.chooseBtn)
    // this.setData({
    //   chooseBtn:this.data.chooseBtn
    // })
    // console.log(this.data.chooseBtn)
    
    // app.globalData.hidden2=this.data.hidden2;
    // console.log(app.globalData.hidden2)
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
  share: function () {
    console.log("1")
    wx.showShareMenu();
  },
  /**
   * 用户点击右上角分享
   */
  
  // 功能
  personal:function(){
    wx.navigateTo({
      url: '../showmessage/showmessage'
    })
  },

  indentification:function(){
    wx.navigateTo({
      url: '../indentification/indentification'
    })
  },
  
  mymoney: function () {
    wx.navigateTo({
      url: '../mymoney/mymoney'
    })
  },

  set:function(){
    wx.navigateTo({
      url:'../set/set'
    })
  },

  mymessage: function () {
    wx.navigateTo({
      url: '../mymessage/mymessage'
    })
  },

  setto: function () {
    wx.navigateTo({
      url: '../set/set'
    })
  },

  sign:function(){
    wx.navigateTo({
      url: '../sign/sign',
    })
  },

  service: function () {
    wx.navigateTo({
      url: '../service/service'
    })
  }

})