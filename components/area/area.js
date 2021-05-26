Component({
 
  properties: {
    
  },

  data: {
    multiArray: [],
    multiIndex: [0,0,0],
    province:'', //省份
    city:'', //市
    region:'', //区
    area:'' //省市区
  },

  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  lifetimes: {
    attached: function () { 
      this.getCityInfo()
    }
  },

  methods: {
    //获取数据库数据
    getCityInfo() {
      wx.showLoading({
        title: 'Loading...',
      })

      const db = wx.cloud.database()
      //因为数据库只存有一个总的数据字典，所以指定它的ID直接获取数据
      let that = this
      db.collection('cityDataArr').doc('3f1caf50607e4acf0014c1dc2c35ab1f').get({
        success: res => {
          wx.hideLoading();
          if (res.data){
            //获取云数据库数据
            let temp = res.data.data;
            //初始化更新数据
            that.setData({
              provinces: temp,
              multiArray: [temp, temp[0].citys, temp[0].citys[0].areas],
              multiIndex: [0, 0, 0]
            })
          }
        },
        fail: err => {
          wx.hideLoading();
          console.error(err)
        }
      })     
    },

    //点击确定
    bindMultiPickerChange(e) {
      //picker发送选择改变，携带值为 e.detail.value
      this.setData({
        multiIndex: e.detail.value
      })

      const db = wx.cloud.database()
      db.collection('cityDataArr').doc('3f1caf50607e4acf0014c1dc2c35ab1f')
        .get()
        .then(res => {
          console.log("确定城市成功",res);

          //设置省，市，区
          this.setData({
            province:res.data.data[this.data.multiIndex[0]].name,
            city:res.data.data[this.data.multiIndex[0]].citys[this.data.multiIndex[1]].name,
            region:res.data.data[this.data.multiIndex[0]].citys[this.data.multiIndex[1]].areas[this.data.multiIndex[2]].name
          })

          this.setData({
            area:this.data.province+this.data.city+this.data.region
          })

          //子组件向父组件传递值
          this.triggerEvent('passArea',this.data.area)
      
        })
        .catch(err => {
          console.log("确定城市成功",err);
        })

    },

    //滑动
    bindMultiPickerColumnChange(e) {
      // console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
      var data = {
        multiArray: this.data.multiArray,
        multiIndex: this.data.multiIndex
      };
      //更新滑动的第几列e.detail.column的数组下标值e.detail.value
      data.multiIndex[e.detail.column] = e.detail.value;
      //如果更新的是第一列“省”，第二列“市”和第三列“区”的数组下标置为0
      if (e.detail.column == 0){
        data.multiIndex = [e.detail.value,0,0];
      } else if (e.detail.column == 1){
        //如果更新的是第二列“市”，第一列“省”的下标不变，第三列“区”的数组下标置为0
        data.multiIndex = [data.multiIndex[0], e.detail.value, 0];
      } else if (e.detail.column == 2) {
        //如果更新的是第三列“区”，第一列“省”和第二列“市”的值均不变。
        data.multiIndex = [data.multiIndex[0], data.multiIndex[1], e.detail.value];
      }
      var temp = this.data.provinces;
      data.multiArray[0] = temp;
      if ((temp[data.multiIndex[0]].citys).length > 0){
        //如果第二列“市”的个数大于0,通过multiIndex变更multiArray[1]的值
        data.multiArray[1] = temp[data.multiIndex[0]].citys;
        var areaArr = (temp[data.multiIndex[0]].citys[data.multiIndex[1]]).areas;
        //如果第三列“区”的个数大于0,通过multiIndex变更multiArray[2]的值；否则赋值为空数组
        data.multiArray[2] = areaArr.length > 0 ? areaArr : [];
      }else{
        //如果第二列“市”的个数不大于0，那么第二列“市”和第三列“区”都赋值为空数组
        data.multiArray[1] = [];
        data.multiArray[2] = [];
      }
      //data.multiArray = [temp, temp[data.multiIndex[0]].citys, temp[data.multiIndex[0]].citys[data.multiIndex[1]].areas];
      //setData更新数据
      this.setData(data);
    }
  }
})
