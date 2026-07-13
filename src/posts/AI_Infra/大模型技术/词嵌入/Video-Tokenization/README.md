---
title: Video Tokenization
icon: server
date: 2026-07-13
order: 102
category:
  - AI基础设施
tag:
  - AI Infra
dir:
  order: 102
  collapsible: true
---

在机器学习处理视频（Video）的领域中，将连续的视频画面切碎并转化为离散、低维特征向量（Tokens）的过程，通常不叫 Tokenization，而是有一个专属于多模态和计算机视觉领域的硬核术语——**Spatial-Temporal Tokenization（时空 Tokenization）** 或 **Video Tokenization（视频标记化 / 视频量化）**。

其产出的核心底层组件通常被称为 **Video Tokenizer** 或 **Spatial-Temporal Patch Embedding（时空 Patch 嵌入）**。

为了让你在架构层面和算法物理层彻底吃透这个概念，以下为你深度拆解视频 Tokenization 的底层机理、三大主流技术演进路线、以及它在万卡集群（Infra）和分布式计算中带来的恐怖挑战：

---

### 一、 视频 Tokenization 的物理第一性原理

视频与文本、图像有着本质的物理差异。文本是一维的离散符号，图像是二维的静态像素。而视频是**三维的高密集时空连续体（Spatial-Temporal Continuum）**。

- **空间维度（Spatial）**：每一帧画面（Frame）的高和宽（![](https://cdn.nlark.com/yuque/__latex/8ac891b376ce337e00e030b6f3930810.svg)）。
- **时间维度（Temporal）**：随时间轴推进的帧数（Frames，即时间长度 ![](https://cdn.nlark.com/yuque/__latex/1553dae3cc5c15cddb4f5b5a367b0aba.svg)）。

如果直接将未经过 Tokenization 的原始视频流（![](https://cdn.nlark.com/yuque/__latex/a454c177c2874d34eda48b1107580f01.svg)）塞进大模型（Transformer）中，由于 Self-Attention（自注意力机制）的计算量呈 **时空全联通的平方级（**![](https://cdn.nlark.com/yuque/__latex/71ffd78ec407daede5fb338bb6f3156e.svg)**）** 暴涨，即便调集全智算中心的 H200 算力也会在第一秒发生显存物理爆炸。

因此，**Video Tokenizer 的物理使命，就是把一个跨越时空的连续视频块，压缩并重构为有限数量、包含时空上下文关系的“时空像素砖（Spatiotemporal Patches）”或离散的“词表 ID”。**

---

### 二、 三大主流技术路线与硬核算子拆解

在当今的多模态大模型（如 Sora、Vidu 以及各类视频扩散模型）的底层架构中，视频 Tokenization 经历了三次重大的技术范式演进：

#### 1. 基于 2D 卷积的伪时空拆解（ViT / Naive Image-to-Video 路线）

这是早期最直观的做法。它直接借用了图像领域的 ViT（Vision Transformer）思想。

- **物理机制**：把视频看作是多张独立的动态图片。针对每一帧图像，利用一个 ![](https://cdn.nlark.com/yuque/__latex/5c8213948b3250fd57bd3a27a4232c6a.svg) 的 2D 卷积核（Stride 为 16），将其切碎成一堆二维的 ![](https://cdn.nlark.com/yuque/__latex/5c8213948b3250fd57bd3a27a4232c6a.svg) 局部小方块（Patches），然后直接在空间维度上拉平（Flatten）变成一维向量。最后，在时间维度上通过硬拼接（Concat）**或者是加上一个**时间位置编码（Temporal Position Embedding）送进大模型。
- **致命缺陷**：这种做法在 Tokenization 阶段**完全割裂了时间轴上的物理连续性**（例如一个物体在前 3 帧移动的连续轨迹被当成了 3 张孤立的图）。它将所有的时空对齐压力全部甩给了后续的 Transformer 主干，导致训练的 MFU（模型利用率）极低。

#### 2. 时空管状嵌入（Tubelet Embedding / 3D Convolution 路线）

这是目前视觉 Transformer（如 ViViT, TimeSformer）以及很多现代视频生成大模型极其主流的底层物理重构手段。

- **物理机制**：将 2D 卷积一步到位升级为 **3D 卷积（3D Convolution）**。3D 卷积核的尺寸不再是 ![](https://cdn.nlark.com/yuque/__latex/a57db14a1e302c2645aa562d6a0568a3.svg)，而是加入时间轴厚度，变成了 ![](https://cdn.nlark.com/yuque/__latex/168a8e8fd4809a8fb28313d4fcec651b.svg)，例如 ![](https://cdn.nlark.com/yuque/__latex/57ec8856a020e77a9876333da53f68b0.svg)。
- **形象比喻**：2D 卷积切视频像“切土豆片”，每一片都是孤立的；而 3D Tubelet Embedding 切视频就像“切管道（Tubelet）”**，它一刀下去，直接切出了一个长 4 帧、高 16 像素、宽 16 像素的**时空小圆柱体/长方体块。
- **核心优势**：在 Tokenization 的最底层（第一层），3D 卷积的矩阵乘法就已经把**相邻帧之间的运动趋势、速度、光流变化（时间特征）和空间轮廓（空间特征）完美融合进同一个嵌入向量（Token Vector）中**。这直接为后续的 Transformer 过滤掉了大量冗余的帧间重复信息，大幅缩短了 Token 序列长度。

#### 3. 离散视频量化生成路线（Video VQ-VAE / VQ-GAN / Magvit 系列）

在类似于自回归（Autoregressive）生成式视频大模型中，算法团队会把视频彻底翻译成类似文本的“数字 ID 字典”。

- **物理机制**：它包含一个**编码器（Encoder）**、一个**离散码本（Codebook / 词表）**和一个**解码器（Decoder）**。

1. 编码器将原始时空视频压缩成一组低维的连续特征图。
2. 利用 **矢量量化（Vector Quantization, VQ）** 算子，在 Codebook 中寻找与这些特征图物理距离最近的离散索引（Index，比如编号为 4589 的视觉词）。
3. 此时，**一个 10 秒钟的电影级视频，在数学上被彻底转化为了类似于** `[4589, 12, 893, 7761, ...]` **这样由离散 Token 组成的数字序列**。

- **应用场景**：这让大模型可以像预测下一个文本单词（Next-token Prediction）一样，去预测下一个“视频 Token”，从而完美统一了文本生成与视频生成的底层算法逻辑。

---

### 三、 Infra 工程师视角：Video Tokenization 的计算与 I/O 恶梦

在万卡算力集群和 AIOps 运维平台上，负责网络与加速的 Infra 工程师在面对 Video Tokenizer 时的痛苦程度丝毫不亚于处理 PPO 强化学习。它带来了三个极端的工程瓶颈：

#### 1. 显存膨胀与 3D 算子的非不连续访存（Memory-Bound）

- 3D 卷积算子在执行时，由于要跨越视频的多帧进行特征采样，数据在 GPU 显存（HBM）中的物理存储地址是**极度非连续的（Non-contiguous Memory Access）**。这会导致显存硬件的合并读取（Coalesced Memory Access）机制失效，带来严重的 **I/O 延迟（Memory Latency Bound）**，导致 GPU 的 Tensor Core 经常处于饥饿空转状态，拉低整体 MFU。
- **Infra 优化手段**：手写高性能的 Triton 或 CUDA C++ 算子，在进入 3D 卷积前，通过片上超高速缓存（SRAM）对时空数据执行高效的 **Transpose（转置合并）** 或者是点亮 **Flash-Decoding** 类似思想，强行把多帧数据拉入 L2 Cache 一次性算完。

#### 2. 分布式训练下的“时空并行（Space-Time Parallelism）”通信风暴

- 当一个视频 Token 序列长达几十万时，单张 GPU 的显存直接爆仓。算法不得不开启**序列并行（Sequence Parallelism）**，把同一个视频在 Token 维度上切碎，打散到 8 张卡上分别计算。
- **通信黑洞**：在 Transformer 的每一个 Attention 层结束时，这 8 张卡之间必须通过 NCCL 网络跑极高频的 `AllGather` 和 `ReduceScatter` 集合通信来拼回完整的时空图。
- **Infra 调优防线**：在这种多模态场景下，必须死守之前提过的极限网络调优：注入 `NCCL_CROSS_NIC=1` 开启 8 卡 8 网卡多通道条带化流量均摊，同时强行将 `NCCL_BUFFSIZE` 拓宽至 32MB 甚至更高，来承载多模态时空 Token 同步所带来的海量吞吐包，杜绝网络死锁。

### 💡 一句话总结

在机器学习处理视频时，这个把时空画面切碎并转化为大模型通行证的过程叫做 **Spatial-Temporal Tokenization（时空标记化）**。无论是通过 3D 卷积切出“时空管（Tubelet）”，还是通过 VQ-VAE 压缩成“视觉字典 ID”，它们都是现代多模态大模型和视频生成引擎不可或缺的物理根基。
