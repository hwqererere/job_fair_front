const app = getApp()
const utils = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    jobinfo:{},
    deli:false,
    fav:false
    // latitude: 31.2221754,
    // longitude: 121.281587,
    // markers: [{
    //   id: 1,
    //   latitude: 31.2221754,
    //   longitude: 121.281587,
    //   name: '某某公司'
    // }],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self=this
    self.setData({ jobinfo: app.globalData.jobinfo})
    self.checkdeli_fav()
  },
  checkdeli_fav:function(){
    let self=this
    if (wx.getStorageSync('deli')){
      let deli = wx.getStorageSync('deli')
      for(let i=0;i<deli.length;i++){
        if(deli[i].id==self.data.jobinfo.id){
          self.setData({deli:true})
        }
      }
    }
    if(wx.getStorageSync('fav')){
      let fav = wx.getStorageSync('fav')
      for (let i = 0; i < fav.length; i++) {
        if (fav[i].id == self.data.jobinfo.id) {
          self.setData({ fav: true })
        }
      }
    }
   
    
  },
  deli:function(){
    let self=this
    if(wx.getStorageSync('resume') && !self.data.deli){
      let resume = wx.getStorageSync('resume')
      utils.requestFn('deliUserDeli', { recruitId: app.globalData.jobinfo.id, resumeId: resume.id, openid:wx.getStorageSync('openid')},function(res){
        wx.showToast({
          title: res.msg,
        })
        if (wx.getStorageSync('deli')) {
          let deli = wx.getStorageSync('deli')
          deli.push(app.globalData.jobinfo)
          wx.setStorageSync('deli',deli)
        }else{
          let deli=[]
          deli[0] = app.globalData.jobinfo
          wx.setStorageSync('deli', deli)
          
        }
        self.setData({ deli: true })
      })
    }else{
      wx.navigateTo({
        url: 'resumeEdit',
      })
    }
  }

  
})