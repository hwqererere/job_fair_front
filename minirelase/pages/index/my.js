const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    head:"",
    name:"",
    resumeId:wx.getStorageSync("have_resume")
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let resume=wx.getStorageSync('resume')

      this.setData({ head: app.globalData.reslink + "data/" + resume.url_id,name:resume.username})
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

  showresumecode: function () {
    if (!this.data.codelay) {
      this.setData({ lay: true, codelay: true }, () => {
        let have_resume = wx.getStorageSync('have_resume') ? 1 : 0
        if (have_resume == 1) {
          let width = wx.getSystemInfoSync().windowWidth
          let size = 500 / 750 * width
          drawQrcode({
            width: size,
            height: size,
            x: 0,
            y: 0,
            canvasId: 'myQrcode',
            typeNumber: 10,
            text: JSON.stringify({ link: '../resume/index?resumeId=' + wx.getStorageSync('openid') }),
            callback(e) {
              console.log(e)
            }
          })
        }
      })

    } else {
      this.setData({ lay: false, codelay: false })
    }

  },
})