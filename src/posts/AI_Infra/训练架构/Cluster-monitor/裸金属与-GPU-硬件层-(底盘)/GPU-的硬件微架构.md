---
title: GPU 的硬件微架构
icon: server
date: 2026-07-13
order: 25
category:
  - AI基础设施
tag:
  - AI Infra
---

深入理解 GPU 的硬件微架构，是把大模型算力榨干到最后一滴的必备基本功。

在英伟达（NVIDIA）的 GPU 体系中（特别是你们正在使用的 Hopper/Blackwell 架构），GPU 的设计并不是一个单一的“超级 CPU”，而是一个**高并发、层层嵌套的巨型计算矩阵**。

如果把一块 GPU 芯片（比如 H200）拆开，从宏观到微观，它的硬件结构层级如下：

### 一、 宏观层：GPU 芯片的“省市划分”

1. **GPU 芯片整体（Die）**：

最顶层。例如一块 H100 物理芯片上集成了近 800 亿个晶体管。

2. **GPC (Graphics Processing Cluster，图形处理集群)**：

GPU 内部的“大省”。一块 H100 包含 8 个 GPC。GPC 是几乎独立的计算大区，拥有自己独立的流水线控制逻辑。

3. **TPC (Texture Processing Cluster，纹理处理集群)**：

GPC 内部的“地级市”。一个 GPC 包含数个 TPC（通常为 9 个）。

4. **SM (Streaming Multiprocessor，流式多处理器)**：

**这就是你提到的“流式处理器”，它是 GPU 的基本计算单元！** 一个 TPC 内部包含 2 个 SM。也就是说，一块 GPU 核心里有上百个 SM（H100 有 132 个 active SM）。

### 二、 微观层：解剖一个 SM（GPU 的核心引擎）

**SM 相当于 CPU 里面的“物理核”**，但它的设计方向与 CPU 截然不同：CPU 的核极其强壮（精于复杂的单线程控制逻辑），而 GPU 的 SM 极其精简（精于暴力并发计算）。

一个 SM 内部，被切分成了 4 个**子模块（Sub-Core）**。每个 SM 里面塞满了以下硬件：

#### 1. 核心计算单元（The Muscles）

- **CUDA Core (ALU)**：

传统的“小计算器”。负责执行最基本的算术和逻辑运算。一个 SM 里有大量不同种类的 CUDA Core：

- **FP32 Core**：单精度浮点运算单元。
- **INT32 Core**：整数运算单元（负责地址计算、循环控制等）。
- **FP64 Core**：双精度浮点运算单元。在 AI 中几乎不用，但在高性能科学计算（如天气预报、物理模拟）中是主力。

- **Tensor Core (张量核心)**：

**专门为了 AI 矩阵乘法而焊死在芯片上的“物理外挂”。** 它不干别的事，只做：$D = A \times B + C$ 这个矩阵乘加操作（通常是 $4 \times 4$、 $8 \times 8$ 或 $16 \times 16$ 的矩阵）。它的吞吐量是普通 CUDA Core 的几十倍。

- **SFU (Special Function Unit，特殊函数单元)**：

普通的 CUDA Core 算加减乘除很快，但算 $\sin(x)$、$\cos(x)$、$\ln(x)$、$\sqrt{x}$ 这种复杂的超越函数就力不从心了。SFU 是专门用来物理加速这些高难度数学运算的。

#### 2. 存储与搬运工（The Logistics）

- **Register File (寄存器堆)**：

SM 内部最快、物理距离最近的存储。GPU 的寄存器数量极其庞大（H100 单个 SM 拥有 $256\text{ KB}$ 寄存器），因为 GPU 需要在纳秒内切换成千上万个线程，所有线程的数据必须同时留在寄存器里（这叫**零开销线程切换**）。

- **Shared Memory / L1 Cache (共享内存/一阶缓存)**：

SM 内部的超高速缓存（SRAM，约 $256\text{ KB}$）。

- 它可以被算法工程师在代码中手动控制（称为 `Shared Memory`），用于 SM 内部各个线程之间的数据共享。
- 也可以作为硬件自动控制的一级缓存（`L1 Cache`）。

- **TMA (Tensor Memory Accelerator，张量内存加速器)**：

**这是 Hopper 架构引入的硬核创新。** 以前把数据从显存搬到 SM 共享内存，需要 SM 亲自出马执行指令，极度浪费计算算力。TMA 是一个独立的硬件异步搬运工，它可以**在不惊动 SM 计算单元的情况下，直接在后台将海量矩阵数据在显存和共享内存之间倒腾**。

#### 3. 控制与调度（The Brain）

- **Warp Scheduler (线程束调度器)**：

GPU 并不像 CPU 那样一次执行一个线程。GPU 每次执行都打包 **32 个线程**一起跑，这个 32 线程的组合叫 **Warp (线程束)**。Warp Scheduler 负责决定哪一个 Warp 优先进入计算通道。

- **Dispatch Unit (分发单元)**：

负责把 Warp Scheduler 挑选出的指令发送给具体的计算单元（如 Tensor Core 或 FP32 Core）。

### 三、 芯片外围与存储层（支持系统）

除了上面的计算核心，GPU 芯片上还有几个关键的基础设施：

1. **L2 Cache (二级缓存)**：

这是一个跨越所有 GPC、所有 SM 共享的巨型片上缓存（H100 有高达 $50\text{ MB}$ 的 L2 Cache）。它的存在是为了尽量减少 GPU 去访问慢速片外显存的次数。

2. **HBM (High Bandwidth Memory，高带宽显存)**：

通过中介层（Interposer）与 GPU 芯片封装在同一个基板上的高速 3D 堆叠显存（比如 H200 搭载的 $141\text{ GB}$ HBM3e）。它的带宽高达 $4.8\text{ TB/s}$，是普通电脑内存的几十倍，专门用来存放模型的权重参数和临时激活值。

3. **HIC / NVLink Interface (NVLink 接口)**：

负责 GPU 之间互联的物理高速收发器。

4. **GigaThread Engine (全局调度引擎)**：

GPU 的主控大脑。负责接收来自 CPU 的 K8s 任务、Stream 队列，并将这些巨量网格（Grid）线程块派发到各个 GPC 和 SM 中去。

### 💡 总结：它们是如何协同工作训练大模型的？

当你的大模型在 GPU 上进行一步前向传播时，底层的硬件配合是极其艺术的：

1. **GigaThread** 接收到 PyTorch 的矩阵乘法任务，将任务切分成多个线程块（Blocks），分发给各个 **SM**。
2. **TMA** 自动启动，绕过 SM，直接将模型参数从片外的 **HBM** 显存拉进 SM 内部的 **Shared Memory** 中。
3. **Warp Scheduler** 迅速将计算任务打包成 32 线程的 Warp，分发给 **Tensor Core**。
4. **Tensor Core** 物理级爆发，在 1 个时钟周期内完成巨大的混合精度矩阵相乘（触发 `DCGM_FI_PROF_TENSOR_OP_UTIL` 指标暴涨）。
5. 算完的中间结果写入 **L2 Cache**，最终通过 **PCIe/NVLink** 传递给其他 GPU，或者写回 **HBM**，准备下一次计算。

明白了这个结构，当你在看之前的 `dcgm_parameters_reference.md` 监控文件时，你就会有完全不同的底气：

- 为什么 `SM_ACTIVE` 代表整体？因为那是流式处理器的综合饱满度。
- 为什么 `DRAM_ACTIVE` 卡住是地狱？因为那是 HBM 搬运数据的油管堵塞了。
