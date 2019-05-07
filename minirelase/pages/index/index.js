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
    searchinfo:{},
    top:1,
    pay:{minx:0,maxx:0,minpay:'不限',maxpay:'不限'},
    sign:false,
    loginlay:false
  },
  //事件处理函数

  onLoad: function (option) {
    let self = this
    if(option.sign){
      console.log("aaa")
      self.setData({sign:true})
    }
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
    self.getlist({})
  },
  scrolltopset:function(){
    if(this.data.top==3){
      this.setData({ top: 2 })
    }
    
  },
  scrolldownset: function (e) {
    if(e.detail.scrollTop>120){
      if (this.data.top != 3) {
        this.setData({ top: 3 })
      }
    }

   
   
  },
  checklogsign: function () {
    let self=this
    if (wx.getStorageSync('openid')) {
      if (!wx.getStorageSync('login')) {
        utils.requestFn('recruitsign', { openid: wx.getStorageSync('openid') }, function (res) {
          if (res.code == 200) {
            self.setData({ loginlay: true })
            wx.setStorageSync('login',1)
            setTimeout(function(){
              self.setData({ loginlay: false })
            },3000)
          } else {
            if (openid == "oCbNK5HvXHAlhMqPiDupn6y4BRCY") {
              wx.showToast({
                title: res.msg,
                icon: 'none',
                duration: 1000
              })
            }
          }
        })
      }
    }
  },
  closeloginlay:function(){
    self.setData({ loginlay: false })
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

      utils.requestFn('street', {}, function (res) {
        if (res.code == 200) {
          let street = {}
          wx.setStorageSync('streetupdate', utils.getsortTime())

          street.list = res.data

          wx.setStorageSync('street', street)
          let arr = []
          for (let i = 0; i < street.list.length; i++) {
            arr[i] = { id: street.list[i].id, check: 0, txt: street.list[i].street_name }
          }
          self.setData({ streetlist: arr })
          
        }
      })
    

  },
  getfuli: function () {
    let self=this
    let fulitmp=wx.getStorageSync('fuli')
    let fuliupdate=wx.getStorageSync('fuliupdate')
    
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
    
  },
  onShow: function () {
    this.checkresume()
  
  },

  getlist:function(data){
    let self=this
    utils.requestFn('recruitInfoSelect', data,function(res){
      let tmp = res.data
      if(tmp){
        for (let i = 0; i < tmp.length; i++) {
          if (tmp[i].fuli) {
            tmp[i].fuli = tmp[i].fuli.split(";")
          }

        }
        self.setData({ job: tmp })
      }
      
      
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
      self.setData({pay:{minx:0,maxx:0,minpay:'不限',maxpay:'不限'}})
      let search=self.data.searchinfo
      if(search.maxpay){
        delete search.maxpay
      }
      if(search.minpay){
        delete search.minpay
      }
      console.log(self.data.pay)
      self.setData({searchinfo:search})
    } else if (type == 1) {
      dataitem = self.data.fulilist
    } else if (type == 2) {
      dataitem = self.data.streetlist
    }
    if(type!=0){
      let dataallcounts = self.data.allcounts
      for(let i=0;i<dataitem.length;i++){
        dataitem[i].check=0
      }
      dataallcounts[type]=0
      if (type == 0) {
      } else if (type == 1) {
        self.setData({ fulilist: dataitem, allcounts: dataallcounts })
      } else if (type == 2) {
        self.setData({ streetlist: dataitem, allcounts: dataallcounts })
      }
    }
    
  },
  searchitemclick:function(){
    let self=this
    let search={}
    if (self.data.pay.minx!=0){
      search.minpay=self.data.pay.minpay
    }
    if(self.data.pay.maxx!=0){
      search.maxpay=self.data.pay.maxpay
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
     
      for (let i = 0; i < tmp.length; i++) {
        if(tmp[i].fuli){
          tmp[i].fuli = tmp[i].fuli.split(";")
        }
        
        
        job.push(tmp[i])
      }
      self.setData({ job: job, page: searchinfo.page })
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
      utils.requestFn('resumeSelect', { UserId: wx.getStorageSync('openid') }, function (res){
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
    let self=this
    utils.scan(function(res){
      if(res.openid){
        wx.navigateTo({
          url: 'resume?resumeId='
        })
      }else if(res.company_id){
        let search={}
        search.company_id=res.company_id
        self.setData({searchinfo:search})
        self.getlist(search)
      }
    })
  },
  searchval:function(e){
    let val=e.detail.value
    let searchinfo=this.data.searchinfo;
    searchinfo.jobName=val
    searchinfo.page=0
    this.setData({searchinfo:searchinfo})
  },
  search:function(){
    let searchinfo=this.data.searchinfo
    this.getlist(searchinfo)
  },
  paychange:function(e){
    let self=this
    let lib=[1000,3000,5000,7000,9000,11000,13000,15000,17000,19000]
    let max=480/2;
    let type = e.target.dataset.t ? e.target.dataset.t : e.currentTarget.dataset.t
    let val=e.detail.x
    let pay=this.data.pay

    let numa=val / max * 10
    let num=(numa+"").split(".")
    num=num[0]-0
    if(type=="min"){
      pay.minx=val
      pay.minpay=lib[num]
      if(val==0){
        if(self.data.searchinfo.minpay){

        }
      }
    }else{
      pay.maxx=val
      pay.maxpay=lib[num]

    }
    this.setData({pay:pay})
  }
})
