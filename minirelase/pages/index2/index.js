//获取应用实例
const app = getApp()
var route=require("../../utils/route.js")
var model=require("../../utils/model.js")
var utils=require("../../utils/util.js")
Page({
  data: {
    access:true,
    addtomyminiprogram:false,    
    pageid:"",
    tips:"",
    animate:"",
    nickName:"",
    nobgm:"0",
    floatedData:{id:""},
    indexData:{},
    rankData:{},
    getcoinData:{},
    cashData:{},
    cashlistData:{},
    morepageData:{},
    ad:0
  },
  
  onLoad: function (options) {
    let _this=this
    let nickName=wx.getStorageSync("nickName")?wx.getStorageSync("nickName"):''
    _this.setData({nickName:nickName})

    let pageid=options.pageid?options.pageid:""
    if(pageid==""){
      app.globalData.timeing=0;
      utils.setconfigdata(options,function(){
        route.getUrlData(_this,options,function(){
          _this.showCallback()
        })
      })
    }  
    _this.showad()
  },
  onShow:function(){
    let _this=this
    let user_id=app.globalData.user_id?app.globalData.user_id:""
    if(user_id==""){
      app.globalData.user_id=wx.getStorageSync("user_id")+""
      user_id=wx.getStorageSync("user_id")+""
    }
    if(user_id!=""){
      _this.showCallback()
    }
    
  },

 
  bindgetUserInfo: function(e) {
    let _this=this
    route.bindUserInfo(_this,e)
  },
  fn:function(e){
    let _this=this

    route.fn(_this,e)
  },
  


})
