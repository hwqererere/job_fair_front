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
  ports.access ="candidate"

  let url ="https://res.hothwq.com/index.php?r=";
  console.log(ports[portName]);
  return url + ports[portName];
}



const loginaccess = function (st, callback) {
  wx.login({
    success: loginRes => {
      wx.getUserInfo({
        success: getUserInfoRes => {
          wx.setStorageSync("nickName", getUserInfoRes.userInfo.nickName);
          wx.setStorageSync("avatarUrl", getUserInfoRes.userInfo.avatarUrl);
          let reurl = "https://res.hothwq.com/index.php?r=candidate"

          requestFn("access", { code: loginRes['code'], rawData: getUserInfoRes['rawData'], signature: getUserInfoRes['signature'], encryptedData: getUserInfoRes['encryptedData'], iv: getUserInfoRes['iv'], signtype: st },function(){
            wx.setStorageSync('openid', res.data.data.openid)
            wx.setStorageSync('signtype', res.data.data.linktype)
            app.globalData.openid = res.data.data.openid
            console.log("ffff");
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
  console.log(portName)
  wx.request({
    url: port(portName), // 仅为示例，并非真实的接口地址
    data: da,
    method:meth,
    header: {
      'content-type': 'application/json' // 默认值
    },
    success(res) {
      console.log(res.data)
    }
  })
}



module.exports = {
  formatTime: formatTime,
  loginaccess: loginaccess,
  requestFn: requestFn
}
