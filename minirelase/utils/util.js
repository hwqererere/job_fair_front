const app = getApp()

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  // return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
  return [year, month, day].map(formatNumber).join('-') 
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const getsortTime=function(){
  var timestamp = new Date().getTime();
  return timestamp;
}

function port(portName){
  var ports={};
  ports.access ="candidate"//授权验证
  ports.osskey="osskey"
  ports.resumeSelect="resume"//查询简历
  ports.resumeUpdate="resume/update"//更新简历  有id为更新，没id为创建
  ports.recruitInfoSelect ="recruit-info-select" //获取岗位信息
  ports.fuli = "fuli" //获取福利列表
  ports.jobtype = "fuli/job"//职能列表
  ports.street = "fuli/street"//所属街道列表
  ports.deliUserDeli ="delivery-info-select/user-delivery" //用户投递
  ports.deliUserDs = "delivery-info-select/user-delilist" //用户状态
  

  ports.compBund="company/select-bundling"//查询微信号绑定企业信息
  ports.compUpdUseCom ="company/update-user-company"//绑定微信号到企业
  ports.company="company"
  ports.compDeli ="company/delivery"//查询当前企业投递简历
  ports.delistat ="company/deliverystat"//更改投递状态
  ports.fuliupdate ="fuli/fuli-save-or-update"//福利
  ports.udcop ="company/update-company"
  ports.recruitUpdate = "recruit-info-select/update" //岗位信息更新
  ports.recruitDel = "recruit-info-select/delrecruit" //岗位信息删除
  // let url ="https://res.hothwq.com/index.php?r=";
  let url = wx.getStorageSync('serverhost')+"/";
  return url + ports[portName];
}

const portFn=function(portName){
  return port(portName)
}


const loginaccess = function (st, callback) {
  wx.login({
    success: loginRes => {
      wx.getUserInfo({
        success: getUserInfoRes => {
          wx.setStorageSync("nickName", getUserInfoRes.userInfo.nickName);
          wx.setStorageSync("avatarUrl", getUserInfoRes.userInfo.avatarUrl);


          requestFn("access", { code: loginRes['code'], rawData: getUserInfoRes['rawData'], signature: getUserInfoRes['signature'], encryptedData: getUserInfoRes['encryptedData'], iv: getUserInfoRes['iv'], signtype: st },function(res){
            if(res.code==200){
              wx.setStorageSync('openid', res.data.openid)
              wx.setStorageSync('signtype', res.data.linktype)
              app.globalData.openid = res.data.openid
              callback.call(this,{})
            }else{
              wx.showToast({
                icon:"none",
                title: '授权出错'+res.code,
              })

            }
            
            
          },"GET")

          
        }
      });
    },
    fail: failInfo => {
      console.log(failInfo)
      callback.call(this, { login: false })
    }
  })
}

const requestFn=function(portName,da,callback,meth="POST"){
  let u = port(portName);
  wx.request({
    url: port(portName), // 仅为示例，并非真实的接口地址
    data: da,
    method:meth,
    header: {
      'content-type': 'application/json' // 默认值
    },
    success(res) {
      callback.call(this,res.data)
    }
  })
}


function formlib(){
  let obj={}
  obj.sex = ['女', '男']
  obj.marital_status = ['未婚','已婚','已婚已育']
  obj.education = ['初中或以下','高中','中专','大专、高职','本科','研究生','博士','博士后','其他']
  obj.political_status=['群众','党员','团员']
  obj.place=['本区','本市非本区','外省市']
  obj.county=['黄浦区','徐汇区','长宁区','静安区','普陀区','虹口区','杨浦区','浦东新区','闵行区','宝山区','嘉定区','金山区','松江区','青浦区','奉贤区','崇明区']
  obj.street=['莘庄镇','七宝镇','浦江镇','梅陇镇','虹桥镇','马桥镇','吴泾镇','华漕镇','颛桥镇','江川路街道','新虹街道','古美路街道','浦锦街道']
  obj.personnel_type = ['失业','在职','征地','协保','下岗','退休','应届毕业生','外来媳妇','退伍军人']
  return obj
}
const formlibFn=function(){
  return formlib()
}
const resume_set=function(self,resume,type,value){
  let lib=formlib()
  let indextype = ['street','county']
  let inarr=false;
  for(let i=0;i<indextype.length;i++){
    if(type==indextype[i]){
      inarr=true
    }
  }
  if (inarr){
    resume[type] = lib[type][value]
  }else{
    resume[type] = value    
  }
  
  return resume
}


const arrReplace=function(arr,ind,revalue){
  // console.log(arr, revalue)
  let newarr=[]
  if(arr){
    for (let i = 0; i < arr.length; i++) {
      if (i == ind) {
        newarr[i] = revalue
      } else {
        newarr[i] = arr[i]
      }
    }
    if (arr.length == ind) {
      newarr[ind] = revalue
    } 
  }else{
    newarr[0]=revalue
  }
  
  
  return newarr;
}
const scan=function(callback){
  wx.scanCode({
    onlyFromCamera: true,
    success(res) {
      let result=res.result
      console.log(result)
      callback.call(this,JSON.parse(result))
      }
  })
}

const uploadimg=function(savename,filepath,callback){
  let util = require('../lib/util');
  let config = require('../config');
  let cos = require('../lib/cos');
  wx.showToast({
    title: '文件上传中...',duration:200,icon:'success'
  })
  cos.postObject({
    Bucket: config.Bucket,
    Region: config.Region,
    Key: "mhjczx/data/" + savename,
    FilePath: filepath,
  }, function (err, res) {
    wx.hideLoading();
    if (res && res.Location) {
      wx.hideLoading();
      callback.call(this)

    } else {
      console.log(err)
      wx.hideLoading();
      wx.showToast({ title: '上传失败', icon: 'error', duration: 2000 })
    }
  });
}
const getfilename=function(filepath){
  let util = require('../lib/util');
  let config = require('../config');
  let re=util.getRandFileName(filepath);
  return re;
}
function randomTime(){
  let timestamp = (new Date()).getTime();
  return timestamp;
}
const randomTimeFn=function(){
  
}
module.exports = {
  portFn:portFn,
  formatTime: formatTime,
  loginaccess: loginaccess,
  requestFn: requestFn,
  formlibFn:formlibFn,
  resume_set: resume_set,
  arrReplace: arrReplace,
  scan:scan,
  uploadimg: uploadimg,
  getfilename:getfilename,
  randomTimeFn:randomTimeFn,
  getsortTime: getsortTime
}
