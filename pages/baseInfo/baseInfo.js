const app = getApp();
const db = wx.cloud.database('data-base-1g3n115z3df553d0')
Page({
  data: {
    show:true,
    nickName:'',
    school:'',
    schoolNo:'',
    realName:'',
    phoneNum:'',
    carNum:''
  },

  onLoad: function (options) {
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
        nickName:res.result.data[0].userInfo.nickName,
        school:res.result.data[0].userInfo.school,
        schoolNo:res.result.data[0].userInfo.No,
        realName:res.result.data[0].userInfo.name,
        phoneNum:res.result.data[0].userInfo.phoneNum,
        carNum:res.result.data[0].userInfo.carNum

    
      })
    })

  },
  change(){
    this.setData({
      show:!this.data.show
    })

  },
  formSubmit(e){
    console.log(e);
    console.log(JSON.stringify(e));

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
    .then(res =>{
      let id = res.result.data[0]._id
      db.collection('t_user_info').doc(id).update({
        data:{
          'userInfo.school':e.detail.value.school,
          'userInfo.nickName':e.detail.value.nickName,
          'userInfo.name':e.detail.value.realName,
          'userInfo.No':e.detail.value.studentNumber,
          'userInfo.phoneNum':e.detail.value.phoneNum,
          'userInfo.carId':e.detail.value.carid
        }
      })
      .then(res =>{
        wx.showToast({
          title: '修改信息成功',
          duration:3000
        })
        wx.navigateBack({
          delta: 1,
        })
    
        console.log("用户基本信息修改成功")
      })
    })
  },

})