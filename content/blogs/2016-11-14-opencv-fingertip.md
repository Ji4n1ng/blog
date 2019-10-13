---
title: iOS 利用 OpenCV 实时识别手指
date: 2016-11-14 12:00:00
template: post
draft: false
slug: "/posts/opencv-fingertip/"
background: https://s2.ax1x.com/2019/04/23/EEGo24.jpg
category: "Development"
tags:
   - "OpenCV"
   - "iOS"
---

> 2017-8-31更新
>
> 程序在去年就写了，只不过前段时间刚整理了一下开源了，不到两周就收到了国际友人的来信，在这里统一说一下，在背景与手部肤色相差很大的情况下，算法会很准确，在复杂背景下准确识别手指，是不太准确的。这篇文章参考了 [Fingertip Detection in OpenCV](https://picoledelimao.github.io/blog/2015/11/15/fingertip-detection-on-opencv/)，有其他疑问可以联系一下文章的作者。
>
> 以下是原文：

## 前言

利用 OpenCV 在 iOS 设备上实时识别手指个数。

<!--more-->

(程序是16年11月写的, 图片是最近补上的)

## OpenCV for iOS

因为需要混编一些 C++ 的文件, 所以用 Objective-C 来做的.

OpenCV 具体怎么导入我就不说了. 我是将官方的 `opencv2.framework` 导入至项目, 添加一些依赖库就好了.

注意一点, 引用 OpenCV 头文件的 `.m` 文件需要改成 `.mm` 后缀, 用 Objective-C++ 的方式来编译.

## OpenCV 算法

> 此处大量参考了 [Fingertip Detection in OpenCV](https://picoledelimao.github.io/blog/2015/11/15/fingertip-detection-on-opencv/) 一文. 文章是桌面端程序, 为了适应本程序, 我进行了更改.

概要算法思路:

1. 利用 `HSV` 色彩模型, 根据人皮肤值大概在 (H=0,S=58) 和 (H=50,S=173) 之间, 找出人的皮肤
2. 利用 `cv::inRanger` 找出阈值图像
3. 利用中值滤波 `cv::medianBlur` 去降噪和 `cv::dilate` 去填补漏洞
4. 利用 `cv::findContours` 来找出手掌轮廓
5. 利用凸包算法找出手指和手掌的外轮廓.
6. 利用 `cv::convexityDefects` 计算轮廓凸缺陷
7. 利用相邻手指角度在20°和120°之间的特点去掉不符合要求的点

### 1. 颜色分割找出手部皮肤

有很多颜色空间, 常见的 RGB 是其中一种. 对于颜色分割, HSV 更好用. 通常人皮肤位于 (H = 0，S = 58) 和 (H = 50，S = 173) 之间.

```c++
cv::Mat hsv;
cv::cvtColor(frame, hsv, CV_BGR2HSV);
```

### 2. inRanger 函数

在我们的阈值范围内, 将图像变成二值图像, 也就是, 在阈值范围内的点为白色, 否则为黑色.

```c++
cv::inRange(hsv, cv::Scalar(minH, minS, minV), cv::Scalar(maxH, maxS, maxV), hsv);
```

![blog-ifd-1](https://s2.ax1x.com/2019/04/23/EAOH2t.jpg)

如图所示, 仅做颜色分割效果并不好, 有太多的噪点, 如果背景存在和皮肤相近的颜色, 会非常影响检测, 所以我们需要用 **中值滤波** 来去掉一些孤立的点, 并且把手部的 "孔" 进行扩大填充.

### 3. 利用中值滤波 `cv::medianBlur` 去降噪和 `cv::dilate` 去填补漏洞

```
    int blurSize = 5;
    int elementSize = 5;
    cv::medianBlur(hsv, hsv, blurSize);
    cv::Mat element = cv::getStructuringElement(cv::MORPH_ELLIPSE, cv::Size(2 * elementSize + 1, 2 * elementSize + 1), cv::Point(elementSize, elementSize));
    cv::dilate(hsv, hsv, element);
```

![blog-ifd-2](https://s2.ax1x.com/2019/04/23/EAOTPA.jpg)

看起来好多了, 但是还是有一些异常值, 我们需要查找阈值图像中分离的对象的轮廓, 然后仅使用具有面积最大的轮廓的对象, 来解决这一问题.

### 4. 利用 `cv::findContours` 来找出手掌轮廓

```
    // Contour detection
    std::vector<std::vector<cv::Point> > contours;
    std::vector<cv::Vec4i> hierarchy;
    cv::findContours(hsv, contours, hierarchy, CV_RETR_EXTERNAL, CV_CHAIN_APPROX_SIMPLE, cv::Point(0, 0));
    size_t largestContour = 0;
    for (size_t i = 1; i < contours.size(); i++)
    {
        if (cv::contourArea(contours[i]) > cv::contourArea(contours[largestContour]))
            largestContour = i;
    }
    cv::drawContours(frame, contours, largestContour, cv::Scalar(0, 0, 255), 1);
```

将阈值图像利用 `cv::findContours` 来找出所有的具有轮廓的独立对象, 然后利用 ` cv::contourArea` 计算一下轮廓的面积, 找出最大的即可. 然后利用 `cv::drawContours` 即可绘制出轮廓, 如图:

![blog-ifd-3](https://s2.ax1x.com/2019/04/23/EAObxP.jpg)

因为我用的是纯黑色背景, 识别的非常准确😁. 然而, 毕竟阈值范围有点大, 如果背景不纯, 会影响识别.

### 5. 利用凸包算法找出手指和手掌的外轮廓

> 关于什么是凸包, 可以移步[百度百科](https://baike.baidu.com/item/%E5%87%B8%E5%8C%85/179150?fr=aladdin)

OpenCV 这些算法都实现了, 直接调用 `cv::convexHull` 就好. 利用绿色的线绘制一下`cv::drawContours` 凸包的轮廓.

![blog-ifd-4](https://s2.ax1x.com/2019/04/23/EAOLKf.jpg)

可以把凸包的外轮廓用蓝色的矩形表示出来

![blog-ifd-5](https://s2.ax1x.com/2019/04/23/EAO78I.jpg)

我们的手指和凸包的角重合. 但是凸包区域和轮廓区域之间有间隙.

### 6. 利用 `cv::convexityDefects` 计算轮廓的凸性缺陷区域

把凸性缺陷区域的线绘制为蓝色. `convexityDefects` 函数, 返回四个值的元组向量. 第一个值是凸性缺陷区域初始点, 第二个值是凸性缺陷区域的终止点, 第三个值是连接起始点和终止点的中间点. 

![blog-ifd-6](https://s2.ax1x.com/2019/04/23/EAOxaQ.jpg)

起始点的位置就是指尖的位置, 绘制出来就行, 如图,

![blog-ifd-7](https://s2.ax1x.com/2019/04/23/EAOXqS.jpg)

然而, 有很多杂点, 例如最底下手臂还有两个点, 我们需要更多的特征来过滤出真正需要的点.

一种比较简单的方式是, 凸性缺陷区域的两条线的夹角在大约 20° 和 120° 之间.

### 7. 利用相邻手指角度在20°和120°之间的特点去掉不符合要求的点

将两条线转换为向量, 计算余弦即可. 效果如图,



![blog-ifd-8](https://s2.ax1x.com/2019/04/23/EAOvVg.jpg)

## iOS 实时显示手指数.

以上, 基本能检测出指尖了, 还有一点收尾工作.

1. 加了两个 UISwitch, 用来控制检测和显示辅助线.
2. 用 `CvVideoCamera` 来设置一系列参数, 比如在哪个 View 来显示, 设置代理, FPS, 分辨率, 哪个摄像头等等, 具体用法跟 AVFoundation 里差不多.
3. 在右上角加了一个 UIImageView 来显示当前识别指头的个数.

收工图:

![blog-ifd-9](https://s2.ax1x.com/2019/04/23/EAOz5j.jpg)

可以选择显示辅助线:

![blog-ifd-10](https://s2.ax1x.com/2019/04/23/EAXpPs.jpg)

![blog-ifd-11](https://s2.ax1x.com/2019/04/23/EAX9Gn.jpg)

## 总结

本教程到此就结束了, 是不是很好玩. 最后感谢 [Fingertip Detection in OpenCV](https://picoledelimao.github.io/blog/2015/11/15/fingertip-detection-on-opencv/) 一文的作者👍, 站在巨人的肩膀上很爽. 但愿我也能被给别人垫个肩.

项目开源地址: [https://github.com/JianingWang/FingertipDetection](https://github.com/JianingWang/FingertipDetection)





