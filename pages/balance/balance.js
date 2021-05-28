Page({
  /**
   * 页面的初始数据
   */
  data: {
    money: 11.32,
  },

  // 渲染背景函数
  render(ctx, axisLength, waveWidth, waveHeight, xOffset, dY, color){
    ctx.beginPath();
    ctx.lineTo(0, 0);

    //  在整个轴长上取点, axisLength 是x轴轴长
    for(let x = 0; x < 0 + axisLength; x += Math.PI/6){
        // 计算每个坐标点(x, y)
        let y = Math.sin(x * waveWidth + xOffset);
        ctx.lineTo(x, dY + y * waveHeight);    // 描述路径
    }

    ctx.lineTo(axisLength, 0);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  },

  // 提现事件
  withdrawal(){
    console.log("待开发，敬请期待");
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    // 获取数据库账户余额

    // 绘制余额
    const query = wx.createSelectorQuery()
    query.select('#myCanvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        const canvas = res[0].node;
        const ctx = canvas.getContext('2d');

        const dpr = wx.getSystemInfoSync().pixelRatio;
        canvas.width = res[0].width * dpr;
        canvas.height = res[0].height * dpr;
        ctx.scale(dpr, dpr);

        that.render(ctx, canvas.width, 0.02, 20, Math.PI/2, 200, "#AED3FC");
        that.render(ctx, canvas.width, 0.02, 20, 0, 200, "#7E8BE8");

        ctx.fillStyle="#000000";

        ctx.font = "italic bold 20px 微软雅黑";
        ctx.fillText("可提现余额: ", 30, 100);

        ctx.font = "italic 25px 微软雅黑";
        ctx.fillText(this.data.money + " 元", 140, 102);
      })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },
})