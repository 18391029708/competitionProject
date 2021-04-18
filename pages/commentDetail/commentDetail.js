// pages/commentDetail/commentDetail.js
const app = getApp();
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
    else if (JSON.stringify(this.data.userInfo) == "{}") {
      const that = this;
      wx.showModal({
        title: '请登录',
        confirmText: "立即登录",
        success(res) {
          if (res.confirm) {
            wx.getUserProfile({
              desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
              success: (resu) => {
                app.globalData.userInfo = resu.userInfo;
                that.setData({
                  userInfo: resu.userInfo
                })
                wx.showToast({
                  title: '登录成功',
                })
              }
            })
          }
        }
      })
    } else {
      let comments = this.data.confessionDetail.comments;
      const { confessionDetail } = this.data;
      let confessionComment = {
        _openid: this.data.userId,
        commentorArr: [],
        likerArr: [],
        confessionId: this.data.confessionId,
        reviewContent: this.data.inputComment,
        reviewTime: new Date().toLocaleString(),
        reviewerInfo: app.globalData.userInfo,
      }
      let commentCount = confessionDetail.commentCount += 1;
      comments.unshift(confessionComment); // 前插--让最新的评论显示在最前面
      confessionDetail.commentCount = commentCount; // 表白信息评论数量
      this.setData({
        comments,
        confessionDetail,
        inputComment: '',
      })
      // 更改当前表白评论数
      const db = wx.cloud.database();
      db.collection("t_confession").doc(this.data.confessionId).update({
        data:{
          commentCount:comments.length
        }
      })

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
    }
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
        console.log(res);
        const { userInfo } = app.globalData;
        this.setData({
          comments: res.result.data,
          userInfo,
          confessionId,
          isLoading: false,
          userId:app.globalData.openid
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
          confessionDetail:res.result.data[0]
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