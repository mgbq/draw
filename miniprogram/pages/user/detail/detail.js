var t = getApp();

Page({
    data: {
        loading_hidden: !0,
        title: "",
        drawlotsId: "",
        drawlots_result_list: []
    },
    onLoad: function (t) {
        var o = t.drawlotsId;
        this.getDrawlotsResule(o);
    },
    onReady: function () {},
    onShow: function () {},
    onHide: function () {},
    onUnload: function () {},
    onPullDownRefresh: function () {},
    onReachBottom: function () {},
    onShareAppMessage: function () {},
    getDrawlotsResule: function (o) {
        var n = this;
        const db = wx.cloud.database()
        // 查询当前用户所有的 chouqianList
        db.collection('chouqianList').where({
            _id: o
        }).get({
            success: res => {

                var detail = res.data[0].detail;
                if (detail.length > 0) {
                    var e = detail[0].title;
                   // let drawlotsId = res.data[0]._id
                    n.setData({
                        title: e,
                        drawlotsId: o,
                        drawlots_result_list: detail
                    });
                }
            },
            fail: err => {
                console.error('[数据库] [查询] 失败：', err)
            }
        });
        
    },
    bindToHome: function (t) {
        wx.switchTab({
            url: "/pages/index/index"
        });
    },
    bindTochouqian: function () {
        let that = this;
        wx.navigateTo({
            url: "/pages/share/share?drawlotsId=" + that.data.drawlotsId
        });
    },
});