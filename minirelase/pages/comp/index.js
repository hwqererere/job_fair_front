const app = getApp()
const utils = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bondsteps:0,
    bondcompname:"",
    reslink: app.globalData.reslink,
    deli:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self=this
    if (!wx.getStorageSync('openid')){
      utils.loginaccess(1,function(){
        self.checkcompbond(function(){
          self.getdeInSe_ReCo()
        })
      })
    }else{
      if(!wx.getStorageSync('company_id')){
        self.checkcompbond(function () {
          self.getdeInSe_ReCo()
        })
      }else{
        self.getdeInSe_ReCo()
      }
      
    }
  },
  checkcompbond:function(callback){
    let self=this
    utils.requestFn('compBund', { user_id:wx.getStorageSync('openid')},function(res){
      if(res.code==200){
        self.setData({ bondsteps:1})
      }else if(res.code==400){
        self.setData({ bondsteps: 1 })
      }else{
        self.setData({ bondsteps: 1 })
        wx.showToast({
          title:res.msg,
          icon:"none"
        })
      }
    })
  },
  getdeInSe_ReCo:function(){//获取投递简历，未标示
    let self=this
    utils.requestFn('compDeli',{company_id:wx.getStorageSync('company_id')},function(res){
      if(res.code==200){
        
        self.setData({deli:res.data})
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
    if (self.data.bondsteps==1){
      utils.requestFn('compUpdUseCom', { companyName: self.data.bondcompname, userId: wx.getStorageSync('openid') }, function (res) {
        if (res.code == 200) {
          wx.setStorageSync("company_id",res.data.company_id)
          self.setData({ bondsteps: 2 })
        } else {
          wx.showToast({
            title: res.msg,
          })
        }

      })
    } else if (self.data.bondsteps==2){
      self.setData({ bondsteps: 0 })
      self.getdeInSe_ReCo()
    }
    
  },
})