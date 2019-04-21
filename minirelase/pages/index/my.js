const app = getApp()
const utils = require("../../utils/util.js");
const drawQrcode = require('../../lib/weapp.qrcode.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    head:"",
    name:"",
    codelay: false,
    resumeId: wx.getStorageSync('resume'),
    resume:wx.getStorageSync('resume')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let resume=wx.getStorageSync('resume')

      this.setData({ head: app.globalData.reslink + "data/" + resume.url_id,name:resume.username})
  },
  link:function(e){
    let link = e.currentTarget.dataset.link ? e.currentTarget.dataset.link : e.target.dataset.link
    wx.navigateTo({
      url: link,
    })
  },

  closelay:function(){
    this.setData({ codelay: false })
  },
  opencode: function () {
    if(wx.getStorageSync('resume')){
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
    }else{
      wx.navigateTo({
        url: 'resumeEdit',
      })
    }
    

  },
})