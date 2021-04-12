Page({
  data: {
    formats: {},
    readOnly: false,
    placeholder: '开始你的告白吧...',
    editorHeight: 300,
    keyboardHeight: 0,
    isIOS: false,
    imgPath:[]
  },
  readOnlyChange() {
    this.setData({
      readOnly: !this.data.readOnly
    })
  },
  onLoad() {
    const platform = wx.getSystemInfoSync().platform
    const isIOS = platform === 'ios'
    this.setData({ isIOS})
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
  previewImg(e){
    const {index} = e.currentTarget.dataset;
    const {imgPath} = this.data;
    wx.previewImage({
      current:imgPath[index],
      urls: imgPath,
    })
  },
  // 选择图片
  handleChooseImg(e){
    wx.chooseImage({
      sizeType:['original','compressed'],
      success:(result)=>{
        console.log(result);
        this.setData({
          // imgPath:result.tempFilePaths
          // 进行拼接
          imgPath:[...this.data.imgPath,...result.tempFilePaths]
        })
      }
    })
  },
  // 删除选取的图片
  handleDeleteImg(e){
    const {index} = e.currentTarget.dataset;
    let {imgPath} = this.data;
    // 删除数组的index元素
    imgPath.splice(index,1);
    this.setData(
      {imgPath}
    )
  },
  // 发送表白信息
  getContent(){
    this.editorCtx.getContents({
      success:(res)=>{
        console.log("文本：",res,"图片：",this.data.imgPath);
      }
    })
  },
})
