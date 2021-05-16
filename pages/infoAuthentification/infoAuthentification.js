// pages/infoAuthentification/infoAuthentification.js
const app = getApp();
wx.cloud.init({
  env: 'data-base-1g3n115z3df553d0'
});
const db = wx.cloud.database('data-base-1g3n115z3df553d0')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    authentificationStatus:'',
    cardType:[{title:"学生认证",tip:"未完善"},{title:"实名认证",tip:"未完善"},{title:"车手认证",tip:"未完善"}]

  },
  authentification(e){
    // 跳转到认证细节页面，根据传值进行渲染页面显示
    // 展示学生认证信息
    if(e.currentTarget.id == 0){
      wx.navigateTo({
        // 跳转传参方式
        url: '../authentificationDetail/authentificationDetail?studentInfoShow='+true,
      })
    }else  if(e.currentTarget.id == 1){
      wx.navigateTo({
        url: '../authentificationDetail/authentificationDetail?realInfoShow='+true,
      })
      // 展示车手认证信息
    }else  if(e.currentTarget.id == 2){
      wx.navigateTo({
        url: '../authentificationDetail/authentificationDetail?vehicleInfoShow='+true,   
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log("加载信息认证页")
    // wx.cloud.callFunction({
    //   name:'OperateDatabase',
    //   data:{
    //     opr:'query',
    //     tablename:'t_user_info',
    //     data:{
    //       userId:app.globalData.openid,
    //       studentAuthentificationStatus:true
    //     }
    //   }
    // }).then(res =>{
    //   console.log("信息认证状态；" + res)
    //   const key = 0;
    //   const state = "cardType[" + key +"].tip"
    //   this.setData({
    //     [state]:"已实名"
    //   })
    // })
    wx.cloud.callFunction({
      name:'OperateDatabase',
      data:{
        opr:'query',
        tablename:'t_user_info',
        data:{
            userId:app.globalData.openid
        }
      },
      success:res =>{
        console.log(res)
        console.log("返回查询订单数据：" + res.result)
        console.log(JSON.stringify(res.result.data[0]._id))
        let id = res.result.data[0]._id;
        console.log("查询结束")
        // db.collection('')
        console.log("数据id：", id)
        db.collection('t_user_info').doc(id).get().then(res =>{
          console.log("身份证实名信息：" + JSON.stringify(res) )
          // 获取用户信息后判断用户实名结果
          if(studentAuthentificationStatus){
            const key = 0;
            const state = "cardType[" + key +"].tip"
            this.setData({
              [state]:"已实名"
            })
          }else if(userAuthentificationStatus){
            const key = 1;
            const state2 = "cardType[" + key +"].tip"
            this.setData({
              [state2]:"已实名"
            })
          }
     
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
    
    if(this.data.authentificationStatus){
      const key = 0;
      const state = "cardType[" + key +"].tip"
      this.setData({
        [state]:"已实名"
      })
    }
    console.log("我是tip值："+ this.data.cardType[0].tip)

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