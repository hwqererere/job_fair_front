const utils = require('../../utils/util')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    job: [],
    curr:0,
    jobtmp:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    utils.requestFn('deliUserDs', { openid: wx.getStorageSync('openid') }, function (res) {
      if (res.code == 200) {
        self.setData({ jobtmp: res.data })
        self.formatdata()
      } else {
        wx.showToast({
          title: res.msg,
          icon: "none"
        })
      }

    })
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.formatdata()
    console.log(this.data.job)
  },
  ord:function(e){
    let self=this
    let curr = e.currentTarget.dataset.curr ? e.currentTarget.dataset.curr : e.target.dataset.curr
    self.setData({curr:curr})
    this.formatdata()
  },
  formatdata:function(){
    let curr=this.data.curr
    if(curr!=0){
      let arr=[]
      let arri=0
      for (let i = 0; i < this.data.jobtmp.length; i++) {
        if (curr == 1 && this.data.jobtmp[i].status==1) {
          arr[arri]=this.data.jobtmp[i]
          arri++
        }else if(curr==2 && this.data.jobtmp[i].status==4){
          arr[arri]=this.data.jobtmp[i]
          arri++
        }
      }
      console.log(arr)
      this.setData({job:arr})
    }else{
      this.setData({job:this.data.jobtmp})
    }
    
  }
  
  
})