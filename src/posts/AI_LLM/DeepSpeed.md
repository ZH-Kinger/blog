---
title: DeepSpeed
icon: robot
date: 2026-03-16
category:
  - AI大模型
---

## DeepSpeed是什么？

DeepSpeed 是理解现代 AI 大规模部署的**必经之路**。如果说大模型是“庞然大物”，那么 DeepSpeed 就是一套极致的**“空间折叠技术”**。

它是微软开发的一个深度学习优化库，核心使命只有一个：**打破显存限制，让小显卡（或更少的显卡）也能跑大模型**
<hr id="Nouk6" class="ne-hr">
## 1. 核心大招：ZeRO (零冗余优化器)

这是 DeepSpeed 的成名绝技。在传统的分布式训练中，每个 GPU 都要存储一份完整的模型参数、梯度和优化器状态。这就像每个员工都背着全套的工具箱，非常沉重且浪费。

ZeRO 将这些数据分成了三个阶段进行“瘦身”：


- **ZeRO-1**：只把**优化器状态（Optimizer States）**切开，平摊到各个 GPU。
- **ZeRO-2**：把**梯度（Gradients）**也切开平摊。
- **ZeRO-3**：最激进的阶段，把**模型参数（Parameters）**也全部切开平摊。

**结果**：原本需要 64 张显卡才能跑的模型，用了 ZeRO-3 之后，可能 8 张显卡就能跑起来。显存占用被降低到了原来的 $1/N$（N 是显卡数量）。
<hr id="l9cig" class="ne-hr">
## 2. 内存卸载：Offload 技术

如果你的显存（VRAM）连切开后的模型都塞不下，DeepSpeed 还有第二招：**Offload**。


- **CPU Offload**：把暂时不参与计算的参数挪到 **内存 (RAM)** 里。
- **NVMe Offload**：如果内存也满了，就挪到 **SSD 硬盘** 里。

虽然硬盘比显存慢，但通过 DeepSpeed 极致的预取（Prefetch）和并行策略，它能让你在普通的消费级显卡（比如单张 RTX 3090/4090）上跑起原本属于 A100/H100 的千亿参数大模型。
<hr id="HBBRw" class="ne-hr">
## 3. DeepSpeed 与底层的联动（结合你之前的 Infra 知识）

为什么我之前一直跟你强调 **RDMA** 和 **InfiniBand**？因为 DeepSpeed 的 ZeRO 架构有一个副作用：**通信压力极大**。

由于参数被切开存在不同显卡上，每次计算（前向传播和反向传播）时，GPU 之间都要疯狂地互相“借”参数。


- 如果你的网络是普通的 **TCP/IP**，带宽低且 CPU 占用高，DeepSpeed 就会卡在数据传输上（即 **Communication Bottleneck**）。
- 如果你有 **RDMA/RoCE**，数据搬运几乎不占 CPU，DeepSpeed 才能发挥出真正的“空间折叠”威力。
<hr id="uK3oL" class="ne-hr">
## 4. 实战笔记

你可以把 DeepSpeed 总结为 AI 运维中的 **“资源调优大师”**：
<table id="XRYFB" class="ne-table" style="width: 750px"><tbody><tr style="height: 33px"><td width="250">
**解决的问题**
</td><td width="250">
**DeepSpeed 的方案**
</td><td width="250">
**运维效果**
</td></tr><tr style="height: 33px"><td width="250">
**显存溢出 (OOM)**
</td><td width="250">
ZeRO 1/2/3 分块存储
</td><td width="250">
支持训练/微调超大规模模型
</td></tr><tr style="height: 33px"><td width="250">
**硬件设备贵**
</td><td width="250">
CPU/NVMe Offload
</td><td width="250">
用廉价硬件跑高性能任务
</td></tr><tr style="height: 33px"><td width="250">
**训练速度慢**
</td><td width="250">
1位 Adam 优化器 / 浮点压缩
</td><td width="250">
提高吞吐量，缩短训练周期
</td></tr></tbody></table><hr id="Vrp4h" class="ne-hr">
## 这块知识如何运用？

你在面试时，如果能把 **DeepSpeed 的 ZeRO 机制** 结合 **RDMA 网络** 一起讲，面试官会觉得你对“AI 系统的全栈协同”理解得非常深刻。

既然 DeepSpeed 是为了处理“大”，而你之前研究的量化是为了让模型变“小”，你想不想对比一下：**在一个 4B 的轻量级 Agent 场景下，是该用 DeepSpeed 还是该用量化？**

我会建议你在博客中写一个专题：**《大与小的博弈：DeepSpeed 的分布式扩展 vs 模型量化的本地加速》**。要不要我帮你理一下这个专题的提纲？