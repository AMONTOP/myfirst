import { DBPost } from '../../../db/DBPost.js';
//获取小程序App对象，app.js
var app = getApp();
console.log(app)

Page({
  data: {
    //isPlayingMusic作为音乐播放状态的控制变量
    isPlayingMusic: false
  },
  onLoad: function (options) {
    var postId = options.id;
    this.dbPost = new DBPost(postId);
    this.postData = this.dbPost.getPostItemById().data;
    this.setData({
      post: this.postData
    })
    this.addReadingTimes();
    //设置音乐播放监听
    this.setMusicMonitor();
    this.initMusicStatus();
    this.setAniation();
  },

  onReady: function () {
    wx.setNavigationBarTitle({
      title: this.postData.title
    })
  },

  setAniation: function () {
    //定义动画
    var animationUp = wx.createAnimation({
      timingFunction: 'ease-in-out'
    })

    this.animationUp = animationUp
  },
//初始化音乐播放图标状态
  initMusicStatus() {
    var currentPostId = this.postData.postId;
    if (app.globalData.g_isPlayingMusic &&
      app.globalData.g_currentMusicPostId === currentPostId) {

      // 如果全局播放的音乐是当前文章的的音乐，才将图标状态设置为正在播放
      this.setData({
        isPlayingMusic: true
      })
    }
    else {
      this.setData({
        isPlayingMusic: false
      })
    }
  },

  onCollectionTap: function (event) {
    var newData = this.dbPost.collect();

    // 重新绑定数据。注意，不要将整个newData全部作为setData的参数，
    // 应当有选择的更新部分数据

    this.setData({
      'post.collectionStatus': newData.collectionStatus,
      'post.collectionNum': newData.collectionNum
    })

    // 交互反馈
    wx.showToast({
      title: newData.collectionStatus ? "收藏成功" : "取消成功",
      duration: 1000,
      icon: "success",
      mask: true
    })
  },

  onUpTap: function (event) {
    var newData = this.dbPost.up();

    this.setData({
      'post.upStatus': newData.upStatus,
      'post.upNum': newData.upNum
    }),

    this.animationUp.scale(2).step();
    this.setData({
      animationUp: this.animationUp.export()
    })
    setTimeout(function () {
      this.animationUp.scale(1).step();
      this.setData({
        animationUp: this.animationUp.export()
      })
    }.bind(this), 300);
  },

  onCommentTap: function (event) {
    var id = event.currentTarget.dataset.postId;
    wx.navigateTo({
      url: '../post-comment/post-comment?id=' + id
    })
  },

  //阅读量+1
  addReadingTimes: function () {
    this.dbPost.addReadingTimes();
  },
//onMusicTap音乐播放图片切换start、stop
  onMusicTap: function (event) {
    if (this.data.isPlayingMusic) {
      wx.pauseBackgroundAudio();
      this.setData({
        isPlayingMusic: false
      })
      app.globalData.g_isPlayingMusic = false;
    }
    else {
      wx.playBackgroundAudio({
        //dataUrl音乐的播放地址
        dataUrl: this.postData.music.url,
        //音乐标题
        title: this.postData.music.title,
        //音乐封面图url
        coverImgUrl: this.postData.music.coverImg
      })
      this.setData({
        isPlayingMusic: true
      })
      app.globalData.g_isPlayingMusic = true;
      app.globalData.g_currentMusicPostId = this.postData.postId;
    }
  },

  setMusicMonitor: function () {
    var that = this;
    wx.onBackgroundAudioStop(function () {
      that.setData({
        isPlayingMusic: false
      })
      app.globalData.g_isPlayingMusic = false;
    });

    wx.onBackgroundAudioPlay(function (event) {
      // 只处理当前页面的音乐播放。
      if (app.globalData.g_currentMusicPostId === that.postData.postId) {
        that.setData({
          isPlayingMusic: true
        })
      }
      app.globalData.g_isPlayingMusic = true;
    });

    wx.onBackgroundAudioPause(function () {
      // 只处理当前页面的音乐暂停。
      if (app.globalData.g_currentMusicPostId == that.postData.postId) {
        that.setData({
          isPlayingMusic: false
        })
      }
      app.globalData.g_isPlayingMusic = false;
    });
  },
//定义页面分享函数
  onShareAppMessage: function () {
    return {
      title: this.postData.title,
      desc: this.postData.content,
      path: "/pages/post/post-detail/post-detail"
    }
  }

})