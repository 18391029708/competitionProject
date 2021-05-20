const util = require("../../utils/util.js")

Page({
  data: {
    //发布类型
    lostOrFounds:[
      {name:"失物",value:"失物",checked: 'true'},
      {name:"招领", value:"招领"}
    ],
    lostOrFound:'失物',
    //物品类型
    types:['校园卡','手机','身份证','银行卡','钥匙','照相机','书籍','其他'],
    type:'',
    //物品名称
    goodsName:"",
    //事发时间
    goodsTime: util.formatTime(new Date()),
    //事发地点
    goodsLocation:"",
    //联系方式
    contactWay:"",
    //物品描述
    goodsDescription:""
  },

  //处理发布类型：看选中的是失物还是招领
  radioChange(e){
    let items = this.data.lostOrFounds
    for(let i=0;i<items.length;i++){
      items[i].checked = items[i].value === e.detail.value
    }

    this.setData({
      lostOrFound:e.detail.value
    })
  },

  //获取物品类型
  getDate(e){
    this.setData({
      type:e.detail
    })
  },

  //处理事发时间
  handleChange(e) {
    this.setData({
      goodsTime: e.detail.dateString
    })
  },

  //发布按钮
  formSubmit(e) {     
    let formdata = e.detail.value;
    
      this.setData({
        goodsName:formdata.goodsName,
        goodsTime:formdata.goodsTime,
        goodsLocation:formdata.goodsLocation,
        contactWay:formdata.contactWay,
        goodsDescription:formdata.goodsDescription
      })
 
      let getdata = this.data;
      
      //调用云函数addLostFound,将该表单中的内容保存到数据库中
      wx.cloud.callFunction({
        name:'addLostFound',
        data:{
          lostOrFound:getdata.lostOrFound,
          type:getdata.type,
          goodsName:getdata.goodsName,
          goodsTime:getdata.goodsTime,
          goodsLocation:getdata.goodsLocation,
          contactWay:getdata.contactWay,
          goodsDescription:getdata.goodsDescription,
        }
      })
      .then(res => {
        console.log('保存成功',res)
        wx.showToast({
            title: '发布成功',
        })
      })
      .catch(err => {
        console.log('保存失败',err)
      })

  },

})