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
    region: ['广东省', '广州市', '海珠区'],
    streetindex:0,
    countyindex:0,
    over_date:"",
    start_date:"",
    end_date:"",
    reslink: app.globalData.reslink ,
    lib: utils.formlibFn(),
    exptmp:{corporate_name:"",work_name:"",start_date:"",end_date:""},
    edutmp: { school_name: "", major: "", start_date: "", end_date: "" },
    exptype:-1,//-1为新增
    workState: false,
    educState: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self=this
    if (app.globalData.addresume){
      self.setData({
        resume: {
          id:"",
          userId: app.globalData.openid,
          username: "",
          url_id: "",
          phone: "",
          sex: 1,
          nation: "",
          postal_code: "",
          marital_status: 0,
          identitycard: "",
          education: 0,
          age:0,
          political_status: 0,
          place: 0,
          home_phone: "",
          expected_income: '',
          personnel_type: 0,
          technical_title: "",
          working_life: '',
          remark: '',
          strong_point: '',
          Job_intention: '',
          person_height:0,
          weight:0,
          province: self.data.region[0],
          city: self.data.region[1],
          county: self.data.lib['county'][0],
          street: self.data.lib['street'][0],
          domicile: "",
          job_intention: "",
          workarray_data: [],
          leparray_data: []
        }
      })
    }else{
      let rstmp=wx.getStorageSync('resume')
      let rs={}
      rs=rstmp;
      self.setData({ resume: rs, headface: app.globalData.reslink +"data/"+rs.url_id+"?_time="+utils.randomTimeFn()})
    }
    
    


  },
  updateface:function(){
    let self=this
    wx.chooseImage({
      count: 1,
      camera: 'back',
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var filePath = res.tempFilePaths[0];
        if (filePath) {
          // set_resume.headface = "https://" + res.Location
          self.setData({
            headface: filePath,
            facechange:true
          })
        }
      }
    })
  },
  
  bindPickerChange:function(e){
    let self=this
    let type=e.target.dataset.type
    let value=e.detail.value
    self.setData({ resume: utils.resume_set(self,self.data.resume,type,value)})
    if(type=='place'){
      if(value!=2){
        self.setData({ resume: utils.resume_set(self,self.data.resume,'province','上海市')})
        self.setData({ resume: utils.resume_set(self,self.data.resume,'city','上海市')})
        self.setData({ resume: utils.resume_set(self,self.data.resume,'county','闵行区')})
      }
    }

  },
  input_text:function(e){
    let self=this
    let type=e.target.dataset.type
    let value=e.detail.value
    self.setData({ resume: utils.resume_set(self,self.data.resume,type,value)})

  },
  bindRegionChange:function(e){
    let self=this
    self.setData({
      region: e.detail.value
    })
    self.setData({ resume: utils.resume_set(self,self.data.resume,'province',e.detail.value[0])})
    self.setData({ resume: utils.resume_set(self,self.data.resume,'city',e.detail.value[1])})
    self.setData({ resume: utils.resume_set(self,self.data.resume,'county',e.detail.value[2])})
  },

  addlist:function(e){
    let self=this
    let time=new Date(); 
    let open = e.currentTarget.dataset.open ? e.currentTarget.dataset.open : e.target.dataset.open
    if (open =='workState'){
      self.setData({ workState: true})
    }else{
      self.setData({ educState: true })
    }
    self.setData({      
      over_date:utils.formatTime(time),
      start_date:utils.formatTime(time),
      end_date:utils.formatTime(time)
    })
    let type = e.currentTarget.dataset.type ? e.currentTarget.dataset.type:e.target.dataset.type
    self.setData({ exptype: type })
    if (type ==-1){     
      if(self.data.workState){
        self.setData({ exptmp: { corporate_name: "", work_name: "", start_date: self.data.start_date, end_date: self.data.end_date } })
      }else{
        self.setData({ edutmp: { school_name: "", major: "", start_date: self.data.start_date, end_date: self.data.end_date }})
      }      
    } else {
      if(self.data.workState){
        self.setData({ exptmp: self.data.resume.workarray_data[type], exptype: type })
      }else{
        self.setData({ edutmp: self.data.resume.leparray_data[type], exptype: type })
      }
    }
  },
   bindDateChange(e) {
    let self=this
    let type=e.target.dataset.type
    if (self.data.educState) {    
     
      if (type == 'begin') {
        self.setData({ start_date: e.detail.value })
        self.setData({ edutmp: { school_name: self.data.edutmp.school_name, major: self.data.edutmp.major, start_date: e.detail.value, end_date: self.data.edutmp.end_date }})
      }else{
         self.setData({ end_date: e.detail.value })
         self.setData({ edutmp: { school_name: self.data.edutmp.school_name, major: self.data.edutmp.major, start_date: self.data.edutmp.start_date, end_date: e.detail.value} })
      }      
    }else{
      
      if (type == 'begin'){
        self.setData({ start_date: e.detail.value })
        self.setData({ exptmp: { corporate_name: self.data.exptmp.corporate_name, work_name: self.data.exptmp.work_name, start_date: e.detail.value, end_date: self.data.exptmp.end_date } })
      }else{
        self.setData({ end_date: e.detail.value })
        self.setData({ exptmp: { corporate_name: self.data.exptmp.corporate_name, work_name: self.data.exptmp.work_name, start_date: self.data.exptmp.start_date , end_date: e.detail.value } })
      }      

     
    }
  },
  input_tmp:function(e){
    let self = this    
    let type=e.target.dataset.type
    let value=e.detail.value
    if (self.data.educState){
      self.setData({ edutmp: utils.resume_set(self, self.data.edutmp, type, value) })
    }else{
      self.setData({ exptmp: utils.resume_set(self, self.data.exptmp, type, value) })
    }    
  },

  listcancel:function(){
    let self = this
    if (self.data.workState){
      self.setData({ workState: false })
      self.setData({ exptmp: utils.resume_set(self, self.data.exptmp, 'corporate_name', '') })
      self.setData({ exptmp: utils.resume_set(self, self.data.exptmp, 'work_name', '') })
    }else{
      self.setData({ educState: false })
      self.setData({ exptmp: utils.resume_set(self, self.data.exptmp, 'school_name', '') })
      self.setData({ exptmp: utils.resume_set(self, self.data.exptmp, 'major', '') })
    }
    
  },
  listsub:function(){
    let self=this
    if (self.data.workState){
      if (self.data.exptmp.corporate_name == "") {
        wx.showToast({ title: '请填写公司', icon: 'none', duration: 2000 })
      } else if (self.data.exptmp.work_name == "") {
        wx.showToast({ title: '请填写职位', icon: 'none', duration: 2000 })
      } else {
        if (self.data.exptype == -1) { 
          let len = self.data.resume.workarray_data ? self.data.resume.workarray_data.length:0
          let workarray_data = utils.arrReplace(self.data.resume.workarray_data, len, self.data.exptmp)        
          let set_resume = self.data.resume
          set_resume.workarray_data = workarray_data
          self.setData({ resume: set_resume })           
        } else {
          let workarray_data = utils.arrReplace(self.data.resume.workarray_data, self.data.exptype, self.data.exptmp)
          workarray_data[self.data.exptype] = self.data.exptmp
          self.setData({ resume: utils.resume_set(self, self.data.resume, 'workarray_data', workarray_data) })
         
        }        
        self.setData({ workState: false }) 
      }
    }else{
      if (self.data.edutmp.school_name == "") {
        wx.showToast({ title: '请填写培训单位', icon: 'none', duration: 2000 })
      } else {
        let setresume = self.data.resume
        if (self.data.exptype == -1) {
          let len = setresume.leparray_data? setresume.leparray_data.length:0
          let leparray_data = utils.arrReplace(self.data.resume.leparray_data, len, self.data.edutmp)
          let set_resume = self.data.resume
          set_resume.leparray_data = leparray_data
          self.setData({ resume: set_resume }) 
        } else {
          setresume.leparray_data[self.data.exptype] = self.data.edutmp
        }
        self.setData({ resume: setresume, educState: false })
      }
    }
  },
  delsub:function(){
    let self=this
    let set_resume = self.data.resume
    if (self.data.workState){      
      set_resume.workarray_data.splice(self.data.exptype,1)
      self.setData({ resume: set_resume, workState: false })
    }else{
      set_resume.leparray_data.splice(self.data.exptype, 1)
      self.setData({ resume: set_resume, educState: false })
    }
  },
  checksave:function(){
    let self=this
    let re=true
    if (self.data.headface==''){
      re = false
      wx.showToast({ title: '请上传照片', icon: "none", duration: 2000 })
    }
    if(self.data.resume.username==''){
      re=false
      wx.showToast({ title: '请填写姓名', icon: "none", duration: 2000})
    }
    if (self.data.resume.phone==''){
      re = false
      wx.showToast({ title: '请填写手机', icon: "none", duration: 2000 })
    }
    if (self.data.resume.identitycard == '') {
      re = false
      wx.showToast({ title: '请填写身份证', icon: "none", duration: 2000 })
    }
    if (self.data.resume.age == '') {
      re = false
      wx.showToast({ title: '请填写年龄', icon: "none", duration: 2000 })
    }
    if(self.data.resume.domicile == '') {
      re = false
      wx.showToast({ title: '请填写现住地址', icon: "none", duration: 2000 })
    }
    return re
  },
  save: function () {
    let self = this
    console.log(self.checksave())
    if (self.data.headface != "" && self.checksave()) {
     
      var Key=""
      var port=""
      if(app.globalData.addresume){
        Key = utils.getfilename(self.data.headface);
        port ='resumeCreate'
      }else{
        Key=self.data.resume.url_id
        port = 'resumeUpdate'
      }
      
      self.setData({ resume: utils.resume_set(self, self.data.resume, 'url_id', Key) })
      utils.requestFn(port, self.data.resume, function (resdata) {
          if(self.data.facechange){
            utils.uploadimg(Key, self.data.headface, function () {
              wx.setStorageSync('resume', self.data.resume)
              delete app.globalData.addresume
              wx.navigateBack({ delta: 1 })
            })
          }else{
            wx.setStorageSync('resume', self.data.resume)
            delete app.globalData.addresume
            wx.navigateBack({ delta: 1 })
          }

      })
    }
  },
})