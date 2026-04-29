---
title: firewalld命令
icon: network-wired
date: 2026-03-02
category:
  - 计算机网络
---

## firewall是什么？

firewalld 是 CentOS 7/8 和 RHEL 系列的默认防火墙管理工具。它最大的特点是引入了 **区域（Zone）** 的概念，并且支持**动态更新**（即修改规则不需要重启服务，不会导致现有连接断开）。

![](https://cdn.nlark.com/yuque/0/2026/png/62301513/1772455937429-e9bb8388-bab0-4953-a603-e2eb8c292dd3.png)

为了让你更透彻地理解防火墙，我们可以把 firewalld 想象成一个**“智能安检中心”**。相比传统的 iptables（手动查表），它提供了更现代、更动态的管理方式。

以下是关于 firewalld 核心概念与常用命令的详细介绍：
<hr id="kYVAt" class="ne-hr">
### 一、 核心概念：区域 (Zone)

firewalld 最核心的创新就是引入了**区域（Zone）**。你可以根据网络环境的信任程度，将网卡或源 IP 划分为不同的“安检级别”。

firewalld 默认定义了 **9 个区域**：


- **drop (丢弃)**：最低信任度。所有进入的数据包都会被直接丢弃，不给发送者任何回应。
- **block (拒绝)**：低信任度。拒绝所有进入的连接，但会发回一个回应（ICMP 消息）告知对方已被拒绝。
- **public (公共)**：**系统默认区域**。不信任网络中的其他计算机，仅允许选定的入站连接（如 SSH）。
- **external (外部)**：用于路由器场景。开启了地址伪装（Masquerading），保护内网私有地址。
- **dmz (隔离区)**：允许受限的公开访问，但禁止该区域访问内部网络。
- **work / home / internal**：对应工作、家庭、内网环境，信任度依次升高，默认开放的服务也更多。
- **trusted (信任)**：最高信任度。接受所有的网络连接，不做任何拦截。
<hr id="FBYAT" class="ne-hr">
### 二、 核心机制：运行时 vs 永久配置

这是新手最容易出错的地方：


- **Runtime (运行时)**：命令立即生效，但重启服务器或重启防火墙后规则会**丢失**。适用于临时测试。
- **Permanent (永久)**：命令写入配置文件，重启后依然有效。


- **注意**：带 --permanent 的命令不会立即生效，必须执行 firewall-cmd --reload 才能将其加载进内存。

<hr id="MCqdN" class="ne-hr">
### 三、 常用命令宝典

#### 1. 基础查询命令

```
# 查看防火墙运行状态
firewall-cmd --state

# 查看当前默认区域
firewall-cmd --get-default-zone

# 查看所有活动的区域及其绑定的网卡
firewall-cmd --get-active-zones

# 列出当前区域的所有规则（服务、端口、富规则等）
firewall-cmd --list-all
```

#### 2. 管理端口与服务

firewalld 允许按“端口号”或“服务名”（如 http）来放行流量。

```
# 永久放行 80 端口（推荐做法）
firewall-cmd --permanent --add-port=80/tcp

# 永久放行 https 服务
firewall-cmd --permanent --add-service=https

# 移除已开放的端口
firewall-cmd --permanent --remove-port=80/tcp

# 【关键步】重新加载使永久配置生效
firewall-cmd --reload
```

#### 3. 进阶：富规则 (Rich Rules)

当你需要复杂的匹配逻辑（例如：只允许特定 IP 访问特定端口）时，使用富规则。

```
# 允许来自 192.168.1.100 的 IP 访问 22 端口
firewall-cmd --permanent --add-rich-rule='rule family="ipv4" source address="192.168.1.100" port port="22" protocol="tcp" accept'

# 屏蔽某个恶意网段
firewall-cmd --permanent --add-rich-rule='rule family="ipv4" source address="123.12.1.0/24" drop'
```

#### 4. 应急“恐慌模式”

如果服务器正遭受严重攻击，可以使用此命令切断所有网络：

```
# 开启恐慌模式（切断所有进出流量）
firewall-cmd --panic-on

# 关闭恐慌模式（恢复网络）
firewall-cmd --panic-off
```
<hr id="GBNJH" class="ne-hr">
### 四、 总结：为什么用 firewalld？


- **动态更新**：修改规则不需要像 iptables 那样重启服务，因此**不会断开现有的网络连接**。
- **语义清晰**：按区域和服务管理，比单纯记端口号更符合人类逻辑。

**你想尝试一下如何将你之前写的那个 ****iptables**** 练习脚本，完整地转化成 ****firewalld**** 的命令吗？**