const app = getApp();
Page({
  data: {
    formats: {},
    readOnly: false,
    placeholder: '开始你的告白吧...',
    editorHeight: 300,
    keyboardHeight: 0,
    isIOS: false,
    imgPath: [],
    anonymous: false
  },
  readOnlyChange() {
    this.setData({
      readOnly: !this.data.readOnly
    })
  },
  onLoad() {
    const platform = wx.getSystemInfoSync().platform
    const isIOS = platform === 'ios'
    this.setData({ isIOS })
    const that = this
    this.updatePosition(0)
    let keyboardHeight = 0
    wx.onKeyboardHeightChange(res => {
      if (res.height === keyboardHeight) return
      const duration = res.height > 0 ? res.duration * 1000 : 0
      keyboardHeight = res.height
      setTimeout(() => {
        wx.pageScrollTo({
          scrollTop: 0,
          success() {
            that.updatePosition(keyboardHeight)
            that.editorCtx.scrollIntoView()
          }
        })
      }, duration)

    })
  },
  updatePosition(keyboardHeight) {
    const toolbarHeight = 50
    const { windowHeight, platform } = wx.getSystemInfoSync()
    let editorHeight = keyboardHeight > 0 ? (windowHeight - keyboardHeight - toolbarHeight) : windowHeight
    this.setData({ editorHeight, keyboardHeight })
  },
  calNavigationBarAndStatusBar() {
    const systemInfo = wx.getSystemInfoSync()
    const { statusBarHeight, platform } = systemInfo
    const isIOS = platform === 'ios'
    const navigationBarHeight = isIOS ? 44 : 48
    return statusBarHeight + navigationBarHeight
  },
  onEditorReady() {
    const that = this
    wx.createSelectorQuery().select('#editor').context(function (res) {
      that.editorCtx = res.context
    }).exec()
  },
  blur() {
    this.editorCtx.blur()
  },
  format(e) {
    let { name, value } = e.target.dataset
    if (!name) return
    // console.log('format', name, value)
    this.editorCtx.format(name, value)
  },
  onStatusChange(e) {
    const formats = e.detail
    this.setData({ formats })
  },
  undo() {
    this.editorCtx.undo();
  },
  redo() {
    this.editorCtx.redo();
  },
  insertDivider() {
    this.editorCtx.insertDivider({
      success: function () {
        console.log('insert divider success')
      }
    })
  },
  clear() {
    this.editorCtx.clear({
      success: function (res) {
        console.log("clear success")
      }
    })
  },
  removeFormat() {
    this.editorCtx.removeFormat()
  },
  insertDate() {
    const date = new Date()
    const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
    this.editorCtx.insertText({
      text: formatDate
    })
  },
  // 预览图片
  previewImg(e) {
    const { index } = e.currentTarget.dataset;
    const { imgPath } = this.data;
    wx.previewImage({
      current: imgPath[index],
      urls: imgPath,
    })
  },
  // 选择图片
  handleChooseImg(e) {
    console.log(app.globalData);
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      success: (result) => {
        console.log(result);
        this.setData({
          // imgPath:result.tempFilePaths
          // 进行拼接
          imgPath: [...this.data.imgPath, ...result.tempFilePaths]
        })
      }
    })
  },
  // 删除选取的图片
  handleDeleteImg(e) {
    const { index } = e.currentTarget.dataset;
    let { imgPath } = this.data;
    // 删除数组的index元素
    imgPath.splice(index, 1);
    this.setData(
      { imgPath }
    )
  },
  handleAnonymous(e) {
    console.log(e);
    this.setData({
      anonymous: e.detail
    })
  },
  // 发送表白信息
  sendConfession() {
    let confessData;
    new Promise((resolve, rej) => {
      this.editorCtx.getContents({
        success: (res) => {
          confessData = {
            _openid: app.globalData.openid,
            content: res.html,
            userId: app.globalData.openid,
            authorInfo: app.globalData.userInfo,
            createTime: new Date().toLocaleString(),
            likerArr: [],
            commentCount: 0,
            likeClass:"icon-like1"
          }
          resolve();
        }
      });
    }).then(()=>{
      if (JSON.stringify(app.globalData.userInfo) === "{}" || JSON.stringify(app.globalData.userInfo) === "null") {
        wx.showModal({
          title: "请登录后再尝试",
        })
      } else if (confessData.content === "") {
        wx.showToast({
          title: '请输入非空文字',
          icon: "error"
        })
      }
      else {
        wx.showLoading({
          title: '上传中',
        })
        let promiseArr = [];
        let pictures = [];
        for (let i = 0; i < this.data.imgPath.length; i++) {
          promiseArr.push(new Promise((reslove, reject) => {
            let item = this.data.imgPath[i];
            let suffix = /\.\w+$/.exec(item)[0];//正则表达式返回文件的扩展名
            wx.cloud.uploadFile({
              cloudPath: new Date().getTime() + suffix, // 上传至云端的路径
              filePath: item, // 小程序临时文件路径
              success: res => {
                console.log("云端图片路径:", res)
                pictures.push(res.fileID)
                console.log(res.fileID)//输出上传后图片的返回地址
                reslove();
              },
              fail: res => {
                wx.showToast({
                  title: "上传失败",
                })
                reject();
              } // fail
            }) // wx.cloud.uploadFile
          })); // promiseArr.push
        } // for
        Promise.all(promiseArr).then(res => {//等数组都做完后做then方法
          wx.hideLoading();
          confessData["pictures"] = pictures;
          wx.cloud.callFunction({
            name: "OperateDatabase",
            data: {
              opr: 'add',
              tablename: "t_confession",
              data: confessData
            },
            success: () => {
              console.log("condata:", confessData);
              this.clear();//清空文本框
              this.setData({
                imgPath: [],
                anonymous: false
              })
              wx.showToast({
                title: '发布成功',
                success: () => {
                  wx.navigateBack({
                    delta: 1,
                  })
                }
              })
            }
          }) // wx.cloud.callFunction
        })  // promise.all
      } // else
    })


  },//sendConfess
})
