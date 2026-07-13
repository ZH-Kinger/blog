---
title: PyTorch 分布式概述
icon: server
date: 2026-07-13
order: 43
category:
  - AI基础设施
tag:
  - AI Infra
dir:
  order: 43
  collapsible: true
---

原文：[PyTorch Distributed Overview — PyTorch Tutorials 2.12.0+cu130 documentation](https://docs.pytorch.org/tutorials/beginner/dist_overview.html)

## 名称解释：

### Tensor：[Tensor](https://www.yuque.com/kinger-wwnro/xldv9a/gwqr1px912t9wdnq "Tensor")

Tensor（张量）就是一个多维数组，它是整个深度学习世界里装载数据的“集装箱”。

无论是你输入的文本、图片，还是模型内部几十亿的参数，在 GPU 眼里，它们全都是 Tensor。

### DeviceMesh：

在分布式训练领域，DeviceMesh 是管理 ProcessGroup 的高级抽象，能简化多维度并行的进程组设置与管理，提供切片、扁平化等操作

### DTensor：[DTensor](https://www.yuque.com/kinger-wwnro/xldv9a/za59d6iswfcndtsc "DTensor")

DTensor 即 Distributed Tensor（分布式张量），是 TensorFlow 和 PyTorch 用于同步分布式计算的扩展。在 TensorFlow 中，它通过单程序多数据（SPMD）扩展分发程序和张量，实现与普通张量的无缝替换；在 PyTorch 中，它是原生张量分片原语，为多设备张量提供单设备抽象，处理分布式逻辑。

### SPMD：

SPMD 是 PyTorch/XLA 中的一种自动并行化系统，允许开发者编写单设备程序，由 XLA 编译器根据用户提示进行分区并行执行

### NCCL：

NCCL（发音为 "Nickel"）的全称是 NVIDIA Collective Communications Library（NVIDIA 集合通信库）

## PyTorch是什么？

**PyTorch 是大模型计算的“操作系统”，负责把上层的算法逻辑翻译成底层的 GPU 计算和网络通信指令。**

对于 AI Infra SRE 来说，你只需要盯紧它的三个核心模块：

- **Tensor (张量/数据结构)：** 负责显存分配。你日常排查的显存 OOM (内存溢出) 报错，基本都是它塞不进数据时抛出的。
- **Autograd (自动求导)：** 负责生成海量的矩阵计算任务。你监控大盘里 GPU 利用率的高低，直接取决于它的执行效率。
- **Distributed (分布式调度)：** 负责跨卡跨机通信。当你发现网络拥塞或计算节点在“干等”时，往往需要从这里深入排查底层 NCCL 库的调用。

简而言之，集群性能的瓶颈点在哪，PyTorch 的日志就会在哪里报警。

既然有了大概的认知，我们现在去服务器终端敲一行简单的命令 `python -c "import torch; print(torch.__version__, torch.version.cuda)"`，先确认一下你现有的环境版本好吗？

## 分布式训练架构的发展历程以及相关演变

### 模块一：显存去哪儿了？（数据与内存并行）

#### • 【老】基础体验：PyTorch DDP (Distributed Data Parallel)

• 学什么： 最经典的“数据并行”。明白为什么每个 GPU 都要完整复制一份模型，以及为什么模型稍微大一点，单卡就直接 OOM。

#### • 【新】进阶破局：DeepSpeed ZeRO 系列 / PyTorch FSDP

• 学什么： 既然单卡装不下，怎么把“模型参数”、“梯度”和“优化器状态”像切蛋糕一样切分到不同 GPU 上。理解 ZeRO 阶段 1、2、3 的演进。

### 模块二：单卡算力不够怎么办？（模型与算力并行）

#### • 【老】微观切分：Megatron-LM (TP/PP)

• 学什么： 学习“张量并行 (TP)”如何把矩阵乘法拆开（需要极高的 NVLink 带宽），以及“流水线并行 (PP)”如何把模型的层像工厂流水线一样分配给不同机器。

#### • 【新】宏观颠覆：Context Parallelism (上下文并行)

• 学什么： 针对现在的长文本需求，学习如何不再切分模型，而是把超长的输入 Token 切分给多张卡并行处理（比如 Ring Attention）。

### 模块三：从“手搓”到“工业化”

#### • 【老】底层原语：NCCL 通信库

• 学什么： 写原生脚本，去调用底层的 AllReduce (全量规约) 和 AllGather (全量收集)，看看数据在 GPU 之间到底是怎么传输的。

#### • 【新】开箱即用：TorchTitan

• 学什么： 看看最新的官方库是如何把上面所有的 DDP、FSDP、TP 用优雅的代码统一管理起来的。

## 并行API

这些并行模块提供高级功能，并可与现有模型组合使用：

• 分布式数据并行（DDP）：[DistributedDataParallel — PyTorch 2.12 documentation](https://docs.pytorch.org/docs/2.12/generated/torch.nn.parallel.DistributedDataParallel.html)

• 全分片数据并行训练（FSDP2）：[torch.distributed.fsdp.fully\_shard — PyTorch 2.12 documentation](https://docs.pytorch.org/docs/2.12/distributed.fsdp.fully_shard.html)

• 张量并行（TP）：[Tensor Parallelism - torch.distributed.tensor.parallel — PyTorch 2.12 documentation](https://docs.pytorch.org/docs/2.12/distributed.tensor.parallel.html)

• 流水线并行（PP）：[Pipeline Parallelism — PyTorch main documentation](https://docs.pytorch.org/docs/main/distributed.pipelining.html)

## 分片原语

DTensor并且DeviceMesh是用于在 N 维进程组上构建分片或复制张量并行性的原语。

• DTensor表示分片和/或复制的张量，并根据操作需要自动通信以重新分片张量。

• DeviceMesh将加速器设备通信器抽象成一个多维数组，该数组管理底层ProcessGroup实例，以在多维并行环境中进行集体通信。请尝试我们的DeviceMesh 示例以了解更多信息。
