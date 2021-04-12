// pages/confession.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLike: false,
    confessions:[
      {
        confessionId:0,
        userId:"o75dQ5ZDFiQUvvDZQid66XskWpWU",
        content:"Ant Design 的色板还具备进一步拓展的能力。经过设计师和程序员的精心调制，结合了色彩自然变化的规律，我们得出了一套色彩生成工具，当有进一步色彩设计需求时，设计者只需按照一定规则定义完毕主色，便可以自动获得一系列完整的衍生色。便可以自动获得一系列完整的衍生色。便可以自动获得一系列完整的衍生色。",
        avatarUrl:"https://thirdwx.qlogo.cn/mmopen/vi_32/FUtyWKg6qZeeS0pLic70Qt8DJNB34ibvE8thSPoiaI6p5VzfK2HZ13sEZoyrlSY2ooBnnlTjQROD1IyXvzJdDPBDA/132",
        pictures:["https://thirdwx.qlogo.cn/mmopen/vi_32/FUtyWKg6qZeeS0pLic70Qt8DJNB34ibvE8thSPoiaI6p5VzfK2HZ13sEZoyrlSY2ooBnnlTjQROD1IyXvzJdDPBDA/132"],
        createTime:"2021/03/01 下午2:30",
        commentCount:12,
        likeCount:0,
      },     
      {
        confessionId:1,
        userId:"o75dQ5ZDFiQUvvDZQid66XskWpWU",
        content:"Ant Design 的色板还具备进一步拓展的能力。",
        avatarUrl:"https://thirdwx.qlogo.cn/mmopen/vi_32/FUtyWKg6qZeeS0pLic70Qt8DJNB34ibvE8thSPoiaI6p5VzfK2HZ13sEZoyrlSY2ooBnnlTjQROD1IyXvzJdDPBDA/132",
        pictures:[],
        createTime:"2021/03/01 下午2:30",
        commentCount:10,
        likeCount:5,
      },      {
        confessionId:2,
        userId:"o75dQ5ZDFiQUvvDZQid66XskWpWU",
        content:"Ant Design 的色板还具备进一步拓展的能力。经过设计师和程序员的精心调制，结合了色彩自然变化的规律，我们得出了一套色彩生成工具，当有进一步色彩设计需求时，设计者只需按照一定规则定义完毕主色.",
        avatarUrl:"https://thirdwx.qlogo.cn/mmopen/vi_32/FUtyWKg6qZeeS0pLic70Qt8DJNB34ibvE8thSPoiaI6p5VzfK2HZ13sEZoyrlSY2ooBnnlTjQROD1IyXvzJdDPBDA/132",
        pictures:["https://thirdwx.qlogo.cn/mmopen/vi_32/FUtyWKg6qZeeS0pLic70Qt8DJNB34ibvE8thSPoiaI6p5VzfK2HZ13sEZoyrlSY2ooBnnlTjQROD1IyXvzJdDPBDA/132","https://img.yzcdn.cn/vant/cat.jpeg","https://img.yzcdn.cn/vant/cat.jpeg"],
        createTime:"2021/03/01 下午2:30",
        commentCount:10,
        likeCount:85,
      }
    ]
  },
  // 事件
  handleLike(e){
    console.log(e);
    this.setData({
      isLike:!this.data.isLike
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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