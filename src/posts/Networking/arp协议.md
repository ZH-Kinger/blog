---
title: arp协议
icon: network-wired
date: 2026-02-20
category:
  - 计算机网络
---

简单来说，**ARP（Address Resolution Protocol，地址解析协议）** 是局域网中的“翻译官”。它的核心任务是将网络层的 **IP 地址**（逻辑地址）转换为数据链路层的 **MAC 地址**（物理地址）。
<hr id="GGmAi" class="ne-hr">
### 为什么需要 ARP？

在网络通信中，由于 IP 协议和以太网协议分工不同，会出现一个“信息差”：


- **IP 地址**：告诉你目的地在网络的哪个位置（像收件人姓名）。
- **MAC 地址**：网卡唯一的硬件标识，是局域网内传输数据的“真正门牌号”（像身份证号）。

当你只知道目标的 IP 地址时，电脑无法直接把数据包发出去，因为它不知道要把这个包交给哪块网卡。这时候，ARP 就会出面解决问题。
<hr id="qnXU2" class="ne-hr">
### ARP 的工作流程：从“广播喊话”到“私信回复”

我们可以把 ARP 的工作过程想象成在一个办公室里找人：


- **ARP 请求（广播）**：

你的电脑（主机 A）在局域网内大声喊：“**谁的 IP 是 192.168.1.5？请把你的 MAC 地址告诉我！**”

*这条消息会被发给局域网内的所有人（广播）。*


- **ARP 响应（单播）**：

拥有该 IP 的电脑（主机 B）听到后，会回复：“**是我！我的 MAC 地址是 00-AA-BB-CC-DD-EE。**”

*这条回复是直接发给主机 A 的（单播）。*


- **ARP 缓存**：

主机 A 收到回复后，会把这个对应关系存入自己的 **ARP 缓存表**（ARP Cache）里。下次再发数据时，直接查表就行，不用再到处喊了。
<hr id="SCojp" class="ne-hr">
### 常见的几种 ARP 类型

除了标准的 ARP，你可能还会听到这些变体：
<table id="KkVqX" class="ne-table" style="width: 750px"><tbody><tr style="height: 33px"><td width="375">
**类型**
</td><td width="375">
**说明**
</td></tr><tr style="height: 33px"><td width="375">
**免费 ARP (Gratuitous ARP)**
</td><td width="375">
电脑刚开机时自己喊一声：“我的 IP 是 XXX，MAC 是 YYY”。主要用于检测 IP 冲突。
</td></tr><tr style="height: 33px"><td width="375">
**代理 ARP (Proxy ARP)**
</td><td width="375">
当目标不在本局域网时，路由器可以代为响应，告诉发送者：“把包发给我，我帮你转交”。
</td></tr><tr style="height: 33px"><td width="375">
**反向 ARP (RARP)**
</td><td width="375">
知道 MAC 地址求 IP 地址（现在基本被 DHCP 协议取代了）。
</td></tr></tbody></table><hr id="MRvuF" class="ne-hr">
### 潜在的安全风险：ARP 欺骗

ARP 协议设计得很“单纯”：它默认相信任何发来的 ARP 响应。

攻击者可以伪造虚假的响应，告诉你的电脑：“我就是网关”。这样，你原本发往互联网的所有流量都会先经过攻击者的电脑，导致隐私泄露或网络中断。