const app = getApp();
const timeutil = require('../../utils/util.js');
Page({
  data: {
    selfFlag:true,
    expressFlag:false,
    // goodsId:'',
    // goodsList:{},
    userAddress:{},
    goods: [],
    totalPrice: 0
  },

  onLoad(options) {
    // this.setData({
    //   goodsId:options.id
    // })
    this.setData({
      goods: JSON.parse(options.goods)
    })

    this.calcPrice()
  },

  onShow() {
    let pages = getCurrentPages();
    let address = pages[pages.length-1].data.address;
    if(address){
      this.setData({
        userAddress: JSON.parse(address)
      })
    }else{
      //调用云函数getUserFoodsByOpenid
      wx.cloud.callFunction({
        name:'getUserFoodsByOpenid'
      })
      .then(res => {
        let address = res.result.data[0].address
        let i = address.findIndex(item => item.default == true)

        this.setData({
          userAddress: address[i]
        })
        console.log("根据openid获取用户收货地址成功",res)
    
      })
      .catch(err => {
        console.log("根据openid获取用户收货地址失败",err)
      })
    }
  },

  calcPrice(){
    this.data.goods.forEach(i => {
      this.data.totalPrice += i.flower.price * i.num
    })

    this.setData({
      totalPrice: this.data.totalPrice
    })
  },

  //跳转到管理我的收货地址页面
  jumpToAddress(){
    wx.navigateTo({
      url: '../manageAddress/manageAddress?canClick=1',
    })
  },

  //上门自提
  getByself(){
    this.setData({
      selfFlag:true,
      expressFlag:false
    })
  },

// 订单提交
submit:function(){
  wx.showToast({
    title: "请稍等...",
    icon: 'loading',
    // duration: 4000
  });
  let that = this;
  var timestamp = Date.parse(new Date());
  console.log(timestamp)
  timestamp = timestamp / 1000;
  // var outTradeNo = timestamp+timestamp+timestamp+'abc';
  console.log("金额",that.data.totalPrice)
  wx.cloud.callFunction({
    name:'pay',
    data: {
      money:that.data.totalPrice,
      outTradeNo:timestamp+timestamp+timestamp+'abc'
    },
    success: res => {
      console.log(res)
      const payment = res.result.payment
  wx.requestPayment({
    ...payment,
    success(res) {
      console.log('pay success', res)
      console.log("支付页用户基本信息：" + app.globalData.openid);
  //  添加订单
      wx.cloud.callFunction({
        name:'OperateDatabase',
        data:{
          opr:'add',
          tablename:'t_order',
          data:{
            create_time: timeutil.formatTime(new Date()),
            update_time: timeutil.formatTime(new Date()),
            _openid:app.globalData.openid,
          //  specifyGender:'',
          orderType:that.data.orderType,
            userId:app.globalData.openid,
            end_position: that.data.EndPosition,
            // 订单分为等待接单，正在进行，已完成，三个状态
            orderStatus: '等待接单',
            start_position: that.data.position ,
            orderMoney:that.data.orderMoney
          }
        },
        // 订单添加成功后返回订单id,带着订单id然后添加账单,
        success :res =>{
          console.log("添加订单成功:",res)
          console.log("添加订单成功:",JSON.stringify(res) );
          that.setData({
            id:res.result._id
          })
      //添加订单成功后添加账单 添加账单,
        console.log(res)
        wx.cloud.callFunction({
          name:"OperateDatabase",
          data:{
            opr:'add',
            tablename:'t_pay_record',
            data:{
              _openid:app.globalData.openid,
              userId:app.globalData.openid,
              orderNo:that.data.id,
              orderMoney:that.data.totalPrice,
              orderTime:timeutil.formatTime(new Date()),
              orderType:'商品支付',
              // 判断为支出或者收入，true为支出，false为收入
              expense:true
            }
          }
        })
        }
      })
      console.log(that.data.id)    
      wx.showToast({
        title: "你最帅",
        icon: 'loading',
        duration: 4000
      });
      setTimeout(function(){
        wx.switchTab({
          url:'../order/order',
        })  
      },3000)
    },
    fail: console.error
  })
},
})
},

  //快递配送
  expressDistribution(){
    this.setData({
      selfFlag:false,
      expressFlag:true
    })
  }
})