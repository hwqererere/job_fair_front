const app = getApp()
const utils = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    deli:[],
    reslink: app.globalData.reslink,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    self.getdeli()
  },
  getdeli:function(){
    let self = this
    utils.requestFn('compDeli', { company_id: wx.getStorageSync('company_id') }, function (res) {
      if (res.code == 200) {
        self.setData({ deli: res.data })
      }
    })
  },
  act:function(e){
    let self = this
    let value = e.target.dataset.value ? e.target.dataset.value : e.currentTarget.dataset.value
    let id = e.target.dataset.id ? e.target.dataset.id : e.currentTarget.dataset.id
    utils.requestFn('delistat', { id:id,stat:value},function(){
      self.getdeli()
    })
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