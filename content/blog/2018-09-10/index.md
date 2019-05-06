---
title: 树莓派 + OpenWrt 打造无线路由科学上网
date: 2018-09-10 20:00:00
categories: Tips
background: https://s2.ax1x.com/2019/04/23/EEGNDI.jpg
tags:
    - Raspberry
---

## 前言

把树莓派刷成无线路由器这件事情起因比较奇怪------激活我的 Pixel2 XL。

<!--more-->

为了尝鲜 Android P 正式版(9.0.0 PPR1.180610.011, Aug 2018, Telstra)，用 Bootloader 刷完之后第一次进系统，需要输入 Google 账号来“激活”，过去我都是在 WiFi 设置界面挂个 Http Proxy 到局域网的电脑来代理，但是千算万算没想到 Android P 的正式版 Http Proxy 功能挂了（事后经测试只有激活界面的 Http Proxy 挂了，进入系统后功能正常，[BUG Report](https://issuetracker.google.com/issues/113304614) 已经提交给 Google 了）。所以一个能科学上网的路由器就成了激活这半块砖的关键道具。

> 后记：Google 回应已经解决了。大概是这么个流程，
> - 普通用户（我）：你的 X 有 BUG。
> - Google：我知道了，开发团队正在解决。
> - 然后半年过去没有回应。
> - 高玩：我也遇到了，这个大概是 Y 原因，需要更改 Z 代码。
> - 四天后，Google：已解决。

## 准备

这是我的准备清单：

- Raspberry 3 Model B
- LEDE
- Etcher

我手头的树莓派是 Raspberry 3 Model B，这一款有 WiFi 的功能，所以不需要另外购买网卡，如果你是老版本的树莓派，还需要购买另外的无线网卡。还有一点就是处理器型号决定了 OpenWrt 的版本，因为目前 OpenWrt 并不支持 Pi3，所以选择其分支 [LEDE](http://downloads.lede-project.org)。根据我的树莓派型号，我选择了 [bcm2710-rpi-3-ext4-sdcard.img.gz](http://downloads.lede-project.org/releases/17.01.4/targets/brcm2708/bcm2710)。

[Etcher](https://etcher.io) 是树莓派官方推荐的镜像刻录工具，支持 macOS、Linux 和 Windows，用它把镜像写入 SD 卡中。

## 写入镜像

下面我们将开始动手实现这一过程。首先将下载的 LEDE 镜像用 Etcher 写入 SD 卡中。

![blog-ro-1](https://s2.ax1x.com/2019/04/23/EAz59J.png)

## 设置路由器

将树莓派和电脑用网线连接起来，树莓派开机，在电脑中访问 192.168.1.1，就可以登录到 LEDE 的管理后台页面，首次登录不需要密码，直接登录就好，然后设置密码。

### 无线网络功能激活

点击 Network -> Wireless 把无线网络功能激活。

![blog-ro-2](https://s2.ax1x.com/2019/04/23/EAzocR.png)

点击 Edit，可以设置无线网的名称和密码等。

### 添加 WAN 口

点击 Network -> Interfaces -> Add new Interface。名称填 WAN，协议按照你的宽带联网方式来，因为我在学校 DHCP 动态分配 IP，所以我用 DHCP，如果你是拨号上网，就选择 PPPoE 然后填写宽带商提供的账号密码即可。保存应用即可。

![blog-ro-3](https://s2.ax1x.com/2019/04/23/EAzTj1.png)

### 将物理网口修改为 WAN 口

目前的物理网口是 LAN 口，需要将其修改为 WAN。SSH 登录树莓派，输入以下命令

```
$ vi /etc/config/network
```

![blog-ro-4](https://s2.ax1x.com/2019/04/23/EAzI39.png)

将 lan 配置下的 option ifname 'eth0' 注释掉即可。

输入命令 `reboot` 重启路由器。将连接电脑和树莓派的网线断开，把带有网络的网线插入树莓派的网口。

## 给树莓派安装科学上网软件

重启好后，电脑连接树莓派所发出的无线网络，默认名称 LEDE 没有密码，如果你修改过，则相应的填入即可。此时就可以访问国内网站了。

在后台页面中，System -> Software 页面里有升级的按钮，但是推荐通过命令行来升级。

SSH 登入树莓派，输入以下命令。

```
$ opkg udpate
```

升级完成后，刷新树莓派后台页面，升级按钮就没了。

在 LEDE 中，你安装的软件总是两个，一个 xxx.ipk，一个形如 luci-app-xxx.ipk，前者相当于后台，提供具体的功能，后者相当于前端，方便我们通过 LEDE 管理页面来设置。

### 方法一 添加作者源

根据 http://openwrt-dist.sourceforge.net/ 里的说明，

将 `openwrt-dist.pub` 添加到 opkg

```
wget http://openwrt-dist.sourceforge.net/openwrt-dist.pub
opkg-key add openwrt-dist.pub
```

查询自己的 CPU 架构，

```
opkg print-architecture | awk '{print $2}'
```

将下面的两行添加到 `/etc/opkg/customfeeds.conf`，并替换 `{architecture}`

```
src/gz openwrt_dist http://openwrt-dist.sourceforge.net/packages/base/{architecture}
src/gz openwrt_dist_luci http://openwrt-dist.sourceforge.net/packages/luci
```

根据需求可选择下列软件安装，

```
opkg install ChinaDNS
opkg install luci-app-chinadns
opkg install dns-forwarder
opkg install luci-app-dns-forwarder
opkg install shadowsocks-libev
opkg install luci-app-shadowsocks
opkg install simple-obfs
opkg install ShadowVPN
opkg install luci-app-shadowvpn
```

除了使用命令，也可以在 LUCI 页面中安装。

### 方法二 通过 scp 手动上传 

我们所需要的科学上网软件和后面所提到的 DNS 软件等，都是由 [aa65535](https://github.com/aa65535) 大佬提供的。

这里将使用 scp 命令将 $$ 软件上传到树莓派。执行以下命令来安装。

```
$ opkg install xxx.ipk
```

刷新页面，然后 Service 里面会出现新的科学上网选项，进入相应页面后，先在 Server 管理里面输入填入你所设置的科学上网账号。然后在基本设置里，将透明代理中的服务器设置为你刚填好的服务器，保存应用即可。刷新页面，如果透明代理变为运行中即可。

## 树莓派 DNS 设置

如果你现在可以科学上网了，恭喜你。如果没有，说明可能存在 DNS 污染等问题，你完成的工作只有一半。具体的 DNS 设置请参考 [飞羽博客](https://cokebar.info/archives/664) DNS 配置部分，写的非常详细，我也不再照搬一遍了。



> 参考
>
> [Vedio Talk](https://www.youtube.com/watch?v=QSuxEax-GAc)
>
> [飞羽博客](https://cokebar.info/archives/664)

