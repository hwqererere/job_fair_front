const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    job:[]
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
    this.setData({ job: wx.getStorageSync('fav')})
    console.log(this.data.job)
  },
  linktojob: function (e) {
    let self = this
    let id = e.target.dataset.id ? e.target.dataset.id : e.currentTarget.dataset.id
    let fav=wx.getStorageSync('fav')
    for (let i = 0; i < fav.length; i++) {
      if (fav[i].id == id) {
        app.globalData.jobinfo = fav[i]
        wx.navigateTo({
          url: 'positionDetail',
        })
      }
    }
  },
})