---
title: ospf
icon: network-wired
date: 2026-02-21
category:
  - 计算机网络
---

**OSPF (Open Shortest Path First，开放最短路径优先)** 是目前企业网和园区网中使用最广泛的**链路状态路由协议**。

如果把 RIP 比作“听信邻居传言”的向导，那么 OSPF 就是一个“手握全城高清地图”的导航系统。

![](https://cdn.nlark.com/yuque/0/2026/png/62301513/1771652527084-b8a8d555-1fb4-4f7b-868c-5aa8ddfac0f8.png)
<hr id="WkyHu" class="ne-hr">
## 1. OSPF 的核心工作原理：五个步骤

OSPF 的运行过程可以概括为从“打招呼”到“画地图”再到“算路径”的过程：

### 第一步：建立邻居关系 (Hello 机制)

路由器启动后，会向各个接口发送 **Hello 报文**。如果对面的路由器也跑了 OSPF 且参数匹配，两者就成了“邻居”。

#### 邻居选举

在 OSPF 协议中，邻居关系的建立与特定角色（DR/BDR）的选举是确保网络稳定和减少冗余信息的关键机制。

##### 1. 邻居建立的五个关键阶段

当两台路由器物理连接并启动 OSPF 后，会经历以下状态转变：


- **Down**: 初始状态。
- **Init**: 收到邻居的 Hello 包，但包中没有自己的 Router ID。
- **2-Way**: 双方都在彼此的 Hello 包中看到了对方，**邻居关系正式建立**。
- **ExStart/Exchange**: 协商主从关系，交换 LSDB 的摘要信息（DBD）。
- **Loading/Full**: 请求详细 LSA 并更新，最终达到 **全毗邻（Full Adjacency）** 状态。
<hr id="T0e2H" class="ne-hr">
##### 2. DR 与 BDR 的选举 (核心逻辑)

在多路访问网络（如以太网）中，为了防止路由器之间两两建立关系导致 LSA 泛洪（n(n-1)/2 条链路），OSPF 会选出“班长”和“副班长”。


- **DR (Designated Router)**: 指定路由器，负责收集和分发所有的链路状态信息。
- **BDR (Backup DR)**: 备用指定路由器，当 DR 故障时立即接管。
- **DRothers**: 普通成员，只与 DR 和 BDR 建立 Full 关系。

##### 选举规则（按顺序匹配）：


- **接口优先级 (Priority)**: 范围 0-255，默认为 **1**。数值越大越优先。若设为 **0**，则永久弃权（不参加选举）。
- **Router ID (RID)**: 如果优先级相同，则比较 RID。数值大的胜出。


- *RID 来源*：手动配置 > Loopback 接口 IP 最大者 > 物理接口 IP 最大者。


**注意：不抢占原则**

OSPF 选举具有“非抢占性”。如果网络中已经存在 DR，即便新加入一台优先级更高的路由器，也不会触发重新选举，除非当前的 DR/BDR 重启或失效。
<hr id="iuGPM" class="ne-hr">
##### 3. 不同网络类型的影响

并不是所有场景都需要选举：
<table id="ImY05" class="ne-table" style="width: 750px"><tbody><tr style="height: 33px"><td width="250">
**网络类型**
</td><td width="250">
**典型场景**
</td><td width="250">
**是否选举 DR/BDR**
</td></tr><tr style="height: 33px"><td width="250">
**P2P (点到点)**
</td><td width="250">
串行链路/光纤直连
</td><td width="250">
**不选举**（直接建立 Full 关系）
</td></tr><tr style="height: 33px"><td width="250">
**Broadcast (广播)**
</td><td width="250">
以太网/交换机连接
</td><td width="250">
**必须选举**
</td></tr><tr style="height: 33px"><td width="250">
**NBMA**
</td><td width="250">
帧中继 (较罕见)
</td><td width="250">
**必须选举**
</td></tr></tbody></table>
****

****

****

****

### 第二步：同步链路状态 (LSA 泛洪)

这是 OSPF 最关键的一步。路由器不再发送整个路由表，而是发送 **LSA (Link State Advertisement)**。LSA 包含了：


- 我是谁？
- 我连接了哪些网段？
- 链路的带宽（开销）是多少？

这些 LSA 会像水波纹一样传遍整个网络，确保**每台路由器收到的 LSA 都是一模一样的**。

### 第三步：构建拓扑数据库 (LSDB)

每台路由器都会把收集到的所有 LSA 存入自己的 **LSDB (链路状态数据库)**。此时，每台路由器脑子里都有一张完整的、一致的全网地图。

### 第四步：计算最短路径 (SPF 算法)

路由器以自己为根节点，利用 **Dijkstra 算法**（也叫 SPF 算法）对 LSDB 进行计算。它会避开拥堵或断开的路径，计算出到达每个网段的**最短、开销最小**的路径。

### 第五步：生成路由表

计算结果被填入路由表。当数据包进入路由器时，路由器直接查表转发。
<hr id="B16Xy" class="ne-hr">
## 2. OSPF 的“开销” (Cost) 是如何计算的？

OSPF 不看跳数，它看的是**带宽**。带宽越高，开销越小，路径就越优。

Cost = Reference Bandwidth (默认 100Mbps)/Interface Bandwidth


- **100Mbps 链路：**Cost = 1
- **10Mbps 链路：**Cost = 10
- **10Gbps 链路：**Cost = 1 (通常需要手动调整参考带宽，否则无法区分高速链路)
<hr id="VuxCY" class="ne-hr">
## 3. OSPF 的层级结构：区域 (Area)

为了防止网络太大导致 LSA 太多、计算量过载，OSPF 引入了**区域化管理**：


- **Area 0 (骨干区域)：** 所有其他区域必须连接到 Area 0。
- **非骨干区域：** 负责局部的数据转发。
- **ABR (区域边界路由器)：** 连接 Area 0 和其他区域的“关卡”，负责汇总路由信息，减少跨区域的流量负担。
<hr id="H9UvD" class="ne-hr">
## 4. OSPF 的优缺点
<table id="lNroM" class="ne-table" style="width: 750px"><tbody><tr style="height: 33px"><td width="375">
**优点**
</td><td width="375">
**缺点**
</td></tr><tr style="height: 33px"><td width="375">
**无环路：** SPF 算法从物理上保证了路径不会绕圈。
</td><td width="375">
**资源消耗高：** 维护地图和运行算法需要较多 CPU 和内存。
</td></tr><tr style="height: 33px"><td width="375">
**收敛快：** 链路一断，秒级感知并重新计算。
</td><td width="375">
**配置复杂：** 相比 RIP，区域划分和参数调优需要更多技术背景。
</td></tr><tr style="height: 33px"><td width="375">
**支持大规模：** 划分区域后可以支撑成千上万个节点。
</td><td width="375"></td></tr></tbody></table>