const app = getApp()
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
            app.globalData.userInfo=result,
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
                iconPath:'../images/01.jpg'})
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
    const tabs = [
   
      {
        title: '电动车',
        title2: '微信小程序直播',
        img: 'http://mmbiz.qpic.cn/sz_mmbiz_png/GEWVeJPFkSHALb0g5rCc4Jf5IqDfdwhWJ43I1IvriaV5uFr9fLAuv3uxHR7DQstbIxhNXFoQEcxGzWwzQUDBd6Q/0?wx_fmt=png',
        desc: '微信小程序直播系列课程持续更新中，帮助大家更好地理解、应用微信小程序直播功能。',
      },
      {
        title: '摩托车',
        title2: '流量主小程序',
        img: 'http://mmbiz.qpic.cn/sz_mmbiz_jpg/GEWVeJPFkSH2Eic4Lt0HkZeEN08pWXTticVRgyNGgBVHMJwMtRhmB0hE4m4alSuwsBk3uBBOhdCr91bZlSFbYhFg/0?wx_fmt=jpeg',
        desc: '本课程共四节，将分阶段为开发者展示如何开通流量主功能、如何接入广告组件、不同类型小程序接入的建议，以及如何通过工具调优小程序变现效率。',
      },
      {
        title: '自行车',
        title2:'2020中国高校计算机大赛',
        img: 'http://mmbiz.qpic.cn/mmbiz_jpg/TcDuyasB5T3Eg34AYwjMw7xbEK2n01ekiaicPiaMInEMTkOQtuv1yke5KziaYF4MLia4IAbxlm0m5NxkibicFg4IZ92EA/0?wx_fmt=jpeg',
        desc: '微信小程序应用开发赛',
      },
      {
        title: '结伴行',
        title2:'2020中国高校计算机大赛',
        img: 'http://mmbiz.qpic.cn/mmbiz_jpg/TcDuyasB5T3Eg34AYwjMw7xbEK2n01ekiaicPiaMInEMTkOQtuv1yke5KziaYF4MLia4IAbxlm0m5NxkibicFg4IZ92EA/0?wx_fmt=jpeg',
        desc: '微信小程序应用开发赛',
      },
      {
        title: '羽毛球',
        title2:'2020中国高校计算机大赛',
        img: 'http://mmbiz.qpic.cn/mmbiz_jpg/TcDuyasB5T3Eg34AYwjMw7xbEK2n01ekiaicPiaMInEMTkOQtuv1yke5KziaYF4MLia4IAbxlm0m5NxkibicFg4IZ92EA/0?wx_fmt=jpeg',
        desc: '微信小程序应用开发赛',
      },
      {
        title: '夜跑',
        title2:'2020中国高校计算机大赛',
        img: 'http://mmbiz.qpic.cn/mmbiz_jpg/TcDuyasB5T3Eg34AYwjMw7xbEK2n01ekiaicPiaMInEMTkOQtuv1yke5KziaYF4MLia4IAbxlm0m5NxkibicFg4IZ92EA/0?wx_fmt=jpeg',
        desc: '微信小程序应用开发赛',
      },
    ]
    this.setData({ tabs })
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