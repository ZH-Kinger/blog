---
title: cisco中的常用命令
icon: network-wired
date: 2026-02-16
category:
  - 计算机网络
---

## 常见命令

### 一、 模式切换与基础管理

这些命令决定了你在哪个“层级”进行操作。

![](https://cdn.nlark.com/yuque/0/2026/png/62301513/1771593915698-78b6319f-f6c2-455d-a40b-b091cb767613.png)
<table id="wm9uC" class="ne-table" style="width: 750px"><tbody><tr style="height: 33px"><td width="250">
**命令**
</td><td width="250">
**功能**
</td><td width="250">
**备注**
</td></tr><tr style="height: 33px"><td width="250">
enable
</td><td width="250">
进入特权模式
</td><td width="250">
图标从 >

变为 #
</td></tr><tr style="height: 33px"><td width="250">
configure terminal
</td><td width="250">
进入全局配置模式
</td><td width="250">
简称 conf t

，大部分配置在此进行
</td></tr><tr style="height: 33px"><td width="250">
hostname [名称]
</td><td width="250">
修改设备名称
</td><td width="250">
方便在多台设备中辨别
</td></tr><tr style="height: 33px"><td width="250">
exit
</td><td width="250">
退回上一级
</td><td width="250">
—
</td></tr><tr style="height: 33px"><td width="250">
end
</td><td width="250">
直接退回特权模式
</td><td width="250">
快捷键 Ctrl+Z

效果相同
</td></tr><tr style="height: 33px"><td width="250">
write
</td><td width="250">
保存当前配置
</td><td width="250">
重启不丢失配置的关键（等同于 copy run start

）
</td></tr></tbody></table><hr id="BdiRs" class="ne-hr">
### 二、 三层核心与路由配置

这是让交换机实现“路由”功能的关键命令。
<table id="d3vG5" class="ne-table" style="width: 750px"><tbody><tr style="height: 33px"><td width="250">
**命令**
</td><td width="250">
**功能**
</td><td width="250">
**关键说明**
</td></tr><tr style="height: 33px"><td width="250">
**ip routing**
</td><td width="250">
**开启三层转发**
</td><td width="250">
**必做步骤**，否则无法实现 VLAN 间路由
</td></tr><tr style="height: 33px"><td width="250">
interface vlan [ID]
</td><td width="250">
进入 VLAN 虚接口 (SVI)
</td><td width="250">
用于给对应的 VLAN 配置网关 IP
</td></tr><tr style="height: 33px"><td width="250">
ip address [IP] [子网掩码]
</td><td width="250">
配置接口 IP 地址
</td><td width="250">
在 SVI 或路由口模式下使用
</td></tr><tr style="height: 33px"><td width="250">
no shutdown
</td><td width="250">
激活接口
</td><td width="250">
开启 SVI 或物理接口
</td></tr><tr style="height: 33px"><td width="250">
**no switchport**
</td><td width="250">
**切换物理口模式**
</td><td width="250">
将二层交换口变为三层路由口（可直接配 IP）
</td></tr><tr style="height: 33px"><td width="250">
ip route 0.0.0.0 0.0.0.0 [下一跳]
</td><td width="250">
配置默认路由
</td><td width="250">
告诉交换机所有外网流量往哪发
</td></tr></tbody></table><hr id="QoUnm" class="ne-hr">
### 三、 以太网通道 (EtherChannel)

用于多条链路捆绑，增加带宽和冗余。
<table id="aocxt" class="ne-table" style="width: 750px"><tbody><tr style="height: 33px"><td width="250">
**命令**
</td><td width="250">
**功能**
</td><td width="250">
**示例/备注**
</td></tr><tr style="height: 33px"><td width="250">
interface range [接口列表]
</td><td width="250">
批量选择端口
</td><td width="250">
如 int range g0/1 - 2
</td></tr><tr style="height: 33px"><td width="250">
channel-group [组号] mode active
</td><td width="250">
建立 LACP 通道
</td><td width="250">
active

代表主动协商（常用）
</td></tr><tr style="height: 33px"><td width="250">
interface port-channel [组号]
</td><td width="250">
进入逻辑通道接口
</td><td width="250">
对捆绑后的“虚拟大网线”进行统一配置
</td></tr><tr style="height: 33px"><td width="250">
switchport mode trunk
</td><td width="250">
设置为中继链路
</td><td width="250">
允许所有 VLAN 通过此通道
</td></tr></tbody></table><hr id="LTJn8" class="ne-hr">
### 四、 状态查看与故障排查 (Show 系列)

当实验不通时，请务必使用以下命令检查。
<table id="wqWoK" class="ne-table" style="width: 750px"><tbody><tr style="height: 33px"><td width="250">
**命令**
</td><td width="250">
**检查重点**
</td><td width="250">
**常用场景**
</td></tr><tr style="height: 33px"><td width="250">
**show ip interface brief**
</td><td width="250">
接口状态 (Status/Protocol)
</td><td width="250">
检查接口是否为 up/up

，IP 是否配对
</td></tr><tr style="height: 33px"><td width="250">
**show ip route**
</td><td width="250">
路由表
</td><td width="250">
确认是否有 C

(直连) 或 S

(静态) 路由
</td></tr><tr style="height: 33px"><td width="250">
show vlan brief
</td><td width="250">
VLAN 划分
</td><td width="250">
确认物理端口是否被正确划分到了对应的 VLAN
</td></tr><tr style="height: 33px"><td width="250">
show etherchannel summary
</td><td width="250">
通道状态
</td><td width="250">
检查通道成员状态是否为 (P)

(已捆绑)
</td></tr><tr style="height: 33px"><td width="250">
show running-config
</td><td width="250">
所有配置
</td><td width="250">
查看你到底敲了哪些命令，是否有错漏
</td></tr></tbody></table><hr id="kX3xh" class="ne-hr">
### 进阶小贴士


- **如何查命令？** 在任何模式下输入 ?，系统会告诉你当前可以输入的所有命令。
- **写错了怎么办？** 在原命令前加上 no 即可撤销。例如：no ip address（删除 IP）。
- **自动补齐：** 输入命令前几个字母后按 Tab 键，省去敲全单词的麻烦。

## 不同模式之间的区别

在 Cisco 网络设备的操作中，理解**模式 (Modes)** 的区别至关重要，因为这决定了你的权限范围以及命令的影响程度。

Cisco IOS 采用了分层的 CLI 结构，主要分为以下四个核心模式：
<hr id="i0pdx" class="ne-hr">
### 一、 模式功能对比表
<table id="akQD5" class="ne-table" style="width: 750px"><tbody><tr style="height: 33px"><td width="150">
**模式名称**
</td><td width="150">
**提示符示例**
</td><td width="150">
**权限级别**
</td><td width="150">
**主要用途**
</td><td width="150">
**常用操作**
</td></tr><tr style="height: 33px"><td width="150">
**用户模式** (User EXEC)
</td><td width="150">
Switch>
</td><td width="150">
最低
</td><td width="150">
查看基础信息，无法修改配置。
</td><td width="150">
ping

, traceroute
</td></tr><tr style="height: 33px"><td width="150">
**特权模式** (Privileged EXEC)
</td><td width="150">
Switch#
</td><td width="150">
中等
</td><td width="150">
查看详细状态、保存配置、进入配置模式。
</td><td width="150">
show

命令, write
</td></tr><tr style="height: 33px"><td width="150">
**全局配置模式** (Global Config)
</td><td width="150">
Switch(config)#
</td><td width="150">
高
</td><td width="150">
修改影响整台设备的参数。
</td><td width="150">
hostname

, ip routing
</td></tr><tr style="height: 33px"><td width="150">
**特定配置模式** (Sub-config)
</td><td width="150">
Switch(config-if)#
</td><td width="150">
高
</td><td width="150">
修改特定接口、VLAN 或路由协议。
</td><td width="150">
ip address

, no shutdown
</td></tr></tbody></table><hr id="pEmcO" class="ne-hr">
### 二、 模式间的切换流程

你可以通过以下命令在模式间跳转。


- **进入特权模式**：在 > 下输入 enable。
- **进入全局配置**：在 # 下输入 configure terminal。
- **进入接口配置**：在 (config)# 下输入特定的接口命令，如 interface vlan 10 或 interface g0/1。
- **返回上一级**：输入 exit。
- **一键回到特权模式**：输入 end 或使用快捷键 Ctrl + Z。