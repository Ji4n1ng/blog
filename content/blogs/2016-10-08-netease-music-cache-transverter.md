---
title: 网易云音乐缓存转换工具
date: 2016-10-08 18:35:54
template: post
draft: false
slug: "/posts/netease-music-cache-transverter/"
category: "Development"
tags:
   - "Swift"
   - "Tool"
background: https://s2.ax1x.com/2019/04/23/EEG5PU.jpg
---

## 前言

Mac 网易云音乐缓存转换工具。

<!--more-->

*仅供个人瞎折腾所用，严禁用于商业用途（虽然我也不知道有没有坏用途，先声明一下）。*

咳，请注意，这是一个利用缓存文件重制 MP3 并被网易云音乐识别的小工具，并不会让你拥有这首歌的下载权利。

## 问题

我没有会员 (其实我有，假设没有)，这首歌需要会员才能下载，非会员只能在线听，怎么才能在我离线状态下听呢 (如果我不注重128K的音质).

## 思路

思路: 找到缓存文件 -> 查询文件信息 -> 将歌曲信息加密 -> 将歌曲信息和加密信息利用Lame写进MP3文件 -> 移动到网易下载音乐的目录 -> Enjoy it!

```
platform: Mac
language: Swift3.0
```

## 1. 缓存文件相关

```
/Users/YourName/Library/Containers/com.netease.163music/Data/Caches/online_play_cache
```

这是我的Mac上缓存文件的目录. 你的系统目录需要替换一下 `YourName`.

![blog-tm-0](https://s2.ax1x.com/2019/04/18/EpC09x.jpg)


这是什么鬼! 不妨看一下它们的大小:  39字节， 118字节， 11.8MB.

显然11.8MB的体积出卖了它. 通过直接改后缀，它竟然能直接被播放… 网易有点小懒，不过也有了可乘之机. 其实这三个文件分别是歌词文件，信息文件，音乐文件.

```
idx
{"size":11847219,"zone":["0 11847218"]}
```

```
info
{"bitrate":"320","volumeGain":"-1.880000","songId":"31152600","md5":"acee7d4c822258fc829ebaa75549b278","format":"mp3"}
```

![blog-tm-1](https://s2.ax1x.com/2019/04/18/EpC2Ed.jpg)


那么这个名字是什么鬼.

```
http://music.163.com/api/song/detail/?id=31152600&ids=%5B31152600%5D
```

看到这个 API，就很清晰了. 这是查询这首歌信息的songId. 这个的用处过会再说.

那么这个文件即使是改了正常的名字，拖进网易云音乐的下载文件夹也不能被直接识别. 因为这个文件缺少了信息. 整个过程的关键也在此.

![blog-tm-2](https://s2.ax1x.com/2019/04/18/EpC48P.jpg)

通过对比两个文件(右边的为正版网易云音乐文件)，我们可以发现，一个`注释`很可疑.

```
163 key(Don't modify):Nl7KBB481H1s6KDr+0LDleV3BNgun+wbkH1VhgrfqMPZzOZVsT3BLFqC2uS7YY09/lrsyew/bRgFclEd6cIwSf8yaE4qkrunWhZhBK3vjD32WJrHnBWhpnlUpA3YcTOyE2l8UxMYHthHFfSfhsJyxJVU9FEPNLs1RUUrVY1rXw4IunfAgYR2xZjzgDJt7pqtnJSSlrBJD8OSAiA2vrMj89KpXOSxs0dSxmwlJThnZwBgYvC+9NFwnikG+yf3We9GyTtXQGipFKgTkus+RnK/jyAEizPAO7HO5h+EgqCp1Mlddnob0oxyI0AeAhvf38ZbdnuvfvqG4XG9IhvI2Npr3J1nirpvoP5RpapGO+R42raX8fINZaS3q5nKQf8zAhjRNj8a9HHlL6sdqQfU5KaSJEyHlNeASUquFE5lsByFK9kXERkXSn1iJncZUUahRgTj6xpbVZOUCmlj8mp1VksKC/ixTXlVoSbGs8xwxuO79DkyuGeYx+K6zXUmOvlsvfAVb6Po37vhZbqZ9YEyZxPVRAH1JCPIpkJTQJA4CCJPTT+vBJ846IwwL6gjK/AIW3exkOKuKgyUb0yddP4zJixj2DRYfzUs1x+EOYBo+PYI7EgT/RQTTeYLAJwU9rbChG5Mt6IpHFxmlikMjvEgmKnnzlw0/imiqUiNFXvxEwLm6m0O/6XjmNtshdQKbROB1N5LUjt+vhxJtUsiDb2CLfDLOA==
```

通过查 [JF的博客](http://blog.zzbd.org/2015/05/07/netease-music-tag/)，知道了这个注释一个经过 AES 加密，并且Base64 编码后的字符串.

那么这个加密后的信息解密后:

```json
music:{"albumId": 3112513,
  "alias": [],
  "mMusic": "{\"fid\":7780144278729503,\"br\":160000,\"size\":5923693}",
  "album": "2M2H",
  "musicId": 31152600,
  "musicName": "Carried Away",
  "mvId": 0,
  "duration": 296000,
  "lMusic": "{\"fid\":7773547208962834,\"br\":96000,\"size\":3554282}",
  "bitrate": 320000,
  "albumPic": "http://p4.music.126.net/V1wyjAqur6wWJfMJkk_IfQ==/7727367720543370.jpg",
  "mp3DocId": 7731765767111592,
  "artist": [
    [
      "Great Good Fine OK",
      905068
    ]
  ],
  "hMusic": "{\"fid\":7731765767111592,\"br\":320000,\"size\":11847219}",
  "albumPicDocId": 7727367720543370
}
```

这段 json 是歌曲相关的信息，我大胆猜测是因为这个加密信息决定了网易云音乐客户端判断该文件是不是从网易服务器下载的自家文件.

## 2.查询歌曲信息

那么我们可以手动配好这段 JSON

通过上面的 URL

```
http://music.163.com/api/song/detail/?id=31152600&ids=%5B31152600%5D
```

我们可以获取所有歌曲信息，解析一下 JSON 就可以配置成上面的这段信息.

当然，我们的文件没有专辑封面，还要获得专辑封面. 通过上面的URL里有一项可以获得专辑封面

![blog-tm-3](https://s2.ax1x.com/2019/04/18/EpCcHH.jpg)

## 3.获取加密注释

这个 AES 简直让我头疼的不要不要的. 原谅我不懂加密. 在全网的解密网站进行解密，最终发现了[AES Encryption](http://aesencryption.net/)这个网站能解密.

根据博客，可知Key为 `***********` (暂时隐去)，博主是通过逆向得到的.

![blog-tm-4](https://s2.ax1x.com/2019/04/18/EpChCt.jpg)

通过 `Charles` 这个神器，在点击 Encrypt/Decrypt 按钮后，我抓到了表单提交的方式.

![blog-tm-5](https://s2.ax1x.com/2019/04/18/EpCRUA.jpg)

![blog-tm-6](https://s2.ax1x.com/2019/04/18/EpCW4I.jpg)

根据这些参数配置好请求. 解析一下返回后的 HTML，提取加密后的字符串，在字符串前添加 `163 key(Don't modify):` 就配置好了.

## 3.LAME

![blog-tm-7](https://s2.ax1x.com/2019/04/18/EpC5gf.jpg)

重新编码MP3文件，就是通过这款神器将歌名，歌手，专辑，专辑图片和最重要的加密注释写进MP3文件中.

[Installing LAME on Mac OSX Lion](https://gist.github.com/trevorsheridan/1948448)

```
Getting the Source
$ cd ~/source
$ curl -L -O http://downloads.sourceforge.net/project/lame/lame/3.99/lame-3.99.5.tar.gz
$ tar -zxvf lame-3.99.5.tar.gz
$ rm -r lame-3.99.5.tar.gz
$ cd lame-3.99.5

Installing
$ ./configure
$ make
$ sudo make install

Checking if it was installed successfully
$ which lame
$ lame -v
```

在终端中执行下列代码，即可

```
lame -b 320 --ti /Users/Jianing/Desktop/01.jpg --tt 'Carried Away' --ta 'Great Good Fine OK' /Users/Jianing/Desktop/test.mp3 --tl '2M2H' --tc "163 key(Don't modify):Nl7KBB481H1s6KDr+0LDlTmzcc+VUcElSdefUAs4k9TZzOZVsT3BLFqC2uS7YY09/cphkXZKwgwLwZdkK6DiuPcGmSdKv3CKIxg4shzkNDzwsJMdyfgeRtCMFWLMH1UzOByjQtuVuXqJO8lmEoW+GX8eOAQhgJKliYwIsQoxLdVTuzpvVPy0ToLJr4H6Nzwgit+mKYxjEuA0vE6k6LsyEKjXDPHh0L5PAMhn9RFjnCFS4+dU8jEVa5zIemxxkSIJwcpPO5n/aai0uyB/0T12SNQ+wSCmgsBwdF6/IEP7Hv5u5Y8Bg/8P1sHg40eZ3pR9PQvul4Vom3kCsyWkHEwSv23bFkp3ZBUyqXZhtioQAAWQbVnhjJ/wpTG1AWnHWH3iTfsD9utHHtBSUwP2uRploeAFyqkjSU3nuZ2OqIqiNi9kmayJuVE4PmJbfpldAf3XO0pQtTWb+jpuwQ9KkrOGiYyf9Jv/cmJ4JlT7y36oXAZOafghmMM2aDAa+hk+cjJYq9BsmbBovHhMTF+hVLRQu6SEuIfu06FsI0K4qIk77ff7ohIgYllkf7iLic8tgJF9E3vRCx2KhU33tPyNX4gbKfeTQzZCV35xfdnNi8njL18dBmra/Y4wg0hVDweYZ9tO7OLII8m+Uhb4k5UsW2FB8xf7BodIRbw1uhNLs5NvhEbulMURMMs/+CFw6AxKT6ZN13V0J9BnTaj6aZY6QUcN9A=="
```

## 4.移动文件

经过 lame 重制后的 mp3 拖进 `/Users/YourName/Music/网易云音乐` 这个目录 (网易云音乐的下载目录) 即可被网易云音乐识别.

![blog-tm-8](https://s2.ax1x.com/2019/04/18/EpCIv8.jpg)

![blog-tm-9](https://s2.ax1x.com/2019/04/18/EpCTKS.jpg)

当下载图案变成对号的时候，是不是有点激动

Enjoy it~~

## Final

我用 Swift 写的 Mac 命令行程序. 暂时不想开源，倒不是吝啬，主要是这个并不是很 legal 的东西... 认识我的小盆友可以直接问我要源码...

效果图如下:

![blog-tm-10](https://s2.ax1x.com/2019/04/18/EpC7Dg.jpg)

So，这就是我国庆玩的小程序. 本来打算写一个 macOS 的图形界面程序，但是有点麻烦，就写了命令版本的，如果大家喜欢，我考虑研究一下高品质的API，拿到高品质或者无损的缓存就可以更加愉快的和网易云音乐玩耍了.

不过，网易云音乐做得真良心，然而我这么别有用心会让人家伤心的... 请支持正版! 当然了只是业余玩玩，我自己还是乖乖支持会员了!

最后再强调一遍: 仅供个人瞎折腾所用，严禁用于商业用途. 如有损坏您的利益，请联系 wjnmailg@gmail.com

> 参考资料:
>
> [J.F's Blog](http://blog.zzbd.org/2015/05/07/netease-music-tag/)
>
> [AES Encryption](http://aesencryption.net/)


