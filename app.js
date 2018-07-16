App({
  onLaunch: function () {
    var storageData = wx.getStorageSync('postList');
    if (!storageData) {
      var dataObj = require("data/data.js")
      wx.clearStorageSync();
      wx.setStorageSync('postList', dataObj.postList);
    }
    this._getUserInfo();
    // wx.login();
  },

  _getUserInfo: function () {
    var userInfoStorage = wx.getStorageSync('user');
    if (!userInfoStorage) {
      var that = this;
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              console.log(res);
              that.globalData.g_userInfo = res.userInfo
              wx.setStorageSync('user', res.userInfo)
            },
            fail: function (res) {
              console.log(res);
            }
          })
        }
      })
    }
    else {
      this.globalData.g_userInfo = userInfoStorage;
    }
  },

  getSkin: function () {
    var that = this
    wx.getStorage({
      key: 'skin',
      success: function (res) {
        that.globalData.skin = res.data
      }
    })
  },

  //globalData对象用来记录整个项目的全局变量
  globalData: {
    //记录和管理音乐播放状态
    g_isPlayingMusic: false,
    //保存正在播放音乐的id号
    g_currentMusicPostId: null,
    //豆瓣API的基地址
    doubanBase: "http://t.yushu.im",
    g_userInfo: null,
    skin:""
  }
})