let _id = '' //user集合的_id
let cartLength = 0
let cartIds = [] //临时存储该用户购物车的信息(包含花id和花数量)

Page({
  data: {
    tip:'商品库存有限，请尽快下单',
    emptyFlag:false,  //默认为空
    circleFlag:[],  //每一项圆圈
    allCircleFlag:false, //全选圆圈
    payFlag:false, //支付按钮
    cartList:[], //购物车列表
    totalMoney:0,
  },

  onShow() {
    //根据openid拿到user的_id
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

    //根据_id去拿用户信息
    wx.cloud.callFunction({
      name:'getUserFoodsByOpenid'
    })
    .then(res=> {
      console.log("获取用户信息成功",res)

      //临时存储该用户购物车的信息(包含花id和花数量)
      cartIds = res.result.data[0].cart
      cartLength = cartIds.length
      
      if(this.duplicatedRemove(cartIds)){
        wx.cloud.callFunction({
          name:'updateCart',
          data:{
            _id:_id,
            cart:cartIds
          }
        })
        .then(res => {
          this.setData({
            cartList: this.data.cartList
          })
    
          console.log("合并重复商品成功",res)
        })
        .catch(err => {
          console.log("合并重复商品失败",err)
        })
      }

      //存在购物车商品，展示
      if(cartIds.length){
        this.setData({
          emptyFlag:false,
          allCircleFlag: false,
          totalMoney: 0
        })
      }

      //临时存储该用户每一项购物车的详细信息
      let cartListTemp = []
      let promiseArr = []
      for(let i = 0; i < cartIds.length; i++){
        promiseArr.push(new Promise((resovle, reject) => {
          //根据_id 去flowerList集合查找该花的详情
          wx.cloud.callFunction({
            name:'getFlowerById',
            data:{
              id:cartIds[i]._id,
            },
            success: res => {
              console.log("获取花详情成功",res)
              cartListTemp.push({flower: res.result.data, num: cartIds.find(item => {
                return item._id === res.result.data._id
              }).num, checked: false})
              resovle(res)
            },
            fail: err => {
              console.log("获取花详情失败",err)
              reject(err)
            }
          })
        }))   
      }

      Promise.all(promiseArr).then(res => {
        this.setData({
          cartList: cartListTemp
        })
      })
    })
    .catch(err=> {
      console.log("获取用户信息失败",err)
    })
  },

  //对重复商品数量进行合并
  duplicatedRemove(){
    let cartIds_ = []
    let needUpdateDB = false
    cartIds.forEach(i => {
      let t = 0
      if(cartIds_.findIndex(k => k._id === i._id) === -1){
        for(let j = 0; j < cartIds.length; j++){
          if(cartIds[j]._id === i._id){
            t += cartIds[j].num
          }
        }
        cartIds_.push({_id: i._id, num: t})
      }
    })

    needUpdateDB = (cartIds_.length != cartIds.length)
    cartIds = cartIds_

    return needUpdateDB
  },

  //点击圆圈进行选中/取消
  check(e){
    let item = e.currentTarget.dataset.item

    this.data.cartList.find(i => i.flower._id === item.flower._id).checked = !item.checked
    this.setData({
      cartList: this.data.cartList
    })

    this.priceRecount()
  },

  //点击删除按钮，将此项商品进行删除
  deleteCart(e){
    let flowerId = e.currentTarget.dataset.item._id
    wx.showModal({
      content:'确认删除此商品',
      success:(sm)=> {
        if(sm.confirm){
          cartIds.splice(cartIds.findIndex(item => item._id === flowerId), 1)

          wx.cloud.callFunction({
            name:'deleteCart',
            data:{
              _id:_id,
              cart:cartIds
            }
          })
          .then(res => {
            console.log("删除成功",res)
            wx.showToast({
              title: '删除成功',
              duration:2000
            })
            
            this.data.cartList.splice(this.data.cartList.findIndex(item => item.flower._id === flowerId), 1)
            this.setData({
              cartList: this.data.cartList
            })

            this.priceRecount()
          })
          .catch(err => {
            console.log("删除失败",err)
          })

        }else if(sm.cancel){
          console.log("用户点击了取消");
        }
      }
    })
  },

  //加减号按钮
  numModifyBtnClicked(e){
    let ope = e.currentTarget.dataset.ope
    let item = e.currentTarget.dataset.item

    cartIds.find(i => i._id === item.flower._id).num += (ope === '+' ? 1 : -1)
    
    wx.cloud.callFunction({
      name:'updateCart',
      data:{
        _id:_id,
        cart:cartIds
      }
    })
    .then(res => {
      this.data.cartList.find(i => i.flower._id === item.flower._id).num += (ope === '+' ? 1 : -1)
      this.setData({
        cartList: this.data.cartList
      })

      this.priceRecount()

      console.log("更新购物车成功",res)
    })
    .catch(err => {
      console.log("更新购物车失败",err)
    })
  },

  //重新计算价格
  priceRecount(){
    let p = 0
    this.data.cartList.forEach(i => {
      if(i.checked)
        p += i.flower.price * i.num
    })

    this.setData({
      totalMoney: p,
    })
  },

  //全选按钮
  checkAll(){
    this.data.cartList.forEach(i => i.checked = !this.data.allCircleFlag)
    this.setData({
      allCircleFlag: !this.data.allCircleFlag,
      cartList: this.data.cartList
    })
    this.priceRecount()
  },

  //支付按钮
  pay(){
    if(this.data.totalMoney){
      let goods = []
      this.data.cartList.forEach(i => {
        if(i.checked){
          goods.push(i)
        }
      })

      wx.navigateTo({
        url: '../account/account?goods=' + JSON.stringify(goods),
      })
    }
  }
})