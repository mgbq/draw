getApp();

App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
      })
      this.onGetOpenid();
    }
  },

  onGetOpenid: function () {
    let that = this;
    return new Promise(function (n, s) {
      // 调用云函数
      wx.cloud.callFunction({
        name: 'login',
        data: {},
        success: res => {
          console.log('[云函数] [login] user openid: ', res.result.openid)
          that.globalData.openid = res.result.openid;
          n(res.result.openid)
        },
        fail: err => {
          console.error('[云函数] [login] 调用失败', err);
          s(err);
        }
      })
    });

  },



  getUserInfo: function () {
    let that = this;
    return new Promise(function (n, s) {
      wx.getUserInfo({
        success: function (res) {
          console.log(res);
          that.globalData.userInfo.username = res.userInfo.nickName;
          that.globalData.userInfo.icon = res.userInfo.avatarUrl;
          n(that.globalData.userInfo);
        },
        fail: function (error) {
          s();
          console.log(error);
        }
      })

    });
  },
  uploadImg: function (o) {
    var e = this;
    return new Promise(function (n, s) {
      e.getSession().then(function (t) {
        wx.uploadFile({
          url: e.globalData.commSvrUrl + "comm/upload_image?session=" + t,
          filePath: o,
          name: "image",
          method: "POST",
          success: function (o) {
            if (200 == o.statusCode) {
              console.log(o.data);
              var e = JSON.parse(o.data);
              0 == e.err_code ? n(e) : (wx.showModal({
                showCancel: !1,
                content: e.err_msg
              }), s(e));
            } else console.log(o);
          },
          fail: function (o) {
            console.log(o), s(o);
          }
        });
      });
    });
  },
  globalData: {
    userInfo: {
      username: "",
      icon: "",
      id: 0
    },
    commSvrUrl: "https://www.xx",
    svrUrl: "https://www.xx",
    session: "",
    user_id: 0,
    openid: ""
  }
});