// components/likerlist/likerlist.js
Component({
  behaviors:['wx://component-export'],
  export(){
    return this.loadAvatar();
  },
  /**
   * 组件的属性列表
   */
  properties: {
    likerArr: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    likerAvatar: []
  },
  ready: function () {
    this.loadAvatar()
  },
  /**
   * 组件的方法列表
   */
  methods: {
    loadAvatar: function () {
      const likerArr = this.data.likerArr.reverse();
      let likerAvatar = [];
      let promiseArr = [];
      let length = likerArr.length > 5 ? 5 : likerArr.length;
      let i = 0;
      for (i = 0; i < length; i++) {
        promiseArr.push(new Promise((resolve, reject) => {
          wx.cloud.callFunction({
            name: "OperateDatabase",
            data: {
              opr: 'query',
              tablename: "t_user_info",
              data: {
                userId: likerArr[i]
              }
            },
            success: (res) => {
              likerAvatar.push(res.result.data[0].userInfo.avatarUrl);
              resolve();
            }
          })
        }))
      }
      Promise.all(promiseArr).then(res => {
        this.setData({
          likerAvatar
        })
      })
    }
  }
})
