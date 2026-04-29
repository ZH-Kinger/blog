---
title: NAT
icon: network-wired
date: 2026-02-16
category:
  - 计算机网络
---

## nat是什么？

简单来说，**NAT**（Network Address Translation，网络地址转换）是一种将“私有 IP 地址”转换为“公用 IP 地址”的技术。

它的核心作用是让多台处于局域网（内网）的设备，通过共享同一个公网 IP 地址来访问互联网。
<hr id="DphHw" class="ne-hr">
## 一、 为什么需要 NAT？

NAT 的出现主要是为了解决以下两个问题：


- **缓解 IPv4 地址枯竭**：IPv4 地址只有约 43 亿个，远远不够全球设备使用。通过 NAT，一个家庭或公司只需要一个公网 IP，内部成百上千台设备就能上网。
- **安全性**：NAT 隐藏了内网设备的真实 IP 地址。外界只能看到路由器的公网 IP，无法直接攻击内网的电脑，相当于一层天然的防火墙。
<hr id="DPZMx" class="ne-hr">
## 二、 NAT 是如何工作的？

你可以把 NAT 想象成一个**“邮件转办处”**：


- **发出请求**：你的电脑（IP: 192.168.1.5）想看网页。它把数据包发给路由器。
- **地址转换**：路由器把数据包里的“寄件人”地址从私有的 192.168.1.5 换成运营商给它的公网 IP（比如 202.96.x.x），并记录在一个 **NAT 转换表**里。
- **数据返回**：网页服务器把内容发回到公网 IP。
- **分发回传**：路由器查表发现这个请求是 192.168.1.5 发起的，再把地址换回来，转发给你的电脑。
<hr id="WfxTZ" class="ne-hr">
## 三、 NAT 的常见分类
<table id="H7RkG" class="ne-table" style="width: 750px"><tbody><tr style="height: 33px"><td width="250">
**类型**
</td><td width="250">
**简称**
</td><td width="250">
**特点**
</td></tr><tr style="height: 33px"><td width="250">
**静态 NAT**
</td><td width="250">
Static NAT
</td><td width="250">
一个内网 IP 固定对应一个公网 IP。通常用于内网服务器对外提供服务。
</td></tr><tr style="height: 33px"><td width="250">
**动态 NAT**
</td><td width="250">
Dynamic NAT
</td><td width="250">
在一个公网 IP 池中动态分配。谁先上网谁占用，用完释放。
</td></tr><tr style="height: 33px"><td width="250">
**端口多路复用**
</td><td width="250">
**NAPT / PAT**
</td><td width="250">
**最常用类型**。通过不同的“端口号”来区分不同的设备。即使只有一个公网 IP，也能让上百台设备同时在线。
</td></tr></tbody></table><hr id="iEtHg" class="ne-hr">
## 四、 在三层交换机中的应用

在你之前的实验中，**三层交换机主要负责内网 VLAN 间的通信**。通常 NAT 功能是在连接外网的**出口路由器**上开启的。


- **三层交换机**：负责“楼层内/部门间”的路由。
- **路由器（开启 NAT）**：负责“公司到互联网”的转换。
<hr id="TmtMj" class="ne-hr">
### 总结

NAT 就是**内网到外网的“翻译官”**。它既省了钱（不用买那么多公网 IP），又保了命（隐藏了内网结构）。

**既然你了解了 NAT，你想看看如何在思科设备上配置一个简单的 NAT 指令，还是想了解一下它的“兄弟”技术——端口映射（Port Forwarding）？**

****

****

## SNAT（源地址转换）

**SNAT (Source Network Address Translation)** 修改数据包的**源 IP 地址**。


- **应用场景**：最常见的上网方式。当内网（私有 IP）的多台电脑想要访问互联网（公网 IP）时，路由器将这些电脑发出的数据包的源地址改为路由器的公网 IP。
- **谁发起的？**：由**内部网络终端**发起的请求。
- **作用**：隐藏内部真实 IP，解决公网 IP 不足的问题。
- **典型案例**：你在家里连接 WiFi 上网。
<hr id="U65Tx" class="ne-hr">
## DNAT（目的地址转换）

**DNAT (Destination Network Address Translation)** 修改数据包的**目的 IP 地址**。


- **应用场景**：通常用于**发布服务**。当外部用户想要访问你内网的一台服务器（比如 Web 服务器或游戏服务器）时，他们访问的是你的公网 IP，路由器收到请求后，将数据包的目的地址改为内网服务器的私有 IP。
- **谁发起的？**：由**外部网络（互联网）**发起的请求。
- **作用**：保护服务器，使外部用户无法直接看到内网服务器的真实 IP，同时实现“端口映射”。
- **典型案例**：公司内网有一台网站服务器，你想让全世界的人都能通过公司的公网 IP 看到这个网站。
<hr id="Nff1T" class="ne-hr">
## SNAT vs DNAT 对比表
<table id="FmkJ8" class="ne-table" style="width: 750px"><tbody><tr style="height: 33px"><td width="250">
**特性**
</td><td width="250">
**SNAT (源地址转换)**
</td><td width="250">
**DNAT (目的地址转换)**
</td></tr><tr style="height: 33px"><td width="250">
**修改位置**
</td><td width="250">
数据包的 **Source IP**
</td><td width="250">
数据包的 **Destination IP**
</td></tr><tr style="height: 33px"><td width="250">
**数据流向**
</td><td width="250">
**内部 → 外部**
</td><td width="250">
**外部 → 内部**
</td></tr><tr style="height: 33px"><td width="250">
**主要目的**
</td><td width="250">
内部私网主机访问互联网
</td><td width="250">
互联网用户访问内部服务器
</td></tr><tr style="height: 33px"><td width="250">
**典型配置**
</td><td width="250">
配置在出口路由器的 **Outbound** 方向
</td><td width="250">
配置在出口路由器的 **Inbound** 方向
</td></tr><tr style="height: 33px"><td width="250">
**生活例子**
</td><td width="250">
多人共用一个公网 IP 上网
</td><td width="250">
远程桌面映射、内网建站
</td></tr></tbody></table><hr id="Q79Zm" class="ne-hr">
## 

****