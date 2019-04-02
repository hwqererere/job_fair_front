const app = getApp()
const util = require("../../utils/util.js")
Page({
  data: {
   access:false
  },

  onLoad: function (option) {
    let self=this
    
    let signtype = option.signtype ? option.signtype : (wx.getStorageSync('signtype')? wx.getStorageSync('signtype') : 0)
    app.globalData.signtype = signtype
    let openid = wx.getStorageSync('openid') ? wx.getStorageSync('openid'):""
    if(openid!=""){
      app.openid = openid
      self.setData({access:true})
    }else{
      util.loginaccess(signtype,function(){
        self.setData({ access: true })
      })
    }

  },
  bindGetUserInfo: function(e) {
    let self = this
    if (e.detail.userInfo) {
      let signtype=app.globalData.signtype 
      util.loginaccess(signtype, function () {
        self.setData({ access: true })
      })
    }

    
  }

  



})
