Page({
    onTapJump: function (event) {
      //swichTab只能用于跳转到带tabbar的页面，并关闭其他所有非tabbar页面
        wx.switchTab({
            url: "../post/post",
            success: function () {
                console.log("jump success")
            },
            fail: function () {
                console.log("jump failed")
            },
            complete: function () {
                console.log("jump complete")
            }
        });
    },
    onUnload: function (event) {
        console.log("page is unload")
    },
    onHide: function (event) {
        console.log("page is hide")
    },
})