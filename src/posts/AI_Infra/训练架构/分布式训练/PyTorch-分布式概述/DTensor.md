---
title: DTensor
icon: server
date: 2026-07-13
order: 57
category:
  - AI基础设施
tag:
  - AI Infra
---

我们在上一层刚聊过 Tensor（张量）是装载数据的“集装箱”。现在你问到的 **DTensor（Distributed Tensor，分布式张量）**，正是 PyTorch 2.0 之后推出的**最新、最硬核的底层杀手锏**，也是支撑我们前面提到的 **TorchTitan** 能做到极致优雅的核心技术。

用一句话概括：**DTensor 是一种“全局幻觉”。它让分散在几十台机器、上百张 GPU 里的物理数据碎片，在算法工程师眼里，看起来就像是一个完整的一整块 Tensor。**

### 为什么需要 DTensor？（老技术的痛点）

在 DTensor 出现之前（比如使用早期的 Megatron-LM 做张量并行 TP）：  
算法工程师写代码极其痛苦。一个 8000x8000 的大矩阵，如果要分给 4 张卡算，工程师必须在代码里**手动**写出：

1. `GPU_0 取前 2000 行`
2. `GPU_1 取中间 2000 行...`
3. 算完之后，大家手动调用 `NCCL.AllGather()` 把结果拼起来。

这种方式不仅代码像意大利面条一样混乱，而且极容易写出 Bug，SRE 排查起来更是灾难。

### DTensor 的魔法：SPMD（单程序多数据）

有了 DTensor，算法工程师只需要写**一份**普通的单卡代码（SPMD，Single Program Multiple Data）。  
DTensor 在底层默默接管了一切。它引入了两个对于 Infra SRE 必须掌握的核心概念：

1. **DeviceMesh（设备网格）：** 它描述了底层硬件的拓扑结构。比如你那台 8 卡机器，可以定义为一个 `[2, 4]` 的两维网格。
2. **Placement（放置策略）：** 也就是这块“大蛋糕”到底该怎么切、分给谁。这是 DTensor 的灵魂。

为了让你直观理解 DTensor 是如何做切分的，我为你做了一个交互工具。你可以切换不同的 **Placement 策略**，看看一个“全局 Tensor”是如何被物理打散到 4 张 GPU 上的：

![](https://cdn.nlark.com/yuque/0/2026/png/62301513/1779245037878-8821e8a0-8007-4018-82e0-85fc7650a240.png)

### 为什么 SRE 面试要懂这个？

因为未来的大模型 Infra 平台化，底层必然会大规模转向 DTensor。

当你理解了 DTensor，你就会明白为什么 **TorchTitan** 能如此强大：  
在 TorchTitan 中，你想要把 8 张卡配成“4卡张量并行(TP) + 2卡数据并行(DP)”，你不再需要去改动模型里那些繁琐的切分逻辑，你**只需要改一行 DeviceMesh 和 Placement 的配置**！DTensor 会在底层自动把你的 3 维张量切得明明白白，并在需要同步时，**自动**去调用底层的 NCCL 发起通信。

既然你们组有 8 卡甚至可能是 Blackwell 架构的巨兽，如果要在上面跑最前沿的训练，你是否考虑过直接基于这台机器，去试跑一个包含 DTensor 逻辑的极简切分脚本，感受一下它自动调用 NCCL 通信的魅力？
