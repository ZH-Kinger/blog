---
title: ICMP报文
icon: network-wired
date: 2026-03-02
category:
  - 计算机网络
---

简单来说，**ICMP**（Internet Control Message Protocol，互联网控制报文协议）是 TCP/IP 协议族中的一个核心辅助协议。

如果把互联网通信比作寄快递，**IP 协议**负责把包裹送到目的地，而 **ICMP** 就像是快递查询系统和异常报告机制：它不直接运送你的信件内容，但会告诉你“快递丢了”、“地址找不到”或者“路堵了”。
<hr id="bYcM5" class="ne-hr">
### 1. ICMP 的核心功能

ICMP 运行在**网络层（Network Layer）**，它的主要任务有两个：**确认网络通畅性**和**报告错误**。


- **确认状态（查询任务）：** 检查目标主机是否在线，或者测量数据包往返的时间。
- **报告错误（控制任务）：** 当数据包在传输过程中遇到问题（比如找不到路径、生存时间 TTL 耗尽）时，路由器会通过 ICMP 报文通知发送者。
<hr id="TJjx1" class="ne-hr">
### 2. ICMP 的两大常用工具

你可能每天都在使用 ICMP，只是没有意识到：


- **Ping**：


- 它利用了 ICMP 的 **回显请求（Echo Request）** 和 **回显应答（Echo Reply）**。
- 当你执行 ping google.com，你的电脑发出 Request，对方回传 Reply。如果能收到，说明物理链路和对方主机都是正常的。


- **Traceroute（路由跟踪）**：


- 它利用 ICMP 的 **超时报文（Time Exceeded）**。
- 它通过故意让数据包的 TTL 逐个增加，诱导路径上的每个路由器发回 ICMP 报错，从而“画”出数据包经过的所有站点。

<hr id="SBXoM" class="ne-hr">
### 3. ICMP 的报文结构

ICMP 报文是封装在 **IP 数据包** 内部的。它的关键字段包括：


- **类型（Type）**：大类。例如 8 代表请求，0 代表应答，3 代表不可达。
- **代码（Code）**：小类。例如类型 3 下的代码 1 代表“主机不可达”，代码 3 代表“端口不可达”。
- **校验和（Checksum）**：确保数据在传输中没被损坏。
<hr id="PKg0y" class="ne-hr">
### 4. ICMP 与安全（iptables 相关）

在网络安全中，ICMP 是一把双刃剑：


- **风险：** 黑客可以通过 ICMP 探测你的网络拓扑（扫描哪些 IP 在线），或者发动 ICMP Flood 攻击（洪水攻击）让你的网卡瘫痪。
- **防御：** 许多管理员会在防火墙中限制 ICMP。

**在 ****iptables**** 中禁掉 Ping 的典型命令：**

Bash

```
# 拦截所有进入本机的 ICMP 回显请求（别人 Ping 不通你）
iptables -A INPUT -p icmp --icmp-type echo-request -j DROP
```
<hr id="ilPkE" class="ne-hr">
### 5. 总结


- **TCP/UDP**：负责搬运**业务数据**（网页、视频、聊天内容）。
- **ICMP**：负责搬运**网络状态信息**。