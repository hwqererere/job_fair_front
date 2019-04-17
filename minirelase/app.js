//app.js
App({
  onLaunch: function () {
    let self=this
    var timestamp = new Date().getTime();
    wx.request({
      url: self.globalData.reslink +"style/version?_random=timestamp",
      success:function(res){
      
        let version = wx.getStorageSync('version') ? wx.getStorageSync('version'):0
        if(version<res.data.version){
          wx.removeStorageSync('resume')
          wx.removeStorageSync('have_resume')
          wx.removeStorageSync('openid')
          wx.removeStorageSync('signtype')
          wx.setStorageSync('version', res.data.version)
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    reslink:"https://res-1251120695.cos.ap-shanghai.myqcloud.com/mhjczx/"
  }
})