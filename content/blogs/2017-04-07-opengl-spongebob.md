---
title: 利用 OpenGL 绘制海绵宝宝
date: 2017-04-07 12:00:00
template: post
draft: false
slug: "/posts/opengl-spongebob/"
category: "Development"
tags:
   - "OpenGL"
background: https://s2.ax1x.com/2019/04/23/EEGdVP.jpg
---

## 前言

一场由海绵宝宝引发的原型设计, 抽象等编程问题的讨论.

<!--more-->

先来个效果图, 是不是很萌.

![blog-gl-1](https://s2.ax1x.com/2019/04/23/EAjtmT.png)

语言: C++

库: OpenGL

工具: Sketch, Xcode 

## Sketch

乍一看, Sketch 作为一个原型工具, 跟 OpenGL 毛关系啊. 别着急.

### 临摹

作为毫无美术功底但有几年书法经验的人, 深知临摹的重要性啊. 编程也是一样的, 多去看一看别人是怎么写的, 很重要.

我去网上找了一个图片, 如右图, 然后经过我的临摹, 绘制了左图. (临摹的时候, 肯定放在原图上面临摹, Sketch 可以提供锁定和隐藏选项, 方便观察某个部位是否临摹的像. 为了方便展示, 最后把成果图移到了左边)

因为方便 OpenGL 绘制, 我只用了最简单的图形包括线段, 矩形, 多边形(领带), 圆形和椭圆. 整体还是很简单的.

![blog-gl-2](https://s2.ax1x.com/2019/04/23/EAj8lq.jpg)

### 坐标化

当然了, 使用 Sketch 最重要的功能是, **彻底坐标化**.

什么意思呢?

比如当我选中了左边的胳膊, 右边有相应的位置, 大小和旋转信息, 以及颜色值. **经过统一的坐标变换函数**, 在实际编程时直接填上 Sketch 里面的数值, 直接映射成 OpenGL 绘制的坐标, 是不是超方便. 一比一仿真绘制.

![blog-gl-3](https://s2.ax1x.com/2019/04/23/EAjG60.jpg)

这引发了第一个问题, 关于原型设计的问题.

我从自学 iOS 开始, 也就是自学编程来, 脑子里有一个想法, 想做出来的时候, 我第一步打开的是 Sketch, 而不是 Xcode. 在我不断的将脑子里的想法 "画" 出来的时候, 我会考虑一会程序怎么写, 哪些类可以抽象出来等等. 还有一个好处是, 坐标都有了, 写程序的时候不会因为坐标这些东西扰乱思路, 专心写逻辑.

## 编程之前

在原型设计之后, 对于整个项目已经有了非常细致的了解了. 所以实际前代码之前, 先把一些共性的东西抽象出来.

我们可以看到, 海绵宝宝由很多不同的矩形, 圆形, 椭圆和线段组成, 少部分多边形.

矩形又可以分为填充矩形, 和不填充矩形, 以及填充带边的矩形, 圆形椭圆也是这样.

所以, 我们从弧线开始, 圆形和椭圆特殊的闭合弧线.

因为后期有功能需要根据键盘方向键进行旋转, 所以绘制的角度 `theta` 最好是全局变量.

### 基本绘制工具:

```c++
//弧线
//起始角, 结束角
void drawArc(double x,double y,double start_angle,double end_angle,double delta_angle,double radius,bool fill, bool line=false)
{
    if (fill)
    {
        glBegin(GL_TRIANGLE_FAN);
        for (double i=start_angle;i<=end_angle;i+=delta_angle)
        {
            double vx=x+radius * cos(i);
            double vy=y+radius*sin(i);
            glVertex2d(vx,vy);
        }
        glEnd();
    }
    if (line)
    {
        glBegin(GL_LINE_STRIP);
        glColor3f(0.0f, 0.0f, 0.0f);
        for (double i=start_angle;i<=end_angle;i+=delta_angle)
        {
            double vx=x+radius * cos(i);
            double vy=y+radius*sin(i);
            glVertex2d(vx,vy);
        }
        glVertex2d(x+radius * cos(start_angle), y+radius*sin(start_angle));
        glVertex2d(x+radius * cos(end_angle), y+radius*sin(end_angle));
        glEnd();
    }
}
```

这样一来, 圆就简单了

```c++
//圆
void drawCircle(double x, double y, double radius,bool fill,bool line=false)
{
    double pi=acos(-1.0);
    drawArc(x,y,0,2*pi,pi/180,radius,fill,line);
}
```

调用的时候, 可以根据需求, 选择是否填充.

再例如, 填充带边多边形可以调用两次绘制多边形的方法来做.

```c++
//多边形
void glPolygon(polygon poly, int MODE, int x, int y)
{
    glBegin( MODE );
    for ( int i = 0; i <= poly.length; i++ )
    {
        glVertex2d( poly.x[i]+x, poly.y[i] +y);
    }
    glEnd();
}

//填充多边形
void glFillPolygon(polygon poly, GLfloat color[3], int x, int y)
{
    glColor3f(0,0,0);
    glPolygon(poly, GL_LINE_LOOP, x, y);
    glColor3f(color[0],color[1],color[2]);
    glPolygon(poly, GL_POLYGON, x, y);
}
```

## 开始编程

因为我加了许多其他的功能, 例如五官可以拖动, 可以右键换颜色, 可以根据键盘方向键旋转等功能. 所以代码会有其他不同的地方.

因为之前有 Sketch 的具体坐标, 以及基本构成是简单图形, 所以每个部位非常好画, 例如:

```c++
	//画左腿
    glLoadIdentity();
    glRotatef(theta, 0.0, 0.0, 1.0);
    glColor3f(colors[BODY_COLOR][0], colors[BODY_COLOR][1], colors[BODY_COLOR][2]);
    glTranslateRotateRect(5, 26, -18, -20, -19);
    
	//画左脚
    glLoadIdentity();
    glRotatef(theta, 0.0, 0.0, 1.0);
    glRect(-33, -44, -23, -51, true, true);
    glRect(-23, -40, -16, -51, true, true);

    //画左臂
    glLoadIdentity();
    glRotatef(theta, 0.0, 0.0, 1.0);
    glColor3f(colors[BODY_COLOR][0], colors[BODY_COLOR][1], colors[BODY_COLOR][2]);
    glTranslateRotateRect(41, 4, 34, 63, 34);

    //画腮帮子
    glLoadIdentity();
    glRotatef(theta, 0.0, 0.0, 1.0);
    glColor3f(colors[BROWN_FACE][0],colors[BROWN_FACE][1],colors[BROWN_FACE][2]);
    drawArc(28, 40, -50*PI/180, 220*PI/180, pi/180, 5, true, false);
    glColor3f(colors[BODY_COLOR][0],colors[BODY_COLOR][1],colors[BODY_COLOR][2]);
    drawCircle(28 ,40, 4.3,true);
```

上述方法组成了"画身体"方法

具体画的

```c++
void myDisplay(void)
{
    //清除缓存
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    paintViewport();
    
    glMatrixMode(GL_MODELVIEW);
    glPushMatrix();
    
    glInitNames();
    glPushName(0);
    
    //身体
    glLoadName(Body);
    drawBody(BodyCor[0], BodyCor[1]);
    
    //嘴
    glPushMatrix();
    glLoadIdentity();
    glLoadName(Mouth);
    drawMouth(MouthCor[0], MouthCor[1]);
    
    //左眼
    glPushMatrix();
    glLoadIdentity();
    glLoadName(EyeLeft);
    drawEyeLeft(EyeLeftCor[0], EyeLeftCor[1]);

    //衣服
    glPushMatrix();
    glLoadIdentity();
    glLoadName(Clothes);
    drawClothes(ClothesCor[0], ClothesCor[1]);
    
    ...
    glPopMatrix();
    ....
    glutSwapBuffers();
}
```

每次绘制之前压栈 `glPushMatrix();` 最后出栈`glPopMatrix`, `glutSwapBuffers` 交换双缓冲就好了.

### 关于鼠标拖动部位

鼠标点击后, 利用 MouseCallback 将鼠标点击的坐标发给 ProcessSelection 函数处理, ProcessSelection 将 gluPickMatrix 获取点击的深度信息和绘制时 Push 的name, 根据 name, 将全局变量改变, 将 select_part 改为选中的部位, 然后在重新绘制时, 根据拖动的坐标偏移量加上原坐标, 就能做到随鼠标移动.

## 效果图

跟随方向键旋转
![blog-gl-4](https://s2.ax1x.com/2019/04/23/EAjJXV.png)

五官分离... 
![blog-gl-5](https://s2.ax1x.com/2019/04/23/EAj3pn.png)

右键菜单
![blog-gl-6](https://s2.ax1x.com/2019/04/23/EAjN0U.png)

奇怪染色的海绵宝宝
![blog-gl-7](https://s2.ax1x.com/2019/04/23/EAjU7F.png)

## 总结

当然了, 如果不是很熟悉, 在编程之前考虑得不可能那么成熟, 随着不断地敲下去才可能发现有些地方可以抽象出来, 这个时候就需要重构了. 程序没有一次写好的, 不断重构是常态.

就是一个简单的海绵宝宝程序. 最后感谢实验室[男神](http://cuiqingcai.com)提供的[OpenGL 教程](http://cuiqingcai.com/2467.html), 男神已经成为了知名博主了. 再次站在巨人的肩膀上.


