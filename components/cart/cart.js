let _id = '' //user表的_id

Component({
  properties: {
    flowerId:{
      type:String,
      value:''
    }
  },

  data: {
    flower:{},
    num:1,
  },

  lifetimes:{
    //ready 在组件在视图层布局完成后执行
    ready(){
      //调用云函数获取该花的详情
      wx.cloud.callFunction({
        name:'getFlowerById',
        data:{
          id:this.data.flowerId
        }
      })
      .then(res => {
        console.log("获取花详情成功",res)

        this.setData({
          flower:res.result.data
        })
      })
      .catch(err => {
        console.log("获取花详情失败",err)
      })

      //根据openid拿到user集合的_id
      wx.cloud.callFunction({
        name:'getUseridByOpenid'
      })
      .then(res => {
        console.log("获取user集合的_id成功",res)
        _id = res.result.data[0]._id
      })
      .catch(err => {
        console.log("获取user集合的_id失败",err)
      })
      
    },

  },

  methods: {
    //关闭购物车按钮
    closeCart(){
      this.triggerEvent('closeCartEvent')
    },

    //数量加法按钮
    plus(){
      this.setData({
        num:this.data.num + 1
      })
    },

    //数量减法按钮
    minus(){
      if(this.data.num > 1){
        this.setData({
          num:this.data.num - 1
        })
      }
    },

    //加入购物车
    addCart(){
      let cart = {}
      cart._id = this.data.flowerId
      cart.num = this.data.num
 
      wx.cloud.callFunction({
        name:'saveCart',
        data:{
          _id:_id,
          cart:cart
        }
      })
      .then(res => {
        console.log("添加购物车成功",res)
        wx.showToast({
          title: '添加购物车成功',
          duration:2000,
          success:()=> {
            this.closeCart()
          }
        })
      })
      .catch(err => {
        console.log("添加购物车失败",err)
      })
    },

    //立即购买
    buy(){
      wx.navigateTo({
        url: '../../pages/account/account?goods=' + JSON.stringify([{flower: this.data.flower, num: this.data.num}]),
      })
    }
  }
})
