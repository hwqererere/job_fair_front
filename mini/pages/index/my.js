// pages/index/my.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
  },
  link:function(e){
    let link = e.currentTarget.dataset.link ? e.currentTarget.dataset.link : e.target.dataset.link
    wx.navigateTo({
      url: link,
    })
  },



  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let openid = wx.getStorageSync('openid') ? wx.getStorageSync('openid') : ""
    if (openid == "") {
      wx.switchTab({
        url: 'index'
      })
    } 
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})