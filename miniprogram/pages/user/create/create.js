var t = getApp();

Page({
    data: {
        drawlots_list: []
    },
    onLoad: function(t) {},
    onReady: function() {},
    onShow: function() {
        this.getHistory();
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {},
    getHistory: function() {
        let that = this;

         const db = wx.cloud.database()
        // 查询当前用户所有的 chouqianList
        db.collection('chouqianList').where({
            _openid: t.globalData.openid
        }).get({
            success: res => {

                var detailList = res.data;
                if (detailList.length > 0) {
                    that.setData({
                        drawlots_list: detailList
                    });
                }
            }, fail: err => {
                console.error('[数据库] [查询] 失败：', err)
            }
        });
        // var o = this;
        // t.request({
        //     url: "drawlots/get_self_create_drawlots",
        //     method: "GET"
        // }).then(function(t) {
        //     o.setData({
        //         drawlots_list: t.data.drawlots_list
        //     });
        // });
    },
    bindDetail: function(t) {
        var o = t.currentTarget.dataset.drawlots_id;
        wx.navigateTo({
            url: "../detail/detail?drawlotsId=" + o
        });
    }
});