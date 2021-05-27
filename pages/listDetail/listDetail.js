const db = wx.cloud.database()
const app = getApp();
import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify';

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
    steps: [{
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

  closeRulesPopup() {
    this.setData({
      rulesShow: false
    })
  },

  showRulesCard() {
    this.setData({
      rulesShow: true
    })
  },

  closeTaskPopup() {
    this.setData({
      taskShow: false
    })
  },

  takeTask() {
    const that = this;

    // 判断用户是否登录，若用户未登录，弹出授权页面
    // console.log(app.globalData.openid);

    db.collection('t_user_info').where({
      _openid: app.globalData.openid
    }).get().then(res => {
      // console.log(res.data);
      let userData = res.data[res.data.length - 1];
      if ( userData && "realNameAuthentificationStatus" in userData ) {
        // 用户已经实名认证，增加用户接单信息,
        db.collection('t_delivery_order').add({
          data: {
            task: that.data.task.task,
            taskStatusTake: "正在进行",
            taskStatus: "已接单",
            avatarUrl: that.data.task.avatarUrl,
            isNick: that.data.task.isNick,
            addTime: that.data.task.addTime
          }
        }).then(res => {
          // console.log(res)
          
          // 更改该订单状态，根据是否成功完成以上操作提示用户
          db.collection('t_take_delivery').doc(that.data.task._id).update({
            data: {
              taskStatus: "已接单"
            },
          }).then(res => {
            console.log(res);
            // 提示用户接单成功
            // Notify({ type: 'primary', message: '接单成功' });
            
            // 返回至主界面
            wx.navigateBack({
              delta: 1
            });
          }).catch(err => {
            console.log(err);
            // 提示用户接单失败
            // Notify({ type: 'primary', message: '接单失败' });
            
            // 返回至主界面
            wx.navigateBack({
              delta: 1
            });
          })
        }).catch(err => {
          console.log(err);

          // 提示用户接单失败
          // Notify({ type: 'primary', message: '接单失败' });
            
          // 返回至主界面
          wx.navigateBack({
            delta: 1
          });
        })
      } else {
        // 用户未实名认证，提示用户先实名认证，跳转实名认证界面
        this.setData({
          taskShow: true
        })
      }
    })
  },

  toReal() {
    // 跳转实名认证界面
    this.setData({
      taskShow: false
    });

    wx.navigateTo({
      url: '../authentificationDetail/authentificationDetail?realInfoShow='+true,
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let jsondata = JSON.parse(options.task);
    let nickPhone = jsondata.task.userPhone.replace(/^(\d{3})\d{4}/, "$1****");
    jsondata["nickPhone"] = nickPhone;

    let status;
    if (jsondata.taskStatus === "新任务") {
      status = 0;
    } else if (jsondata.taskStatus === "已接单") {
      status = 1;
    } else {
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
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {}
})