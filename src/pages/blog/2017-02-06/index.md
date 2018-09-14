---
title: 微信小程序
date: 2017-02-06 17:26:50
background: https://i.imgur.com/znCI2Si.jpg
categories: Inbox
tags: 
  - 微信小程序
---

## 前言

尝尝鲜.

<!--more-->

## 小程序

之前一直对微信不是很感冒. 而且圈子也大都在 QQ. 平常不管是学校还是商家, 都一直让你扫码关注公众号, 跟平时走在大街上被硬塞宣传单一样烦人.

小程序发布后, 认真看了几篇文章. 逐渐理解了微信的格局和张小龙的智慧.

### 小程序的特点:

* 不需要下载安装即可使用
* 用完即走, 不用关心是否安装太多应用
* 应用将无处不在, 随时可用

### 小程序的定位:

张小龙认为目前的 iOS 和 Android 的 App, 太重了, 用户耗费了大量的精力在里面.

小程序就是想连接人与服务 (C2P).

小程序适合以下几点:

1. 非长时间停留(反例: 知乎)
2. 使用频率低(如: 生活缴费, 购票)
3. 性能要求低(反例: 直播应用, 游戏)

所以, 轻量级的服务选择小程序, 重一点的选择 App. 两者互为补充, 非相互替代关系.

### 小程序的意义:

支付宝的服务是自己开发的, 而微信却选择提供一个平台, 让第三方提供服务.

某种程度可以理解为开源闭源. 就像早期的 iPhone 可玩性不高, 因为没有 App Store, iPhone 上的程序都是 Apple 自己开发的, 当乔布斯开创了 App Store, 第三方大量涌入才让这个生态真正茁壮起来. 

小程序就伟大在此, 张小龙选择了将一个应用生态化. 应用生态化, 格局和决心也是让人敬佩.

这样以来, 搭建平台提供创业机会的案例, 前者有乔布斯的 App 创业和马云的电商创业, 后来的张小龙的微信小程序创业是否能壮大, 真的是让人拭目以待.

### 小程序的剖析

小程序不粘人, 不像是 App 去抓用户, 用户用完即走非常乐意. 没有了客户留存, 对于企业将是噩梦. 所以, 以小程序为原点去创业, 逻辑就有点问题. 小程序只是你提供服务的载体, 而不是一桩生意.

在开发上思路就与传统的 App 不一样, 什么登录注册, 第三方支付插件什么的, 显然微信本身提供了. 

创业还是要想明白自己能为别人提供什么服务, 提供什么价值. 服务的具体形式并不重要, 随着时间的推移, 只是方便程度不一样. 例如美团就是提供团购服务的企业, 管他是网站, App, 还是小程序.

废话少说.

### 小程序在技术层面

小程序和 Angular 在某些方面很像: 

* 数据优先
* 不操作 dom

小程序的 template 思想, 支持 ES6.

## 01

### Flex 弹性盒子模型, CSS3 技术.

### 小程序自适应单位 rpx

### 样式位置

静态样式(不会改变)放到样式表里

动态样式放到 style 里

因为, 如果静态样式也放进 style 会影响性能效率.

### css 一定有大局观

用整体思维去布局, 代码不要断裂式去写

在 container 这里设置水平居中

```css
.container{
    display: flex;
    flex-direction: column;
    align-items: center;
}
```

### 全局设置

放到 app.wxss 里面

```css
text{
    font-family: MicroSoft Yahei;
}
```

### 圆角矩形外框内部文字垂直居中

moto 行高 = moto-container 高度

```css
.moto-container {
    border: 1px solid #405f80;
    width: 200rpx;
    height: 80rpx;
    border-radius: 5px;
    text-align: center;    
}

.moto {
    line-height: 80rpx;
}
```

## 02

### rpx 和 px 小技巧

```css
.post-image{
    width:100%;
    height:340rpx;
    margin:auto 0;
    margin-bottom: 15px;
}

.post-date{
    font-size:26rpx;
    margin-bottom: 10px;
}
.post-title{
    font-size:34rpx;
    font-weight: 600;
    color:#333;
    margin-bottom: 10px;
    margin-left: 10px;
}
```

垂直方向间隔用 px, 水平用 rpx.

px 是固定不变的距离, rpx 在不同机器上两个控件在垂直方向上的距离不可控.

手机水平方向有限, 更需要去自适应. 而垂直方向是一直可以往下滚的.

### Swiper 组件

### App.json 里的关于导航栏, 标题配置

### Page 页面与应用程序的生命周期

### 数据绑定

小程序是单向数据绑定, 和 Angular 的双向数据绑定不一样. 

小程序 js -\> wxml, wxml里的数据变动是没法直接影响 js 里的数据.

### 数据绑定的运算与逻辑

#### `{ { } }` true 与 false

```
<swiper vertical="false"></swiper>
```

没用, 字符串非空依旧认为 true

```
<swiper vertical="{{false}}"></swiper>
```

这样才行.

#### 显示/隐藏

```
<image wx:if"{{true}}" ></image>
```

#### 组件复用 for

```
<block wx:for="{{postList}}" wx:for-item="item" wx:for-index="idx">
        <!--//template-->
        <view catchtap="onPostTap" data-postId="{{item.postId}}">
             <template is="postItem" data="{{...item}}"/>
        </view>
</block>
```

### AppData 区域介绍

### 事件与事件对象

#### 冒泡事件与非冒泡事件

```html
<view class="journey-container" bindtap="onContainerTap">
    <text class="journey" bindtap="onSubTap">开启小程序之旅</text>
</view>
```

```javascript
Page({
  onContainerTap: function(event) {
    console.log("Container")
  },
  onSubTap: function(event) {
    console.log("Sub")
  }
})
```

点击 text 的文字的时候, 都执行.

点击 Container 但不包括 text 时候, 只执行父节点的监听函数.

冒泡事件: 点击子节点时, 也执行父节点的事件.

阻止事件冒泡: catch

```html
<view class="journey-container" bindtap="onContainerTap">
    <text class="journey" catchtap="onSubTap">开启小程序之旅</text>
</view>
```

#### 界面跳转

```javascript
wx.navigateTo ({
})
// 调用
onUnload: function(){
}
wx.redirectTo({
})
// 调用
onHide:function() {
}
```

#### data 数据绑定两种方式

在 onLoad 中

```javascript
var postsData = require('../../data/posts-data.js')
Page({
  data: {
    //小程序总是会读取data对象来做数据绑定，这个动作我们称为动作A
    // 而这个动作A的执行，是在onLoad函数执行之后发生的
  },
  onLoad: function () {
    // this.data.postList = postsData.postList
    this.setData({
        postList:postsData.postList
    });
  }
})
```

onLoad 中如果是异步操作里面只能用 setData.

### 缓存

缓存的上限最大不能超过10MB

四类操作, 八种方法

### 列表渲染

### Template 模板的使用

复用的思想

```html
<template name="postItem">
    <view class="post-container">
       <view class="post-author-date">
           <image class="post-author" src="{{avatar}}"></image>
                <text class="post-date">{{date}}</text>
        </view>
           <text class="post-title">{{title}}</text>
            <image class="post-image" src="{{imgSrc}}"></image>
            <text class="post-content">{{content}}
            </text>
            <view class="post-like">
                    <image class="post-like-image" 
                    src="/images/icon/chat.png"></image>
                    <text class="post-like-font">{{collection}}</text>

                    <image class="post-like-image" 
                    src="/images/icon/view.png"></image>
                    <text class="post-like-font">{{reading}}</text>
            </view>
        </view>
</template>
```

```html
<import src="post-item/post-item-template.wxml" />
<block wx:for="{{postList}}" wx:for-item="item" wx:for-index="idx">
        <!--//template-->
        <view catchtap="onPostTap" data-postId="{{item.postId}}">
             <template is="postItem" data="{{...item}}"/>
        </view>
</block>
```

```css
@import "post-item/post-item-template.wxss";
```

遗憾的是, 小程序只实现了模板编程, 而没有实现模块编程. template 没法复用 js 文件, 业务逻辑没法复用.

```html
<template is="postItem" data="{{...item}}"/>
```

## 03

### template 只是占位符

```html
<block wx:for="{{postList}}" wx:for-item="item" wx:for-index="idx">
    <template is="postItem" data="{{...item}}" catchtap="onPostTap"/>
</block>
```

所以, 不能绑定事件. 在外面包裹一个 view

```html
<block wx:for="{{postList}}" wx:for-item="item" wx:for-index="idx">
        <!--//template-->
        <view catchtap="onPostTap" data-postId="{{item.postId}}">
             <template is="postItem" data="{{...item}}"/>
        </view>
</block>
```

### 经典垂直水平布局

```css
.audio {
  width: 102rpx;
  height: 110rpx;
  position: absolute;
  top: 180rpx;
  opacity: 0.6;
  
  left: 50%; 
  margin-left: -51rpx;
}
```

## 小程序IDE使用技巧

### 快速生成文件

无意中, 先在 app.json 里面配置了页面

```json
{
  "pages": [
    "pages/welcome/welcome"
  ]
}
```

Cmd + s 保存以后, 自动生成了 welcome 对应的目录和相应的文件.

很方便有木有.

### 常用快捷键

#### 格式调整

- Ctrl+S：保存文件
- Ctrl+[， Ctrl+]：代码行缩进
- Ctrl+Shift+[， Ctrl+Shift+]：折叠打开代码块
- Ctrl+C Ctrl+V：复制粘贴，如果没有选中任何文字则复制粘贴一行
- Shift+Alt+F：代码格式化
- Alt+Up，Alt+Down：上下移动一行
- Shift+Alt+Up，Shift+Alt+Down：向上向下复制一行
- Ctrl+Shift+Enter：在当前行上方插入一行
- Ctrl+Shift+F：全局搜索

#### 光标相关

- Ctrl+End：移动到文件结尾
- Ctrl+Home：移动到文件开头
- Ctrl+i：选中当前行
- Shift+End：选择从光标到行尾
- Shift+Home：选择从行首到光标处
- Ctrl+Shift+L：选中所有匹配
- Ctrl+D：选中匹配
- Ctrl+U：光标回退

#### 界面相关

- Ctrl + \：隐藏侧边栏
- Ctrl + m: 打开或者隐藏模拟器


### 模拟器空白

重启大法好. 从 IDE 到电脑.

