---
title: Netfilter
icon: network-wired
date: 2026-03-02
category:
  - 计算机网络
---

# Netfilter

**Netfilter** 是 Linux 内核中一个极其强大的**框架**，它专门负责在网络协议栈中“截获”和“处理”数据包。

如果你把 Linux 内核想象成一条生产流水线，数据包是传送带上的产品，那么 **Netfilter 就是流水线上设置的 5 个固定检查站**。它允许其他程序（如 iptables、nftables、firewalld）在这些检查站安插“保安”，根据规则对产品进行放行、丢弃或修改。
<hr id="RrYps" class="ne-hr">
## 1. Netfilter 与 iptables 的关系

这是最容易混淆的地方。


- **Netfilter（内核层）**：它是真正的“执行者”，驻留在 Linux 内核空间。它提供了一套钩子（Hooks）机制，决定数据包在什么时候被处理。
- **iptables / nftables（用户层）**：它们是“指挥官”。用户通过这些工具编写规则（比如“禁止 80 端口进入”），然后下达给 Netfilter 去执行。

**比喻**：Netfilter 是**法律执行系统**，而 iptables 是编写法律的**立法者**。
<hr id="o66w7" class="ne-hr">
## 2. 五个关键钩子 (The 5 Hooks)

Netfilter 在内核协议栈的五个关键位置埋下了“钩子”，数据包每经过一个位置都会触发相应的规则：


- **PREROUTING**：数据包刚进入网卡，还没决定发往哪里。
- **LOCAL_IN (INPUT)**：确定数据包是发给本机的。
- **FORWARD**：确定数据包不是给本机的，需要转发给其他设备。
- **LOCAL_OUT (OUTPUT)**：本机程序产生的向外发送的数据包。
- **POSTROUTING**：数据包即将离开网卡发送出去。
<hr id="SRdot" class="ne-hr">
## 3. Netfilter 的三大核心功能

### ① 数据包过滤 (Packet Filtering)

这是防火墙的基础。根据源 IP、目的 IP、协议类型等，决定数据包是否可以继续通行（ACCEPT）还是被丢弃（DROP）。

### ② 网络地址转换 (NAT)


- **SNAT (Source NAT)**：当你内网的电脑上互联网时，Netfilter 会把私网 IP 转换成公网 IP。
- **DNAT (Destination NAT)**：当外网访问你的服务器时，Netfilter 把公网 IP 映射回内网服务器 IP。

### ③ 数据包修改 (Packet Mangling)

Netfilter 可以修改数据包的头部信息，比如修改 TTL（生存时间）、设置服务类型（QoS 优先级标记）等。
<hr id="LJfc8" class="ne-hr">
## 4. 连接追踪 (Connection Tracking / conntrack)

这是 Netfilter 的“杀手锏”功能。它能记录每一个正在进行的网络连接状态（如 NEW, ESTABLISHED, RELATED）。


- **作用**：即使你只开放了 80 端口，Netfilter 也能识别出哪些数据包是响应你之前请求的“回包”，并自动放行，而不需要你手动为每一个返回流量写规则。这也是**状态检测防火墙**的核心。
<hr id="pM2EJ" class="ne-hr">
## 5. 现状：从 iptables 转向 nftables

在较新的 Linux 内核中（如 2026 年的主流发行版），虽然底层依然由 Netfilter 框架支撑，但前端工具正从 iptables 转向性能更好、语法更简洁的 **nftables**。

**你想看看 ****nftables**** 的语法与 ****iptables**** 有什么不同，还是想了解如何通过修改内核参数来优化 Netfilter 的连接追踪性能？**