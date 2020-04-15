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
        var o = this;
        t.request({
            url: "drawlots/get_self_drawlots_history",
            method: "GET"
        }).then(function(t) {
            o.setData({
                drawlots_list: t.data.drawlots_result_list
            });
        });
    },
    bindDetail: function(t) {
        console.log(t);
        var o = t.currentTarget.dataset.drawlots_id;
        wx.navigateTo({
            url: "../detail/detail?drawlots_id=" + o
        });
    }
});