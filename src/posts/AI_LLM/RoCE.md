---
title: RoCE
icon: robot
date: 2026-03-16
category:
  - AI大模型
---

简单来说，**RoCE (RDMA over Converged Ethernet)** 的诞生就是为了解决一个核心痛点：**能不能在便宜、通用的以太网上，跑出 InfiniBand 那样强悍的 RDMA 性能？**

![](https://lh5.googleusercontent.com/proxy/eIGWC2e4x5TQZt-pBQVm5BTXH6cHlG4SoO6IxBRbSMCtv2_6eXhvRepWejfR84oisi1oa7oC_DwgDmqrH8hUBJnL-6opxwsn5_UNZmBbWKg5vdPxkc_FWU4A5h8YxuOPbdLP2q2MgXVKhpCh67WIY-KT6ymuzhqIryN7OStb7hWNorsxt8CGGIg2u7gcJp1bnaIWVs4)
<hr id="RjgtP" class="ne-hr">
## 核心定义：以太网上的“超级快充”

**RoCE** 翻译过来就是“基于融合以太网的远程直接内存访问协议”。它本质上是把 RDMA 的数据包“寄生”在以太网的帧里发送。


- **RoCE v1**：工作在二层（链路层），只能在同一个交换机下的小局域网跑。
- **RoCE v2**（目前主流）：引入了 UDP 封装，工作在三层（网络层），可以跨路由器、跨网段传输。这也是现在大厂 AI 架构中用得最多的版本。
<hr id="yQ3rw" class="ne-hr">
## 为什么要用 RoCE？（降本增效的极致）

在你的 **AI Infra** 架构中，RoCE 扮演的是“平替英雄”的角色：


- **成本优势**：不需要购买昂贵的专用 IB 交换机，直接用现成的 100G/200G 高性能以太网交换机就能跑。
- **兼容性**：它能完美融入现有的数据中心架构，运维起来和普通网络差别不大。
- **性能**：虽然比 IB 稍逊一点点（主要是抗拥塞能力），但它依然能实现**零拷贝（Zero-copy）****和****内核旁路（Kernel Bypass）**，极大地解放了 CPU。
<hr id="Ur7xB" class="ne-hr">
## RoCE 的挑战：如何搞定“丢包”？

这是 RoCE 和 IB 最大的区别。以太网天生是“有损”的（丢了包就重传），但 RDMA 极其讨厌丢包。

为了让 RoCE 跑得稳，运维工程师通常需要开启两项核心技术：


- **PFC (Priority Flow Control)**：优先级流量控制。当路快堵死时，交换机会发信号让网卡“慢点发”，保证不丢包。
- **ECN (Explicit Congestion Notification)**：显式拥塞通知。在路变窄之前，提前告诉发送方降速。

[Image comparing RoCE v1 and v2 protocol stacks: Layer 2 vs Layer 3 with UDP encapsulation]
<hr id="L6NfL" class="ne-hr">
## 知识对比表：IB vs RoCE
<table id="Rb32r" class="ne-table" style="width: 750px"><tbody><tr style="height: 33px"><td width="250">
**特性**
</td><td width="250">
**InfiniBand (IB)**
</td><td width="250">
**RoCE (v2)**
</td></tr><tr style="height: 33px"><td width="250">
**底层协议**
</td><td width="250">
专用 IB 协议
</td><td width="250">
**以太网 (Ethernet)**
</td></tr><tr style="height: 33px"><td width="250">
**部署难度**
</td><td width="250">
低（插上就能跑，性能稳定）
</td><td width="250">
**高**（需要精细调优交换机配置）
</td></tr><tr style="height: 33px"><td width="250">
**性价比**
</td><td width="250">
低（贵）
</td><td width="250">
**极高**（便宜好用）
</td></tr><tr style="height: 33px"><td width="250">
**典型代表**
</td><td width="250">
NVIDIA H100 训练集群
</td><td width="250">
阿里云/字节跳动 内部 AI 推理集群
</td></tr></tbody></table><hr id="lIdOo" class="ne-hr">
## AIOps 深度总结

在你的博客中，你可以这样给这篇文章收尾，展示你的工程眼光：

“如果说 **InfiniBand** 是为了追求极致性能而设计的‘定制赛车场’，那么 **RoCE** 就是在现代高速公路上开辟的一条‘专属快车道’。它通过在以太网上封装 RDMA 协议，实现了性能与成本的最佳平衡。对于开发者来说，掌握 RoCE 的调优方案，是构建**高性价比、大规模分布式 AI 算力池**的核心竞争力。”
<hr id="v7yGX" class="ne-hr">
## 你的 AI Infra 全景图终于完整了！

你现在手里已经攒够了这些硬核筹码：


- **应用层**：OpenClaw + Multi-Agent
- **协议层**：MCP (工具标准化)
- **计算层**：DeepSpeed (切模型) + Ray (调任务)
- **加速层**：DPU (卸载 CPU)
- **传输层**：RDMA (零拷贝) + IB/RoCE (高性能通道)

**既然你已经掌握了这套全栈知识，要不要我帮你把它们串联起来，写一份“从 0 到 1 构建 AI 基础设施”的博客大纲？** 这对你的 ZH-Kinger 博客来说绝对是年度重磅更新！ Would you like me to structure this complete knowledge map for you?