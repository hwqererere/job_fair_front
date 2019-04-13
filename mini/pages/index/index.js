//index.js
//获取应用实例
const app = getApp()
const utils=require("../../utils/util.js");
const drawQrcode=require('../../lib/weapp.qrcode.js');

Page({
  data: {
    access:false,
    searchItem:0,
    searchOpen:false,
    searchitems: [[[{ check: 0, txt: '决策管理类' }, { check: 0, txt: '人事行政类' }, { check: 0, txt: '财务管理' }, { check: 0, txt: '营销类' }, { check: 0, txt: '技术类' }, { check: 0, txt: '生产服务类' }, { check: 0, txt:'其他'}],[]],[
      [{ check: 0, txt: '早九晚五' }, { check: 0, txt: '双休' }, { check: 0, txt: '长白班' }, { check: 0, txt: '福利好' }, { check: 0, txt: '包吃住' }, { check: 0, txt: '班车接送' }, { check: 0, txt: '五险一金' }], [{ check: 0, txt: '长三角及扶贫专区' }, { check: 0, txt: '莘庄镇' }, { check: 0, txt: '七宝镇' }, { check: 0, txt: '大学生实践和生态环保专区' }, { check: 0, txt: '浦江镇' }, { check: 0, txt: '梅陇镇' }, { check: 0, txt: '虹桥镇' }, { check: 0, txt: '马桥镇' }, { check: 0, txt: '吴泾镇' }, { check: 0, txt: '华漕镇' }, { check: 0, txt: '颛桥镇' }, { check: 0, txt: '江川路街道' }, { check: 0, txt: '新虹街道' }, { check: 0, txt: '古美路街道' }, { check: 0, txt: '浦锦街道' } ]]],
      allcounts:[[0,0],[0,0]],
      job:[],
      codelay:false,
      have_resume:true,
      lay:false
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
    self.setrandomjob()
  },
  setrandomjob:function(){
    let self=this
    let j=['信息采集员','网络管理员','仓库保管员','出纳']
    let e=['上海智传有限公司','上海朴实有限公司','上海纳柯有限公司','上海隆基机械有限公司']
    let jobj=[]
    for(let i=0;i<15;i++){
      let obj = { jobname: j[i % 4], compname: e[i % 4], area: "A区", no: ("0" + i), belong: self.data.searchitems[1][1][i].txt, minrepay: 4000, maxrepay: 8000, tag: [self.data.searchitems[1][1][i % 7].txt, self.data.searchitems[1][1][i % 7].txt, self.data.searchitems[1][1][i % 7].txt, self.data.searchitems[1][1][i % 7].txt]}
      jobj.push(obj)
    }
    this.setData({ job:jobj})
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
    let idarr=id.split("-")
    let dataitem=self.data.searchitems
    let dataallcounts = self.data.allcounts
    if (self.data.searchitems[idarr[0]][idarr[1]][idarr[2]].check==1){      
      dataitem[idarr[0]][idarr[1]][idarr[2]].check=0
      dataallcounts[idarr[0]][idarr[1]]--
    }else{     
      dataitem[idarr[0]][idarr[1]][idarr[2]].check = 1      
      dataallcounts[idarr[0]][idarr[1]]++
    }
    self.setData({ searchitems: dataitem, allcounts:dataallcounts})
  },
  reset:function(e){
    let self = this
    let id = e.target.dataset.si ? e.target.dataset.id : e.currentTarget.dataset.id
    let idarr=id.split("-")
    let dataitem = self.data.searchitems
    let dataallcounts = self.data.allcounts
    if(idarr.length==1){
      dataallcounts[idarr[0]][0] = 0
      dataallcounts[idarr[0]][1] = 0
      for (let i = 0; i < dataitem[id][0].length; i++) {
        if (dataitem[idarr[0]][0][i].check == 1) {
          dataitem[idarr[0]][0][i].check = 0
        }
      }
      for (let i = 0; i < dataitem[id][1].length; i++) {
        if (dataitem[idarr[0]][1][i].check == 1) {
          dataitem[idarr[0]][1][i].check = 0
        }
      }
    }else{
      dataallcounts[idarr[0]][idarr[1]] = 0
      for (let i = 0; i < dataitem[idarr[0]][idarr[1]].length; i++) {
        if (dataitem[idarr[0]][idarr[1]][i].check == 1) {
          dataitem[idarr[0]][idarr[1]][i].check = 0
        }
      }
    }    
    self.setData({ searchitems: dataitem, allcounts: dataallcounts })
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
  showresumecode:function(){
    if(!this.data.codelay){
      this.setData({ lay: true, codelay: true },()=>{
        let have_resume = wx.getStorageSync('have_resume') ? 1 : 0
        if (have_resume == 1) {
          let width = wx.getSystemInfoSync().windowWidth
          let size = 500 / 750 * width
            drawQrcode({
              width: size,
              height: size,
              x: 0,
              y: 0,
              canvasId: 'myQrcode',
              typeNumber: 10,
              text: JSON.stringify({ link: '../resume/index?resumeId=' + wx.getStorageSync('openid')}),
              callback(e) {
                console.log(e)
              }
            })
        }
      })

    }else{
      this.setData({lay:false,codelay:false})
    }
    
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
        if(res.data.length!=0){
          wx.setStorageSync('resume', res.data.countries[0])
          wx.setStorageSync('have_resume', wx.getStorageSync('openid') )
        }else{
          self.setData({have_resume:false})
        }
        
      })
      
      
    }
  },
  addresume:function(){
    app.globalData.addresume=1
    wx.navigateTo({
      url: 'resumeEdit',
    })
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
