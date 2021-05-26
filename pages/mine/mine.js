// pages/personal/personal.js
const db = wx.cloud.database()
var app = getApp();
Page({
  data: {
    listItemContent:[{title:"我的账单",src:"../../icons/moneyBall.png",img:"../../icons/enter (2).png"},{title:"发布历史",src:"../../icons/psw.png",img:"../../icons/enter (2).png"},{title:"基本信息",src:"../../icons/baseInfo.png",img:"../../icons/enter (2).png"},{title:"我的商城",src:"../../icons/market/myMarket.png",img:"../../icons/enter (2).png"}],
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
  // 身份切换
  switchValue(){
    this.setData({
      switch1Checked:!this.data.switch1Checked,
    })
    app.globalData.selectStatus = this.data.switch1Checked

  },
  click(e){
    console.log("点击认证索引："+ JSON.stringify(e))
     if(e.currentTarget.id == 0){//进入我的钱包页
      wx.navigateTo({
        url: '../wallet/wallet',
      })
      console.log("我是1")
    }else if(e.currentTarget.id == 1 ){//进入发布历史
      wx.navigateTo({
        url: '../pubilishHistory/pubilishHistory',
      })
      console.log("我是1")
    } else if(e.currentTarget.id== 2){
      wx.navigateTo({
        url: '../baseInfo/baseInfo',
      })
      console.log("我是w")
    } else if(e.currentTarget.id == 3){ //进入我的商城
      wx.navigateTo({
        url: '../myMarket/myMarket',
      })
      
    }
  },
  studentAuthentication(){
    wx.navigateTo({
      url: '../authentificationDetail/authentificationDetail?studentInfoShow='+true,
    })

  },
  realNameAutentication(){
    wx.navigateTo({
      url: '../authentificationDetail/authentificationDetail?realInfoShow='+true,
    })
  },
  driverAuthentication(){
    wx.navigateTo({
      url: '../authentificationDetail/authentificationDetail?vehicleInfoShow='+true,   
    })
  },
  click0(){
    console.log("这是打印的0值")
  },
  click1(){
    console.log("这是打印的1值")
  },

  /**
   * 生命周期函数--监听页面加载
   */
  // 当前状态选择为上线或者下线
  selectStatus:function(event){
    console.log(event)
    app.globalData.selectStatus = event.detail.value;
    console.log(app.globalData.selectStatus,this.data.switch1Checked);
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