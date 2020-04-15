var t = getApp();

Page({
    data: {
        image_list: [],
        content: ""
    },
    onLoad: function(t) {},
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {},
    bindInputContent: function(t) {
        this.setData({
            content: t.detail.value
        });
    },
    chooseImage: function() {
        var n = this, e = n.data.image_list;
        wx.chooseImage({
            count: 1,
            success: function(a) {
                console.log(a);
                var o = a.tempFilePaths[0];
                t.uploadImg(o).then(function(t) {
                    e.push(t.data.url), console.log(e), n.setData({
                        image_list: e
                    });
                });
            }
        });
    },
    previewImage: function(t) {
        var n = t.target.dataset.src;
        wx.previewImage({
            current: n,
            urls: this.data.image_list
        });
    },
    delImg: function(t) {
        var n = t.currentTarget.dataset.index, e = this.data.image_list;
        n < e.length && e.splice(n, 1), this.setData({
            image_list: e
        });
    },
    bindSubmit: function(n) {
        var e = this, a = e.data.content;
        if (void 0 !== a && null != a && "" != a) {
            var o = {
                content: a,
                image_list: e.data.image_list
            };
            t.request({
                url: "comm/submit_question",
                method: "POST",
                data: o
            }).then(function(t) {
                wx.showModal({
                    showCancel: !1,
                    content: "提交成功，感谢你的反馈",
                    success: function(t) {
                        wx.navigateBack({
                            delta: 1
                        });
                    }
                });
            });
        } else wx.showModal({
            showCancel: !1,
            content: "问题描述不能为空"
        });
    }
});