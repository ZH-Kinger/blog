---
title: WLAN
icon: network-wired
date: 2026-02-25
category:
  - 计算机网络
---

![](https://cdn.nlark.com/yuque/0/2026/jpeg/62301513/1772001890280-ec18a535-e0de-4ac8-87bc-14a8ff2a4a27.jpeg)

WLAN（Wireless Local Area Network，无线局域网）是我们日常生活中最熟悉的无线技术。它通过无线信道（通常是射频电磁波）将设备连接到局域网。

以下是关于 WLAN 的核心架构、技术标准及关键机制的深度解析：
<hr id="sv7kR" class="ne-hr">
## 1. 核心架构：WLAN 是如何组成的？

WLAN 的基本单位是 **BSS (Basic Service Set)**。


- **基础设施模式 (Infrastructure Mode)：** 这是最常见的模式。


- **AP (Access Point)：** 无线接入点（通常是路由器），负责管理信号。
- **STA (Station)：** 终端设备（手机、电脑）。


- **自组网模式 (Ad-hoc Mode)：** 设备之间直接连接，不需要 AP。
- **ESS (Extended Service Set)：** 多个 AP 通过有线网络连接在一起，形成一个更大的覆盖区域，支持**无缝漫游**。
<hr id="oWWWB" class="ne-hr">
## 2. 核心协议：Wi-Fi 标准演进

WLAN 遵循 IEEE **802.11** 协议簇。虽然 WLAN 和 Wi-Fi 经常混用，但严格来说，Wi-Fi 是由 Wi-Fi 联盟认证的符合 802.11 标准的产品。
<table id="ItqI2" class="ne-table" style="width: 748px"><tbody><tr style="height: 33px"><td width="187">
**协议标准**
</td><td width="187">
**Wi-Fi 代号**
</td><td width="187">
**频段 (GHz)**
</td><td width="187">
**最高理论速度**
</td></tr><tr style="height: 33px"><td width="187">
802.11n
</td><td width="187">
Wi-Fi 4
</td><td width="187">
2.4 / 5
</td><td width="187">
600 Mbps
</td></tr><tr style="height: 33px"><td width="187">
802.11ac
</td><td width="187">
Wi-Fi 5
</td><td width="187">
5
</td><td width="187">
3.46 Gbps
</td></tr><tr style="height: 33px"><td width="187">
**802.11ax**
</td><td width="187">
**Wi-Fi 6 / 6E**
</td><td width="187">
2.4 / 5 / 6
</td><td width="187">
9.6 Gbps
</td></tr><tr style="height: 33px"><td width="187">
**802.11be**
</td><td width="187">
**Wi-Fi 7**
</td><td width="187">
2.4 / 5 / 6
</td><td width="187">
高达 30+ Gbps
</td></tr></tbody></table><hr id="aMOJB" class="ne-hr">
## 3. 关键冲突解决机制：CSMA/CA

与有线以太网的 CSMA/CD（碰撞检测）不同，无线环境无法边发边听，因此使用 **CSMA/CA (Carrier Sense Multiple Access with Collision Avoidance - 载波侦听多路访问/冲突避免)**。


- **Listen before talk：** 说话前先听。如果信道忙，就随机等待一段时间。
- **确认机制 (ACK)：** 只有收到接收方的 ACK，才认为发送成功。
- **RTS/CTS 机制：** 为了解决“**隐藏节点**”问题（两个终端都能看到 AP，但互看不到，导致同时发包碰撞），发送方先发一个小请求（RTS），AP 回复准许（CTS）后才正式传数据。
<hr id="VZ30Y" class="ne-hr">
## 4. 安全加密协议

WLAN 信号在空气中传播，安全性至关重要：


- **WEP：** 极不安全，早已被破解，严禁使用。
- **WPA/WPA2：** 目前最主流，使用 AES 加密。
- **WPA3：** 针对 Wi-Fi 6 引入的新标准，增强了防暴力破解能力（SAE 握手协议），建议开启。
<hr id="UcUI5" class="ne-hr">
## 5. WLAN 的关键技术 (Wi-Fi 6/7)


- **OFDMA：** 将信道切分成更小的资源块，允许多个设备**同时**传输，显著降低延迟。
- **MU-MIMO：** 多用户多入多出，像超市开了多个收银柜台，提高并发能力。
- **QAM (正交幅度调制)：** Wi-Fi 7 升级到了 4K-QAM，在同样的信号里塞入更多数据位。