// pages/commentDetail/commentDetail.js
const app = getApp();
const db = wx.cloud.database();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isLoading: true,
    comments: [],
    confessionDetail: {},
    inputComment: "",
    showComment: false,
    userInfo: null,
    confessionId: "",
    userId:""
  },
  // 展示用户评论详情
  showCommentlist() {
    this.setData({
      showComment: true
    })
  },
  // 关闭用户评论详情
  closeCommentList() {
    this.setData({
      showComment: false
    })
  },
  // 输入评论
  handleCommentInput(e) {
    const { value } = e.detail;
    this.setData({
      inputComment: value
    })
  },
  // 发送评论函数
  handleSentComment(e) {
    // 输入框为空
    if (this.data.inputComment === '') {
      wx.showToast({
        title: '请输入非空评论',
        icon: "error"
      })
    } 
    // 没有登录
    else if (JSON.stringify(this.data.userInfo) == "{}"||JSON.stringify(this.data.userInfo) === "null") {
      const that = this;
      wx.showModal({
        title: '请登录后再进行评论',
        confirmText: "确定",
      })
    } else {
      let comments = this.data.comments;
      let { confessionDetail } = this.data;
      confessionDetail.commentCount+=1;
      // 表白信息的评论
      let confessionComment = {
        _openid: this.data.userId,
        commentCount: 0,
        likerArr: [],
        confessionId: this.data.confessionId,
        reviewContent: this.data.inputComment,
        reviewTime: new Date().toLocaleString(),
        reviewerInfo: app.globalData.userInfo,
      }
      comments.unshift(confessionComment); // 前插--让最新的评论显示在最前面， 也表示当前评论数 加1
      // this.setData({
      //   comments,
      //   confessionDetail,
      //   inputComment: '',
      // })
      // t_confession_comment表  新增一条评论
      wx.cloud.callFunction({
        name: "OperateDatabase",
        data: {
          opr: "add",
          tablename: "t_confession_comment",
          data: {
            ...confessionComment
          }
        }
      })
      // 更新confession   
      db.collection('t_confession').doc(confessionDetail._id).update({
        data:{
          commentCount:confessionDetail.commentCount
        },
        success:()=>{
          console.log("commentCount更改成功");
          this.updateCommentList();
        },
        complete:(res)=>{
          console.log(res,{...confessionDetail});
        }
      })
    }
  },
  // 删除评论
  handleDelCom(e){
    const db = wx.cloud.database();
    let { confessionDetail } = this.data;
    wx.showModal({
      title:"是否删除当前评论",
      success:()=>{
        db.collection('t_confession_comment').doc(`${e.currentTarget.dataset.id}`).remove({
          success:()=>{
            // 评论数减一
            db.collection('t_confession').doc(confessionDetail._id).update({
              data:{
                commentCount:confessionDetail.commentCount-1
              },
              success:()=>{
                wx.showToast({
              title: '删除成功',
               })
               this.updateCommentList();
              },
              failed:()=>{
                wx.showToast({
                  title: '删除失败',
                })
              }
            })
          },
        })
      }
    })
  },
  // 初始化界面
  updateCommentList() {
    // 根据confessionId查询当前的评论
    wx.cloud.callFunction({
      name: "OperateDatabase",
      data: {
        opr: "query",
        tablename: "t_confession_comment",
        data: {
          confessionId: this.data.confessionId
        }
      },
      success: (res) => {
        this.setData({
          comments: res.result.data,
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {confessionId} = options;
    // 根据confessionId查询当前的评论
    wx.cloud.callFunction({
      name: "OperateDatabase",
      data: {
        opr: "query",
        tablename: "t_confession_comment",
        data: {
          confessionId: options.confessionId
        }
      },
      success: (res) => {
        const { userInfo } = app.globalData;
        this.setData({
          comments: res.result.data,
          userInfo,
          confessionId,
        })
      }
    })
    // 查找表白信息
    wx.cloud.callFunction({
      name:"OperateDatabase",
      data:{
        opr:"query",
        tablename:"t_confession",
        data:{
          _id:options.confessionId
        }
      },
      success:(res)=>{
        this.setData({
          confessionDetail:res.result.data[0],
          userId:app.globalData.openid,
          isLoading: false,
        })
      }
    })
  },
  // 图片预览
  handlePreviewImg(e){
    const {index} = e.currentTarget.dataset
    wx.previewImage({
      current:this.data.confessionDetail.pictures[index],
      urls: this.data.confessionDetail.pictures,
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
    console.log("触底");
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
