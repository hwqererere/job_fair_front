// pages/index/addHome.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    homeState:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.homeState == "add") {
      this.setData({
        homeState: "添加"
      })
    } else {
      this.setData({
        homeState: "编辑"
      })
    }
  }, 
  backClick: function () {
    wx.redirectTo({
      url: 'resumeEdit',
    })
  },
  saveClick: function () {
    wx.redirectTo({
      url: 'resumeEdit',
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