---
title: InfiniBand
icon: robot
date: 2026-03-16
category:
  - AI大模型
---

在普通的互联网世界，我们用以太网（Ethernet）；但在**大模型训练**和**超级计算机**的世界，InfiniBand 是绝对的统治者。它是目前 NVIDIA 构建万卡集群（如 H100 集群）时唯一首选的网络方案。

![](https://cdn.nlark.com/yuque/0/2026/png/62301513/1773646111068-673c6430-19a0-4699-9ecb-fa90072e096b.png)

梓涵，既然你已经了解了 RDMA 和 DPU，那 **InfiniBand (IB)** 就是站在这个领域食物链顶端的“网络之王”。

在普通的互联网世界，我们用以太网（Ethernet）；但在**大模型训练**和**超级计算机**的世界，InfiniBand 是绝对的统治者。它是目前 NVIDIA 构建万卡集群（如 H100 集群）时唯一首选的网络方案。
<hr id="rUvjz" class="ne-hr">
## 核心定义：专为“快”而生的网络协议

InfiniBand 并不是一种更快的以太网，而是一套**完全独立**的、从底层物理层到应用层重新设计的网络架构。


- **物理层**：它使用专用的 IB 网卡、IB 交换机和特殊的导线。
- **协议层**：它不跑传统的 TCP/IP，而是天生就为 **RDMA**（远程直接内存访问）设计的。
<hr id="caIwl" class="ne-hr">
## 为什么 AI 训练离不开它？（三大必杀技）

如果你的 Agent 需要在多台服务器之间频繁同步几百 GB 的参数，以太网会让你“等到花儿都谢了”，而 IB 能做到：


- **极低延迟 (Ultra-low Latency)**：

以太网的延迟通常在微秒级别，而 IB 能压到**纳秒级**。这对于并行计算中成千上万次的细碎通信至关重要。


- **无损网络 (Lossless Network)**：

以太网在拥堵时会丢包（靠 TCP 重传，很慢）。IB 在硬件层面实现了基于信用的流量控制（Credit-based flow control），**天生不丢包**。


- **高带宽与效率**：

目前主流已经达到 400Gbps (NDR) 甚至更高。更重要的是，它对 CPU 的占用极低，因为所有的搬运工作都由硬件完成。
<hr id="r6jCM" class="ne-hr">
## InfiniBand vs. RoCE (以太网)

这是面试中最常考的区别点：
<table id="iRZoL" class="ne-table" style="width: 750px"><tbody><tr style="height: 33px"><td width="250">
**特性**
</td><td width="250">
**InfiniBand (IB)**
</td><td width="250">
**RoCE (基于以太网)**
</td></tr><tr style="height: 33px"><td width="250">
**部署成本**
</td><td width="250">
**极其昂贵**（专用设备）
</td><td width="250">
较低（兼容现有以太网）
</td></tr><tr style="height: 33px"><td width="250">
**性能**
</td><td width="250">
**天花板级**，最稳定
</td><td width="250">
很高，但受限于以太网丢包特性
</td></tr><tr style="height: 33px"><td width="250">
**配置难度**
</td><td width="250">
插件化，管理简单（子网管理器）
</td><td width="250">
复杂（需要精细配置交换机 PFC/ECN）
</td></tr><tr style="height: 33px"><td width="250">
**典型用户**
</td><td width="250">
NVIDIA H100 集群、超算中心
</td><td width="250">
互联网大厂云平台、AI 推理集群
</td></tr></tbody></table><hr id="g8pPH" class="ne-hr">
## 进阶视角

你可以把这个逻辑写进博客，解释为什么 NVIDIA 这么强势：

“NVIDIA 的护城河不仅是 GPU，更是它收购 Mellanox 后获得的 **InfiniBand** 技术。通过 IB 网络，NVIDIA 将成千上万颗 GPU 连成了一台‘超级计算机’。对于运维来说，理解 IB 意味着你触及了 **AI Infra 的性能核心**。虽然我们在本地实验多用以太网，但在真正的生产级大模型训练中，IB 才是确保算力不被网络损耗浪费的唯一答案。”