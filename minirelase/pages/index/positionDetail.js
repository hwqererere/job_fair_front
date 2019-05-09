const app = getApp()
const utils = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    jobinfo:{},
    deli:false,
    fav:false,
    time:"",
    timelay:false

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self=this
    self.setData({ jobinfo: app.globalData.jobinfo})
    self.checkdeli_fav()

   
    
    
    this.getDate();
    
  },
  tow:function(n){
    return n >= 0 && n < 10 ? '0' + n : '' + n;
  },
  getDate:function(){
    let self=this
    let oDate = new Date();
    let oldTime = oDate.getTime();
    let newDate = new Date('2019/5/11 13:15:00');
    let newTime = newDate.getTime();
    let second = Math.floor((newTime - oldTime) / 1000);
    if(second>0){
      let day = Math.floor(second / 86400);
      second = second % 86400;
      let hour = Math.floor(second / 3600);
      second %= 3600;
      let minute = Math.floor(second / 60);
      second %= 60;
      let str = this.tow(day) + '天' + this.tow(hour) + '小时' + this.tow(minute) + '分钟' + this.tow(second) + '秒';
      this.setData({ time: str,timelay:true })
      setTimeout(function(){self.getDate()},1000)
    }else{
      this.setData({timelay:false})
    }
    
  },
  checkdeli_fav:function(){
    let self=this
    if (wx.getStorageSync('deli')){
      let deli = wx.getStorageSync('deli')
      for(let i=0;i<deli.length;i++){
        if(deli[i].id==self.data.jobinfo.id){
          self.setData({deli:true})
        }
      }
    }
    if(wx.getStorageSync('fav')){
      let fav = wx.getStorageSync('fav')
      for (let i = 0; i < fav.length; i++) {
        if (fav[i].id == self.data.jobinfo.id) {
          self.setData({ fav: true })
        }
      }
    }
   
    
  },
  deliFn:function(){
    let self=this
    if(!self.data.deli){
      if (wx.getStorageSync('resume')){
        let resume = wx.getStorageSync('resume')
        utils.requestFn('deliUserDeli', { recruitId: app.globalData.jobinfo.id, resumeId: resume.id, openid: wx.getStorageSync('openid') }, function (res) {
          wx.showToast({
            title: res.msg,
          })
          if (wx.getStorageSync('deli')) {
            let deli = wx.getStorageSync('deli')
            deli.push(app.globalData.jobinfo)
            wx.setStorageSync('deli', deli)
          } else {
            let deli = []
            deli[0] = app.globalData.jobinfo
            wx.setStorageSync('deli', deli)

          }
          self.setData({ deli: true })
        })
      } else {
        wx.navigateTo({
          url: 'resumeEdit',
        })
      }
      
    }
  },
  favFn:function(){
    let self = this
    if(self.data.fav){
      let fav = wx.getStorageSync('fav')
      let newfav=[]
      for(let i=0;i<fav.length;i++){
        if (fav[i].id != self.data.jobinfo.id){
          newfav.push(fav[i])
        }
      }
      wx.setStorageSync('fav',newfav)
      self.setData({ fav: false })
    }else{
      if (wx.getStorageSync('fav')) {
        let fav = wx.getStorageSync('fav')
        fav.push(app.globalData.jobinfo)
        wx.setStorageSync('fav', fav)
      } else {
        let fav = []
        fav[0] = app.globalData.jobinfo
        wx.setStorageSync('fav', fav)

      }
      self.setData({ fav: true })
    }
    

  }

  
})