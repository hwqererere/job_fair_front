var util = require('../../lib/util');
var config = require('../../config');
var cos = require('../../lib/cos');
var utils=require('../../utils/util')

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    resume:{} ,
    headface: "",
    region: ['广东省', '广州市', '海珠区'],
    streetindex:0,
    countyindex:0,
    over_date:"",
    start_date:"",
    end_date:"",
    reslink: app.globalData.reslink ,
    lib: utils.formlibFn(),
    exptmp:{corporate_name:"",work_name:"",start_date:"",end_date:""},
    exptype:-1,//-1为新增
    workState: false,
   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self=this


    self.setData({
      resume:{
        username:"",
        url_id:"",
        phone:"",
        sex:1,
        nation:"",
        marital_status:0,
        identitycard:"",
        education:0,
        age:"",
        political_status:0,
        place:0,
        province:self.data.region[0],
        city:self.data.region[1],
        county:self.data.lib['county'][0],
        street:self.data.lib['street'][0],
        domicile:"",
        job_intention:"",
        exp:[]
      }
    })


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
            headface: filePath
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
    console.log(self.data.resume)
  },

  work:function(e){
    let self=this
    let time=new Date(); 
    self.setData({
      workState:true,
      over_date:utils.formatTime(time),
      start_date:utils.formatTime(time),
      end_date:utils.formatTime(time)
    })
    let type = e.currentTarget.dataset.type ? e.currentTarget.dataset.type:e.target.dataset.type

    if (type ==-1){

      self.setData({ exptype:-1})
      self.setData({ exptmp: utils.resume_set(self, self.data.exptmp, 'start_date', self.data.start_date)})
      self.setData({ exptmp: utils.resume_set(self, self.data.exptmp, 'end_date', self.data.end_date) })
      self.setData({ exptmp: utils.resume_set(self, self.data.exptmp, 'corporate_name', '') })
      self.setData({ exptmp: utils.resume_set(self, self.data.exptmp, 'work_name', '') })
    } else {
      self.setData({ exptmp: self.data.resume.exp[type], exptype:type})

    }
  },
   bindDateChange(e) {
    let self=this
    let type=e.target.dataset.type
    if(type=='begin'){
      self.setData({
        start_date: e.detail.value,
        exptmp:utils.resume_set(self,self.data.exptmp,'start_date',e.detail.value)
      })
    }else{
      self.setData({
        end_date: e.detail.value,
        exptmp:utils.resume_set(self,self.data.exptmp,'end_date',e.detail.value)
      })  
    }
  },
  input_tmp:function(e){
    let self=this
    let type=e.target.dataset.type
    let value=e.detail.value
    self.setData({ exptmp: utils.resume_set(self,self.data.exptmp,type,value)})
  },
  expcancel:function(){
    let self = this
    self.setData({
      workState: false
    })
    self.setData({ exptmp: utils.resume_set(self, self.data.exptmp, 'corporate_name', '') })
    self.setData({ exptmp: utils.resume_set(self, self.data.exptmp, 'work_name', '') })
  },
  expsub:function(){
    let self=this
    if (self.data.exptmp.corporate_name==""){
      wx.showToast({title: '请填写公司',icon: 'none', duration: 2000})
    } else if (self.data.exptmp.work_name==""){
      wx.showToast({ title: '请填写职位', icon: 'none', duration: 2000 })
    }else{
      let setresume = self.data.resume
      if(self.data.exptype==-1){
        setresume.exp.push(self.data.exptmp)
      }else{
        setresume.exp[self.data.exptype] = self.data.exptmp
      }

      self.setData({ resume: setresume, workState:false})

  

    }
  },
  checksave:function(){
    let self=this
    let re=true
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
      wx.showLoading({ title: '正在上传...' });
      var Key = util.getRandFileName(self.data.headface);
      cos.postObject({
        Bucket: config.Bucket,
        Region: config.Region,
        Key: "mhjczx/data/" + Key,
        FilePath: self.data.headface,
      }, function (err, res) {
        wx.hideLoading();
        if (res && res.Location) {
          
          self.setData({ resume: utils.resume_set(self, self.data.resume, 'url_id', Key) })
          // headface = self.data.reslink + "data" + Key
          console.log(self.data.resume)


        } else {
          console.log(err)
          wx.hideLoading();
          wx.showToast({ title: '上传失败', icon: 'error', duration: 2000 });
        }
      });
    }
  },
})