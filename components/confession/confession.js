// components/confession/confession.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    height:{
      type:Number,
      value:0
    },
     curActiveTab:{
      type:Number,
      value:0
    }
  },
  options: {
    addGlobalClass: true
  },
  /**
   * 组件的初始数据
   */
  data: {
    loading: true,
    isLike: false,
    confessions: [],
    userInfo: {},
    userId: "",
    bottomRefresh: false,
    totalConfess: 4,
    curConfessCount: 0,
    showBackTop: false,
    topNum: 0,
    active: 0
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // tab切换
    onChange(e) {
      console.log(e);
      // this.setData({
      //   active: e.detail.index
      // })
    },
    // 发送评论或者点赞信息
    // 修改点赞列表
    modify(index, data,classname) {
      this.selectComponent('.'+classname);
      const db = wx.cloud.database();
      db.collection('t_confession').doc(this.data.confessions[index]._id).update({
        data: {
          likerArr: data
        },
        succcess: function (res) {
          console.log("修改点赞成功：", res);
        }
      })
    },
    // 点赞事件
    handleLike(e) {
      console.log(e);
      let { index } = e.currentTarget.dataset;
      let {sonclass} = e.currentTarget.dataset;
      // 没未登录
      if (JSON.stringify(this.data.userInfo) == "{}" || JSON.stringify(this.data.userInfo) === "null") {
        wx.showToast({
          icon: "error",
          title: '登录后可点赞',
        })
      } else {
        let isExist = this.data.confessions[index].likerArr.indexOf(this.data.userId);
        const { confessions } = this.data;
        console.log(isExist, confessions);
        if (isExist === -1) { // 还未点赞
          confessions[index].likerArr.push(this.data.userId);
          confessions[index].likeClass = "icon-like"; // 红心
        } else { // 取消点赞
          console.log('cancel');
          confessions[index].likerArr.splice(isExist, 1);
          confessions[index].likeClass = "icon-like1";
        }
        this.setData({
          confessions
        })
        this.modify(index, confessions[index].likerArr,sonclass);
      }
    },
    // 跳转
    handleNavigate(e) {
      wx.navigateTo({
        url: e.currentTarget.dataset.url,
      })
    },
    // 更新表白墙列表 
    uploadConfession() {
      wx.cloud.callFunction({
        name: "OperateDatabase",
        data: {
          opr: 'query',
          tablename: "t_confession",
          data: {}
        },
        complete: (res) => {
          let confessions = res.result.data;
          let userId = app.globalData.openid;
          // 根据openId来确定 点赞列表 是否含有该用户
          // 处理当前用户是否喜爱当前表白
          confessions.map((item, index) => {
            if (item.likerArr.indexOf(userId) !== -1) {
              return item.likeClass = "icon-like";
            }
          })
          this.setData({
            confessions: confessions.reverse(),
            loading: false,
            userInfo: app.globalData.userInfo,
            userId,
            curConfessCount: confessions.length
          })
        }
      })
    },
    // 返回顶部
    handleBackTop() {
      this.setData({
        topNum: 0
      });
    },
    // 显示返回顶部按钮
    showBackToTop(e) {
      if (e.scrollTop > 250) {
        this.setData({
          showBackTop: true
        })
      } else {
        this.setData({
          showBackTop: false
        })
      }
    },
    // 获取滚动条当前位置
    scrolltoupper: function (e) {
      if (e.detail.scrollTop > 100) {
        this.setData({
          showBackTop: true
        });
      } else {
        this.setData({
          showBackTop: false
        });
      }
    },
    scrollReachBottom: function () {
      console.log("chudi");
      this.setData({
        bottomRefresh: true
      })
    },
  },
  pageLifetimes: {
    show: function () {
      this.uploadConfession();
    },
  }
})
