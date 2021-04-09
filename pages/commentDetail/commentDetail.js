// pages/commentDetail/commentDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLoading:true,
    comments:[{
      avaUrl:'123',
      name:'MahuaTeng',
      commentTime:'2021-2-11 12:30:01',
      content:'这只猫真不错啊！！！',
      likeCount:99999,
      commentCount:999999999
    },{
      avaUrl:'123',
      name:'MahuaTeng',
      commentTime:'2021-2-11 12:30:01',
      content:'这只猫真不错啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊！！！',
      likeCount:0,
      commentCount:5
    }],
    inputComment:"",
    totalComment:2
  },
  handleCommentInput(e){
    const {value} = e.detail;
    this.setData({
      inputComment:value
    })
  },
  // 发送评论函数
  handleSentComment(e){
    if(this.data.inputComment===''){
      wx.showToast({
        title: '请输入非空评论',
        icon:"error"
      })
    }else{
      console.log(e);
      const {comments} = this.data;
      let time = new Date();
      comments.unshift({
        avaUrl:'123',
        name:e.timeStamp,
        commentTime:time.toLocaleString(),
        content:this.data.inputComment
      })
      this.setData({
        comments,
        inputComment:''
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    setTimeout(()=>{
      this.setData({
        isLoading:false
      })
    },2000)
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