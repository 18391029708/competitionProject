let _Aid = '' //全局变量 该条地址的_id
let canClick = false

Page({
  data: {
    address:{},
    _id:'', //用户的_id
  },

  onLoad(options) {
    _Aid = options._id
    canClick =  options.canClick? true: false

    let pages = getCurrentPages()
    pages[pages.length - 2].setData({
      needUpdateDisplay: false
    })
      
    //获取用户_id
    wx.cloud.callFunction({
      name: "getUseridByOpenid"
    })
    .then(res => {
      this.setData({
        _id: res.result.data[0]._id
      })
    })

    //获取该用户的收货地址
    wx.cloud.callFunction({
      name:'getUserFoodsByOpenid'
    })
    .then(res => {
      console.log("获取收货地址成功",res)
    
      this.setData({
        address: res.result.data[0].address.find(item => item._id === _Aid)
      })
    })
    .catch(err => {
      console.log("获取收货地址失败",err)
    })
  },

  //获取从area子组件传递过来的值
  getArea(e){
    console.log(e.detail);
    this.setData({
      ['address.area']:e.detail
    })
  },

  //保存地址到user集合
  formSubmit(e){
    //保存地址前先判断该用户是否有收货地址，若没有，则将default设置为true；若有，则将default设置为false
    wx.cloud.callFunction({
      name:'getUserFoodsByOpenid'
    })
    .then(res => {
      console.log("获取收货地址成功",res)

      //拿到input框的输入值
      let formdata = e.detail.value

      //生成一个6位随机数充当该条地址的_id
      let _id = ''
      for(var i=0;i<6;i++){
        _id += Math.floor(Math.random()*10)
      }
 
      this.setData({
        ['address.name']:formdata.name,
        ['address.phone']:formdata.phone,
        ['address.detail']:formdata.detail
      })


      let addressLength = res.result.data[0].address.length
      
      let pages = getCurrentPages()
      pages[pages.length - 2].setData({
        canClick: canClick? '1': '0',
        needUpdateDisplay: true
      })
      
      //没有收货地址
      if(addressLength === 0){
        this.setData({
          ['address._id']:_id,
          ['address.default']:true
        })
        
        //根据openid拿到用户的_id
        wx.cloud.callFunction({
          name:'getUseridByOpenid'
        })
        .then(res => {
          console.log("获取_id成功",res)
          this.setData({
            _id:res.result.data[0]._id
          })

          //将该地址存到user集合中
          wx.cloud.callFunction({
            name:'saveAddress',
            data:{
              _id:this.data._id,
              address:this.data.address
            }
          })
          .then(res => {
            console.log("存储地址成功",res)

            wx.showToast({
              title: '添加成功',
              duration:2000,
              success(){
                wx.navigateBack({
                  delta: 1,
                })
              }
            })
          })
          .catch(err => {
            console.log("存储地址失败",err)
          })

        })
        .catch(err => {
          console.log("获取_id成功",err)
        })
      }else{ //有收货地址：还得判断 该地址是新添加还是修改
        //获取该用户的收货地址
        wx.cloud.callFunction({
          name:'getUserFoodsByOpenid'
        })
        .then(res => {
          console.log("获取收货地址成功",res)
          let addressTemp = res.result.data[0].address
          let index = addressTemp.findIndex(item => item._id === _Aid)

          if(index === -1){
            //说明地址需要新添
            this.setData({
              ['address._id']: _id,
              ['address.default']:false
            })

            //将该地址存到user集合中
            wx.cloud.callFunction({
              name:'saveAddress',
              data:{
                _id:this.data._id,
                address:this.data.address
              }
            })
            .then(res => {
              console.log("存储地址成功",res)

              wx.showToast({
                title: '添加成功',
                duration:2000,
                success(){
                  wx.navigateBack({
                    delta: 1,
                  })
                }
              })
            })
            .catch(err => {
              console.log("存储地址失败",err)
            })
            
          }else{
            //说明地址需要更新
            addressTemp.splice(index, 1, this.data.address)
            
            wx.cloud.callFunction({
              name: "updateAddress",
              data: {
                _id: this.data._id,
                address: addressTemp
              }
            })
            .then(res => {
              console.log("更新地址成功", res)

              wx.showToast({
                title: '修改成功',
                duration:2000,
                success(){
                  wx.navigateBack({
                    delta: 1,
                  })
                }
              })
            })
            .catch(err => {
              console.log("更新地址失败", err)
            })
          }
        })
        .catch(err => {
          console.log("获取收货地址失败",err)
        })
      }
          
    })
    .catch(err => {
      console.log("获取收货地址失败",err)
    })
  }
})