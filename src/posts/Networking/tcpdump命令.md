---
title: tcpdump命令
icon: network-wired
date: 2026-02-24
category:
  - 计算机网络
---

如果说 nmap 是侦察兵，lsof 是管理员，那么 **tcpdump** 就是网络世界的“闭路电视”和“显微镜”。它是 Linux 下最强大的命令行抓包工具，能够实时截获并分析网卡上通过的数据包。
<hr id="fbhEf" class="ne-hr">
### 1. tcpdump 的核心逻辑

tcpdump 的强大在于它的**过滤表达式**。如果不加过滤，海量的数据包会瞬间刷屏。它的命令结构通常是：

tcpdump [选项] [过滤表达式]
<hr id="Lah2E" class="ne-hr">
### 2. 常用基础选项 (Options)
<table id="ucrRb" class="ne-table" style="width: 750px"><tbody><tr style="height: 33px"><td width="375">
**选项**
</td><td width="375">
**功能描述**
</td></tr><tr style="height: 33px"><td width="375">
**-i**
</td><td width="375">
指定监听的网卡（如 -i eth0

），any

表示监听所有网卡。
</td></tr><tr style="height: 33px"><td width="375">
**-n**
</td><td width="375">
不解析主机名（显示 IP 而不是域名），速度更快。
</td></tr><tr style="height: 33px"><td width="375">
**-nn**
</td><td width="375">
不解析主机名和端口名（显示 80 而不是 http）。
</td></tr><tr style="height: 33px"><td width="375">
**-X**
</td><td width="375">
以 Hex (十六进制) 和 ASCII 形式打印数据包内容（看明文协议很有用）。
</td></tr><tr style="height: 33px"><td width="375">
**-v / -vv**
</td><td width="375">
显示更详细的报文信息（如 TTL、ID、标志位等）。
</td></tr><tr style="height: 33px"><td width="375">
**-c**
</td><td width="375">
抓取指定数量的包后退出（如 -c 10

）。
</td></tr><tr style="height: 33px"><td width="375">
**-w**
</td><td width="375">
将抓取的包保存到文件（如 -w test.pcap

），可用 Wireshark 打开。
</td></tr></tbody></table><hr id="VOKuF" class="ne-hr">
### 3. 精准过滤表达式 (Filters)

这是 tcpdump 的灵魂，支持按地址、端口、协议进行组合。

#### A. 按主机/网段过滤


- tcpdump host 192.168.1.1 (只看与该 IP 相关的所有流量)
- tcpdump src 192.168.1.5 (只看来源是该 IP 的包)
- tcpdump net 192.168.1.0/24 (查看整个网段)

#### B. 按端口过滤


- tcpdump port 80 (只看 80 端口)
- tcpdump portrange 1000-2000 (查看端口范围)

#### C. 按协议过滤


- tcpdump icmp (看 Ping 包)
- tcpdump tcp 或 tcpdump udp

#### D. 逻辑组合 (and, or, not)


- tcpdump src 192.168.1.1 and port 80 (来源是 .1 且端口是 80)
- tcpdump port 80 or port 443 (看 HTTP 或 HTTPS)
- tcpdump not port 22 (排除 SSH 流量，避免被自己的远程连接刷屏)
<hr id="sJQyc" class="ne-hr">
### 4. 实战案例 (直接拿去用)

#### 场景 1：排查 Web 服务响应慢

抓取 80 端口的所有包，并显示内容：

```
tcpdump -i eth0 -nn -X port 80
```

#### 场景 2：查看经典的 TCP 三次握手

利用标志位过滤（只看 SYN 和 ACK）：

```
tcpdump -i eth0 'tcp[tcpflags] & (tcp-syn|tcp-ack) != 0'
```

#### 场景 3：保存包给 Wireshark 分析

在服务器上抓包，在电脑上用图形化工具看：

```
tcpdump -i eth0 -w dump.pcap
```
<hr id="U8OmL" class="ne-hr">
### 5. tcpdump 输出内容怎么看？

一条标准的 TCP 包输出通常长这样：

23:10:01.123456 IP 192.168.1.5.54321 > 192.168.1.1.80: Flags [S], seq 12345, win 64240, length 0


- **时间戳**：23:10:01...
- **源 IP.端口 > 目的 IP.端口**：1.5.54321 > 1.1.80
- **Flags**: [S] 代表 SYN（请求连接），[.] 代表 ACK（确认），[P] 代表推送数据，[F] 代表结束连接。
- **seq/ack**: 序列号和确认号。
<hr id="FSaL2" class="ne-hr">
### 避坑指南


- **权限**：必须使用 sudo 运行。
- **性能**：在高并发服务器上，尽量使用具体的过滤条件，并配合 -c 限制数量，否则可能导致 CPU 飙升。
- **SSH 陷阱**：如果你通过 SSH 连接服务器，千万不要在不加过滤的情况下抓包，否则会产生“死循环”（抓包动作产生 SSH 流量 -> 产生新包 -> 又被抓到），屏幕会疯狂滚动。