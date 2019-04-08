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
    resume: {
      headface: "",
      sex:1,
      nation:"汉族",
      marital_status:0,
      identitycard:0
    },
    reslink: app.globalData.reslink ,
    lib: utils.formlibFn(),
    workState: true,
    trainState: true,
    homeState: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self=this



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
          let set_resume = self.data.resume
          // set_resume.headface = "https://" + res.Location
          set_resume.headface = filePath
          self.setData({
            resume: set_resume
          })
          var Key = util.getRandFileName(filePath);
          
          
        }
      }
    })
  },
  save:function(){
    let self=this
    if (self.data.resume.headface!=""){
      wx.showLoading({ title: '正在上传...' });
      cos.postObject({
        Bucket: config.Bucket,
        Region: config.Region,
        Key: "mhjczx/data/" + Key,
        FilePath: filePath,
      }, function (err, res) {
        wx.hideLoading();
        if (res && res.Location) {
    
          set_resume.headface = "https://" + res.Location

          

        } else {
          console.log(err)
          wx.hideLoading();
          wx.showToast({ title: '上传失败', icon: 'error', duration: 2000 });
        }
      });
    }
  },
  bindPickerChange:function(e){
    let self=this
    let type=e.target.dataset.type
    let value=e.detail.value
    self.setData({ resume: utils.resume_set(self,self.data.resume,type,value)})
  },
  addWorkClick:function(){
     wx.redirectTo({
       url: 'addWork?workState=add',
     })
  },
  editWorkClick: function () {
    wx.redirectTo({
      url: 'addWork?workState=edit',
    })
  },
  addTrainClick: function () {
    wx.redirectTo({
      url: 'addTrain?trainState=add',
    })
  },
  editTrainClick: function () {
    wx.redirectTo({
      url: 'addTrain?trainState=edit',
    })
  },
  addHomeClick: function () {
    wx.redirectTo({
      url: 'addHome?homeState=add',
    })
  },
  editHomeClick: function () {
    wx.redirectTo({
      url: 'addHome?homeState=edit',
    })
  },
  backClickFun:function(){
    wx.navigateBack({ delta: 1 })
    // wx.redirectTo({
    //   url: 'resume'
    // })
  },
})