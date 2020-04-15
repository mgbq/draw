var e = getApp();

Page({
    data: {
        canIUse: wx.canIUse("button.open-type.getUserInfo"),
        hasUserInfo: !1,
        loadingHidden: !0,
        userInfo: {}
    },
    onShow: function () {
        let that = this;
        var n = e.globalData.userInfo,
            o = n.username,
            a = n.icon,
            s = !0;
        void 0 !== o && null != o && "" != o || (console.log("username is empty"), s = !1),
            void 0 !== a && null != a && "" != a || (console.log("icon is empty"), s = !1),
            s && this.setData({
                userInfo: n,
                hasUserInfo: !0
            });
        !s & e.getUserInfo().then(function (res) {
            that.setData({
                userInfo: res,
                hasUserInfo: !0
            });
        })
    },
    onLoad: function () {
        let that = this;
        var n = e.globalData.userInfo.id || 0;
        void 0 != n && 0 != n || e.getUserInfo().then(function (res) {
            that.setData({
                userInfo: res,
                hasUserInfo: !0
            });
        });
    },
    bindGetUserInfo: function (n) {
        let that = this;
        wx.getUserInfo({
            success: function (res) {
                that.setData({
                    userInfo: res,
                    hasUserInfo: !0
                });
            },
            fail: function (n) {
                console.log(n), n(n);
            }
        })
    }
});