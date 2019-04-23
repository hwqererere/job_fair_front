const utils = require('../../utils/util')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    workdata:{},

    index:-1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self=this
    if(options.index>=0){
      self.setData({ workdata: app.globalData.resume.workarray_data[options.index],index:options.index})
    }else{
      self.setData({ workdata: { begin: "", end: "", corporate_name:"", corporate_name:""}})
    }
    
  },
  bindDateChange:function(e){
    let self=this
    let type = e.currentTarget.dataset.type ? e.currentTarget.dataset.type : e.target.dataset.type
    let tmp = self.data.workdata
    tmp[type] = e.detail.value
    self.setData({ workdata: tmp })
  },
  
  sub:function(){
    let self=this
    if(self.data.index>=0){
      app.globalData.resume.workarray_data[self.data.index]=self.data.workdata
    }else{
      if (app.globalData.resume.workarray_data){
        app.globalData.resume.workarray_data.push(self.data.workdata)
      }else{
        app.globalData.resume.workarray_data=[]
        app.globalData.resume.workarray_data[0] = self.data.workdata
      }
      
    }
    wx.navigateBack({
      delta: 1
    })
  }
})