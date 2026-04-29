---
title: 四、配置LVS，keepalive负载均衡服务器
icon: server
date: 2026-01-26
category:
  - 运维
---

配置 LVS（Linux Virtual Server）配合 Keepalived 负载均衡服务器，其核心目的可以概括为：**消除单点故障、实现高可用性（HA）和扩展系统的吞吐能力。**

简单来说，就是把一堆普通的服务器变成一个“打不倒、能扛压”的整体。
<hr id="GHxpF" class="ne-hr">
## 1. 为什么要配置LVS和keepalive

### 1. 提高并发处理能力（负载均衡）

单台 Web 服务器的资源（CPU、内存、带宽）是有上限的。


- **均衡分配**：LVS 作为流量调度器，根据预设算法（如轮询 rr、加权轮询 wrr）将成千上万的并发请求均匀地分发给后端的 Real Server（Web 节点）。
- **无缝扩展**：当业务增长时，你只需要在后端增加服务器，LVS 就能立刻利用新机器，而客户端对此完全无感知。

### 2. 实现高可用性（High Availability）

这是引入 **Keepalived** 的主要原因。


- **健康检查 (Health Check)**：Keepalived 会定期给后端服务器“把脉”。如果某台 Web 节点宕机（比如网口坏了或进程崩溃），Keepalived 会自动在 LVS 转发列表中将其剔除。
- **调度器冗余 (Failover)**：如果负载均衡器（LB）本身坏了怎么办？Keepalived 通过 VRRP 协议实现主备切换（Master/Backup）。当主调度器宕机，备用调度器会瞬间抢占 **VIP (虚拟IP)**，保证业务不断网。

### 3. 成本与性能平衡


- **极致性能**：LVS 运行在 Linux 内核层（第四层），不涉及复杂的协议解析，处理能力远超 Nginx、HAProxy 等软件负载。
- **低成本**：相比昂贵的硬件负载均衡（如 F5），LVS + Keepalived 是基于标准 Linux 硬件的开源方案，成本极低且性能强悍。

## iptables命令

### 一、 核心概念：四表五链

#### 1. 四表（功能分类）


- **filter**（默认表）：过滤包。决定包是放行（ACCEPT）还是丢弃（DROP/REJECT）。
- **nat**：地址转换。修改源地址（SNAT）或目标地址（DNAT）。
- **mangle**：修改数据包内容（如修改 TTL、打标记）。
- **raw**：关闭连接追踪，提高性能。

#### 2. 五链（时机分类）


- **PREROUTING**：数据包刚到达网卡，还未决定路由。
- **INPUT**：发往本机的数据包。
- **FORWARD**：本机只做中转，发往其他机器的数据包。
- **OUTPUT**：本机产生并向外发出的数据包。
- **POSTROUTING**：路由决策完成后，数据包离开网卡前。
<hr id="tJX8o" class="ne-hr">
### 二、 命令基本格式

```
iptables [-t 表名] 命令选项 [链名] [匹配条件] [-j 控制动作]
```

#### 1. 常用命令选项


- -A (Append)：在链的末尾追加一条规则。
- -I (Insert)：在链的开头或指定位置插入一条规则。
- -L (List)：列出所有规则（常用 -L -n -v 查看详情）。
- -D (Delete)：删除指定规则。
- -F (Flush)：清空规则。
- -P (Policy)：设置默认策略（如 iptables -P INPUT DROP）。

#### 2. 常用控制动作 (-j)


- **ACCEPT**：允许。
- **DROP**：丢弃（不给任何回应）。
- **REJECT**：拒绝（回给对方一个“拒绝”的错误包）。
- **DNAT/SNAT**：NAT 转换。
- **LOG**：记录日志。
<hr id="vyNa3" class="ne-hr">
### 三、 实战案例

#### 1. 基础过滤：保护本机

```
# 1. 允许回环接口（127.0.0.1）的所有流量
iptables -A INPUT -i lo -j ACCEPT

# 2. 允许已建立的连接通过（防止你自己发起的请求被拦）
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

# 3. 开放 22 端口 (SSH)
iptables -A INPUT -p tcp --dport 22 -j ACCEPT

# 4. 开放 80 端口 (HTTP)
iptables -A INPUT -p tcp --dport 80 -j ACCEPT

# 5. 禁止其他所有进入的流量（慎用，先开 SSH 再执行）
iptables -P INPUT DROP
```

#### 2. NAT 地址转换（你刚才实验的核心）

```
# DNAT：外网访问本机的 80 端口，转发到内网的 31.200
iptables -t nat -A PREROUTING -p tcp --dport 80 -j DNAT --to-destination 192.168.31.200

# SNAT：内网 31.0 网段通过本机上网，把源地址改成 1.128
iptables -t nat -A POSTROUTING -s 192.168.31.0/24 -j SNAT --to-source 192.168.1.128
```

#### 3. 查看与删除

```
# 列出 nat 表规则并显示行号
iptables -t nat -L -n --line-numbers

# 删除 nat 表 PREROUTING 链的第一条规则
iptables -t nat -D PREROUTING 1
```

## 什么是SNAT和DNAT？

### 1. SNAT (Source Network Address Translation) —— 源地址转换

**核心功能**：修改数据包的 **源 IP 地址**。


- **典型场景**：内网机器访问互联网。
- **工作流程**：当你实验室或公司的电脑（私有 IP，如 192.168.1.5）想访问百度时，公网是不识别私有 IP 的。当包经过防火墙时，防火墙把“源 IP”改成自己的“公网 IP”，然后再发给百度。百度回包时，防火墙再根据记录转交给你的电脑。
- **生活类比**：你在宿舍（内网）给外面写信。你虽然是发信人，但在信封的“发件地址”一栏写的是“宿舍传达室地址”（公网 IP）。回信寄到传达室，传达室大爷再根据收件人名字送到你手里。
<hr id="LZTF7" class="ne-hr">
### 2. DNAT (Destination Network Address Translation) —— 目的地址转换

**核心功能**：修改数据包的 **目的 IP 地址**。


- **典型场景**：互联网用户访问内网服务器（发布服务）。
- **工作流程**：你公司内网有一台 Web 服务器（192.168.31.200）。外网用户访问公司的公网 IP（1.1.1.1）的 80 端口时，防火墙收到包，发现是找 Web 服务的，就把包的“目的 IP”改成内网的 192.168.31.200，把请求“引”进去。
- **生活类比**：你拨打一个公司的总机电话。你只知道总机号（公网 IP），拨通后，前台接线员（防火墙）询问你的需求，然后把电话线路转接（DNAT）到了某个具体的工位分机（内网服务器）上。
<table id="pESh9" class="ne-table" style="width: 750px"><tbody><tr style="height: 33px"><td width="250">
**特性**
</td><td width="250">
**SNAT**
</td><td width="250">
**DNAT**
</td></tr><tr style="height: 33px"><td width="250">
**修改对象**
</td><td width="250">
源 IP 地址
</td><td width="250">
目的 IP 地址
</td></tr><tr style="height: 33px"><td width="250">
**主要用途**
</td><td width="250">
内部机器共享公网 IP 上网
</td><td width="250">
外部用户访问内部服务器
</td></tr><tr style="height: 33px"><td width="250">
**生效位置**
</td><td width="250">
POSTROUTING

（路由之后，出网卡前）
</td><td width="250">
PREROUTING

（路由之前，进网卡时）
</td></tr><tr style="height: 33px"><td width="250">
**隐藏对象**
</td><td width="250">
隐藏了客户端的真实 IP
</td><td width="250">
隐藏了服务器的真实 IP
</td></tr></tbody></table>
## LVS (DR模式) + Keepalived 架构配置

### 1. 角色规划与 VIP 准备


- **VIP (虚拟IP)**: 192.168.31.200 (请确保此 IP 在你的路由器中未被占用)
- **负载均衡 (LB)**: 192.168.31.132 (Master), 192.168.31.133 (Backup)
- **Web 节点 (Real Server)**: 192.168.31.130, 192.168.31.131
- **防火墙 (FW)**: 192.168.31.135
<hr id="Fa4M4" class="ne-hr">
### 2. 第一阶段：配置 Web 节点 (130/131)

在 LVS-DR 模式下，Web 节点必须绑定 VIP 但不能响应 ARP，否则会导致 IP 冲突。

**在两台 Web 服务器上分别执行以下操作：**


- **创建脚本 ****/lvs_dr/set_vip_arp.sh** (参考文档逻辑)：

```
#!/bin/bash
VIP=192.168.31.200
case "$1" in
start)
    # 在 lo 接口绑定 VIP
    ifconfig lo:0 $VIP netmask 255.255.255.255 broadcast $VIP up
    route add -host $VIP dev lo:0
    # 抑制 ARP 响应
    echo "1" > /proc/sys/net/ipv4/conf/lo/arp_ignore
    echo "2" > /proc/sys/net/ipv4/conf/lo/arp_announce
    echo "1" > /proc/sys/net/ipv4/conf/all/arp_ignore
    echo "2" > /proc/sys/net/ipv4/conf/all/arp_announce
    echo "LVS DR Real Server started"
    ;;
stop)
    ifconfig lo:0 down
    route del -host $VIP dev lo:0
    echo "0" > /proc/sys/net/ipv4/conf/lo/arp_ignore
    echo "0" > /proc/sys/net/ipv4/conf/lo/arp_announce
    echo "0" > /proc/sys/net/ipv4/conf/all/arp_ignore
    echo "0" > /proc/sys/net/ipv4/conf/all/arp_announce
    echo "LVS DR Real Server stopped"
    ;;
esac
```


- **执行脚本并设置开机自启**：

```
chmod +x /lvs_dr/set_vip_arp.sh
/lvs_dr/set_vip_arp.sh start
# 将启动命令写入 /etc/rc.local
echo "bash /lvs_dr/set_vip_arp.sh start" >> /etc/rc.local
chmod +x /etc/rc.d/rc.local
```
<hr id="RgHto" class="ne-hr">
### 3. 第二阶段：配置负载均衡器 (132/133)

你需要在两台 LB 上安装 keepalived 和 ipvsadm。


- **安装软件**：

yum install -y keepalived ipvsadm


- **修改 Keepalived 配置文件** (/etc/keepalived/keepalived.conf)：


- **LB1 (Master)** 关键配置：


```
vrrp_instance VI_1 {
    state MASTER
    interface ens33        # 确认你的网卡名称
    virtual_router_id 51
    priority 100           # 优先级比 Backup 高
    advert_int 1
    virtual_ipaddress {
        192.168.31.200     # VIP
    }
}
virtual_server 192.168.31.200 80 {
    delay_loop 6
    lb_algo rr             # 轮询调度算法
    lb_kind DR             # DR模式
    protocol TCP
    real_server 192.168.31.130 80 {
        weight 1
        TCP_CHECK { connect_timeout 3 }
    }
    real_server 192.168.31.131 80 {
        weight 1
        TCP_CHECK { connect_timeout 3 }
    }
}
```


- **LB2 (Backup)** 只需要将 state 改为 BACKUP，priority 改为 90。


- **启动服务**：

systemctl start keepalived && systemctl enable keepalived
<hr id="uSwu8" class="ne-hr">
### 4. 第三阶段：防火墙与连通性

由于你的防火墙 IP 是 192.168.31.135：


- **内外网映射**：如果在公网访问，请在 135 防火墙上做端口转发，将公网 80 端口指向 **VIP 192.168.31.200**。
- **后端存储**：确保两台 Web 节点（130/131）都挂载了管理服务器（如 132 或其他节点）提供的 NFS 目录，以保证内容一致。
<hr id="IysxZ" class="ne-hr">
### 5. 如何测试？


- **检查 VIP**：在 LB1 上执行 ip addr，看是否出现了 192.168.31.200。
- **检查调度**：执行 ipvsadm -Ln，你会看到两个后端 IP。
- **访问测试**：在浏览器访问 http://192.168.31.200。
- **压力测试**：参考文档中的 ab 命令：

ab -n 1000 -c 100 http://192.168.31.200/index.html

**提示**：如果你想更专业地管理，建议在综合服务器上使用 **Ansible** 编写一个 Playbook，把上述步骤写成自动化脚本，这样后期扩展 Web 节点（如增加 .134）只需要改一个配置文件即可。