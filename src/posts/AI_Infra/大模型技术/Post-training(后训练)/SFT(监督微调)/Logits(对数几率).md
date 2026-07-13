---
title: Logits（对数几率）
icon: server
date: 2026-07-13
order: 69
category:
  - AI基础设施
tag:
  - AI Infra
---

**Logits（对数几率）** 是机器学习和大语言模型（LLM）前向传播（Forward Pass）最后一步输出的、**未经归一化的原始数学分值**。

如果把大模型比作一台“算力绞肉机”，那么 **Logits 就是模型内部矩阵乘法刚刚结束时，吐出来的、冰冷的、没有经过任何加工的原始实数数组**。

为了让你在架构和物理层彻底吃透这个概念，我们从它的物理来源、它与概率的关系、以及在 Infra 和算法调优中的关键角色进行深度拆解：

---

### 一、 Logits 在大模型流水线中处于什么物理位置？

当你向大模型输入一句话，比如预测下一个字，大模型内部的 Transformer 层（包含无数的 Tensor Core 矩阵乘法和自注意力计算）会对这个输入进行疯狂的特征提取。

在模型的最后一层（通常是一个线性全连接层，Linear Layer，也叫 LM Head）：

1. **矩阵乘法物理落地**：模型用最终提取出的特征向量，去乘以一个巨大的**词表权重矩阵**（维度通常是 `[隐藏层维度, 全量词表大小]`，例如词表大小为 128,256）。
2. **Logits 诞生**：这次矩阵乘法出来的结果，就是一个长度为 128,256 的一维浮点数数组。这个数组里的每一个数字，就叫做 **Logit**。

例如，针对词表里的三个词 `["电脑", "汉堡", "量子力学"]`，模型最后一层吐出来的 **Logits** 可能是：

- 电脑 = `[4.5]`
- 汉堡 = `[1.2]`
- 量子力学 = `[-2.3]`

---

### 二、 Logits 的三大物理物理特征（它的痛点）

1. **范围无边界**：Logits 里的数字可以是任意实数。它可以是正数、可以是负数（如上面的 `-2.3`），也可以是 0，完全没有上限和下限。
2. **不代表概率**：在物理层面上，概率必须满足两个铁律：**数值在** ![](https://cdn.nlark.com/yuque/__latex/93a4c1e807b833e099bb778b63e9d7bd.svg) **之间**，且**全量词表所有词的概率加起来必须严格等于 1**。显然，Logits 完全不满足这个条件，计算机和人类无法直接把 `4.5` 当成概率去采样。
3. **对数空间（Log Space）的产物**：为什么叫“Log”its？因为从数学上看，它处于对数几率空间。Logit 的数学定义是 ![](https://cdn.nlark.com/yuque/__latex/f7fc589ec533d7ffcedb72241fc895b0.svg)（其中 ![](https://cdn.nlark.com/yuque/__latex/d4cd21d60552e207f237e82def9029b6.svg) 为概率）。这意味着模型在线性层输出它时，是在对数尺度上衡量各个词的相对可能性。

---

### 三、 终极翻译官：从 Logits 到概率的临门一脚

为了把这组杂乱无章、有正有负的 Logits 翻译成人类和采样算法能看懂的“百分比概率”，大模型必须把它们送进 **Softmax 激活函数** 中：

1. **指数放大（干掉负数）**：Softmax 首先对每个 Logit 做自然底数 ![](https://cdn.nlark.com/yuque/__latex/c9a277d40d3a0b3afb85cdb557908945.svg) 的指数次方（![](https://cdn.nlark.com/yuque/__latex/e6fd16927ee3ee80704a9b635bd36d26.svg)）。这一步极为神奇，因为不管输入是多小的负数（如 ![](https://cdn.nlark.com/yuque/__latex/d3779474005a153028639f179c43bc97.svg)），出来都会变成正数；而原本就大的正数（如 ![](https://cdn.nlark.com/yuque/__latex/c7f57ffddebec13cf7da61bc03a9d478.svg)）会被剧烈放大，瞬间拉开差距。
2. **归一化（加和等于 1）**：把所有放大后的正数加在一起作为分母，每个词的指数值除以这个分母，Logits 就变成了如 `[85.2%, 14.1%, 0.7%]` 这样完美的概率分布。

---

### 四、 在工业界（Infra / 算法）中，Logits 的核心实战操作

在真正的智算中心和微调流水线中，Logits 是算力开销、显存开销以及模型创造力控制的绝对重地：

#### 1. 训练期：利用“算子融合”强行把 Logits 压进片上缓存（SRAM）

在大模型进行预训练或 **SFT（监督微调）** 时，LM Head 吐出的 Logits 矩阵会随着词表扩大（如 13W 维）和 Batch Size 增加而变得极度庞大，甚至能在一瞬间吃掉几十 GB 的显存（HBM）。

- **Infra 痛点**：如果在显存里开辟空间把 Logits 全存下来，再去读它算 Softmax 和交叉熵损失（Cross-Entropy Loss），GPU 的显存带宽（Memory Bandwidth）会直接被榨干，触发 **Memory-Bound 瓶颈**。
- **解法**：Infra 团队会利用 **Triton**、**cuTile** 或手写 CUDA 算子，编写 **Fused Linear Cross-Entropy（融合线性交叉熵）算子**。让模型计算出 Logits 的顺发瞬间，**直接在 GPU 片上的超高速缓存（SRAM）中就地运行 Softmax 和 Loss 计算**，算完只写回一个单标量的 Loss 值，物理上彻底不让庞大的 Logits 矩阵染指片外显存，能省下巨额显存并大幅提升 MFU（模型利用率）。

#### 2. 推理期：用 Temperature（温度）在 Logits 层注入灵魂

在部署大模型推理服务（如 vLLM 架构）时，用户经常会调节一个叫 **Temperature（温度，**![](https://cdn.nlark.com/yuque/__latex/1553dae3cc5c15cddb4f5b5a367b0aba.svg)**）** 的参数。这个参数在物理位置上，直接卡在 Logits 送进 Softmax 之前的临门一脚：公式为 ![](https://cdn.nlark.com/yuque/__latex/1e80bfd8ea7180f9a8fa3a8a56e5272c.svg)。

- **超低温度（如** ![](https://cdn.nlark.com/yuque/__latex/223bc182be2373cb5e7233f3c6f8dd12.svg)**）**：用 Logits 除以 0.1，等于把原本的数值放大了 10 倍，强者愈强。Softmax 算完后，原本最高分的那个词概率会直接飚到 ![](https://cdn.nlark.com/yuque/__latex/12bbbaf85c3a38a49bb82944b56390a8.svg)。模型会变得极度严谨、死板。
- **超高温度（如** ![](https://cdn.nlark.com/yuque/__latex/21e69eae91fac6358d2790d60e68f5e7.svg)**）**：用 Logits 除以 1.5，原本拉开的差距被强行抹平、缩小。Softmax 算完后大家的概率都差不多，大模型就会开始“胡思乱想”，吐出一些概率原本很低的词，创造力和幻觉同时暴涨。
