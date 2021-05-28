Page({
  data: {

  },

  onLoad: function (options) {

  },

  //跳转到我的收藏
  jumpToCollect(){
    wx.navigateTo({
      url: '../collect/collect',
    })
  },

  //跳转到我的收货地址
  jumpToAddress(){
    wx.navigateTo({
      url: '../manageAddress/manageAddress',
    })
  },

  //跳转到我的购物车
  jumpToCart(){
    wx.navigateTo({
      url: '../cart/cart',
    })
  },

})