Page({

  /**
   * 页面的初始数据
   */
  data: {
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

  },
  jumpTo: function (e) {
    var id = e.currentTarget.dataset.opt;
    console.log(id)
    this.setData({
      toView: id
    })
  },
  backClick: function () {
    wx.reLaunch({
      url: 'index'
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