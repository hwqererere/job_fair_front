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
    streetindex:0,
    fulilay:false,
    fulisel:[],
    addfuli:""
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
  },
  inputchangeFn:function(e){
    let type = e.currentTarget.dataset.type ? e.currentTarget.dataset.type : e.target.dataset.type
    let value=e.detail.value
    let ci=this.data.compinfo
    ci[type]=value
    this.setData({conpinfo:ci})
  },
  openfuliconfig:function(){
    let fuliarr=[]
    for (let i = 0; i < this.data.fulilist.length;i++){
      let key=false
      for(let j=0;j<this.data.compinfo.fuli.length;j++){
        if (this.data.fulilist[i].id==this.data.compinfo.fuli[j]){
          key=true
        }
      }
     
        fuliarr[i] = { id: this.data.fulilist[i].id, fuli: this.data.fulilist[i].fuli,check:key}
      
      
    }
    this.setData({ fulisel: fuliarr, fulilay:true})
  },
  itemcheck:function(e){
    let id = e.currentTarget.dataset.id ? e.currentTarget.dataset.id : e.target.dataset.id
    let items = this.data.fulisel

    for(let i=0;i<items.length;i++){
      if (items[i].id == id ){
        if (items[i].check){
          items[i].check=false
        }else{items[i].check=true}

      } 
    }
    this.setData({ fulisel:items})
  },
  fuliselover:function(){
    let comp=this.data.compinfo
    let cont=[]
    for(let i=0;i<this.data.fulisel.length;i++){
      if (this.data.fulisel[i].check){
        cont.push(this.data.fulisel[i].id)
      }
    }
    comp.fuli=cont
    this.setData({ compinfo: comp, fulilay: false})
  },
  newfuli:function(e){
      this.setData({ addfuli: e.detail.value})
  },
  fuliadd:function(){
    let self=this
    utils.requestFn('fuliupdate', { fuli:self.data.addfuli},function(res){
      if(res.code==200){
        wx.removeStorageSync('fuli')
        self.getfuli()
        setTimeout(function(){
          self.openfuliconfig()
        },3000)
        
      }else{
        wx.showToast({
          title:res.msg,
          icon:'none'
        })
      }
    })
  },
  save:function(){
    let self=this
    let compinfo=self.data.compinfo


    compinfo.streetId = self.data.streetlist[self.data.streetindex].id
    utils.requestFn('udcop',compinfo,function(res){
      if(res.code==200){
        wx.showToast({
          title:res.msg
        })
      }
    })

  }
  
})