// pages/resume/index.js
const utils=require('../../utils/util')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    resume:{},
    reslink: app.globalData.reslink,
    lib: utils.formlibFn()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self=this
    let resumeId = options.resumeId
    if(resumeId==wx.getStorageSync('openid')){
      self.setData({resume:wx.getStorageSync('resume')})
    }else{
      utils.requestFn('resumeSelect', { UserId: wx.getStorageSync('openid') }, function (res) {
        self.setData({ resume: res.data.countries[0].resume})
      })
    }
    console.log(self.data.resume)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})