const app = getApp()

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
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






module.exports = {
  portFn:portFn,
  formatTime: formatTime,
  loginaccess: loginaccess,
  requestFn: requestFn
}
