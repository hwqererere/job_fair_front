//index.js
//获取应用实例
const app = getApp()
const util=require("../../utils/util.js");
Page({
  data: {
    access:false
  },
  //事件处理函数

  onLoad: function (option) {
    let self = this
    //授权验证
    let signtype = option.signtype ? option.signtype : (wx.getStorageSync('signtype') ? wx.getStorageSync('signtype') : 0)
    app.globalData.signtype = signtype
    let openid = wx.getStorageSync('openid') ? wx.getStorageSync('openid') : ""
    if (openid != "") {
      app.openid = openid
      self.setData({ access: true })
      self.checkresume()
    } else {
      util.loginaccess(signtype, function () {
        self.setData({ access: true })
        self.checkresume()
      })
    }
    
  },

  bindGetUserInfo: function (e) {
    let self = this
    if (e.detail.userInfo) {
      let signtype = app.globalData.signtype
      util.loginaccess(signtype, function () {
        self.setData({ access: true })
        self.checkresume()
      })
    }
   

  },
  checkresume: function () {
    let self=this
    //简历是否已填
    let have_resume = wx.getStorageSync('have_resume') ? 1 : 0
    if (have_resume == 0) {
      wx.navigateTo({
        url: 'resumeEdit',
      })
      // util.requestFn("resumeSelect", { userId: app.openid},function(res){
      //     console.log(res)
      //   })
    }
  },
})
