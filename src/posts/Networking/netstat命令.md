---
title: netstat命令
icon: network-wired
date: 2026-02-23
category:
  - 计算机网络
---

netstat（Network Statistics）是一个经典的命令行工具，用于监控网络连接、路由表、接口统计以及更多网络相关信息。虽然在一些现代 Linux 系统中它逐渐被 ss 命令取代，但它依然是网络排障和系统监控的“瑞士军刀”。
<hr id="orjVE" class="ne-hr">
## 常用参数组合

在实际操作中，我们很少单独运行 netstat，通常会配合以下参数：
<table id="AZtM4" class="ne-table" style="width: 750px"><tbody><tr style="height: 33px"><td width="375">
**参数**
</td><td width="375">
**含义**
</td></tr><tr style="height: 33px"><td width="375">
**-a** (all)
</td><td width="375">
显示所有连接中的 Socket（包括监听和非监听状态）。
</td></tr><tr style="height: 33px"><td width="375">
**-t** (tcp)
</td><td width="375">
仅显示 TCP 相关连接。
</td></tr><tr style="height: 33px"><td width="375">
**-u** (udp)
</td><td width="375">
仅显示 UDP 相关连接。
</td></tr><tr style="height: 33px"><td width="375">
**-n** (numeric)
</td><td width="375">
直接使用 IP 地址和端口号，不进行域名解析（速度极快）。
</td></tr><tr style="height: 33px"><td width="375">
**-l** (listening)
</td><td width="375">
仅列出正在监听（Listening）的服务端口。
</td></tr><tr style="height: 33px"><td width="375">
**-p** (programs)
</td><td width="375">
显示占用该连接的程序 PID 和名称（通常需要 root 权限）。
</td></tr><tr style="height: 33px"><td width="375">
**-r** (route)
</td><td width="375">
显示核心路由表。
</td></tr></tbody></table><hr id="dQRWN" class="ne-hr">
## 5 个最高频的使用场景

### 1. 查看哪些端口正在被监听

这是最常见的用法，用来确认你的 Web 服务器、数据库等是否已正常启动。

```
netstat -tunlp
```


- **解读**：你会看到 Local Address 列显示类似 0.0.0.0:80，表示 80 端口正在全网监听。

### 2. 查找特定端口被哪个进程占用

如果你尝试启动一个服务却提示“端口已被占用”，可以用这个组合：

```
netstat -anp | grep :8080
```

### 3. 查看网络接口统计

想看看网卡有没有丢包或错误？

```
netstat -i
```

### 4. 实时监控网络连接状态

如果你怀疑服务器遭受攻击（如 SYN Flood），可以统计各种连接状态的数量：

```
netstat -n | awk '/^tcp/ {++S[$NF]} END {for(a in S) print a, S[a]}'
```


- 这会输出类似 ESTABLISHED 50, TIME_WAIT 200 等数据。

### 5. 查看路由信息

确认数据包是从哪个网关出去的：

```
netstat -rn
```
<hr id="fIVWl" class="ne-hr">
## 状态说明（State）

当你运行 netstat 时，State 列的信息至关重要：


- **LISTEN**: 等待从任意远程端口和地址发来的连接请求。
- **ESTABLISHED**: 连接已建立，双方正在传输数据。
- **TIME_WAIT**: 客户端主动关闭连接后进入的等待状态，属于正常现象，但过多可能消耗资源。
- **CLOSE_WAIT**: 远程端已关闭连接，等待本地端关闭。如果此处堆积过多，通常说明程序代码有 Bug。
<hr id="lXd6s" class="ne-hr">
### 小贴士

如果你发现系统提示 command not found，在 CentOS/RHEL 上可以通过 yum install net-tools 安装，在 Ubuntu/Debian 上则是 apt install net-tools。