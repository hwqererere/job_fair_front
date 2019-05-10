const utils = require("../../utils/util.js");
Page({
  data: {
    mail:"",
  },
  onLoad: function (options) {

  },
  inputchange:function(e){
    this.setData({mail:e.detail.value})
  },
  sub:function(e){
    let self=this
    wx.showLoading({
      title: '邮件发送中...',
    })
    utils.requestFn("mail", { company_id: wx.getStorageSync('company_id'), email:self.data.mail},function(res){
      if(res.code==200){
        wx.showToast({
          titel:'发送成功',
          icon:"success",
          duration:3000
        })
      }else{
        wx.showToast({
          titel: res.msg,
          icon: "none",
          duration: 3000
        })
      }
      wx.hideLoading();
    })
    
  }
})