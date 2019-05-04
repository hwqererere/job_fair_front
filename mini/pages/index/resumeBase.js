var utils = require('../../utils/util')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    reslink: app.globalData.reslink,
    lib: utils.formlibFn(),
    resume:{},
    region: ['北京市', '北京市', '东城区'],
    headface:"",
    updateface:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self=this
    let tmp = app.globalData.resume
    if (app.globalData.resume.url_id){
      self.setData({ headface: app.globalData.reslink+"data/"+app.globalData.resume.url_id})
    }
    self.setData({resume:tmp})

  },
  inputchange:function(e){
    let self=this
    let type = e.currentTarget.dataset.type ? e.currentTarget.dataset.type : e.target.dataset.type
    let value = e.detail.value
    let tmp=self.data.resume
    if (type == "street" || type =="county"){
      let lib=utils.formlibFn()
      tmp[type] = lib[type][value]
    }else{
      tmp[type] = value
    }
    
    self.setData({resume:tmp})
  },
  bindRegionChange: function (e) {
    let self = this
    self.setData({
      region: e.detail.value
    })
    let tmp=self.data.resume
    tmp.province=e.detail.value[0]
    tmp.city=e.detail.value[1]
    tmp.county=e.detail.value[2]
    self.setData({resume:tmp})
  },
  updateface: function () {
    let self = this
    wx.chooseImage({
      count: 1,
      camera: 'back',
      sizeType: ['original'],
      sourceType: ['album'],
      success: function (res) {
        var filePath = res.tempFilePaths[0];
        if (filePath) {
          // set_resume.headface = "https://" + res.Location
          self.setData({
            headface: filePath,
            updateface:true
          })
        }
      }
    })
  },
  sub:function(){
    let self=this
    var idcard_patter = /^[1-9][0-9]{5}([1][9][0-9]{2}|[2][0][0|1][0-9])([0][1-9]|[1][0|1|2])([0][1-9]|[1|2][0-9]|[3][0|1])[0-9]{3}([0-9]|[X])$/;
    let idcard = self.data.resume.identitycard
    var format = idcard_patter.test(idcard);
    if(!format){
        wx.showToast({
        title: '身份证错误',
        icon:'none'
      })
    }else{
      let tmp=self.data.resume
      if (parseInt(tmp.identitycard.substr(16, 1)) % 2 == 1) {
        tmp.sex=1
      } else {
        tmp.sex=0
      }
      var myDate = new Date();
      var month = myDate.getMonth() + 1;
      var day = myDate.getDate();
      var age = myDate.getFullYear() - tmp.identitycard.substring(6, 10) - 1;
      if (tmp.identitycard.substring(10, 12) < month || tmp.identitycard.substring(10, 12) == month && tmp.identitycard.substring(12, 14) <= day) {
        age++;
      }
      tmp.age=age
      tmp.birthday = tmp.identitycard.substring(6, 10) + "" + tmp.identitycard.substring(10, 12) + "" + tmp.identitycard.substring(12, 14);
      if(self.data.updateface){
        tmp.url_id = self.data.headface
        app.globalData.updatehead=true
      }
      if (tmp.place==0){
        tmp.province="上海市"
        tmp.city="上海市"
        tmp.county="闵行区"
      }else if(tmp.place==1){
        tmp.province = "上海市"
        tmp.city = "上海市"
      }
      app.globalData.resume=tmp

      wx.navigateBack({
        delta: 1
      })
    }
  }
})