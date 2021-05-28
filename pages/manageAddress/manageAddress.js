let _Aid = '' //全局变量，该条地址的_id

Page({
  data: {
    showFlag: false,
    addressList:[],
    _id:'', //user集合的_id
    defaultFlags: [],
    posTitle: "已设为默认",
    navTitle: "设为默认",
    canClick: false
  },

  onLoad(options){
    //这里的操作判断是否可以点击是从account传递过来的
    if(options.canClick === '1')
      this.setData({
        canClick: true
      })
    else
      this.setData({
        canClick: false
      })

    this.loadAddressData()
  },

  loadAddressData(){
    //访问云函数getuserIdByOpenid，根据openid拿到_id
    wx.cloud.callFunction({
      name:'getUseridByOpenid',
    })
    .then(res => {
      console.log('根据openid获取_id成功',res);

      
      this.setData({
        _id:res.result.data[0]._id
      })
    })
    .catch(err => {
      console.log("根据openid获取_id失败",err);
    })

    //获取用户收货地址
    wx.cloud.callFunction({
      name:'getUserFoodsByOpenid'
    })
    .then(res => {
      console.log("获取收货地址成功",res)
      this.setData({
        addressList:res.result.data[0].address
      })

      //如果存在收货地址，则展示收货地址
      if(this.data.addressList.length > 0){
        this.setData({
          showFlag:true
        })

        //设置默认地址操作
        let i = 0
        this.data.addressList.forEach(item => {
          this.setData({
            ["defaultFlags[" + i + "]"] : item.default
          })
          i++
        })
      }
    })
    .catch(err => {
      console.log("获取收货地址失败",err)
    })
  },

  onShow() {
    let pages = getCurrentPages();
    let canClick = pages[pages.length-1].data.canClick;
    let needUpdateDisplay = pages[pages.length-1].data.needUpdateDisplay

    //这里的操作判断是否可以点击是从address返回过来的
    if(canClick === '1' || canClick === true)
      this.setData({
        canClick: true
      })
    else
      this.setData({
        canClick: false
      })
    
    if(needUpdateDisplay){
      this.loadAddressData()
    }
  },

  chooseAddress(e){
    if(this.data.canClick){
      let i = e.currentTarget.dataset.index
    
      let pages = getCurrentPages()
      pages[pages.length - 2].setData({
        address: JSON.stringify(this.data.addressList[i])
      })

      wx.navigateBack({
        delta: 1
      })
    }else{
      console.log("不允许跳转")
    }
  },

  //跳转到添加地址的页面
  jumpToAddress(){
    wx.navigateTo({
      url: '../address/address?canClick=' + (this.data.canClick ? '1': '0'),
    })
  },
  
  //更改设置默认地址
  changeSet(e){
    //表明是第几条地址
    let index = e.currentTarget.dataset.index

    //若该地址已经设置为默认，则点击后什么都不做
    if(this.data.defaultFlags[index])
      return

    this.data.addressList.forEach((item,i)  => {
      item.default = i === index ? true : false
    })

    //将更改后的值存入数据库
    wx.cloud.callFunction({
      name:'updateAddress',
      data:{
        _id:this.data._id,
        address:this.data.addressList
      }
    })
    .then(res => {
      console.log("更改默认值成功",res)

      //将除了index位的其他位改为false
      this.data.defaultFlags.forEach((item,i) => {
        this.setData({
          ['defaultFlags[' + i+ ']']: i === index? true: false
        })
      })
    })
    .catch(err => {
      console.log("更改默认值失败",err)
    })
  },

  //用户点击编辑地址
  editAddress(e){
     //该条地址的_id
     let _id = e.currentTarget.dataset.item._id
     wx.navigateTo({
       url: '../address/address?_id=' + _id + '&canClick=' + (this.data.canClick ? '1': '0'),
     })
  },

  //用户点击删除地址
  deleteAddress(e){
    //该条地址的_id
    let _id = e.currentTarget.dataset.item._id

    wx.showModal({
      content: '确定删除收货地址',
      success:(sm)=> {
        // 用户点击了确定 可以调用删除方法了
        if (sm.confirm) {
          //先拿到用户的收货地址
          wx.cloud.callFunction({
            name:'getUserFoodsByOpenid'
          })
          .then(res => {
            console.log("拿到收货地址成功",res)
            //收货地址
            let address = res.result.data[0].address
            let index = address.findIndex(item => item._id === _id)
            if(index !== -1){
              let flag = false
              //至少有两条地址且删除的那个地址是默认地址，所以将删除后的第一条地址设为默认
              if(address.length > 1 && address[index].default)
                flag = true

              address.splice(index,1)

              if(flag)
                address[0].default = true
            }
            
            //调用云函数，删除地址
            wx.cloud.callFunction({
              name:'deleteAddress',
              data:{
                _id:this.data._id,
                address:address
              }
            })
            .then(res => {
              console.log("删除地址成功",res)
              
              //再次判断该用户是否有收货地址，若有，则展示
              this.loadAddressData()

            })
            .catch(err => {
              console.log("删除地址失败",err)
            })
  
          })
          .catch(err => {
            console.log("拿到收货地址失败",err)
          })

        } else if (sm.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }

})