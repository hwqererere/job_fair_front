const utils = require('../../utils/util')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    edudata: {},

    index: -1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    if (options.index >= 0) {
      self.setData({ workdata: app.globalData.resume.leparray_data[options.index], index: options.index })
    } else {
      self.setData({ edudata: { begin: "", end: "", school: "", majoy: "" } })
    }

  },
  bindDateChange: function (e) {
    let self = this
    let type = e.currentTarget.dataset.type ? e.currentTarget.dataset.type : e.target.dataset.type
    let tmp = self.data.edudata
    tmp[type] = e.detail.value
    self.setData({ edudata: tmp })
  },

  sub: function () {
    let self = this
    if (self.data.index >= 0) {
      app.globalData.resume.leparray_data[self.data.index] = self.data.edudata
    } else {
      if (app.globalData.resume.leparray_data) {
        app.globalData.resume.leparray_data.push(self.data.edudata)
      } else {
        app.globalData.resume.leparray_data = []
        app.globalData.resume.leparray_data[0] = self.data.edudata
      }
    }
    wx.navigateBack({
      delta: 1
    })
  }
})