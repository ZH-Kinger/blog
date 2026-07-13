---
title: FlushAttention kernel
icon: server
date: 2026-07-13
order: 142
category:
  - AI基础设施
tag:
  - AI Infra
---

**FlashAttention** 绝对是大模型时代（LLM）算子优化史诗级的、最具革命性的“神作”算子。

在它诞生之前，大模型在处理长文本（Long Context）时，90% 的算力都蒸发在了 Attention（自注意力）的显存内耗中。FlashAttention 的出现，直接通过底层算子重构，将大模型原本 ![](https://cdn.nlark.com/yuque/__latex/44987cdf24dd308d34c4c7af30ad5b0b.svg) 的**显存占用**强行砍成了 ![](https://cdn.nlark.com/yuque/__latex/8c51f5913186f8ac629f1d5838940f33.svg)**（线性复杂度）**，让长文本微调和推理服务成为现实。

以下为你硬核拆解它的痛点、底层的数学与物理黑科技，以及它的演进版本：

---

### 一、 传统 Attention 的物理痛点（它干掉了什么？）

在标准的 Transformer 自注意力机制中，计算公式为：

![](https://cdn.nlark.com/yuque/__latex/23031ccb3922607ce0ecc3ea6c8edba4.svg)

#### 1. 传统算子的显存爆炸轨迹

假设输入序列长度（Sequence Length）为 ![](https://cdn.nlark.com/yuque/__latex/459f3c80a50b7be28751b0869ef5386a.svg)。

1. **矩阵乘法**：![](https://cdn.nlark.com/yuque/__latex/4ef7132d0df72d9e3db76f6391960a3d.svg) 乘以 ![](https://cdn.nlark.com/yuque/__latex/703d6d1833d8fc879a427eb0f3da358e.svg)，得到一个大小为 ![](https://cdn.nlark.com/yuque/__latex/448076210c9db212a5460533e680aa95.svg) 的注意力得分矩阵 ![](https://cdn.nlark.com/yuque/__latex/55fc237afbe535f7d8434985b848a6a7.svg)。如果 ![](https://cdn.nlark.com/yuque/__latex/544cdf4bf1ebeb23b3a49fc097e14b29.svg)（6万多个 Token），这个临时矩阵的大小将达到惊人的 ![](https://cdn.nlark.com/yuque/__latex/78c65f93dacd286c2b6b9fea3e2d6c56.svg)。
2. **读写内耗（Memory-Bound 噩梦）**：传统算子会把这个巨大的 ![](https://cdn.nlark.com/yuque/__latex/448076210c9db212a5460533e680aa95.svg) 矩阵**完完整整地写入片外主显存（HBM）**。
3. **Softmax 计算**：紧接着，Softmax 算子从 HBM 中把这个矩阵读出来，在 GPU 内部算完归一化概率，**再写回 HBM**。
4. **乘以 V**：最后，另一个矩阵乘法算子再次从 HBM 读出这个概率矩阵，去乘以 ![](https://cdn.nlark.com/yuque/__latex/9f493997c33913987175caf4a4849955.svg)，算出最终结果。

#### 2. 物理致命伤

这个 ![](https://cdn.nlark.com/yuque/__latex/448076210c9db212a5460533e680aa95.svg) 的中间矩阵在算完之后其实就可以直接丢弃了，但为了算 Softmax，它在 HBM 里来回倒腾了数次。随着文本长度 ![](https://cdn.nlark.com/yuque/__latex/459f3c80a50b7be28751b0869ef5386a.svg) 的增加，显存占用呈平方级（![](https://cdn.nlark.com/yuque/__latex/44987cdf24dd308d34c4c7af30ad5b0b.svg)）暴涨，GPU 计算单元（Tensor Core）的大部分时间都在干等慢速的 HBM 搬运数据，模型利用率（MFU）发生雪崩。

---

### 二、 FlashAttention 的核心物理黑科技（怎么实现的？）

它的核心第一性原理非常暴力：**“哪怕我在片上多算几次，也绝对不要往片外慢速显存（HBM）写那个该死的** ![](https://cdn.nlark.com/yuque/__latex/448076210c9db212a5460533e680aa95.svg) **矩阵！”**

它主要依靠两大底层算子优化手段：

#### 1. 硬件级分块计算（Tiling）

FlashAttention 绝不一次性处理整张图或全量序列。它利用 **Triton** 或 **CUDA C++**，将巨大的 ![](https://cdn.nlark.com/yuque/__latex/48613cc0ea765864baba0334c07dc45f.svg) 矩阵物理切碎成一个个适合 GPU 片上超高速缓存（SRAM/Shared Memory）大小的小块（Tiles）。

- 数据被一小块一小块地加载进片上 SRAM。
- 所有中间的矩阵乘法、Softmax、以及乘以 ![](https://cdn.nlark.com/yuque/__latex/9f493997c33913987175caf4a4849955.svg) 的操作，**全部在这个超高速的 SRAM 内部闭环算完**。
- 算完之后，直接把最终合并好的结果写回 HBM。自始至终，**那个庞大的** ![](https://cdn.nlark.com/yuque/__latex/448076210c9db212a5460533e680aa95.svg) **矩阵在物理上根本没有诞生过**，它只存在于转瞬即逝的片上寄存器和 SRAM 中。显存空间复杂度瞬间从 ![](https://cdn.nlark.com/yuque/__latex/44987cdf24dd308d34c4c7af30ad5b0b.svg) 降到了 ![](https://cdn.nlark.com/yuque/__latex/8c51f5913186f8ac629f1d5838940f33.svg)。

#### 2. 核心数学魔法：在线 Softmax 增量更新（Online Softmax）

分块计算有一个巨大的数学逻辑硬伤：Softmax 的分母需要知道**整行**数据的最大值（![](https://cdn.nlark.com/yuque/__latex/4760e2f007e23d820825ba241c47ce3b.svg)）和指数和（![](https://cdn.nlark.com/yuque/__latex/56c1b0cb7a48ccf9520b0adb3c8cb2e8.svg)）才能做归一化。我都把矩阵切碎了，算前一个小块时，怎么知道后面小块的最大值是多少？

FlashAttention 引入了 **Online Softmax（在线分块缩放）** 算法：

- 当算完第一个分块（Tile 1）时，算子记录当前局部的最大值 ![](https://cdn.nlark.com/yuque/__latex/cc0264633de0aab0bdb0628ff5f2a4ff.svg) 和分母 ![](https://cdn.nlark.com/yuque/__latex/05741e47c8bb01eee2d36ca2e75a52e3.svg)，并算出一个局部结果。
- 当加载第二个分块（Tile 2）时，发现了一个更大的新最大值 ![](https://cdn.nlark.com/yuque/__latex/d5247c93a984cdafbf59d2b1c0bbfaaf.svg)。
- **增量修正**：算子不需要推翻重算！它利用严格的数学公式，将旧的局部结果乘以一个**缩放因子**（如 ![](https://cdn.nlark.com/yuque/__latex/9744cd78ec0047ce270379c10fe24bbb.svg)），瞬间将其物理校正到以新最大值为基准的正确数值上，然后与新分块的结果融合成最新的全局状态。
- 依靠这个数学魔术，算子只需要对数据进行**前向单次扫描（One-pass）**，就能在完全不存大矩阵的情况下，算出完美的自注意力结果。

#### 3. 反向传播的“重计算”（Recomputation / Checkpointing）

在训练模型的反向传播（Backward）阶段，通常需要用到前向传播时产生的 Attention 矩阵来计算梯度。既然前向传时没存它，反向传时怎么办？

- FlashAttention 的选择是：**要用的时候，当场在片上 SRAM 里重新算一遍！**
- 听起来多算了步骤，但因为片上 SRAM 算得极快，重新算一遍的时间，远远小于从 HBM 里面读取一个几十 GB 矩阵的时间。这就是高阶 Infra 调优里的“以计算换访存”。

---

### 三、 FlashAttention 的家族史（进化到了哪一步？）

随着 NVIDIA 显卡硬件架构的升级，该算子也在疯狂迭代：

#### 1. FlashAttention-1 (2022年)

- **战绩**：提出了 Tiling 和 Online Softmax 思想。
- **效果**：比原生 PyTorch 的 Attention 快了 2~4 倍，省下巨大显存。

#### 2. FlashAttention-2 (2023年)

- **战绩**：针对 NVIDIA Ampere (A100) 和 Hopper (H100) 架构进行了硬件级重构。
- **物理优化**：
- 调整了计算指令的顺序，消灭了大量不必要的非矩阵乘法指令（Non-GEMM operations），让 GPU 几乎 100% 的时间都在高频运转 **Tensor Core**。
- 改进了线程块（Thread Blocks）之间的并行划分，避免了线程打架和数据冲突（Bank Conflict）。
- **效果**：速度再次比 1 代飙升了 2 倍，达到了硬件理论极限算力的 50%~70%（进入惊人的满血状态）。

#### 3. FlashAttention-3 (2024~2025年之后)

- **战绩**：专门针对 **NVIDIA Hopper (H100/H200) 和 Blackwell (B200/B300)** 架构的全新硬件特性进行了死磕。
- **物理优化**：
- 利用 Hopper 架构底层的 **TMA（张量内存加速器）** 硬件单元，实现数据从 HBM 到 SRAM 的完全硬件级异步搬运，彻底解放了 SM 计算单元。
- 完美适配了全新的 **FP8（8位浮点数）低精度低带宽暴算**。
- 利用了 **Warp-Group（线程束组）级异步指令**，让计算和搬运在时间和空间上实现了像素级的 Overlap（重叠）。
- **效果**：在 H100/H200 上跑 FP8 时，吞吐量直奔 **近 1 PFLOPS** 的神级算力表现。

---

### 💡 怎么看懂和学习它的源码？

如果你打算去深挖大厂 Infra 岗位最看重的 FlashAttention 能力，可以从两条路径去切入：

1. **看 Triton 版本实现（高回报率）**：  
   在 FlashAttention 官方仓库或 PyTorch 源码中，有一套用 **OpenAI Triton** 编写的 Python 满血版本。它用极度干净的 Python 语法完整重现了 Online Softmax 的增量更新公式（`tl.load`, `tl.dot`, `tl.store`）。看懂它，你的算子分块思想直接通关。
2. **看 NVIDIA 官方的 TileGym / cuTile 实现**：  
   去研读英伟达新一代 **TileGym** 仓库里用官方最新新兵器 **cuTile** 重新打磨的 FlashAttention 内核。对比一下官方是如何通过全新的 CUDA Tile IR 去压榨 Tensor Core 的，这能让你直接站在大模型 Infra 算子优化最前沿的浪尖上。
