//获取应用实例
const app = getApp()
var route=require("../../utils/route.js")
var utils=require("../../utils/util.js")
Page({
  data: {
    access:false,

  },
  
  onLoad: function (options) {
    let _this=this
    let openid = wx.getStorageSync("openid") ? wx.getStorageSync("openid"):''
    if(openid==''){
      _this.setData({access:true})
    }
  },
  onShow:function(){
    let _this=this
    _this.showCallback()
  },
  showCallback: function () {
    let _this = this
    let allpages = getCurrentPages()
    let thispage = allpages[allpages.length - 1]
    let pageid = thispage.options.pageid ? thispage.options.pageid : "index"
    let apppageid = app.globalData.pageid ? app.globalData.pageid : ""
    route.pageCtrl(_this, pageid)
    wx.hideLoading()
  },
 
  bindGetUserInfo: function (e) {
    let self = this
    if (e.detail.userInfo) {
      let signtype = app.globalData.signtype
      utils.loginaccess(signtype, function () {
        self.setData({ access: true })
        self.checkresume()
        if (self.data.sign) {
          self.checklogsign();
        }
      })
    }
  },
  fn:function(e){
    let _this=this
    route.fn(_this,e)
  },
  


})
