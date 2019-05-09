const app = getApp()
const utils = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    access: false,
    bondsteps:0,
    bondcompname:"",
    reslink: app.globalData.reslink,
    deli:[],
    delitmp:[],
    scrol:0,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    let self=this
    let signtype = option.signtype ? option.signtype : (wx.getStorageSync('signtype') ? wx.getStorageSync('signtype') : 0)
    app.globalData.signtype = signtype
    let openid = wx.getStorageSync('openid') ? wx.getStorageSync('openid') : ""
    if (openid != "") {
      app.globalData.openid = openid
      self.setData({ access: true })
      self.checkcompbond(function(){
          self.getdeInSe_ReCo()
        })

    } else {
      utils.loginaccess(signtype, function () {
        self.setData({ access: true })
        
      })
    }



    if (!wx.getStorageSync('openid')){
      utils.loginaccess(1,function(){
        self.checkcompbond(function () {
          self.getdeInSe_ReCo()
        })
      })
    }
  },
  
  bindGetUserInfo: function (e) {
    let self = this
    if (e.detail.userInfo) {
      let signtype = app.globalData.signtype
      utils.loginaccess(signtype, function () {
        self.setData({ access: true })
        if (!wx.getStorageSync('openid')) {
          utils.loginaccess(1, function () {
            self.checkcompbond(function () {
              self.getdeInSe_ReCo()
            })
          })
        } else {
          if (!wx.getStorageSync('company_id')) {
            self.checkcompbond(function () {
              self.getdeInSe_ReCo()
            })
          }

        }
      })
    }


  },
  checkcompbond:function(callback){
    let self=this
    utils.requestFn('compBund', { user_id:wx.getStorageSync('openid')},function(res){
      if(res.code==200){
        wx.removeStorageSync('company_id')
        self.setData({ bondsteps:1})
      }else if(res.code==300){
        wx.setStorageSync('company_id',res.data[0].company_id)
        callback.call(this)
        self.setData({ bondsteps: 0 })
      }else if(res.code==400){
        wx.removeStorageSync('company_id')
        self.setData({ bondsteps: 1 })
      }else{
        wx.removeStorageSync('company_id')
        self.setData({ bondsteps: 1 })
        wx.showToast({
          title:res.msg,
          icon:"none"
        })
      }
    })
  },
  getdeInSe_ReCo:function(){//获取投递简历，未标示
    let self=this
    utils.requestFn('compDeli',{company_id:wx.getStorageSync('company_id')},function(res){
      if(res.code==200){
        
        self.setData({deli:res.data,delitmp:res.data})
      }
    })
  },

  bindinput:function(e){
    let self=this
    let type = e.currentTarget.dataset.type ? e.currentTarget.dataset.type : e.target.dataset.type
    let obj={}
    obj[type] =e.detail.value
    self.setData(obj)
  },
  bondstep:function(){
    let self=this
    if (self.data.bondsteps==1){
      utils.requestFn('compUpdUseCom', { companyName: self.data.bondcompname, userId: wx.getStorageSync('openid') }, function (res) {
        if (res.code == 200) {
          wx.setStorageSync("company_id",res.data[0].company_id)
          self.setData({ bondsteps: 2 })
        } else {
          wx.showToast({
            title: res.msg,
            icon:'none'
          })
        }

      })
    } else if (self.data.bondsteps==2){
      self.setData({ bondsteps: 0 })
      self.getdeInSe_ReCo()
    }
    
  },
  onShow:function(){
    if(wx.getStorageSync('company_id')){
      this.getdeInSe_ReCo()
    }
    
  },
  
  scan:function(){
    utils.scan(function(res){
      if(res.resumeId){
        utils.requestFn('sign', {}, function () { })
        wx.navigateTo({
          url: 'resume?openid='+res.resumeId
        })
      }
    })
  },
  notopen:function(){
    wx.showToast({
      title:"招聘会未开始",
      icon:"none"
    })
  },
  scr:function(e){
    let self=this
    let val = e.currentTarget.dataset.val ? e.currentTarget.dataset.val : e.target.dataset.val
    self.setData({scrol:val})
    let newdeli=[]
    if(val==0){
      newdeli=self.data.delitmp
    }    
    for(let i=0;i<self.data.delitmp.length;i++){
      if(val==1 && self.data.delitmp[i].status==1){
        newdeli.push(self.data.delitmp[i])
      }else if(val==2 && self.data.delitmp[i].status==4){
        newdeli.push(self.data.delitmp[i])
      }
    }
    self.setData({deli:newdeli})
  }
})