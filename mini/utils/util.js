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


const loginaccess = function (st,callback) {
  wx.login({
    success: loginRes => {
      wx.getUserInfo({
        success: getUserInfoRes => {
          wx.setStorageSync("nickName", getUserInfoRes.userInfo.nickName);
          wx.setStorageSync("avatarUrl", getUserInfoRes.userInfo.avatarUrl);
          let reurl = "https://res.hothwq.com/index.php?r=candidate"
          wx.request({
            url: reurl,
            data: { code: loginRes['code'], rawData: getUserInfoRes['rawData'], signature: getUserInfoRes['signature'], encryptedData: getUserInfoRes['encryptedData'], iv: getUserInfoRes['iv'], signtype: st },
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              if(res.data.code==200){
                wx.setStorageSync('openid', res.data.data.openid)
                wx.setStorageSync('signtype', res.data.data.linktype)                
                app.globalData.openid = res.data.data.openid
                callback.call(this,{})
              }
              console.log(res)
            },
            fail: function (e) {
              console.log(e)
            }
          })
        }
      });
    },
    fail: failInfo => {
      console.log(failInfo)
      callback.call(this, { login: false })
    }
  })
}



module.exports = {
  formatTime: formatTime,
  loginaccess: loginaccess
}
