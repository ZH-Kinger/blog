---
title: vlan和vxlan
icon: network-wired
date: 2026-02-14
category:
  - 计算机网络
---

## 1. 什么是 VLAN？ (Virtual Local Area Network)

VLAN 是一种在**二层（数据链路层）**隔离广播域的技术。它通过在以太网帧中插入一个 **802.1Q 标签（Tag）**，让物理上的同一台交换机逻辑上变成多台虚拟交换机。


- **核心限制：** 它的标签只有 **12 位（bits）**，这意味着一个网络里最多只能有 $2^{12} = 4096$ 个 VLAN。这在早期的公司网络够用了，但在拥有成千上万租户的云数据中心里，这远远不够。

## 2. 什么是 VXLAN？ (Virtual Extensible LAN)

VXLAN 是一种 **MAC-in-UDP** 的隧道技术（隧道协议）。它把二层以太网帧封装在三层 UDP 报文中，从而实现“大二层网络”。


- **核心优势：** 它的标识符（VNI）有 **24 位（bits）**，支持多达 $2^{24} \approx 1600$ 万个隔离网络。

### 3. VLAN 与 VXLAN 的深度对比
<table id="GdIrS" class="ne-table" style="width: 750px"><tbody><tr style="height: 33px"><td width="250">
**特性**
</td><td width="250">
**VLAN (传统)**
</td><td width="250">
**VXLAN (现代)**
</td></tr><tr style="height: 33px"><td width="250">
**OSI 层级**
</td><td width="250">
二层 (Layer 2)
</td><td width="250">
三层之上的隧道 (Layer 3 Overlay)
</td></tr><tr style="height: 33px"><td width="250">
**ID 限制**
</td><td width="250">
**4,096** (12-bit ID)
</td><td width="250">
**16,777,216** (24-bit VNI)
</td></tr><tr style="height: 33px"><td width="250">
**跨网段传输**
</td><td width="250">
困难（通常需要二层链路汇聚）
</td><td width="250">
轻松（基于 IP 网络，可跨路由器/互联网）
</td></tr><tr style="height: 33px"><td width="250">
**负载均衡**
</td><td width="250">
使用 STP（生成树），链路利用率低
</td><td width="250">
使用 ECMP（等价多路径），多条路径同时跑
</td></tr><tr style="height: 33px"><td width="250">
**主要用途**
</td><td width="250">
办公室、实验室、小型机房
</td><td width="250">
**公有云、SDN（软件定义网络）、大规模虚拟机迁移**
</td></tr></tbody></table><hr id="X2tig" class="ne-hr">
### 4. 为什么现在大家都聊 VXLAN？

想象一下，如果你在阿里云或华为云上开了一台虚拟机：


- **突破物理限制：** 你的两台服务器可能物理上相隔几公里，中间隔着无数路由器。VLAN 没法跨路由器，但 VXLAN 可以像“钻山隧道”一样，让两台机器觉得自己在同一个交换机下。
- **虚拟机迁移：** 当你的虚拟机从 A 机架搬到 B 机架时，它的 IP 地址不需要变，业务不会中断。这是因为 VXLAN 在底层 IP 网络之上构建了一个透明的虚拟层。
- **多租户隔离：** 在云环境下，4096 个分区根本不够分给成千上万的用户，VXLAN 的 1600 万个分区解决了这个燃眉之急。
<hr id="H6uY9" class="ne-hr">
### 5. 总结


- **VLAN** 就像是把一个大房间用**屏风**隔成几个小单间。
- **VXLAN** 就像是在不同的城市之间修了**专用的高速隧道**，即使物理距离很远，逻辑上也像是在同一个房间里。

## 广播域是什么？

**广播域（Broadcast Domain）** 简单来说，就是**广播包（全网喊话）能够传达到的最大范围。**

### 1. 核心定义

在一个广播域内，如果一台设备发送了一个广播帧（目标 MAC 地址为 FF:FF:FF:FF:FF:FF），该范围内所有的其他设备都能收到这个包。

### 2. 关键设备区别

判断广播域范围，看这三样东西：


- **交换机（Switch）：** 默认情况下，连接在同一台交换机上的所有电脑都在**同一个**广播域内。
- **路由器（Router）：** 路由器的每一个接口都是一个**独立**的广播域。路由器默认**隔离**广播，不会把广播包从一个接口传到另一个接口。
- **VLAN（虚拟局域网）：** 在交换机上划分 VLAN 后，每一个 VLAN 就是一个**逻辑上独立**的广播域。
<hr id="Bwwbj" class="ne-hr">
### 3. 为什么要限制广播域？

如果一个广播域太大（比如几千台电脑连在一起）：


- **广播风暴：** 太多设备同时“喊话”，会挤爆网络带宽。
- **性能损耗：** 每台电脑的 CPU 都要停下手中的活儿去处理这个广播包，导致设备变慢。
- **安全问题：** 广播包里可能含有敏感信息，不该听到的设备也能听到。
<hr id="LEH10" class="ne-hr">
### 4. 总结对比
<table id="YtLsi" class="ne-table" style="width: 750px"><tbody><tr style="height: 33px"><td width="250">
**概念**
</td><td width="250">
**范围层级**
</td><td width="250">
**核心作用**
</td></tr><tr style="height: 33px"><td width="250">
**冲突域**
</td><td width="250">
物理层/数据链路层
</td><td width="250">
解决“两台机器同时说话会撞车”的问题（交换机端口隔离）
</td></tr><tr style="height: 33px"><td width="250">
**广播域**
</td><td width="250">
数据链路层
</td><td width="250">
解决“一个人说话全网都要听”的问题（路由器/VLAN 隔离）
</td></tr></tbody></table>
**一句话总结：** 交换机隔离冲突域，路由器隔离广播域。

## 划分vlan

即使在同一网段也不一定能通信，vlan可能不同

### 1，点击交换机进入配置界面

![](https://cdn.nlark.com/yuque/0/2026/png/62301513/1771164332347-7efd8bf4-6eda-40c1-beb3-b6c79a5d1da1.png)

### 2，点击config选择vlan databases添加vlan

![](https://cdn.nlark.com/yuque/0/2026/png/62301513/1771164411082-0a5b4105-48e9-4b6b-a90f-234929573763.png)

添加了vlan100，名字是dev的vlan网段

![](https://cdn.nlark.com/yuque/0/2026/png/62301513/1771164449016-8d427c53-36a2-4fc3-9aa3-8480442641b0.png)

### 3，选择接口修改vlan网段

![](https://cdn.nlark.com/yuque/0/2026/png/62301513/1771164561366-28ae4c1d-8995-4155-9e99-fae99bd57da4.png)