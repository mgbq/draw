var t = getApp();

Page({
    data: {
        showComfirm: !1,
        loadingHidden: !0,
        errorArray: [],
        counteArray: [],
        drawlotsData: {
            title: "",
            detail: [
                // {
                //     content: "洗碗",
                //     count: "1",
                //     openid:""
                // },
                // {
                //     content: "切菜",
                //     count: "1",
                //     openid:""
                // },
                // {
                //     content: "洗菜",
                //     count: "1",
                //     openid:""
                // },
                // {
                //     content: "买菜做饭",
                //     count: "1",
                //     openid:""
                // },
                // {
                //     content: "扫地拖地",
                //     count: "1",
                //     openid:""
                // },
                // {
                //     content: "擦桌子，台面",
                //     count: "1",
                //     openid:""
                // }, {
                //     content: "炒菜",
                //     count: "1",
                //     openid:""
                // }
            ]
        },
        drawlotsId: 0,
        commonDrawlots: ["四人吃饭", "五人吃饭", "六人吃饭", "七人吃饭", "八人吃饭", "九人吃饭"]
    },
    onLoad: function (a) {
        // t.getUserInfo();
    },
    onReady: function () {},
    onShow: function () {},
    onHide: function () {},
    onUnload: function () {},
    onPullDownRefresh: function () {},
    onReachBottom: function () {},
    onShareAppMessage: function (t) {
        var a = this;
        if ("button" !== t.from) return {
            imageUrl: "/resources/image/share_logo.png"
        };
        a.setData({
            showComfirm: !1
        });
        var o = a.data.drawlotsData,
            n = a.data.drawlotsId;
        return {
            title: "你的好友邵东大鲨鱼邀请你参加 " + o.title + " 抽签",
            imageUrl: "/resources/image/share_logo.png",
            path: "/pages/share/share?drawlotsId=" + n
        };
    },
    bindDel: function (t) {
        var a = t.target.dataset.index,
            o = this.data.drawlotsData;
        o.detail.splice(a, 1), this.setData({
            drawlotsData: o
        });
    },
    bindAdd: function (t) {
        let that = this;

        let detailLength = that.data.drawlotsData.detail.length + 1
        var a = {
            content: `抽签项${detailLength}`,
            openid: ""
        };
        that.data.drawlotsData.detail.push(a);
        that.setData({
            drawlotsData: that.data.drawlotsData
        });
    },
    inputTitle: function (t) {
        var a = this.data.drawlotsData;
        a.title = t.detail.value, this.setData({
            drawlotsData: a
        });
    },
    bindblur: function (e) {
        // let that = this;
        // let content = e.detail.value;
        // let index = e.target.dataset.index;
        // that.isCheckMsg(content).then(
        //     res => {
        //         console.log("选项描述", res);
        //         if (res === false) {
        //             wx.showModal({
        //                 showCancel: !1,
        //                 content: `检测选项${index+1}描述违规，已清空`
        //             });
        //             // that.data.drawlotsData.detail[index].content = `抽签项${index+1}`;
        //             that.data.drawlotsData.detail[index].content = ``;
        //             that.setData({
        //                 drawlotsData: that.data.drawlotsData,
        //             });
        //             return false;
        //         }
        //     });
    },
    inputContent: function (t) {
        var a = t.target.dataset.index,
            o = this.data.drawlotsData;
        o.detail[a].content = t.detail.value, this.setData({
            drawlotsData: o
        });
    },
    inputCount: function (t) {
        var a = t.target.dataset.index,
            o = this.data.drawlotsData;
        o.detail[a].count = t.detail.value, this.setData({
            drawlotsData: o
        });
    },
    // 异步检测内容是否违规
    async checkMessages (detail) {
        let that = this;
        let nullArray = [];
        that.setData({
            errorArray: nullArray,
            counteArray:nullArray
        });
        return new Promise(function (n, s) {
            for (let l = 0; l < detail.length; ++l) {

                var d = detail[l].content;
                if (void 0 === d || null == d || "" == d) {
                    let errmsg = "抽签描述不能为空";
                    wx.showModal({
                        showCancel: !1,
                        content: errmsg
                    });
                    break;
                } else {
                    that.isCheckMsg(d).then(
                        res => {
                            let newcountArray = [];
                            newcountArray.push(l);
                           let allArray= newcountArray.concat(that.data.counteArray);
                            that.setData({
                                counteArray: allArray
                            });
                            if (res === false) {
                                let errmsg = `检测选项${l+1}描述违规，请修改`;
                                let newArray = [];
                                newArray.push(false);
                               let allArray= newArray.concat(that.data.errorArray);
                                that.setData({
                                    errorArray: allArray
                                });
                                wx.showModal({
                                    showCancel: !1,
                                    content: errmsg
                                });
                            } else {
                                // 如果循环至最后一个选项且没有违规选项返回ok
                                if (that.data.errorArray.length === 0 && that.data.counteArray.length === detail.length) {
                                    let obj = {
                                        isok: true,
                                        errmsg: ""
                                    }
                                    n(obj)
                                }

                            }

                        });

                }

               


            }
            that.setData({
                loadingHidden: 1
            });

        });
        
    },

    clickPublish: function (a) {
        let that = this;
        var o = this,
            n = o.data.drawlotsData;
        var e = n.title;
        if (void 0 !== e && null != e && "" != e) {
            o.isCheckMsg(e).then(
                res => {
                    if (res) {
                        if (n.detail.length === 0) {
                            wx.showModal({
                                showCancel: !1,
                                content: "请至少添加一个选项"
                            });
                            return false;
                        }
                        that.setData({
                            loadingHidden: !1
                        });
                        that.checkMessages(n.detail).then(res => {
                            that.setData({
                                loadingHidden: 1
                            });
                            if (res.isok) {
                                for (let k = 0; k < n.detail.length; k++) {
                                    n.detail[k].index = k
                                }
                                const db = wx.cloud.database();
                                db.collection('chouqianList').add({
                                    data: {
                                        title: n.title,
                                        detail: n.detail
                                    },
                                    success: res => {
                                        // 在返回结果中会包含新创建的记录的 _id
                                        o.setData({
                                            showComfirm: !0,
                                            drawlotsId: res._id
                                        });
                                    },
                                    fail: err => {
                                        wx.showToast({
                                            icon: 'none',
                                            title: '发起抽签失败'
                                        })
                                    }
                                })

                            }



                        })



                    } else {
                        wx.showModal({
                            showCancel: !1,
                            content: "检测主题违规，请修改主题"
                        });
                        return false;
                    }
                })
        } else wx.showModal({
            showCancel: !1,
            content: "标题不能为空"
        });
    },
    clickCancelComfirm: function (t) {
        this.setData({
            showComfirm: !1
        });
    },
    isCheckMsg: function (msg) {
        return new Promise(function (n, s) {
            wx.cloud.callFunction({
                name: 'msg',
                data: ({
                    text: msg
                })
            }).then(res => {
                if (res.result.errCode === 87014) {
                    // 没通过
                    n(false) 
                } else {
                    // ("通过")
                    n(true)
                }
            });
        });


    },
    bindCommonDrawlots: function (t) {
        let that = this;
        let index = t.target.dataset.index;
        that.setData({
            'drawlotsData.title': "煮饭炒菜分工抽签"
        });
        if (index === 0) {
            let detail = [{
                    content: "炒菜",
                    openid: ""
                },
                {
                    content: "洗菜，切菜",
                    openid: ""
                },
                {
                    content: "扫地,拖地,煮饭,买菜",
                    openid: ""
                },
                {
                    content: "擦桌子，台面，洗碗",
                    openid: ""
                }
            ]
            that.setData({
                'drawlotsData.detail': detail
            });
        } else if (index === 1) {
            let detail = [{
                    content: "炒菜",
                    openid: ""
                },
                {
                    content: "洗菜，切菜",
                    openid: ""
                },
                {
                    content: "扫地,拖地",
                    openid: ""
                },
                {
                    content: "擦桌子，台面,买菜",
                    openid: ""
                },
                {
                    content: "洗碗,煮饭",
                    openid: ""
                }
            ]
            that.setData({
                'drawlotsData.detail': detail
            });
        } else if (index === 2) {
            let detail = [{
                    content: "炒菜",
                    openid: ""
                },
                {
                    content: "洗菜，切菜",
                    openid: ""
                },
                {
                    content: "扫地,拖地",
                    openid: ""
                },
                {
                    content: "擦桌子，台面",
                    openid: ""
                },
                {
                    content: "煮饭，买菜",
                    openid: ""
                }, {
                    content: "洗碗",
                    openid: ""
                }
            ]
            that.setData({
                'drawlotsData.detail': detail
            });
        } else if (index === 3) {
            let detail = [{
                    content: "炒菜",
                    openid: ""
                },
                {
                    content: "洗菜",
                    openid: ""
                },
                {
                    content: "切菜",
                    openid: ""
                },
                {
                    content: "扫地,拖地",
                    openid: ""
                },
                {
                    content: "擦桌子，台面",
                    openid: ""
                },
                {
                    content: "煮饭，买菜",
                    openid: ""
                }, {
                    content: "洗碗",
                    openid: ""
                }
            ]
            that.setData({
                'drawlotsData.detail': detail
            });
        } else if (index === 4) {
            let detail = [{
                    content: "炒菜",
                    openid: ""
                },
                {
                    content: "洗菜",
                    openid: ""
                },
                {
                    content: "切菜",
                    openid: ""
                },
                {
                    content: "扫地,拖地",
                    openid: ""
                },
                {
                    content: "擦桌子，台面",
                    openid: ""
                },
                {
                    content: "煮饭，买菜",
                    openid: ""
                }, {
                    content: "洗碗",
                    openid: ""
                }, {
                    content: "幸运签",
                    openid: ""
                }
            ]
            that.setData({
                'drawlotsData.detail': detail
            });
        } else if (index === 5) {
            let detail = [{
                    content: "炒菜",
                    openid: ""
                },
                {
                    content: "洗菜",
                    openid: ""
                },
                {
                    content: "切菜",
                    openid: ""
                },
                {
                    content: "扫地,拖地",
                    openid: ""
                },
                {
                    content: "擦桌子，台面",
                    openid: ""
                },
                {
                    content: "煮饭，买菜",
                    openid: ""
                }, {
                    content: "洗碗",
                    openid: ""
                }, {
                    content: "幸运签",
                    openid: ""
                }, {
                    content: "幸运签",
                    openid: ""
                }
            ]
            that.setData({
                'drawlotsData.detail': detail
            });
        }
    }
});