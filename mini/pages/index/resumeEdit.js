var util = require('../../lib/util');
var config = require('../../config');
var cos = require('../../lib/cos');


const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    resume: {
      headface: ""
    },
    workState: true,
    trainState: true,
    homeState: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self=this
    let set_resume=self.data.resume
    set_resume.headface = app.globalData.reslink + "style/default_head.jpg"
    self.setData({ resume: set_resume})


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
          var Key = util.getRandFileName(filePath);
          wx.showLoading({ title: '正在上传...' });
          cos.postObject({
            Bucket: config.Bucket,
            Region: config.Region,
            Key: "mhjczx/data/"+Key,
            FilePath: filePath,
          }, function (err, res) {
            wx.hideLoading();
            if (res && res.Location) {
              let set_resume=self.data.resume
              set_resume.headface = "https://"+res.Location
             
              self.setData({
                resume: set_resume
              })
              console.log(res)

            } else {
              console.log(err)
              wx.showToast({ title: '上传失败', icon: 'error', duration: 2000 });
            }
          });
        }
      }
    })
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