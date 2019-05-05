const app = getApp()
const utils = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    job:[],
    lib: utils.formlibFn(),
    changejob:{},
    changelay:false,
    jobtypelist:[],
    jobtypeindex:0,
    delid:0
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getjobtype()
  },
  getlist: function (page) {
    let self = this
    utils.requestFn('recruitInfoSelect', {company_id:wx.getStorageSync("company_id"),page:page}, function (res) {
      let tmp = res.data
      if(page==0){
        for (let i = 0; i < tmp.length; i++) {
          if (tmp[i].fuli){
            tmp[i].fuli = tmp[i].fuli.split(";")
          }        
        }
        self.setData({ job: tmp })
      }else{
        let job=self.data.job
        for(let i=0;i<tmp.length;i++){
          job.push(tmp[i])
        }
        self.setData({ job: job })
        
      }
      if(tmp.length>=9){
        page+=1
        self.getlist(page)
      }

    })
  },
  getjobtype: function () {
    let self = this
    let jobtypetmp = wx.getStorageSync('jobtype')
    if (!jobtypetmp || (jobtypetmp.update - 0 + 300000) < utils.getsortTime) {
      utils.requestFn('jobtype', {}, function (res) {
        if (res.code == 200) {
          let jobtype = {}
          jobtype.update = utils.getsortTime
          jobtype.list = res.data
          wx.setStorageSync('jobtype', jobtype)
         
          self.setData({ jobtypelist: jobtype.list })
        }
      })
    } else {
     
      self.setData({ jobtypelist: jobtypetmp.list})
    }
  },
  onShow: function () {
    this.getlist(0)
  },
  changeinfo:function(e){
    let self=this
    let id = e.currentTarget.dataset.id ? e.currentTarget.dataset.id : e.target.dataset.id
    if(id==0){
      let changejob = { id: 0, jobName: "", record:0, mansize: "1", pay: "面议", workingplace: "", job_id: 1, work_content: "", work_demand:""}
      self.setData({ changejob: changejob, changelay:true})
    }else{
      for(let i=0;i<self.data.job.length;i++){
        if (self.data.job[i].id==id){
          let changejob = { id: self.data.job[i].id, jobName: self.data.job[i].jobName, mansize: self.data.job[i].mansize, pay: self.data.job[i].pay, workingplace: self.data.job[i].workingplace, job_id: self.data.job[i].job_id, work_content: self.data.job[i].work_content, work_demand: self.data.job[i].work_demand, record: self.data.job[i].record }
          self.setData({ changejob: changejob, changelay: true })
        }
      }
    }
  },
  inputchangeFn: function (e) {
    let type = e.currentTarget.dataset.type ? e.currentTarget.dataset.type : e.target.dataset.type
    let value = e.detail.value
    let cj = this.data.changejob
    cj[type] = value
    this.setData({ changejob: cj })
  },
  jobchange:function(e){
    this.setData({ jobtypeindex: e.detail.value })
  },
  sub:function(){
    let self = this
    let changejob = self.data.changejob


    changejob.job_id = self.data.jobtypelist[self.data.jobtypeindex].id
    changejob.company_id = wx.getStorageSync("company_id")
    utils.requestFn('recruitUpdate', changejob, function (res) {
      if (res.code == 200) {
        wx.showToast({
          title: res.msg
        })
        self.getlist(0)
      }
      self.setData({ changelay:false})
    })
  },
  cancel:function(){
    this.setData({ changelay: false })
  },
  delinfo:function(e){
    let self=this
    wx.showModal({
      title: '注意',
      content: '确定要删除吗',
      success(res) {
        if (res.confirm) {
          let rid = e.currentTarget.dataset.id ? e.currentTarget.dataset.id : e.target.dataset.id
          utils.requestFn('recruitDel', { openid: wx.getStorageSync("openid"), company_id: wx.getStorageSync("company_id"), recruitid:rid},function(re){
            wx.showToast({
              title: re.msg,
              icon:"none"
            })
            self.getlist(0)
          })
        } else if (res.cancel) {
          self.setData({ delid:0})
        }
      }
    })
  }
})