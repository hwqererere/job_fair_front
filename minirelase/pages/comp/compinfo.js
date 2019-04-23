const app = getApp()
const utils = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    compinfo:{},
    fulilist:[],
    streetlist:[],
    streetindex:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   

  },
  getcompinfo:function(){
    let self = this
    utils.requestFn('company', { company_id: wx.getStorageSync('company_id') }, function (res) {
      if (res.code == 200) {
        let comp = res.data[0] 
        comp.fuli = res.data[0].fuliid.split(",")
        self.setData({ compinfo: comp })
        self.getstreet()
        self.getfuli()
      }
    })
  },
  
  getstreet: function () {
    let self = this
    let streettmp = wx.getStorageSync('street')
    if (!streettmp || (streettmp.update - 0 + 300000) < utils.getsortTime) {
      utils.requestFn('street', {}, function (res) {
        if (res.code == 200) {
          let street = {}
          street.update = utils.getsortTime
          street.list = res.data
          wx.setStorageSync('street', street)
          
          self.setData({ streetlist: street.list })
          self.setstreet()
         
        }
      })
    } else {
      self.setData({ streetlist: streettmp.list })
      self.setstreet()
      
    }

  },
  getfuli: function () {

    let self = this
    let fulitmp = wx.getStorageSync('fuli')
    if (!fulitmp || (fulitmp.update - 0 + 300000) < utils.getsortTime) {
      utils.requestFn('fuli', {}, function (res) {
        if (res.code == 200) {
          let fuli = {}
          fuli.update = utils.getsortTime
          fuli.list = res.data
          wx.setStorageSync('fuli', fuli)
         
          self.setData({ fulilist: fuli.list })
          
        }
      })
    } else {
      
      self.setData({ fulilist: fulitmp.list })
    }
    console.log(self.data.fulilist)
    
  },
  onShow: function () {
    this.getcompinfo()
    
  },
  setstreet(){
    for (let i = 0; i < this.data.streetlist.length;i++){
      if (this.data.streetlist[i].id == this.data.compinfo.streetid){
        this.setData({streetindex:i})
      }
    }    
  },
  streetchange:function(e){
    this.setData({ streetindex: e.detail.value })
  }
})