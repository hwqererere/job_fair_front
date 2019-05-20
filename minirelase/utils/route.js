const app = getApp()

var routes = {}
routes.index = require("../indexcontrollers/index.js")



const getUrlData = function getUrlData(_this, options, callback) {
  app.globalData.friend_id = options.friend_id ? decodeURIComponent(options.friend_id) : ""
  app.globalData.channel_id = options.channel_id ? options.channel_id : ""
  app.globalData.user_id = wx.getStorageSync("user_id") + ""


}

const pageCtrl = function pageCtrl(_this, pageid) { //获取url信息  
  let action = "init" + pageid;
  app.globalData.pageid = pageid
  _this.setData({ pageid: pageid })
  routes[pageid][action](_this)
}

const fn = function fn(_this, e) {
  let fnName = e.currentTarget.dataset.fn ? e.currentTarget.dataset.fn : e.target.dataset.fn
  //console.log(routes[app.globalData.pageid])
  routes[app.globalData.pageid][fnName](_this, e)
}

const sharefn = function sharefn(_this, e) {
  let sharefnName = e.target.dataset.sharefn ? e.target.dataset.sharefn : e.currentTarget.dataset.sharefn
  return routes[app.globalData.pageid][sharefnName](_this, e)
}



module.exports = {
  getUrlData: getUrlData,
  pageCtrl: pageCtrl,
  fn: fn,
  sharefn: sharefn,

}
