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


function port(portName){
  var ports={};
  ports.access ="candidate"//授权验证
  ports.osskey="osskey"
  ports.resumeSelect="resume-select"//查询简历
  ports.resumeCreate="resume-create"//创建简历
  let url ="https://res.hothwq.com/index.php?r=";
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
            console.log(res)
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
  // console.log(meth)
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

module.exports = {
  portFn:portFn,
  formatTime: formatTime,
  loginaccess: loginaccess,
  requestFn: requestFn,
  formlibFn:formlibFn,
  resume_set: resume_set
}
