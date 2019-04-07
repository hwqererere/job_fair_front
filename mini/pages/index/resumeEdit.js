// pages/index/resumeEdit.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    workState: true,
    trainState: true,
    homeState: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  addWorkClick:function(){
     wx.redirectTo({
       url: 'addWork?workState=add',
     })
  },
  editWorkClick: function () {
    wx.redirectTo({
      url: 'addWork?workState=edit',
    })
  },
  addTrainClick: function () {
    wx.redirectTo({
      url: 'addTrain?trainState=add',
    })
  },
  editTrainClick: function () {
    wx.redirectTo({
      url: 'addTrain?trainState=edit',
    })
  },
  addHomeClick: function () {
    wx.redirectTo({
      url: 'addHome?homeState=add',
    })
  },
  editHomeClick: function () {
    wx.redirectTo({
      url: 'addHome?homeState=edit',
    })
  },
  backClickFun:function(){
    wx.navigateBack({ delta: 1 })
    // wx.redirectTo({
    //   url: 'resume'
    // })
  },
})