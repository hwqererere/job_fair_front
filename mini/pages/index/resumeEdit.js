var utils=require('../../utils/util')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    resume:{} ,
    headface: "",
    facechange:false,
    reslink: app.globalData.reslink ,
    lib: utils.formlibFn(),
    saveing:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self=this

    if (wx.getStorageSync('resume')){
      app.globalData.resume = wx.getStorageSync('resume')
    }else{
      app.globalData.resume = {
        id: "",
        userId: app.globalData.openid,
        username: "",
        url_id: "",
        phone: "",
        sex: 1,
        nation: "",
        marital_status: 0,
        identitycard: "",
        birthday: 0,
        education: 0,
        political_status: 0,
        place: 0,
        home_phone: "",
        expected_income: '',
        personnel_type: 0,
        remark: '',
        Job_intention: '',
        person_height: 0,
        province: "上海市",
        city: "上海市",
        county: self.data.lib['county'][0],
        street: self.data.lib['street'][0],
        domicile: "",
        workarray_data: [],
        leparray_data: []
      }
    }

    
    
  },
  onShow:function(){
    let self = this
    self.setshowdata()
  },
  setshowdata:function(){
    let self=this
    self.setData({ resume: app.globalData.resume })
    if (app.globalData.resume.url_id) {
      self.setData({ headface: app.globalData.reslink + "data/" + app.globalData.resume.url_id + "?_time=" + utils.randomTimeFn() })
      if (app.globalData.updatehead){
        self.setData({ headface: app.globalData.resume.url_id })
        
      }
    }
  },
  delarray:function(e){
    let self=this
    let type = e.target.dataset.type ? e.target.dataset.type : e.currentTarget.dataset.type
    let index = e.target.dataset.index ? e.target.dataset.index : e.currentTarget.dataset.index
    app.globalData.resume[type].splice(index,1)
    self.setshowdata()
  },
  eidtworkarray:function(e){
    let index = e.target.dataset.index ? e.target.dataset.index:e.currentTarget.dataset.index
    wx.navigateTo({
      url: 'workarr?index='+index,
    })
  },
  eidteduarray:function(e){
    let index = e.target.dataset.index ? e.target.dataset.index : e.currentTarget.dataset.index
    
    wx.navigateTo({
      url: 'eduarr?index=' + index,
    })
  },
  resumebase:function(){
    wx.navigateTo({
      url: 'resumeBase',
    })
  },
  
  save: function () {
    let self = this
    if (!self.data.saveing){
      self.setData({saving:true})



     
      var Key=""
      var port=""
      let local=wx.getStorageSync("resume")
      if (local.url_id){
        Key = local.url_id
      }
      else{
        Key = utils.getfilename(self.data.headface);
      }
      let tmp=self.data.resume
      tmp.url_id = Key
      utils.requestFn("resumeUpdate", self.data.resume, function (resdata) {
     
        if(resdata.code==200){
          utils.requestFn('resumeSelect', { UserId: wx.getStorageSync('openid') }, function (res) {
            if (res.data.countries.length != 0) {

                wx.setStorageSync('resume', res.data.countries[0].resume)

            } 

          })
          if (app.globalData.updatehead) {
            app.globalData.updatehead = false
            utils.uploadimg(Key, self.data.headface, function () {

              wx.setStorageSync('resume', self.data.resume)
              delete app.globalData.addresume
              wx.navigateBack({ delta: 1 })
            })
          } else {
            wx.setStorageSync('resume', self.data.resume)
            delete app.globalData.addresume
            wx.redirectTo({
              url: 'resume',
            })
          }
        }else{
          self.setData({ saving: true })
        }
          

      })
    }
  },
})