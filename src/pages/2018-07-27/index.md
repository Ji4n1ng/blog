---
title: 利用 Automator 将 PPT / Word 批量转换为 PDF
date: 2018-07-27 20:00:00
categories: Tips
background: https://i.imgur.com/nBea4Bs.jpg
---

## 前言

很久之前在知乎回答了一个[问题](https://www.zhihu.com/question/19805756/answer/150577626)，因为弃乎已久，近来发现先后有几人私信我怎么制作这个 Workflow，遂来简单的说一下。

<!--more-->

## Automator

![blog-at-01](http://on74pxnsk.bkt.clouddn.com/blog-at-01.jpg)

Automator（在 macOS 10.13.2 之后，汉化为“自动操作”，好难听）是 macOS 的一个自动化工具，利用一系列组合操作来将人们从重复性的简单的工作中解放出来。Automator 支持很多系统应用的功能，当然一些第三方的应用也做了对 Automator 接口的支持。这里要对 MS Office 点赞。

## Workflow、App、Service

在打开 Automator 之后，可以选择创建 Workflow、App 或者 Service 等。三者的存在形式不一样，对 Workflow 双击就是利用 Automator 打开，App 可以当做一个应用来看，Service 在右键菜单里。

![blog-at-02](http://on74pxnsk.bkt.clouddn.com/blog-at-02.jpg)

Workflow 示例图如下：

![blog-at-03](http://on74pxnsk.bkt.clouddn.com/blog-at-03.jpg)

如果你所需的自动化工作需要经常修改一些东西，例如要修改一些名称或者参数之类的，那你最好选择第一种形式。如果不需要，可以选择第二种，不用打开再点击执行，例如可以将一对文件直接拖到 App 上。当你需要对单个文件执行的时候，利用第三种形式就不用再去找 Workflow 或者 App 了，直接右键->服务执行就可以。

## 制作 App

以 App 为例，选择运行 AppleScript，将代码粘贴进去即可。

![blog-at-04](http://on74pxnsk.bkt.clouddn.com/blog-at-04.jpg)

制作完成之后，就是一个 .app 应用：

![blog-wf-02](http://on74pxnsk.bkt.clouddn.com/blog-wf-02.jpg)

AppleScript 代码如下：

```
on run {input, parameters}
	set theOutput to {}
	tell application "Microsoft PowerPoint" -- work on version 15.15 or newer
		launch
		set theDial to start up dialog
		set start up dialog to false
		repeat with i in input
			open i
			set pdfPath to my makeNewPath(i)
			save active presentation in pdfPath as save as PDF -- save in same folder
			close active presentation saving no
			set end of theOutput to pdfPath as alias
		end repeat
		set start up dialog to theDial
	end tell
	return theOutput
end run

on makeNewPath(f)
	set t to f as string
	if t ends with ".pptx" then
		return (text 1 thru -6 of t) & ".pdf"
	else
		return (text 1 thru -5 of t) & ".pdf"
	end if
end makeNewPath
```

制作 Service 同理。

## 运行

注意！**请先打开 PowerPoint 或者 Word**，然后再将待处理文件拖到 App 上。

处理中：

![1](http://on74pxnsk.bkt.clouddn.com/blog-wf-03.jpg)

处理完成之后：

![2](http://on74pxnsk.bkt.clouddn.com/blog-wf-04.jpg)

## Word

最后附上 Word 批量转 PDF 的 AppleScript 代码。

```
property theList : {"doc", "docx"}
 
on run {input, parameters}
          set output to {}
          tell application "Microsoft Word" to set theOldDefaultPath to get default file path file path type documents path
          repeat with x in input
                    try
                              set theDoc to contents of x
                              tell application "Finder"
                                        set theFilePath to container of theDoc as text
 
                                        set ext to name extension of theDoc
                                        if ext is in theList then
                                                  set theName to name of theDoc
                                                  copy length of theName to l
                                                  copy length of ext to exl
 
                                                  set n to l - exl - 1
                                                  copy characters 1 through n of theName as string to theFilename
 
                                                  set theFilename to theFilename & ".pdf"
 
                                                  tell application "Microsoft Word"
  set default file path file path type documents path path theFilePath
                                                            open theDoc
                                                            set theActiveDoc to the active document
  save as theActiveDoc file format format PDF file name theFilename
                                                            copy (POSIX path of (theFilePath & theFilename as string)) to end of output
  close theActiveDoc
                                                  end tell
                                        end if
                              end tell
                    end try
          end repeat
          tell application "Microsoft Word" to set default file path file path type documents path path theOldDefaultPath
 
 
          return output
end run
```

> 最后，如果对 Workflow 感兴趣，可以看我另一篇[博客](http://www.jianing.wang/2017/03/09/Workflow%E5%88%9D%E8%AF%86/)里面简单的介绍


