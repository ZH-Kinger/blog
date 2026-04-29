---
title: OSI 7层模型 /Tcp-ip协议
icon: network-wired
date: 2026-02-12
category:
  - 计算机网络
---

## OSI 7层模型 /Tcp-ip协议

在计算机网络的世界里，为了让不同厂家、不同系统的设备能互相沟通，人们制定了“分层”的标准。最著名的就是理论上的 **OSI 七层模型**和实际应用的 **TCP/IP 四层（或五层）模型**。
<hr id="DoDQN" class="ne-hr">
### 1. OSI 七层参考模型 (理论标杆)

OSI（Open System Interconnection）由国际标准化组织定义，它将网络通信细分为 7 层，每一层都有明确的职责。
<table id="jWfqj" class="ne-table" style="width: 748px"><tbody><tr style="height: 33px"><td width="187">
**层级**
</td><td width="187">
**名称**
</td><td width="187">
**核心功能**
</td><td width="187">
**形象比喻**
</td></tr><tr style="height: 33px"><td width="187">
**7**
</td><td width="187">
**应用层**
</td><td width="187">
用户接口，处理特定应用细节。
</td><td width="187">
写信的内容 (HTTP/FTP)
</td></tr><tr style="height: 33px"><td width="187">
**6**
</td><td width="187">
**表示层**
</td><td width="187">
数据格式化、加密、压缩。
</td><td width="187">
翻译成对方懂的语言
</td></tr><tr style="height: 33px"><td width="187">
**5**
</td><td width="187">
**会话层**
</td><td width="187">
建立、管理和终止会话。
</td><td width="187">
确认对方是否在线
</td></tr><tr style="height: 33px"><td width="187">
**4**
</td><td width="187">
**传输层**
</td><td width="187">
端到端的数据传输、流量控制、纠错。
</td><td width="187">
选择平邮还是挂号信 (TCP/UDP)
</td></tr><tr style="height: 33px"><td width="187">
**3**
</td><td width="187">
**网络层**
</td><td width="187">
逻辑寻址，选择路由路径。
</td><td width="187">
在信封上写地址 (IP)
</td></tr><tr style="height: 33px"><td width="187">
**2**
</td><td width="187">
**数据链路层**
</td><td width="187">
物理地址寻址，错误检测。
</td><td width="187">
封装成信封，交给邮局 (MAC)
</td></tr><tr style="height: 33px"><td width="187">
**1**
</td><td width="187">
**物理层**
</td><td width="187">
物理介质上的比特流传输。
</td><td width="187">
运输信件的汽车、飞机
</td></tr></tbody></table><hr id="W93Sz" class="ne-hr">
### 2. TCP/IP 协议栈 (事实标准)

虽然 OSI 模型很完美，但它太复杂了。在实际互联网中，我们使用的是 **TCP/IP 模型**。它更简洁，将 OSI 的上三层合并，下两层有时也合并。

#### 常见的五层结构：
<table id="H6MVy" class="ne-table" style="width: 750px"><tbody><tr style="height: 33px"><td width="150">
**层级**
</td><td width="150">
**层名称**
</td><td width="150">
**数据单位**
</td><td width="150">
**核心功能**
</td><td width="150">
**典型协议**
</td></tr><tr style="height: 33px"><td width="150">
**5**
</td><td width="150">
**应用层** (Application)
</td><td width="150">
**消息 (Message)**
</td><td width="150">
直接为应用进程提供服务，定义数据格式。
</td><td width="150">
**HTTP** (网页), **DNS** (域名), **FTP** (文件), **MQTT** (物联网)
</td></tr><tr style="height: 33px"><td width="150">
**4**
</td><td width="150">
**传输层** (Transport)
</td><td width="150">
**段 (Segment)** / **数据报 (Datagram)**
</td><td width="150">
提供端到端的通信控制，负责数据的可靠性或速度。
</td><td width="150">
**TCP** (可靠传输), **UDP** (快速传输)
</td></tr><tr style="height: 33px"><td width="150">
**3**
</td><td width="150">
**网络层** (Internet)
</td><td width="150">
**包 (Packet)**
</td><td width="150">
负责将数据包从源主机发送到目标主机（寻址和路由）。
</td><td width="150">
**IP** (IPv4/IPv6), **ICMP** (Ping命令), **ARP** (地址解析)
</td></tr><tr style="height: 33px"><td width="150">
**2**
</td><td width="150">
**数据链路层** (Data Link)
</td><td width="150">
**帧 (Frame)**
</td><td width="150">
在相邻节点（如电脑与路由器）间建立逻辑连接，错误检测。
</td><td width="150">
**Ethernet** (以太网), **Wi-Fi** (802.11), **PPP**
</td></tr><tr style="height: 33px"><td width="150">
**1**
</td><td width="150">
**物理层** (Physical)
</td><td width="150">
**比特 (Bit)**
</td><td width="150">
定义物理媒介（网线、光纤）的机械和电气特性。
</td><td width="150">
**RJ45** (网线接口), **光纤**, **中继器**
</td></tr></tbody></table>
### tcp/ip协议簇

![](https://cdn.nlark.com/yuque/0/2026/png/62301513/1770906583986-5219db17-db77-453e-a141-e124f7af86a6.png)

### 3. 核心差异：为什么我们要学两个？


- **OSI** 是**法律上的标准**（De jure standard）：它非常严谨，适合教学和排查故障（比如常说的“排查一下是不是物理层断了”）。
- **TCP/IP** 是**事实上的标准**（De facto standard）：它是互联网成功的基石，实用性极强。
<hr id="YCA53" class="ne-hr">
### 4. 数据在模型中的流动：封装与解封装

这是理解分层模型最关键的一环。


- **封装 (Encapsulation)**：当你发一条消息，数据从高层向底层流动。每经过一层，就会套上一个该层的“头部”（Header），就像给礼物一层层包上包装纸。
- **解封装 (Decapsulation)**：接收方收到后，从物理层往应用层拆包，每一层读取并去掉自己的头部，最后露出最里面的数据。
<hr id="qM7LM" class="ne-hr">
### 5. 总结：如何快速记忆？

你可以记住这个顺口溜（从下往上）：

**物、链、网、传、会、表、应**。


- **物理层**：看得到、摸得着的。
- **链路层**：局域网内的“小圈子”通信。
- **网络层**：跨网络的“远程”导航。
- **传输层**：确保数据“完整、有序”地到达。
- **应用层**：你看到的、用的各种功能。

## 数据封装

**数据封装（Data Encapsulation）** 是计算机网络通信中的核心逻辑。它就像寄快递时“层层装箱”的过程：每一层协议都会在原始数据的基础上加上自己的**控制信息（报头 Header）**，从而确保数据能准确、安全地送达。
<hr id="ARrQf" class="ne-hr">
![](https://cdn.nlark.com/yuque/0/2026/png/62301513/1770906976410-87b02dd9-6abf-4770-b9f2-3e7838ea30a2.png)

### 1. 封装的全过程 (以 TCP/IP 五层模型为例)

当你在电脑上发出一行文字时，数据会自上而下经历以下过程：
<table id="sTfq9" class="ne-table" style="width: 750px"><tbody><tr style="height: 33px"><td width="150">
**步骤**
</td><td width="150">
**层级**
</td><td width="150">
**动作：加上“信封”**
</td><td width="150">
**封装后的名称**
</td><td width="150">
**核心附加信息**
</td></tr><tr style="height: 33px"><td width="150">
**1**
</td><td width="150">
**应用层**
</td><td width="150">
原始数据格式化
</td><td width="150">
**数据 (Data)**
</td><td width="150">
用户真实内容（如：HTTP 请求头）
</td></tr><tr style="height: 33px"><td width="150">
**2**
</td><td width="150">
**传输层**
</td><td width="150">
加上 **TCP/UDP 头**
</td><td width="150">
**段 (Segment)**
</td><td width="150">
**源端口、目的端口**（决定交给哪个程序）
</td></tr><tr style="height: 33px"><td width="150">
**3**
</td><td width="150">
**网络层**
</td><td width="150">
加上 **IP 头**
</td><td width="150">
**包 (Packet)**
</td><td width="150">
**源IP、目的IP**（决定发给哪台电脑）
</td></tr><tr style="height: 33px"><td width="150">
**4**
</td><td width="150">
**数据链路层**
</td><td width="150">
加上 **MAC 头和尾**
</td><td width="150">
**帧 (Frame)**
</td><td width="150">
**源MAC、目的MAC**（决定走哪个网口）
</td></tr><tr style="height: 33px"><td width="150">
**5**
</td><td width="150">
**物理层**
</td><td width="150">
转换成电/光信号
</td><td width="150">
**比特 (Bit)**
</td><td width="150">
纯粹的 0

和 1

二进制流
</td></tr></tbody></table><hr id="WIIoJ" class="ne-hr">
### 2. 为什么要层层加头？（形象比喻）

想象你要给远方的朋友寄一个**乐高积木模型**：


- **应用层**：你把模型拼好（原始数据）。
- **传输层（加内层包装）**：你把模型拆成几块，贴上标签“1号块”、“2号块”，并写上“丢了请联系我”（TCP 序列号与可靠性）。
- **网络层（写快递单）**：你在纸箱外写上**收件人家庭住址**和你的地址（IP 地址）。
- **数据链路层（装入运输车）**：快递员把箱子放进货车，货车上写着“去往xx分拣中心”（MAC 地址，负责局部跳转）。
- **物理层（上路）**：货车在公路上跑（物理传输）。
<hr id="V7sks" class="ne-hr">
### 3. 解封装 (Decapsulation)：对方收到后干什么？

当对方收到数据后，会进行完全相反的操作：**层层拆箱**。


- **物理层**收到信号变回比特流。
- **链路层**拆开 MAC 头，发现是给自己的，传给上一层。
- **网络层**拆开 IP 头，确认目标 IP 正确，传给上一层。
- **传输层**拆开 TCP 头，根据端口号（如 5000）把数据塞给对应的程序（如你的 Flask 后端）。
- **应用层**最终显示出那行文字。
<hr id="m6dqc" class="ne-hr">
### 4. 关键术语：PDU

在网络专业术语中，每一层封装好的数据统称为 **PDU（协议数据单元）**。


- 四层 PDU 是 **Segment**。
- 三层 PDU 是 **Packet**。
- 二层 PDU 是 **Frame**。
<hr id="X97Hv" class="ne-hr">
### 总结

**封装**是为了让复杂的网络环境知道：**这包东西是谁发的？发给谁？丢了怎么办？该交给哪个软件处理？**

**你想看看一个真实的 IP 包头或者 TCP 包头里具体长什么样吗？我们可以拆开一个“快递单”看看里面的细节。**
<hr id="jevGw" class="ne-hr">