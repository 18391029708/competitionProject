// pages/authentificationDetail/authentificationDetail.js
const app = getApp();
wx.cloud.init({
  env: 'data-base-1g3n115z3df553d0'
});
const db = wx.cloud.database('data-base-1g3n115z3df553d0')
// const _ = db.command;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    studentInfoShow:false,
    realInfoShow:false,
    vehicleInfoShow:false,
    studentAuthentificationStatus:'',
    carAuthentificationStatus:'',
    realNameAuthentificationStatus:false,
    id:'',
    school:'',
    number:'',
    name:'',
    sex:'',
    carType:'',
    color:'',
    carAge:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("信息认证详情页用户信息openid :" + app.globalData.openid)
    console.log("认证细节页面信息：" + JSON.stringify(options) );
    this.setData({
      studentInfoShow:options.studentInfoShow,
      realInfoShow:options.realInfoShow,
      vehicleInfoShow:options.vehicleInfoShow
    })
    wx.cloud.callFunction({
      name:"OperateDatabase",
      data:{
        opr:'query',
        tablename:'t_user_info',
        data:{
          userId:app.globalData.openid
        }
      }
    })
    .then(res => {
      console.log("3333000",res)
      this.setData({
        studentAuthentificationStatus:res.result.data[0].studentAuthentificationStatus,
        carAuthentificationStatus:res.result.data[0].carAuthentificationStatus,
      })
    })

  },
  formSubmit(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
    console.log("openid:" + app.globalData.openid)
    this.setData({
      school:e.detail.value.school,
      number:e.detail.value.number,
      name:e.detail.value.name,
      sex:e.detail.value.sex,
    })
    // 查询userid用户的表是否存在，存在则插入实名认证信息
    wx.cloud.callFunction({
      name:"OperateDatabase",
      data:{
        opr:'query',
        tablename:'t_user_info',
        data:{
          userId:app.globalData.openid
        }
      }
    })
    .then(res => {
      console.log("0000",res)
      this.setData({
        id:res.result.data[0]._id
      })
      //  db.collection('common_userInfo_list').where({userId:app.globalData.openid}).update({
      //       data: {
      //       school:this.data.school,
      //       name:this.data.name
      //       },
      //       success: function(res) {
      //         console.log(res)
      //     }
      //   })
      // console.log("用户输入：",id)
   this.updataStudent();
    })
    .then(res =>{//返回上一页
        // 信息认证成功后返回上一个页面，并传参
        let pages = getCurrentPages(); //获取所有页面
        let currentPage = null;  //当前页面
        let prevPage = null;  //上一个页面
        if(pages.length >= 2){
          currentPage = pages[pages.length - 1]; //获取当前页面，并将其赋值
          prevPage = pages[pages.length - 2]; //获取上一个页面，并将其赋值
        }
        if(prevPage){
          console.log("返回页传值")
          prevPage.setData({
            authentificationStatus:true
          })
        }
        console.log("执行跳转")
        wx.navigateBack({
          delta: 1  //1为返回的页面数
        })
       console.log("数据库添加数据成功")
    })
  },
  carformSubmit(e){
    console.log('form发生了carsubmit事件，携带数据为：', e.detail.value);
    console.log("openid:" + app.globalData.openid)
    this.setData({
      carType:e.detail.value.carType,
      color:e.detail.value.color,
      carAge:e.detail.value.carAge,
    })
    // 查询userid用户的表是否存在，存在则插入实名认证信息
    wx.cloud.callFunction({
      name:"OperateDatabase",
      data:{
        opr:'query',
        tablename:'t_user_info',
        data:{
          _openid:app.globalData.openid,

        }
      }
    })
    .then(res => {
      console.log("0000",res)
      this.setData({
        id:res.result.data[0]._id
      })
   this.updataCarInfo();
    })
    .then(res =>{//返回上一页
        // 信息认证成功后返回上一个页面，并传参
        let pages = getCurrentPages(); //获取所有页面
        let currentPage = null;  //当前页面
        let prevPage = null;  //上一个页面
        if(pages.length >= 2){
          currentPage = pages[pages.length - 1]; //获取当前页面，并将其赋值
          prevPage = pages[pages.length - 2]; //获取上一个页面，并将其赋值
        }
        if(prevPage){
          console.log("返回页传值")
          prevPage.setData({
            authentificationStatus:true
          })
        }
        console.log("执行跳转")
        wx.navigateBack({
          delta: 1  //1为返回的页面数
        })
       console.log("数据库添加数据成功")
    })
  },
  updataStudent(){
    console.log(this.data.id)
    db.collection('t_user_info').doc(this.data.id).update({
      data:{
        'userInfo.school':this.data.school,
        'userInfo.No':this.data.number,
       'userInfo.name':this.data.name,
       'userInfo.sex':this.data.sex,
       studentAuthentificationStatus:true
      }
    })
    .then( res =>{
      console.log(res)
    })
  },
  updataCarInfo(){
    console.log(this.data.id)
    db.collection('t_user_info').doc(this.data.id).update({
      data:{
        'carInfo.carAge':this.data.carAge,
        'carInfo.carType':this.data.carType,
       'carInfo.color':this.data.color,
       carAuthentificationStatus:true
      }
    })
    .then( res =>{
      console.log(res)
    })
  },
  // 身份证识别
  idcardsuccess: function (e) {
    console.log(e)
    this.setData({
      name:e.detail.name.text,
      id:e.detail.id.text,
      gender:e.detail.gender.text,
      addr:e.detail.address.text,
      // valid_date:e.detail.valid_date.text
    })
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
       this.setData({
         realName:e.detail.name.text,
         idNum:e.detail.id.text
       })
        console.log("返回查询订单数据：" + res.result)
        console.log(JSON.stringify(res.result.data[0]._id))
        let id = res.result.data[0]._id;
        console.log("查询结束")
        // db.collection('')
        console.log("数据id：", id)
        db.collection('t_user_info').doc(id).update({
          data:{
           'userInfo.realName':e.detail.name.text,
           'userInfo.idNum':e.detail.id.text,
           realNameAuthentificationStatus:true

          },
          success:res=>{
            console.log("数据库添加数据成功")
          }
        })
      }
    })

    
// 数据存储数据库

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