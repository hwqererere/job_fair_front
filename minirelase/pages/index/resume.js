// pages/resume/index.js
const utils = require('../../utils/util')
const drawQrcode = require('../../lib/weapp.qrcode.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    resume: {},
    reslink: app.globalData.reslink,
    headface:"",
    lib: utils.formlibFn(),
    codelay: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    let resumeId = options.resumeId
    if (resumeId == wx.getStorageSync('openid')) {
      self.setData({ resume: wx.getStorageSync('resume') })
      self.checkheadface(wx.getStorageSync('resume'));
    } else {
      utils.requestFn('resumeSelect', { UserId: wx.getStorageSync('openid') }, function (res) {
        if (res.data.countries.length == 0) {
          app.globalData.addresume = 1
          wx.redirectTo({
            url: 'resumeEdit',
          })
        } else {
          self.setData({ resume: res.data.countries[0].resume })
          self.checkheadface(res.data.countries[0].resume);
        }

      })
    }
    
    console.log(self.data.resume)
  },
  checkheadface:function(resume){
    let self=this
    if (resume.url_id) {
      self.setData({ headface: app.globalData.reslink+"data/" + resume.url_id })
    }
  },
  opencode: function () {
    if (wx.getStorageSync('resume')) {
      this.setData({ codelay: true }, () => {
        let width = wx.getSystemInfoSync().windowWidth
        let size = 500 / 750 * width
        drawQrcode({
          width: size,
          height: size,
          x: 0,
          y: 0,
          canvasId: 'myQrcode',
          typeNumber: 10,
          text: JSON.stringify({ resumeId: wx.getStorageSync('openid') }),
          callback(e) {
            console.log(e)
          }
        })

      })
    }


  },
  closelay: function () {
    this.setData({ codelay: false })
  },
})