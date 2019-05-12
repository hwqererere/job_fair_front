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
    lib: utils.formlibFn(),
    deid:0,
    btn:false,
    tipslay:false,
    tip:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    let nobtn = options.nobtn ? options.nobtn:0
    if(!nobtn){
      self.setData({btn:true})
    }
    self.setData({ deid: options.deid})
    utils.requestFn('resumeSelect', { UserId: options.openid }, function (res) {
      self.setData({ resume: res.data.countries[0].resume, })
    })
    utils.requestFn('getdeliverytip',{ id: self.data.deid},function(res){
      if(res.code==200){
        self.setData({tip:res.data})
      }
    })
  },
  del:function(){
    let self = this
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success(res) {
        if (res.confirm) {

          utils.requestFn('delistat', { id: self.data.deid, stat: 2 }, function () {
            wx.showToast({
              title: '操作成功',
              icon: 'success',
              duration: 2000,
              complete:function(){
                wx.redirectTo({
                  url: 'index',
                })
              }
            })
          })
        } else if (res.cancel) {
          
        }
      }
    })
    
  },
  inv:function(){
    let self = this
    wx.showModal({
      title: '提示',
      content: '确定要录用吗？',
      success(res) {
        if (res.confirm) {
          utils.requestFn('delistat', { id: self.data.deid, stat: 4 }, function () {
            wx.showToast({
              title: '操作成功',
              icon: 'success',
              duration: 2000,
              complete:function(){
                wx.redirectTo({
                  url: 'index',
                })
              }
            })
          })
        } else if (res.cancel) {
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 2000,
            
          })
        }
      }
    })
  },
  opentipslay:function(){
    this.setData({ tipslay:true})
  },
  closetipslay:function(){
    this.setData({ tipslay: false })
  },
  tbind:function(e){
    let tip = this.data.tip
    this.setData({ tip: e.detail.value})
   
  },
  savetips:function(){
    let self=this
    utils.requestFn('cdtip', { id: self.data.deid,tip:self.data.tip},function(){
      self.setData({ tipslay: false })
    })
  }
    
})