//index.js
//获取应用实例
const app = getApp()
const utils=require("../../utils/util.js");
const drawQrcode=require('../../lib/weapp.qrcode.js');

Page({
  data: {
    access:false,
    reslink: app.globalData.reslink,
    searchItem:0,
    searchOpen:false,
    jobtypelist:[],
    streetlist: [],
    fulilist:[],
    allcounts:[0,0,0],
      job:[],
      page:0,
    searchinfo:{}
      
  },
  //事件处理函数

  onLoad: function (option) {
    let self = this
    let company_id = wx.getStorageSync('company_id') ? wx.getStorageSync('company_id'):""
    // if (company_id){
    //   wx.redirectTo({
    //     url: '../comp/index',
    //   })
    // }
    //授权验证
    let signtype = option.signtype ? option.signtype : (wx.getStorageSync('signtype') ? wx.getStorageSync('signtype') : 0)
    app.globalData.signtype = signtype
    let openid = wx.getStorageSync('openid') ? wx.getStorageSync('openid') : ""
    if (openid != "") {
      app.globalData.openid = openid
      self.setData({ access: true })
      self.checkresume()
    } else {
      utils.loginaccess(signtype, function () {
        self.setData({ access: true })
        self.checkresume()
      })
    }
    self.getstreet();
    self.getfuli();
    self.getjobtype();
  },
  getjobtype:function(){
    let self = this
    let jobtypetmp = wx.getStorageSync('jobtype')
    if (!jobtypetmp || (jobtypetmp.update - 0 + 300000) < utils.getsortTime) {
      utils.requestFn('jobtype', {}, function (res) {
        if (res.code == 200) {
          let jobtype = {}
          jobtype.update = utils.getsortTime
          jobtype.list = res.data
          wx.setStorageSync('jobtype', jobtype)
          let arr = []
          for (let i = 0; i < jobtype.list.length; i++) {
            arr[i] = { id: jobtype.list[i].id, check: 0, txt: jobtype.list[i].job_name }
          }
          self.setData({ jobtypelist: arr })
        }
      })
    } else {
      let arr = []
      for (let i = 0; i < jobtypetmp.list.length; i++) {
        arr[i] = { id: jobtypetmp.list[i].id, check: 0, txt: jobtypetmp.list[i].job_name }
      }
      self.setData({ jobtypelist: arr })
    }  
  },
  getstreet: function () {
    let self = this
    let streettmp = wx.getStorageSync('street')
    let streetupdate=wx.getStorageSync('streetupdate')
    if (!streettmp || (streetupdate - 0 + 300000) < utils.getsortTime) {
      utils.requestFn('street', {}, function (res) {
        if (res.code == 200) {
          let street = {}
          wx.setStorageSync('streetupdate', utils.getsortTime)

          street.list = res.data

          wx.setStorageSync('street', street)
          let arr = []
          for (let i = 0; i < street.list.length; i++) {
            arr[i] = { id: street.list[i].id, check: 0, txt: street.list[i].street_name }
          }
          self.setData({ streetlist: arr })
          
        }
      })
    } else {
      let arr = []
      for (let i = 0; i < streettmp.list.length; i++) {
        arr[i] = { id: streettmp.list[i].id, check: 0, txt: streettmp.list[i].street_name }
      }
      self.setData({ streetlist: arr })
    }    

  },
  getfuli: function () {
    let self=this
    let fulitmp=wx.getStorageSync('fuli')
    let fuliupdate=wx.getStorageSync('fuliupdate')
    if (!fulitmp || (fuliupdate - 0 + 300000) < utils.getsortTime){
      utils.requestFn('fuli', {}, function (res) {
        if(res.code==200){
          let fuli={}
          fuli.update = utils.getsortTime
          wx.setStorageSync('fuliupdate', utils.getsortTime)
          fuli.list=res.data
          wx.setStorageSync('fuli', fuli)
          let arr=[]
          for(let i=0;i<fuli.list.length;i++){
            arr[i] = { id: fuli.list[i].id, check: 0, txt: fuli.list[i].fuli}
          }
          self.setData({fulilist:arr})
        }
      })
    }else{
      let arr=[]
      for (let i = 0; i < fulitmp.list.length; i++) {
        arr[i] = { id: fulitmp.list[i].id, check: 0, txt: fulitmp.list[i].fuli }
      }
      self.setData({ fulilist: arr })
    }    
  },
  onShow: function () {
    this.checkresume()
    this.getlist({})
  },

  getlist:function(data){
    let self=this
    utils.requestFn('recruitInfoSelect', data,function(res){
      let tmp = res.data
      for(let i=0;i<tmp.length;i++){
        if (tmp[i].fuli){
          tmp[i].fuli = tmp[i].fuli.split(";")
        }
        
      }
      self.setData({job:tmp})
    })
  },
  
  bindGetUserInfo: function (e) {
    let self = this
    if (e.detail.userInfo) {
      let signtype = app.globalData.signtype
      utils.loginaccess(signtype, function () {
        self.setData({ access: true })
        self.checkresume()
      })
    }
   

  },
  searchItemChose:function(e){
    let self=this
    let si = e.target.dataset.si ? e.target.dataset.si : e.currentTarget.dataset.si
    if (self.data.searchOpen && si == self.data.searchItem){
      self.setData({ searchOpen: false })      
    }else{
      self.setData({ searchOpen: true, searchItem: si })
    }
  },
  setitem:function(e){
    let self=this
    let id = e.target.dataset.si ? e.target.dataset.id : e.currentTarget.dataset.id
    let type = e.target.dataset.type ? e.target.dataset.type: e.currentTarget.dataset.type
    type=type-0
    let dataitem=[]
    if(type==0){
      dataitem = self.data.jobtypelist
    }else if(type==1){
      dataitem = self.data.fulilist
    }else if(type==2){
      dataitem = self.data.streetlist
    }
    let dataallcounts = self.data.allcounts
    if (dataitem[id].check==1){      
      dataitem[id].check = 0
      dataallcounts[type]--
    }else{     
      dataitem[id].check = 1      
      dataallcounts[type]++
    }
    
    if(type==0){
      self.setData({ jobtypelist: dataitem, allcounts: dataallcounts })
    }else if(type==1){
      self.setData({ fulilist: dataitem, allcounts: dataallcounts })
    }else if(type==2){
      self.setData({ streetlist: dataitem, allcounts: dataallcounts })
    }
    
  },
  reset:function(e){
    let self = this
    let id = e.target.dataset.id ? e.target.dataset.id : e.currentTarget.dataset.id
    let type = id - 0
    let dataitem = []
    if (type == 0) {
      dataitem = self.data.jobtypelist
    } else if (type == 1) {
      dataitem = self.data.fulilist
    } else if (type == 2) {
      dataitem = self.data.streetlist
    }
    let dataallcounts = self.data.allcounts
    for(let i=0;i<dataitem.length;i++){
      dataitem[i].check=0
    }
    dataallcounts[type]=0
    if (type == 0) {
      self.setData({ jobtypelist: dataitem, allcounts: dataallcounts })
    } else if (type == 1) {
      self.setData({ fulilist: dataitem, allcounts: dataallcounts })
    } else if (type == 2) {
      self.setData({ streetlist: dataitem, allcounts: dataallcounts })
    }
  },
  searchitemclick:function(){
    let self=this
    let search={}
    if (self.data.allcounts[0]!=0){
      let job=[]
      for (let i = 0; i < self.data.jobtypelist.length;i++){
        if (self.data.jobtypelist[i].check){
          console.log("aa")
          job.push(self.data.jobtypelist[i].id)
        }
      }

      search.jobId = job.join(",")
    }
    if(self.data.allcounts[2]!=0){
      let street = []
      for (let i = 0; i < self.data.streetlist.length; i++) {
        if (self.data.streetlist[i].check) {
          street.push(self.data.streetlist[i].id)
        }
      }
      search.street = street.join(",")
    }
    if (self.data.allcounts[1] != 0) {
      let fuli = []
      for (let i = 0; i < self.data.fulilist.length; i++) {
        if (self.data.fulilist[i].check) {
          fuli.push(self.data.fulilist[i].id)
        }
      }
      search.fuli = fuli.join(",")
    }
    self.getlist(search)
    self.setData({searchinfo:search, searchOpen:false,page:0})
  },
  nextpage:function(){
    let self = this
    let searchinfo=self.data.searchinfo
    searchinfo.page=self.data.page-0+1
    utils.requestFn('recruitInfoSelect',searchinfo, function (res) {
      let tmp = res.data
      let job=self.data.job
      console.log(self.data.job,tmp.length)
      for (let i = 0; i < tmp.length; i++) {
        if(tmp[i].fuli){
          tmp[i].fuli = tmp[i].fuli.split(";")
        }
        
        
        job.push(tmp[i])
      }
      self.setData({ job: job, page: searchinfo.page })
      console.log(self.data.job)
    })
  },
  linkto:function(e){
    let link = e.target.dataset.link ? e.target.dataset.link : e.currentTarget.dataset.link
    wx.navigateTo({
      url: link,
    })
  },
  
  closelay:function(){
    this.setData({ searchOpen:false,lay:false,codelay:false})
  },
  checkresume: function () {
    let self=this
    //简历是否已填
    let have_resume = wx.getStorageSync('have_resume') ? 1 : 0
    if (have_resume == 0) {
      utils.requestFn('resumeSelect', { UserId: wx.getStorageSync('openid') }, function (res) {console.log(res)
        if(res.data.countries.length!=0){
          wx.setStorageSync('resume', res.data.countries[0].resume)
          wx.setStorageSync('have_resume', wx.getStorageSync('openid') )
          self.setData({ have_resume: true})
        }else{
          self.setData({have_resume:false})
        }
        
      })
    }
  },
  linktojob:function(e){
    let self=this
    let id = e.target.dataset.id ? e.target.dataset.id : e.currentTarget.dataset.id
    for(let i=0;i<self.data.job.length;i++){
      if(self.data.job[i].id==id){
        app.globalData.jobinfo=self.data.job[i]
        wx.navigateTo({
          url: 'positionDetail',
        })
      }
    }
  },
  scan:function(){
    utils.scan(function(res){
      if(res.openid){
        wx.navigateTo({
          url: 'resume?resumeId='
        })
      }else if(res.company_id){

        
      }
    })
  }
})
