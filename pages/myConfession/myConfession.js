const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    confessions:[],
    userId:'',
    userInfo:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {authorid} = options;
    wx.cloud.callFunction({
      name:"OperateDatabase",
      data:{
        opr:'query',
        tablename:"t_confession",
        data:{
          _openid:authorid
        }
      },
      complete:(res)=>{
        let confessions = res.result.data;
        let userId = options.authorid;
        // 处理当前用户是否喜爱当前表白
        confessions.map((item,index)=>{
          if(item.likerArr.indexOf(userId)!==-1){
            return item.likeClass = "icon-like";
          }
        })
        this.setData({
          confessions,
          userInfo:app.globalData.userInfo,
          userId,
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
    wx.showLoading({
      title: '加载中...',
    })
    setTimeout(function() {
      wx.hideLoading();
    },1000)
  },
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
 // 点赞事件
 handleLike(e){
  console.log(e);
  let {index} = e.currentTarget.dataset;
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
      this.setData({
        confessions
      })
      this.modify(index,confessions[index].likerArr);
    }else{ // 取消点赞
      console.log('cancel');
      confessions[index].likerArr.splice(isExist,1);
      confessions[index].likeClass = "icon-like1";
      this.setData({
        confessions
      })
      this.modify(index,confessions[index].likerArr);
    }
  }
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