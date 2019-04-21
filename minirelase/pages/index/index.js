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
    zhinenglist: [{ check: 0, txt: '决策管理类' }, { check: 0, txt: '人事行政类' }, { check: 0, txt: '财务管理' }, { check: 0, txt: '营销类' }, { check: 0, txt: '技术类' }, { check: 0, txt: '生产服务类' }, { check: 0, txt: '其他' }],
    zhuanqulist: [{ check: 0, txt: '长三角及扶贫专区' }, { check: 0, txt: '莘庄镇' }, { check: 0, txt: '七宝镇' }, { check: 0, txt: '大学生实践和生态环保专区' }, { check: 0, txt: '浦江镇' }, { check: 0, txt: '梅陇镇' }, { check: 0, txt: '虹桥镇' }, { check: 0, txt: '马桥镇' }, { check: 0, txt: '吴泾镇' }, { check: 0, txt: '华漕镇' }, { check: 0, txt: '颛桥镇' }, { check: 0, txt: '江川路街道' }, { check: 0, txt: '新虹街道' }, { check: 0, txt: '古美路街道' }, { check: 0, txt: '浦锦街道' }],
    fulilist:[],
    allcounts:[0,0,0],
      job:[],
      
  },
  //事件处理函数

  onLoad: function (option) {
    let self = this
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
    self.setrandomjob();
    self.getfuli();
  },
  getfuli: function () {
    let self=this
    let fulitmp=wx.getStorageSync('fuli')
    if (!fulitmp || (fulitmp.time - 0 + 300000) < utils.getsortTime){
      utils.requestFn('fuli', {}, function (res) {
        if(res.code==200){
          let fuli={}
          fuli.update = utils.getsortTime
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
    this.getlist()
  },

  getlist:function(){
    let self=this
    utils.requestFn('recruitInfoSelect',{},function(res){
      let tmp = res.data.countries
      for(let i=0;i<tmp.length;i++){
        tmp[i].fuli=tmp[i].fuli.split(";")
      }
      self.setData({job:tmp})
    })
  },
  setrandomjob:function(){
    
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
      dataitem = self.data.zhinenglist
    }else if(type==1){
      dataitem = self.data.fulilist
    }else if(type==2){
      dataitem = self.data.zhuanqulist
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
      self.setData({ zhinenglist: dataitem, allcounts: dataallcounts })
    }else if(type==1){
      self.setData({ fulilist: dataitem, allcounts: dataallcounts })
    }else if(type==2){
      self.setData({ zhuanqulist: dataitem, allcounts: dataallcounts })
    }
    
  },
  reset:function(e){
    let self = this
    let id = e.target.dataset.id ? e.target.dataset.id : e.currentTarget.dataset.id
    let type = id - 0
    let dataitem = []
    if (type == 0) {
      dataitem = self.data.zhinenglist
    } else if (type == 1) {
      dataitem = self.data.fulilist
    } else if (type == 2) {
      dataitem = self.data.zhuanqulist
    }
    let dataallcounts = self.data.allcounts
    for(let i=0;i<dataitem.length;i++){
      dataitem[i].check=0
    }
    dataallcounts[type]=0
    if (type == 0) {
      self.setData({ zhinenglist: dataitem, allcounts: dataallcounts })
    } else if (type == 1) {
      self.setData({ fulilist: dataitem, allcounts: dataallcounts })
    } else if (type == 2) {
      self.setData({ zhuanqulist: dataitem, allcounts: dataallcounts })
    }
  },
  searchitemclick:function(){
    this.setData({ searchOpen:false})
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
      if(res.link){
        wx.navigateTo({
          url: '../resume/index?resumeId='
        })
      }
    })
  }
})
