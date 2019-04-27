const utils = require('../../utils/util')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    job: [],
    curr:0,
    jobtmp:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let self = this
    utils.requestFn('deliUserDs', { openid: wx.getStorageSync('openid') }, function (res) {
      if (res.code == 200) {
        self.setData({ jobtmp: res.data })
      } else {
        wx.showToast({
          title: res.msg,
          icon: "none"
        })
      }

    })
  },
  ord:function(e){
    let curr = e.currentTarget.dataset.curr ? e.currentTarget.dataset.curr : e.target.dataset.curr
    self.setData({curr:curr})
    // this.
  }
  
  
})