// pages/resume/index.js
const utils = require('../../utils/util')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    resume: {},
    reslink: app.globalData.reslink,
    lib: utils.formlibFn()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    
      utils.requestFn('resumeSelect', { UserId: options.openid }, function (res) {
        
          self.setData({ resume: res.data.countries[0].resume })


      })

  },

})