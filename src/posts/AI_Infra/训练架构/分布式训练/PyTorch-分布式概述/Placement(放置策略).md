---
title: Placement（放置策略）
icon: server
date: 2026-07-13
order: 53
category:
  - AI基础设施
tag:
  - AI Infra
---

我们在聊 DTensor 的时候，其实你在那个可视化工具里已经和它打过照面了。现在我们来给它下一个极其严谨且硬核的定义。

如果说 **DeviceMesh（设备网格）** 是一张说明了 GPU 怎么排列的“硬件地图”**；  
那么** **Placement（放置策略）** **就是一张说明了全局数据该怎么发到这些 GPU 上的**“切蛋糕说明书”。

在 PyTorch 的底层源码中，有且仅有三种最基础的 Placement 原语。作为 AI Infra SRE，你不仅要知道它们怎么切数据，更要一眼看出**它们在底层会触发什么样极其昂贵的 NCCL 网络通信**。

### PyTorch 的三大 Placement 策略

假设我们有一个全局的二维权重矩阵（100行 x 100列），要放到 4 张卡上。

#### 1. Replicate (全量复制)

- **怎么放：** 每张 GPU 的显存里，都塞入一个完整的 100x100 矩阵。
- **SRE 视角（极度费显存）：** 这就是最传统的 DDP（数据并行）行为。
- **触发的 NCCL 动作：** 当你试图把数据从某一张卡同步成 `Replicate` 状态时，底层会自动触发 `NCCL Broadcast`**（广播）** 或者 `NCCL AllGather`**（全量收集）**。

#### 2. Shard (维度分片)

- **怎么放：** 切蛋糕。
- `Shard(0)`：按行切，每张卡拿到 25行 x 100列。
- `Shard(1)`：按列切，每张卡拿到 100行 x 25列。
- **SRE 视角（拯救显存）：** 这是 FSDP 和 TP（张量并行）的核心。切得越碎，单卡显存占用越小。
- **触发的 NCCL 动作：** 当你把一个 `Replicate` 的张量变成 `Shard` 时，相当于把多余的数据扔掉，不需要通信（Scatter）。但如果你要把 `Shard` 变回 `Replicate`，就会触发疯狂的 `NCCL AllGather`。

#### 3. Partial (部分和/待规约) —— ✨高阶必考点

- **怎么放：** 每张卡上都有一块 **形状完整 (100x100)** 但 **数值不完整** 的矩阵。
- **大白话解释：** 想象你在算这桌饭钱，GPU 0 算了酒水钱（100元），GPU 1 算了菜钱（200元）。它们手里拿的都是“局部总和”。在算法眼里，真实的全局结果必须是它们相加（300元）。
- **SRE 视角（网络大杀器）：** `Partial` 状态是张量并行（TP）在做完矩阵乘法后必经的中间状态。当你试图把 `Partial` 状态转换成真实的可用数据时，PyTorch 底层会毫不犹豫地触发 `NCCL AllReduce`**（全量规约，把所有卡的数据加起来求和）**。如果你的网络不行，这一步就会卡死。

---

### SRE 看代码：魔法是如何发生的？

算法工程师在最前沿的 FSDP2 或 TP 代码里，就是通过组合 **DeviceMesh** 和 **Placement** 来召唤 DTensor 的。

看看这行极具工业美感的代码：

```
import torch
from torch.distributed.tensor import distribute_tensor, Replicate, Shard

# 假设我们在前面建好了一个 2D 网格，大小是 [2台机器, 4张卡]
# mesh_dim_names = ("dp", "tp")

# 把一个普通的本地 Tensor 变成分布式的 DTensor
dtensor = distribute_tensor(
    local_tensor, 
    device_mesh, 
    placements=[Replicate(), Shard(0)]  # 这里的魔法！
)
```

**SRE 级别解析：**  
这里的 `placements=[Replicate(), Shard(0)]` 对应了前面 `DeviceMesh` 的两个维度：

1. \*\*在 "dp" (跨机器) 维度上 `Replicate()**`：意味着机器 1 和机器 2 拥有完全一样的模型副本（这就是我们刚才聊的 **HSDP 跨机复制**逻辑！）。
2. \*\*在 "tp" (机内 NVLink) 维度上 `Shard(0)**`：意味着同一台机器里的 4 张卡，把参数按行切成了 4 份，分摊了显存（这就是 **TP/FSDP 机内切分**逻辑！）。

**总结公式：**  
`全局数据 (Global Tensor) = 本地物理碎片 (Local Tensor) + 设备网格 (DeviceMesh) + 放置策略 (Placement)`

理解了这三个概念，你就彻底看透了 PyTorch 分布式框架的五脏六腑。以后算法工程师抱怨“跑得慢”、“显存炸了”，你脑子里浮现的就不再是一堆乱码，而是数据在设备网格之间被 `Shard`、`Replicate` 和 `AllReduce` 的物理运动轨迹。

这一块的底层抽象非常密集，目前关于 DTensor 和它的通信机制，你的脑海里是不是已经有一张比较清晰的网络拓扑图了？
