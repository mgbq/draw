import tools from "../../tools/tools";

var t = getApp();

Page({
    data: {
        canIUse: wx.canIUse("button.open-type.getUserInfo"),
        loadingHidden: !0,
        chouqed:true,
        animationData: {},
        showResult: 1,
        showComfirm: !1,
        drawlotsId: 0,
        title: "",
        dttitle: "",
        drawlotsResult: {},
        detail: null
    },
    onLoad: function (option) {
        var that = this,
            a = option.drawlotsId || 0;
        t.onGetOpenid().then(function (resOpenid) {
            that.getDrawlots(a);
        });
        var n = wx.createAnimation({
            duration: 250,
            timingFunction: "ease"
        });
        that.animation = n, that.setData({
            drawlotsId: a,
            loadingHidden: !1
        });
    },
    onReady: function () {},
    onShow: function () {
        let that = this;
        t.onGetOpenid().then(function (resOpenid) {
            that.getDrawlots(that.data.drawlotsId)
        });
    },
    onHide: function () {},
    onUnload: function () {},
    onPullDownRefresh: function () {},
    onReachBottom: function () {},
    onShareAppMessage: function (t) {},
    bindDraw: tools.debounce(function (e) {
        let that = this;
        var o = that.data.drawlotsId;

        let userinfo = t.globalData.userInfo;
        if (!userinfo.username) {
            that.setData({
                showComfirm: !0
            });
            return false;
        }else{
            console.log("666")
            that.setData({
                chouqed: false,
                loadingHidden:false
            });
        }
        that.doDrawlots(o)
    }),
    getDrawlots: function (o) {
        let that = this;
        const db = wx.cloud.database()
        // 查询当前用户所有的 chouqianList
        db.collection('chouqianList').where({
            _id: o
        }).get({
            success: res => {
                let title = res.data[0].title;
                that.setData({
                    detail: res.data[0].detail,
                });
                let object = res.data[0].detail.find(v => {
                    return v.openid === t.globalData.openid;
                });
                if (!object) { // 不存在可抽签
                    let kongopenid = res.data[0].detail.find(v => {
                        return v.openid == "" || v.openid == undefined;
                    });
                    if (!kongopenid) { // 都有openid
                        that.setData({
                            showResult: !0,
                            dttitle: "抽签次数已用完",
                            loadingHidden: !0
                        });
                    } else {
                        that.setData({
                            title: title,
                            showResult:0,
                            loadingHidden: !0
                        });
                    }


                } else { // 已抽签
                    that.setData({
                        title: title,
                        showResult: !0,
                        drawlotsResult: object,
                        dttitle: "你抽中了",
                        loadingHidden: !0
                    });
                }
                console.log('[数据库] [查询记录] 成功: ', res)
            },
            fail: err => {
                wx.showToast({
                    icon: 'none',
                    title: '查询记录失败'
                })
                console.error('[数据库] [查询记录] 失败：', err)
            }
        })
    },
    doDrawlots: function (o) {
        var a = this;
        a.edchouqian().then(function (objectIndex) { // res 随机返回数组中某个对象的index字段
            for (let j = 0; j < a.data.detail.length; j++) {
                if (a.data.detail[j].index === objectIndex) {
                    a.data.detail[j].openid = t.globalData.openid;
                    a.data.detail[j].username = t.globalData.userInfo.username;
                    a.data.detail[j].icon = t.globalData.userInfo.icon;
                }

            }
            const db = wx.cloud.database()
            db.collection('chouqianList').doc(a.data.drawlotsId).update({
                data: {
                    detail: a.data.detail
                },
                success: res => {
                    a.getDrawlots(a.data.drawlotsId)
                },
                fail: err => {
                    icon: 'none',
                    console.error('[数据库] [更新记录] 失败：', err)
                }
            })
        })

    },
    // 递归判断是否已经抽签
    edchouqian() {
        let that = this;
        return new Promise(function (n, s) {
            const db = wx.cloud.database()
            // 查询当前用户所有的 chouqianList
            db.collection('chouqianList').where({
                _id: that.data.drawlotsId
            }).get({
                success: res => {
                    that.setData({
                        detail: res.data[0].detail,
                    });
                    let nullDetail = res.data[0].detail.filter(item => item.openid == "");
                    let arrIndex = Math.floor((Math.random() * nullDetail.length));
                    let objindex = nullDetail[arrIndex].index;
                    n(objindex)
                },
                fail: err => {

                    wx.showToast({
                        icon: 'none',
                        title: '查询记录失败'
                    })
                    console.error('[数据库] [查询记录] 失败：', err);
                    s(err);
                }
            })

        });


    },
    clickCancelComfirm: function (t) {
        this.setData({
            showComfirm: !1
        });
    },
    bindGetUserInfo: function () {
        let that = this;
        wx.getUserInfo({
            success: function (res) {
                t.globalData.userInfo.username = res.userInfo.nickName;
                t.globalData.userInfo.icon = res.userInfo.avatarUrl;
                that.setData({
                    showComfirm: !1
                });
            },
            fail: function (error) {
                console.log(error);
            }
        })
    },
    bindDetail: function (t) {
        var o = this.data.drawlotsId;
        wx.navigateTo({
            url: "../user/detail/detail?drawlotsId=" + o
        });
    },
    bindToHome: function (t) {
        wx.switchTab({
            url: "../index/index"
        });
    }
});