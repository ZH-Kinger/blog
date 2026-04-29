---
title: iptables命令
icon: network-wired
date: 2026-02-25
category:
  - 计算机网络
---

## iptables

iptables 是 Linux 内核集成的 IP 信息包过滤系统（Netfilter）的用户层配置工具。它通过一系列**表（Tables）**、链（Chains）**和**规则（Rules）来控制进出系统的网络数据流。

![](https://cdn.nlark.com/yuque/0/2026/webp/62301513/1772436134390-fadae255-1058-4323-8427-35291f729a2e.webp)
<hr id="x31Nr" class="ne-hr">
## 1. 核心四表五链 (The 4 Tables & 5 Chains)

理解 iptables 的关键在于掌握数据包在内核中的“旅行路线”。

![](https://cdn.nlark.com/yuque/0/2026/png/62301513/1772436533892-ea68e1c1-5f21-424f-b212-d55f466d282f.png)

![](https://cdn.nlark.com/yuque/0/2026/png/62301513/1772436815984-633eea4e-3f39-4e1b-af6d-61572b2ef003.png)

### 四张表（功能分类）


- **Filter 表**（默认表）：负责过滤数据包（允许/拒绝）。
- **NAT 表**：负责网络地址转换（修改源/目的 IP 或端口）。
- **Mangle 表**：负责修改数据包内容（如设置 TOS、TTL 或标记数据包）。
- **Raw 表**：负责关闭连接追踪机制（提高性能，防止状态跟踪）。

#### 优先级排序（从高到低）

如果多张表同时作用在同一个钩子点，处理顺序如下：

raw (最高优先级)：用于脱离连接跟踪（Connection Tracking）。

mangle：用于修改数据包内容（TTL, TOS, Mark）。

nat (dst)：目的地址转换（DNAT）。

filter：数据包过滤（放行/丢弃）。

nat (src)：源地址转换（SNAT）。

### 五条链（处理时机）


- **PREROUTING**：数据包刚到达网络接口，路由决策前。
- **INPUT**：数据包目的地为本机。
- **FORWARD**：数据包只是路过本机，转发到其他目标。
- **OUTPUT**：本机产生的数据包向外发送。
- **POSTROUTING**：数据包离开网络接口前，路由决策后。
<hr id="Vxmg7" class="ne-hr">
## 2. 命令基本语法

```
iptables [-t 表名] 选项 [链名] [条件匹配] [-j 处理动作]
```

### 1. 命令操作选项 (Commands)

这些选项告诉 iptables 你要对“规则链”做什么。
<table id="KkRN4" class="ne-table" style="width: 750px"><tbody><tr style="height: 33px"><td width="250">
**选项**
</td><td width="250">
**全称**
</td><td width="250">
**含义**
</td></tr><tr style="height: 33px"><td width="250">
**-A**
</td><td width="250">
--append
</td><td width="250">
**追加**。在链的末尾添加一条规则（最常用）。
</td></tr><tr style="height: 33px"><td width="250">
**-I**
</td><td width="250">
--insert
</td><td width="250">
**插入**。在链的开头（或指定行号）插入规则，**优先级最高**。
</td></tr><tr style="height: 33px"><td width="250">
**-D**
</td><td width="250">
--delete
</td><td width="250">
**删除**。按内容或行号删除规则。
</td></tr><tr style="height: 33px"><td width="250">
**-R**
</td><td width="250">
--replace
</td><td width="250">
**替换**。修改现有规则。
</td></tr><tr style="height: 33px"><td width="250">
**-L**
</td><td width="250">
--list
</td><td width="250">
**列出**。查看当前表中的所有规则。
</td></tr><tr style="height: 33px"><td width="250">
**-F**
</td><td width="250">
--flush
</td><td width="250">
**清空**。删除选定表中的所有规则。
</td></tr><tr style="height: 96px"><td width="250">
**-P**
</td><td width="250">
--policy
</td><td width="250">
**设置默认策略**。比如 iptables -P INPUT DROP

（默认全拦）。
</td></tr><tr style="height: 38px"><td width="250">
-N
</td><td width="250">
--new
</td><td width="250">
**新建一个自定义链**
</td></tr></tbody></table><hr id="KVRCj" class="ne-hr">
### 2. 数据包匹配条件 (Parameters)

这些选项决定了哪些包会被这条规则“抓到”。


- **-p** (--protocol)：指定协议。常用的有 tcp, udp, icmp, all。
- **-s** (--source)：源地址。支持 IP 或网段（如 192.168.1.1 或 192.168.1.0/24）。
- **-d** (--destination)：目的地址。
- **--sport** / **--dport**：源端口 / 目的端口（**注意：** 必须先用 -p 指定协议才能用端口）。
- **-m** (--match)：调用扩展模块。比如：


- -m state --state ESTABLISHED：匹配已建立连接的状态。
- -m limit --limit 5/min：限制匹配速率（防洪水攻击）。
- -m mac --mac-source：匹配特定的 MAC 地址。
- -m multiport  ：允许指定多个不连续的端口。

<hr id="fl6sm" class="ne-hr">
### 3. 网络接口与辅助选项 (Interfaces & Misc)


- **-i** (--in-interface)：数据包**进入**的网卡（如 eth0, lo）通常用于 INPUT 和 PREROUTING。
- **-o** (--out-interface)：数据包**发出**的网卡。通常用于 OUTPUT 和 POSTROUTING。
- **-n** (--numeric)：数字显示。禁止把 IP 解析成域名，把端口解析成服务名（查看规则时**速度极快**）。
- **-v** (--verbose)：详细模式。显示通过该规则的数据包数量和字节数。
- **--line-numbers**：显示规则行号。
<hr id="IBuJd" class="ne-hr">
### 4. 处理动作 (Target)

由 **-j** (--jump) 引出，决定包的生死。


- **ACCEPT**：允许包通过。
- **DROP**：悄悄丢弃包，不回复。
- **REJECT**：拒绝包，并给对方回一个“我很忙/拒绝访问”的信息。
- **LOG**：在内核日志（/var/log/messages）里记录这个包的信息，然后继续匹配下一条规则。
- **SNAT**** / ****DNAT**：源/目的地址转换。
- **MASQUERADE**：特殊的 SNAT，用于动态拨号上网。
<hr id="GL9tj" class="ne-hr">
## 3. 常用操作指令

### 查询与管理


- **列出规则**：iptables -L -n -v（-n 数字显示，-v 详细信息）。
- **清空规则**：iptables -F（清除所有规则，注意：这可能会导致远程连接中断，如果默认策略是 DROP）。
- **删除特定规则**：iptables -D INPUT 2（删除 INPUT 链中的第 2 条规则）。

### 常见配置场景

#### A. 基础安全设置

```
# 允许本地回环接口（本地服务通信必需）
iptables -A INPUT -i lo -j ACCEPT

# 允许已建立的连接和相关的连接（保证你发出的请求能收到回包）
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

# 开放 SSH 端口 (22)
iptables -A INPUT -p tcp --dport 22 -j ACCEPT

# 设置默认策略为丢弃（白名单模式，最安全）
iptables -P INPUT DROP
```

#### B. 限制访问

```
# 屏蔽特定 IP 地址
iptables -I INPUT -s 192.168.1.100 -j DROP

# 屏蔽一个 IP 段
iptables -A INPUT -s 10.0.0.0/8 -j REJECT

# 限制单 IP 的并发连接数（防简单的 CC 攻击）
iptables -I INPUT -p tcp --dport 80 -m connlimit --connlimit-above 20 -j REJECT
```

#### C. 端口转发 (NAT)

```
# 将访问本机 80 端口的流量转发到内部服务器 192.168.1.2 的 8080 端口
iptables -t nat -A PREROUTING -p tcp --dport 80 -j DNAT --to-destination 192.168.1.2:8080

# 开启 SNAT（共享上网）
iptables -t nat -A POSTROUTING -s 192.168.1.0/24 -o eth0 -j MASQUERADE
```
<hr id="yeKge" class="ne-hr">
## 4. 规则匹配流程

iptables 的规则是**从上到下按顺序匹配**的：


- 一旦匹配到某条规则，就会执行相应的动作（ACCEPT/DROP），并不再继续向下检查（LOG 动作除外）。
- 如果所有规则都没匹配上，则执行该链的**默认策略 (Policy)**。

****** 重要警告：** > iptables 的修改是即时生效的，但重启后会丢失。


- 在 CentOS/RHEL 上使用：service iptables save
- 在 Ubuntu/Debian 上使用：iptables-save > /etc/iptables/rules.v4
<hr id="RB05J" class="ne-hr">
## 5. 现代替代方案：nftables

虽然 iptables 依然经典，但在现代 Linux 内核中（如 RHEL 8+, Debian 10+），它正逐渐被 nftables 取代。nftables 拥有更简洁的语法和更高的执行效率。此外，许多人更倾向于使用更简单的封装工具，如：


- **UFW** (Uncomplicated Firewall)：Ubuntu 默认。
- **firewalld**：CentOS/Fedora 默认，支持“区域 (Zones)”概念。

**如果你正面临某个具体的网络访问问题（例如：Web 服务器无法访问或需要设置内网穿透），需要我为你编写一套完整的防火墙脚本吗？**