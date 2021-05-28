// pages/personal/personal.js
const db = wx.cloud.database()
var app = getApp();

Page({
  data: {
    listRouter:[
      {
        name:"我的订单",
        path:"../order/order",
        imageSrc:"../../icons/order.png"
      },
      {
        name:"发布历史",
        path:"../pubilishHistory/pubilishHistory",
        imageSrc:"../../icons/history-push.png"
      },
      {
        name:"购物信息",
        path:"../myMarket/myMarket",
        imageSrc:"../../icons/order.png"
      },
      {
        name:"关于顺哒",
        path:"../about/about",
        imageSrc:"../../icons/about.png"
      }
    ],
    userInfo: Object,
    isDriver: false,

    chooseBtn:true,
    hidden2:app.globalData.globalData,
  
    // uname:'',
    // usex:'',
    // utx:'',
    // utype:0,
    // uphone:''
  },

  // 切换用户身份
  switchValue(){
    // 判断用户是否通过司机认证

    // 如果已经认证，进行身份切换
    this.setData({
      isDriver:!this.data.isDriver,
    })
    app.globalData.selectStatus = this.data.isDriver
  },

  // 跳转钱包提现页面
  toBalance(){
    wx.navigateTo({
      url: '../balance/balance',
    })
  },

  // 跳转信息详情页面
  toBaseInfo(){
    wx.navigateTo({
      url: '../baseInfo/baseInfo',
    })
  },

  // 跳转我的订单页面
  toBill(){
    wx.navigateTo({
      url: '../wallet/wallet',
    })
  },

  // 跳转学生认证
  studentAuthentication(){
    wx.navigateTo({
      url: '../authentificationDetail/authentificationDetail?studentInfoShow='+true,
    })
  },
  // 跳转实名认证
  realNameAutentication(){
    wx.navigateTo({
      url: '../authentificationDetail/authentificationDetail?realInfoShow='+true,
    })
  },
  // 跳转司机认证
  driverAuthentication(){
    wx.navigateTo({
      url: '../authentificationDetail/authentificationDetail?vehicleInfoShow='+true,   
    })
  },
  
  toNextPage(e){
    const that = this;
    
    // console.log(e);
    wx.navigateTo({
      url: that.data.listRouter[e.currentTarget.id].path,
    })
  },

  // // 当前状态选择为上线或者下线
  // selectStatus:function(event){
  //   app.globalData.selectStatus = event.detail.value;
  // },

    /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    // 从全局数据获取用户基本信息
    this.setData({userInfo:app.globalData.userInfo}) ;
    // 获取用户车辆认证信息为真则显示按钮
    db.collection('common_userInfo_list').where({_openid:app.globalData.openid,'vehicleInformation.have' :'true'}).get({
      success: function(res) {

        for(var i = 0; i < res.data.length; i++){
          if(res.data[i].realName!=undefined && res.data[i].idCardNo!=undefined ){
            that.setData({
              chooseBtn:false
            })
          }
        }
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
})