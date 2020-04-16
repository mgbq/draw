
## 原文
https://blog.csdn.net/qq_32340877/article/details/105540569
## 背景
今天谁炒菜，谁洗碗，谁买菜...啊，Boss说用抽签吧，于是有了下图

<img src="https://user-gold-cdn.xitu.io/2020/4/15/1717cacb657523c9?f=jpeg&s=105441" width = "300" height = "300" alt="抽签" align=center />

<img src="https://user-gold-cdn.xitu.io/2020/4/15/1717d15759bd0794?f=jpeg&s=56477" width = "300" height = "300" alt="抽签" align=center />

这样存在作弊的问题（记住棍子特征，谁先，谁后抽等等）于是有了这个抽签小程序（当然小程序我一个人控制，我想不想作弊看心情了）


## 简介
扫码体验

![](https://user-gold-cdn.xitu.io/2020/4/15/1717d252593e10dd?w=258&h=294&f=jpeg&s=29798)


## 数据服务，存储
本项目使用的是微信云开发，云数据库声明个抽签chouqianList集合即可（云开发为开发者提供完整的原生云端支持和微信服务支持，弱化后端和运维概念，无需搭建服务器，使用平台提供的 API 进行核心业务开发，即可实现快速上线和迭代）

## 运行前准备
(1)[注册微信小程序](https://mp.weixin.qq.com/wxopen/waregister?action=step1)，获取 appid,替换本项目project.config.json里的appid

(2)[开通小程序的云开发](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/quickstart.html)

## 具体实现
### 首页
<img src="https://user-gold-cdn.xitu.io/2020/4/15/1717d1ae3cbe8caf?f=jpeg&s=70751" width = "300" height = "500" alt="首页" align=center />

首页从上至下有抽签主题，抽签选项，发起抽签，常用抽签，此页面主要功能发起抽签，把抽签内容存到数据库里面。

> 微信审核提示
![](https://user-gold-cdn.xitu.io/2020/4/15/1717cf854d85f0c3?w=1194&h=169&f=png&s=14323)
解决这个问题添加的内容调用这个方法（小程序内容安全api，云开发可调用）
```
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
```
随机抽签
```
 // 递归随机返回抽签项
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
                    let nullDetail = res.data[0].detail.filter(item => item.openid == "");//找出没有抽签的选项
                    let arrIndex = Math.floor((Math.random() * nullDetail.length));//从没有抽签的选项随机选择一个选项
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
```
### 抽签页
<img src="https://user-gold-cdn.xitu.io/2020/4/15/1717d1056849302e?f=jpeg&s=61313" width = "300" height = "500" alt="抽签页" align=center />


抽签页有抽签功能，显示抽签结果，此页面主要功能，从数据库查询是否已经抽签，已抽签显示抽签结果，未抽签随机分配抽签（或者显示抽签次数已用完）。
> 重复抽签问题用函数防抖或者节流
### 抽签结果页
<img src="https://user-gold-cdn.xitu.io/2020/4/15/1717d1ce803a40b9?f=jpeg&s=78971" width = "300" height = "500" alt="抽签结果页" align=center />

抽签结果页，显示所有抽签人员和结果（结果从数据库根据抽签表的id查询）



#### 至此完毕 [源码地址](https://github.com/mgbq/draw)

### 结语：
因为发的时间比较短，页面、功能还需要慢慢完善，发布了的功能也有一些待改进的地方，欢迎同样志同道合的码友们多多指教和交流。ヾ(❀╹◡╹)ﾉ~


前端学习大佬群493671066，美女多多。老司机快上车，来不及解释了。

#### 作者相关Vue文章
[基于Vue2.0实现后台系统权限控制](https://github.com/mgbq/vue-permission)

[vue2.0-基于elementui换肤（自定义主题）](https://blog.csdn.net/qq_32340877/article/details/80176987)

[前端文档汇总](https://github.com/mgbq/front-end-Doc)

[VUE2.0增删改查附编辑添加model(弹框)组件共用](https://github.com/mgbq/Vue-admin) 

## 打赏 衷心的表示感谢
![打赏](https://user-gold-cdn.xitu.io/2018/3/1/161e1530672639e9?w=425&h=425&f=png&s=75685)
