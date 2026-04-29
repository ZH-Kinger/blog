---
title: 二、搭建基础DMC集群（内网环境）
icon: server
date: 2026-01-26
category:
  - 运维
---

你需要配置的是一台**双网卡防火墙 / 路由器服务器**（WAN 口连外网、LAN 口连 DMZ 区），核心目标是实现「DMZ 区服务器上网（SNAT）」「外网访问内网 Web / 堡垒机（DNAT）」「限制 SSH 访问（TCP Wrappers）」，我结合你现有的集群环境（DMZ 网段 192.168.203.0/24、web1/web2/nfs-server 堡垒机），整理出**分步、可落地、适配你集群**的完整配置流程，每一步都标注关键注意事项，确保和你的 Web/NFS/DNS 集群无缝配合

## 一、给防火墙机器添加一块网卡

### 1.打开虚拟机设置，点击添加网络适配器

![](https://cdn.nlark.com/yuque/0/2026/png/62301513/1769596859336-2b88e37b-7e84-4f02-9f7c-825c88740a15.png)

### 2.设置网卡模式

一块设置桥接模式作为WAN口

![](https://cdn.nlark.com/yuque/0/2026/png/62301513/1769596878507-6d83ac3f-96b3-4af7-936b-29300aa271b6.png)

一块设置仅主机模式作为LAN口

![](https://cdn.nlark.com/yuque/0/2026/png/62301513/1769596903191-d27cd130-e0df-4ed0-bea8-5772898cb511.png)

打开防火墙虚拟机

### 1.查看虚拟机ip，并连接xshell

```
ip add
```

### 2.设置静态IP

**nmcli 命令行**

```
nmcli con mod "ens160" \
ipv4.method manual \
ipv4.addresses "192.168.1.8/24" \
ipv4.gateway "192.168.1.1" \
```

**手动编辑 nmconnection 配置文件****编辑 NetworkManager 配置文件**

```
vim /etc/NetworkManager/system-connections/ens160.nmconnection
```

**修改 [ipv4] 段内容**（保留其他段，仅改 ipv4 部分）

```
[ipv4]
method=manual # 手动模式（静态）
addresses1=192.168.1.8/24,192.168.1.1 # IP/掩码,网关
ignore-auto-dns=true
```

**修复文件权限**

```
chmod 600 /etc/NetworkManager/system-connections/ens160.nmconnection
```

**重启连接使配置生效**

```
nmcli c reload
nmcli c up ens160
nmcli c up ens224
```

**如果xshell出现断连，去VMware中禁用再重启一下网卡**

```
nmcli d up ens160
nmcli d up ens224
```

## 可能会存在的问题

### 网络设备中文问题

网卡名是中文导致找不到你添加的网卡进入/etc/NetworkManager/system-connections/查看有几个网卡的配置文件

```
[root@localhost ~]# cd /etc/NetworkManager/system-connections/
[root@localhost system-connections]# ls
ens160.nmconnection
```

实际上你有不只有一个nmcli connection show查看网络设备

```
[root@localhost system-connections]#  nmcli connection show
NAME        UUID                                  TYPE      DEVICE 
ens160      d33dec02-4b3c-3053-82f2-acc4ea253510  ethernet  ens160 
有线连接 1  51054532-8ba0-3cd2-9194-a6c1a6bb8f90  ethernet  ens224 
有线连接 2  c1c09e1f-8e3e-37e2-b87a-122970464b26  ethernet  ens256 
lo          84b5497b-6232-489d-8728-d3034cdfcd63  loopback  lo   
```

修改网络设备名称

```
[root@localhost system-connections]# nmcli connection modify "有线连接 1" connection.id ens224
[root@localhost system-connections]# nmcli connection modify "有线连接 2" connection.id ens256
```

## 配置SNAT和DNAT

## 配置堡垒机，web1，web2的ip地址为静态（注意DMZ中的机器网卡模式都是仅主机模式）

修改堡垒机ip地址为静态ip，配置网关到防火墙的LAN口

### 堡垒机

```
nmcli con mod "ens160" \
ipv4.method manual \
ipv4.addresses "192.168.31.136/24" \
ipv4.gateway "192.168.31.135" \
ipv4.dns= "114.114.114.114"
```

### web1

```
nmcli con mod "ens160" \
ipv4.method manual \
ipv4.addresses "192.168.31.130/24" \
ipv4.gateway "192.168.31.135" \
ipv4.dns= "114.114.114.114"
```

### web2

```
nmcli con mod "ens160" \
ipv4.method manual \
ipv4.addresses "192.168.31.131/24" \
ipv4.gateway "192.168.31.135" \
ipv4.dns= "114.114.114.114"
```

分别测试他们内网能不能ping通网关

### 一、SNAT（Source NAT，源网络地址转换）

#### 核心作用

修改**数据包的源 IP 地址**（偶尔也改源端口），让**内网私有 IP**的设备，通过公网 IP 与外网通信，是内网设备访问外网的 “必经转换”。

#### 工作原理


- 内网设备（如 192.168.1.100）向外网发送数据包，源 IP 是私有 IP，目的 IP 是外网公网 IP；
- 数据包到达 NAT 网关（路由器 / 防火墙 / 服务器），网关通过 SNAT 将**源 IP 替换为网关的公网 IP**（如 202.103.0.1），并记录 “内网 IP: 端口 ↔ 公网 IP: 端口” 的映射关系；
- 外网服务器收到数据包，仅能看到网关的公网 IP，回复的数据包将发送到该公网 IP；
- 网关收到回复，通过之前的映射关系，反向找到对应的内网设备，将数据包转发过去。

#### 核心特征


- **单向访问**：仅支持**内网→外网**，外网无法主动访问内网；
- **地址复用**：多个内网设备可共享**同一个公网 IP**访问外网（通过端口区分不同设备），这是解决 IPv4 地址枯竭的关键；
- **隐藏内网**：外网无法获取内网设备的真实 IP，提升内网安全性。

### 二、DNAT（Destination NAT，目的网络地址转换）

#### 核心作用

修改**数据包的目的 IP 地址**（或目的端口），将**外网发往网关公网 IP**的数据包，转发到**内网指定的私有 IP 设备**，是外网访问内网服务的 “核心转换”（端口映射是 DNAT 的常见形式）。

#### 工作原理


- 外网设备（如公网 IP101.37.0.2）向内网网关的公网 IP（202.103.0.1）发送数据包，目的 IP 是网关公网 IP，目的端口可指定（如 80、443）；
- 数据包到达 NAT 网关，网关通过 DNAT 将**目的 IP 替换为内网目标设备的私有 IP**（如 192.168.1.20，内网 web 服务器），若为端口映射，同时替换目的端口；
- 内网目标设备收到数据包，处理后将回复发送给网关；
- 网关将回复的源 IP 换回自身公网 IP，转发给外网设备。

#### 核心特征


- **反向访问**：支持**外网→内网**，是外网访问内网服务的唯一方式（因内网私有 IP 无法被外网路由）；
- **精准映射**：可将 “公网 IP: 端口” 精准映射到 “内网 IP: 端口”，实现多内网服务共享一个公网 IP；
- **端口转发**：DNAT 最常用的形式是**端口映射**（如将公网 IP 的 80 端口映射到内网 192.168.1.20 的 80 端口，外网访问公网 80 即访问内网 web 服务器）。

### 再防火墙机器上配置DNAT和SNAT

编写一键部署脚本

```
vi init.sh
```

#### 一键配置脚本

```
#!/bin/bash
# 一键配置 SNAT/DNAT 优化版脚本

# 0. 检查 root 权限
if [ "$EUID" -ne 0 ]; then
    echo "错误：请使用 root 用户执行此脚本！"
    exit 1
fi

echo "开始配置网络规则..."

# 1. 开启路由转发 (优化：避免重复追加)
echo "1. 配置内核路由转发..."
echo 1 > /proc/sys/net/ipv4/ip_forward
if ! grep -q "net.ipv4.ip_forward = 1" /etc/sysctl.conf; then
    echo "net.ipv4.ip_forward = 1" >> /etc/sysctl.conf
fi
sysctl -p > /dev/null 2>&1

# 2. 清空旧规则 (防止多次运行产生重复规则)
echo "2. 清理现有 iptables 规则..."
iptables -F
iptables -t nat -F
iptables -X
iptables -t nat -X

# 3. 配置 SNAT
echo "3. 配置 POSTROUTING (SNAT)..."
# 注意：如果 ens224 不存在会报错，这里可以加个判断
for dev in ens160 ens224; do
    if ip link show "$dev" >/dev/null 2>&1; then
        iptables -t nat -A POSTROUTING -s 192.168.31.0/24 -o "$dev" -j MASQUERADE
        echo "   - 已为 $dev 配置 MASQUERADE"
    fi
done

# 4. 配置 DNAT
echo "4. 配置 PREROUTING (DNAT)..."
# 转发外网访问 192.168.1.128:80 的流量到 LVS VIP 192.168.31.200
iptables -t nat -A PREROUTING -d 192.168.1.128 -p tcp --dport 80 -j DNAT --to-destination 192.168.31.200

# 5. 保存规则 (解决你之前的目录报错问题)
echo "5. 持久化规则保存..."
if command -v iptables-save >/dev/null 2>&1; then
    # CentOS/RHEL 路径
    if [ -d /etc/sysconfig ]; then
        iptables-save > /etc/sysconfig/iptables
        echo "   - [CentOS] 规则已保存至 /etc/sysconfig/iptables"
    fi

    # Ubuntu/Debian 路径 (增加目录创建判断)
    if [ -d /etc/iptables ] || mkdir -p /etc/iptables 2>/dev/null; then
        iptables-save > /etc/iptables/rules.v4
        echo "   - [Ubuntu] 规则已保存至 /etc/iptables/rules.v4"
    fi
else
    echo "警告：未找到 iptables-save 命令，规则可能在重启后丢失！"
fi

echo "-------------------------------------------"
echo "SNAT/DNAT 配置成功！"
echo "当前 NAT 表规则如下："
iptables -t nat -L -n --line-numbers

```