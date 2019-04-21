const app = getApp()
const utils = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bondstep:0,
    bondcompname:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self=this
    if (!wx.getStorageSync('openid')){
      utils.loginaccess(1,function(){
        self.checkcompbond(function(){})
      })
    }else{
      self.checkcompbond(function () { })
    }
  },
  checkcompbond:function(callback){
    let self=this
    utils.requestFn('compBund', { user_id:wx.getStorageSync('openid')},function(res){
      if(res.code==200){
        self.setData({ bondstep:1})
        callback.call(this)
      }else if(res.code==400){
        
      }else{
        wx.showToast({
          title:res.code,
          icon:"none"
        })
      }
    })
  },
  bindinput:function(e){
    let self=this
    let type = e.currentTarget.dataset.type ? e.currentTarget.dataset.type : e.target.dataset.type
    let obj={}
    obj[type] =e.detail.value
    self.setData(obj)
  },
  bondstep:function(){
    let self=this
    utils.requestFn('compUpdUseCom', { companyName: self.data.bondcompname, user_id: wx.getStorageSync('openid')},function(res){
      console.log(res)
    })
  },
})