const app = getApp()
const utils = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    jobinfo:{},
    latitude: 31.2221754,
    longitude: 121.281587,
    markers: [{
      id: 1,
      latitude: 31.2221754,
      longitude: 121.281587,
      name: '某某公司'
    }],
    toView: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self=this
    self.setData({ jobinfo: app.globalData.jobinfo})
    console.log(app.globalData.jobinfo)
  },
  deli:function(){
    if(wx.getStorageSync('resume')){
      let resume = wx.getStorageSync('resume')
      utils.requestFn('deliUserDeli', { recruitId: app.globalData.jobinfo.id, resumeId: resume.id, openid:wx.getStorageSync('openid')},function(res){
        wx.showToast({
          title: res.msg,
        })
      })
    }else{
      wx.navigateTo({
        url: 'resumeEdit',
      })
    }
  }

  
})