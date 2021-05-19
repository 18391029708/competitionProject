const app = getApp()
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    markers:[],
    EndPosition: '999',
    position:'o',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取车手经纬度
    db.collection('t_user_info').where({'carAuthentificationStatus':true}).get({
      success: function(res) {
        // res.data 包含该记录的数据
        // console.log(res.data)
     function   setdata( ary,ard){
          let arr=[]
          for (const iterator of ary) {
            console.log(iterator)
            console.log(ard)
             arr.push({
              latitude:iterator.latitude,
                longitude	:iterator.longitude,
                iconPath:'../../icons/bike2.png'})
          }
          let tmp=arr.concat(ard)
          return  ard!=undefined? tmp:arr
        }
        that.setData({
          markers:setdata(res.data,that.data.markers)
        })
        console.log(that.data.markers)

      }
    })

    var that = this;
    wx.getLocation({
      type:'wgs84',
      success:function(res){
        console.log(res)
        var getAddressUrl = "https://apis.map.qq.com/ws/geocoder/v1/?location=" + res.latitude + "," + res.longitude + "&key=FSVBZ-SFQK4-DBSUM-DLPJP-LKONQ-IQBWQ";
        that.longitude = res.longitude;
        that.latitude = res.latitude;
        wx.request({          
          url: getAddressUrl,
          success: function (result) {  
            // app.globalData.userInfo=result,
            console.log(result)
            console.log( result.data.result.address)     
            that.locations = result.data.result.address   
            that.setData({position:result.data.result.address})
           
          }
        })
       function setdata( ary,ard){
          let arr=[]
          for (const iterator of ary) {
             arr.push({
              latitude:iterator.latitude,
                longitude	:iterator.longitude,
                iconPath:'../../icons/position.png'})
          }
          let tmp=arr.concat(ard)
          return  ard!=undefined? tmp:arr
        }
        that.setData({
          latitude:res.latitude,
          longitude:res.longitude,
           markers:setdata([{
            latitude:res.latitude,
              longitude	:res.longitude
              }],that.data.markers)
        })
        console.log(res.latitude)
      }    
    })    
  
    // this.setData({ tabs })
  },
  // 选择起点
  chooseStartLocation:function(){
    var that = this;
   wx.chooseLocation({
     success:function(res){
       console.log(res);
       that.setData({
        position:res.name
       })
     },     
   })   
   console.log(this.data)
   console.log(that.data)
  },   
  // 选择终点
  chooseLocation:function(){
    var that = this;
   wx.chooseLocation({
     success:function(res){
       console.log(res);
       that.setData({
          EndPosition:res.name
       })
      that.changeStyle();
     },     
   })   
   console.log(this.data)
   console.log(that.data)
  },   
// 选择终点后进行页面跳转
  changeStyle:function(){
   var that = this;
    wx.navigateTo({
      url:'../orderConfirm/orderConfirm',    
      success: function(res) {
        // var that = this;
        // console.log(that.data);
        console.log(that)
        console.log(res)
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', { data: that.data})      
        console.log(that.data)
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