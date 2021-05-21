// pages/confession.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading:true,
    isLike: false,
    confessions:[],
    userInfo:{},
    userId:"",
    bottomRefresh:false,
    totalConfess:4,
    curConfessCount:0,
    showBackTop:false
  },
  // 发送评论或者点赞信息
  // 修改点赞列表
  modify(index,data){
    const db = wx.cloud.database();
    db.collection('t_confession').doc(this.data.confessions[index]._id).update({
      data:{
        likerArr:data
      },
      succcess:function(res){
        console.log("修改点赞成功：",res);
      }
    })
  },
  // 图片预览
  previewImg(e){
    // preindex是confession对应confessions的下标
    // index是图片对应confessions[preindex].pictures[index]
    const {index,preindex} = e.currentTarget.dataset;
    wx.previewImage({
      current:this.data.confessions[preindex].pictures[index],
      urls: this.data.confessions[preindex].pictures
    })
  },
  // 点赞事件
  handleLike(e){
    console.log(e);
    let {index} = e.currentTarget.dataset;
    // 没未登录
    if(JSON.stringify(this.data.userInfo) == "{}"||JSON.stringify(this.data.userInfo) === "null"){
      wx.showToast({
        icon:"error",
        title: '登录后可点赞',
      })
    }else{
      let isExist = this.data.confessions[index].likerArr.indexOf(this.data.userId);
      const {confessions} = this.data;
      console.log(isExist,confessions);
      if(isExist===-1){ // 还未点赞
        confessions[index].likerArr.push(this.data.userId);
        confessions[index].likeClass="icon-like"; // 红心
      }else{ // 取消点赞
        console.log('cancel');
        confessions[index].likerArr.splice(isExist,1);
        confessions[index].likeClass = "icon-like1";
      }
      this.setData({
        confessions:confessions.reverse()
      })
      this.modify(index,confessions[index].likerArr);
    }
  },
  // 跳转
  handleNavigate(e){
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
    })
  },
  // 更新表白墙列表 
  uploadConfession(){
    wx.cloud.callFunction({
      name:"OperateDatabase",
      data:{
        opr:'query',
        tablename:"t_confession",
        data:{}
      },
      complete:(res)=>{
        let confessions = res.result.data;
        let userId = app.globalData.openid;
        // 根据openId来确定 点赞列表 是否含有该用户
        // 处理当前用户是否喜爱当前表白
        confessions.map((item,index)=>{
          if(item.likerArr.indexOf(userId)!==-1){
            return item.likeClass = "icon-like";
          }
        })
        this.setData({
          confessions:confessions.reverse(),
          loading:false,
          userInfo:app.globalData.userInfo,
          userId,
          curConfessCount:confessions.length
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  // 返回顶部
  handleBackTop(){
    wx.pageScrollTo({
      scrollTop:0,
      duration: 300
    })
  },
  // 显示返回顶部按钮
  onPageScroll(e){
    if(e.scrollTop>250){
      this.setData({
        showBackTop:true
      })
    }else{
      this.setData({
        showBackTop:false
      })
    }
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
    this.uploadConfession();
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
    console.log("chudi");
    this.setData({
      bottomRefresh:true
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})