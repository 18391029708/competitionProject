// components/imgList/imgList.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    pictures: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 图片预览
    previewImg(e) {
      // preindex是confession对应confessions的下标
      // index是图片对应confessions[preindex].pictures[index]
      const { index } = e.currentTarget.dataset;
      console.log(this.data);
      wx.previewImage({
        current: this.data.pictures[index],
        urls: this.data.pictures
      })
    },
  }
})
