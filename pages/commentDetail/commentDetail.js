// pages/commentDetail/commentDetail.js
const app = getApp();
// const cloud = require('wx-server-sdk');
const db = wx.cloud.database();
const { formatTime } = require('../../utils/util.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isLoading: true, // 页面是否在加载
    comments: [], // 表白信息评论列表
    confessionDetail: {}, // 详细表白信息
    showComment: false, // 是否显示用户评论
    userInfo: null, // 当前用户的信息
    confessionId: "", // 但概念表白墙的id
    userId: "", // 当前用户id
    curComment: {}, // 弹出的用户评论
    curReplyList: [], // 弹出用户评论的评论
    inputComment: "", // 双向绑定输入框
    isFocus: false, // 控制是否聚焦输入框
    curPlaceHolder: "发表评论", // 输入框的placeholder
    authorInfo: {}, // 回复评论作者----信息
    repliedInfo: {} // 当前回复的reply
  },
  // 获取数据库的二级评论
  getCommentReply() {
    wx.cloud.callFunction({
      name: "OperateDatabase",
      data: {
        opr: "query",
        tablename: "t_comment_reply",
        data: {
          commentId: this.data.curComment._id
        }
      },
      success: (res) => {
        let data = res.result.data;
        new Promise((resolve, reject) => {
          data.map((item, index) => {
            let isLike = item.likerArr.indexOf(this.data.userId);
            if (isLike === -1) { // 没点赞
              return item.likeClass = "icon-tubiaozhizuomoban-1";
            } else {
              return item.likeClass = "icon-tubiaozhizuomoban-";
            }
          });
          resolve();
        }).then((res) => {
          this.setData({
            curReplyList: data,
            curPlaceHolder: "回复:" + this.data.curComment.reviewerInfo.nickName,
            authorInfo: this.data.curComment.reviewerInfo, // 当前评论的作者信息
            inputComment: ''
          })
        })
      }
    })
  },
  // 展示用户评论详情
  showCommentlist(e) {
    const { index } = e.currentTarget.dataset;
    let curComment = this.data.comments[index];
    curComment.index = index;
    this.setData({
      showComment: true,
      curComment
    })
    // 获取二级评论
    this.getCommentReply();
  },
  // 评论表白墙
  commentConfession() {
    let comments = this.data.comments;
    let { confessionDetail } = this.data;
    confessionDetail.commentCount += 1;
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
    // t_confession_comment表  新增一条评论
    wx.cloud.callFunction({
      name: "OperateDatabase",
      data: {
        opr: "add",
        tablename: "t_confession_comment",
        data: {
          ...confessionComment
        }
      },
      success: () => {
        // 更新confession   
        this.updateDataBase({ tablename: 't_confession', keyword: confessionDetail._id }, { commentCount: confessionDetail.commentCount }, this.updateCommentList())
      }
    })
  },
  // 更新数据库的信息
  updateDataBase(target, newData, callback) {
    db.collection(target.tablename).doc(target.keyword).update({
      data: {
        ...newData
      },
      success: (err) => {
        callback();
      }
    })
  },
  // 评论用户
  replyComment(e) {
    let date = new Date;
    let reply = {
      commentId: this.data.curComment._id,
      createTime: formatTime(date),
      repliedInfo: this.data.repliedInfo,
      replierInfo: { ...this.data.userInfo, userId: this.data.userId },
      authorInfo: this.data.authorInfo,
      content: this.data.inputComment,
      likerArr:[],
      confesisonId: this.data.curComment.confessionId
      // _openid:this.data.userId
    }
    // 添加回复信息
    wx.cloud.callFunction({
      name: "OperateDatabase",
      data: {
        opr: "add",
        tablename: "t_comment_reply",
        data: {
          ...reply
        }
      },
      success: (res) => {
        this.setData({
          curComment: { ...this.data.curComment, commentCount: this.data.curComment.commentCount + 1 },
        },
          () => {
            console.log("更新后的评论数：",this.data.curComment);
            // 更新cuComment的commentCount
            this.updateDataBase({ tablename: 't_confession_comment', keyword: this.data.curComment._id }, { commentCount: this.data.curComment.commentCount }, this.getCommentReply())
          })
      }
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
    wx.showLoading({
      title: '发送中',
    })
    // 输入框为空
    if (this.data.inputComment === '') {
      wx.showToast({
        title: '请输入非空评论',
        icon: "error"
      })
    }
    // 没有登录
    else if (JSON.stringify(this.data.userInfo) == "{}" || JSON.stringify(this.data.userInfo) === "null") {
      const that = this;
      wx.showModal({
        title: '请登录后再进行评论',
        confirmText: "确定",
      })
    } else if (!this.data.showComment) { // 评论表白信息
      this.commentConfession();
    } else { // 评论用户评论
      this.replyComment();
    }
    setTimeout(function () {
      wx.hideLoading()
    }, 500)
  },
  // 删除评论
  handleDelCom(e) {
    const db = wx.cloud.database();
    let { index } = e.currentTarget.dataset;
    let { confessionDetail } = this.data;
    wx.showModal({
      title: "是否删除当前评论",
      success: (res) => {
        if (res.confirm) {
          // 评论数减一
          db.collection('t_confession').doc(confessionDetail._id).update({
            data: {
              commentCount: confessionDetail.commentCount - 1
            }
          })
          // 删除子评论
          wx.cloud.callFunction({
            name: "OperateDatabase",
            data: {
              opr: "del",
              tablename: "t_comment_reply",
              data: { commentId: this.data.comments[index]._id }
            },
            success: (res) => {
              console.log('子评论删除：', res);
            }
          })
          // 删除数据库的评论
          db.collection('t_confession_comment').doc(`${e.currentTarget.dataset.id}`).remove({
            success: () => {
              wx.showToast({
                title: '删除成功',
              })
            },
            failed: () => {
              wx.showToast({
                title: '删除失败',
              })
            },
            complete: () => {
              this.updateCommentList();
            }
          })
        }
      }
    })
  },
  // 初始化表白评论界面
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
        let data = res.result.data;
        new Promise((resolve, reject) => {
          data.map((item, index) => {
            let isLike = item.likerArr.indexOf(this.data.userId);
            if (isLike === -1) { // 没点赞
              return item.likeClass = "icon-tubiaozhizuomoban-1";
            } else {
              return item.likeClass = "icon-tubiaozhizuomoban-";
            }
          });
          resolve();
        }).then((res) => {
          this.setData({
            comments: data,
            inputComment: '',
            curReplyList: [],
            repliedInfo:{},
            showComment: false,
            curPlaceHolder: "发表评论"
          })
        })
      }
    })
  },
  // 图片预览
  handlePreviewImg(e) {
    const { index } = e.currentTarget.dataset
    wx.previewImage({
      current: this.data.confessionDetail.pictures[index],
      urls: this.data.confessionDetail.pictures,
    })
  },
  // 防止滚动穿透
  catchtouchmove(e) {

  },
  // 回复评论按钮
  handleReplyBtn(e) {
    console.log(e);
    const { current } = e.currentTarget.dataset;
    this.setData({
      isFocus: true,
      repliedInfo: current,
      curPlaceHolder: "回复:" + current.replierInfo.nickName
    })
  },
  // 输入框失去焦点
  handleBlur(e) {
    this.setData({
      curPlaceHolder: "发表评论"
    })
  },
  // 点赞处理
  handleLike(e) {
    console.log(e);
    if (this.data.userId==null) {
      wx.showToast({
        icon:"error",
        title: '登录后可以点赞',
      })
    } else {
      const { index } = e.currentTarget.dataset;
      // 点赞回复
      if (!this.data.showComment) {
        let { comments } = this.data;
        console.log(comments[index].likerArr);
        let isLike = comments[index].likerArr.indexOf(this.data.userId);
        if(isLike===-1){ //  没点赞
          comments[index].likerArr.push(this.data.userId);
          comments[index].likeClass = "icon-tubiaozhizuomoban-";
        }else{
          comments[index].likerArr.splice(isLike,1);
          comments[index].likeClass = "icon-tubiaozhizuomoban-1";
        }
        this.setData({
          comments
        })
        db.collection("t_confession_comment").doc(comments[index]._id).update({
          data: {
            likerArr:comments[index].likerArr
          },
          success: (err) => {
            console.log("点赞成功！");
          }
        })
      } else { // 点赞表白墙评论
        let { curReplyList } = this.data;
        let isLike = curReplyList[index].likerArr.indexOf(this.data.userId);
        if(isLike===-1){ //  没点赞
          curReplyList[index].likerArr.push(this.data.userId);
          curReplyList[index].likeClass = "icon-tubiaozhizuomoban-";
        }else{
          curReplyList[index].likerArr.splice(isLike,1);
          curReplyList[index].likeClass = "icon-tubiaozhizuomoban-1";
        }
        this.setData({
          curReplyList
        });
        db.collection("t_comment_reply").doc(curReplyList[index]._id).update({
          data: {
            likerArr:curReplyList[index].likerArr
          },
          success: (err) => {
            console.log(err);
            console.log("点赞成功！");
          }
        })
      }
    }
  },
  // 点赞楼主
  handleLouzhu(e){
    if (this.data.userId==null) {
      wx.showToast({
        icon:"error",
        title: '登录后可以点赞',
      })
    }else{
      console.log(this.data.curComment);
      let {curComment,comments} = this.data;
      let {index} = curComment;
      let isLike = curComment.likerArr.indexOf(this.data.userId);
      if(isLike===-1){ // 没有点赞
        curComment.likerArr.push(this.data.userId);
        curComment.likeClass = "icon-tubiaozhizuomoban-";
        comments[index].likerArr.push(this.data.userId)
        comments[index].likeClass = "icon-tubiaozhizuomoban-";
      }else{
        curComment.likerArr.splice(isLike,1);
        curComment.likeClass = "icon-tubiaozhizuomoban-1";
        comments[index].likerArr.splice(isLike,1);
        comments[index].likeClass = "icon-tubiaozhizuomoban-1";
      }
      db.collection("t_confession_comment").doc(comments[index]._id).update({
        data: {
          likerArr:comments[index].likerArr
        },
        success: (err) => {
          console.log("点赞成功！");
        }
      })
      this.setData({
        curComment,
        comments
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { confessionId } = options;
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
        // 处理点赞样式
        res.result.data.map((item, index) => {
          let isLike = item.likerArr.indexOf(this.data.userId);
          if (isLike === -1) { // 没点赞
            return item.likeClass = "icon-tubiaozhizuomoban-1";
          } else {
            return item.likeClass = "icon-tubiaozhizuomoban-";
          }
        })
        this.setData({
          comments: res.result.data,
          userInfo,
          confessionId,
        })
      }
    })
    // 查找表白信息
    wx.cloud.callFunction({
      name: "OperateDatabase",
      data: {
        opr: "query",
        tablename: "t_confession",
        data: {
          _id: options.confessionId
        }
      },
      success: (res) => {
        this.setData({
          confessionDetail: res.result.data[0],
          userId: app.globalData.openid,
          isLoading: false,
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
    console.log("触底");
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
