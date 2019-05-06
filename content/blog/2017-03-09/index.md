---
title: Workflow 初识
date: 2017-03-09 08:12:41
categories: Tips
background: https://s2.ax1x.com/2019/04/23/EEGWV0.jpg
---

## 前言

瞎折腾

<!--more-->

## Workflow 简介

### 百科定义

工作流（Workflow），指“业务过程的部分或整体在计算机应用环境下的自动化”。是对工作流程及其各操作步骤之间业务规则的抽象、概括描述。在计算机中，工作流属于计算机支持的协同工作（CSCW）的一部分。后者是普遍地研究一个群体如何在计算机的帮助下实现协同工作的。
工作流主要解决的主要问题是：为了实现某个业务目标，利用计算机在多个参与者之间按某种预定规则自动传递文档、信息或者任务。

### 我觉得

Workflow 就是利用计算机去做人类不想干的重复劳动. 

## Mac 平台: Automator

### 知乎人怎么用:

* 下载到下载文件夹中的音乐自动移入 iTunes 然后删除原始文件
* 批量修改文件名后缀
* 一次性打开若干个网页。比如有段时间 Mail.app 不知道为什么启动不能了（汗。。。）的时候经常用来一次性打开 Gmail, 163, 126, QQ 邮箱和 Hotmail。   
* 给照片批量改尺寸。一般是在要把一堆刚拍的照片改小之后上传到社交网络上时使用。Pixelmator 和系统自带的 Preview 在 Automator 里都有这个功能可供调用。   
* 做iOS开发的时候把2备图缩小成1倍图，然后在二倍图后面加上@2x
* 将多个资料图合并为一个PDF文件，偶尔资料整理用，很方便。  
* 之前玩舰娘的时候因为懒而且用不了脚本所以通过鼠标路径和键盘录制刷过经验，超级简单
* 为男神刷投票 
  －鼠标录制
  －（可以不要）shell脚本延时：sleep n秒
  －自动循环
* 图片批量上传 CDN

### 我怎么用

我主要是用来把 Word / PPT 转化为 PDF 格式.

**原因**

我一直想在老师上课时利用 iPad 在课件上记一些笔记, 这样一来, 老师讲哪一部分的知识, 就相应记在了对应的 PPT 上. 如下图(潦草字体请忽略)

最喜欢用 iPad 上的 Notability 来手写笔记. 然而直接在 Word 和 PPT 上手写文件, 我还不清楚有什么好的解决方案, 而且, iPad 打开 PDF 的速度和 打开 Office 家东西的速度不能相提并论.

![blog-wf-1](https://s2.ax1x.com/2019/04/23/EAXdzt.jpg)

**利用 app**

在 Word / PowerPoint 打开的前提下, 选中一堆 word 或者是 ppt 文件, 将其拖到程序上就行了.

![blog-wf-2](https://s2.ax1x.com/2019/04/23/EAXYIH.jpg)

一切都是自动进行的, 如下图.

![blog-wf-3](https://s2.ax1x.com/2019/04/23/EAXUJA.jpg)

完成之后

![blog-wf-4](https://s2.ax1x.com/2019/04/23/EAXNid.jpg)

**利用 Service**

原理一样, 只是这次是通过右键来做

![blog-wf-5](https://s2.ax1x.com/2019/04/23/EAXaRI.jpg)

### 另外

Workflow 是用 AppleScript 来写的. AppleScript是苹果公司开发的一种脚本语言, 可以用来控制运行于Mac OS上的程序, 也可以写成独立运行的Applet.

## Mac 平台: Alfred

Alfred 最核心的当然是 Workflow 功能了. 网上太多教程. 我就不赘述了.

* 迅雷离线下载
* 有道翻译
* 新浪微博快速发布
* 图片上传七牛

![blog-wf-6](https://s2.ax1x.com/2019/04/23/EAX0QP.png)

可以去 [知乎](https://zhuanlan.zhihu.com/p/20024559?columnSlug=pinapps) 看看.

## iOS 平台: Workflow

熟悉 iOS 的同学都知道, iOS 限制诸多, Workflow 也基本算是戴着镣铐跳舞.

Workflow 提供了很多国外诸多大神的脑洞作品. 

这是我收藏的一些 Workflow, 大多数是对剪贴板的扩展操作. 

比如:

* Safari / Chrome 打开 剪贴板 内容 (URL)
* 把 剪贴板 内容创建为 备忘录 或者 提醒事项 或者 Omnifocus
* 给 10086 发短信
* 利用 Google / 百度 搜索剪贴板
* 查快递
* LMGTFY (拒绝伸手党)
* 把 提醒事项 的所有事件导入 Omnifocus 并删除.

![blog-wf-7](https://s2.ax1x.com/2019/04/23/EAXBsf.jpg)

## 最后

综上, 基本就是需要一定的编程能力和脑洞来玩的事情. 让你更高效, 也更懒...

## 补充

> 更新于 2017-06-27

Workflow 现已被 Apple 收购了有几月之久, 期待的 WWDC 2017 上 iOS 11 也没见到系统级别的支持 Workflow, 看来只能等 iOS 12 了. 被收购之后, 竞争对手的 App 不再支持 Workflow (如 Chrome 等), sad.



