---
title: Logits
icon: server
date: 2026-07-13
order: 110
category:
  - AI基础设施
tag:
  - AI Infra
---

在 Transformer 架构中，**Logits** 特指**模型最顶层（线性输出层，Linear Projection Head）物理暴算出来的、未经 Softmax 标准化的全量词表原始得分数组（Raw Scores）。**

如果把 Transformer 架构在底层对文本的处理流向扒开，Logits 处于隐向量空间（连续数字）**通往**词表概率空间（概率/文本）的物理立交桥卡槽上：

---

### 一、 Logits 在 Transformer 内部的物理位置

一个标准的 Decoder-only Transformer（如 Llama、GPT 系列）在处理预测下一个 Token 时，底层的数字矩阵流动如下：

1. **隐空间表征（Hidden States）**：  
   经过几十层自注意力（Self-Attention）和前向传播网络（FFN）的密集矩阵乘法后，Transformer 在最后一层的输出是一个高维向量，通常被称为 **Hidden States（隐状态）**，其维度为 `[Batch_Size, Sequence_Length, Hidden_Size]`（比如 Hidden Size 是 4096）。此时的数据是极其抽象的高维几何空间表征。
2. **词表映射层（LM Head）**：  
   为了将这个抽象的 4096 维向量翻译成人类能看懂的单词，Transformer 的最顶部挂载了一个没有偏置的纯线性层，叫做 **LM Head（Language Model Head）**。这个线性层的权重矩阵维度通常为 `[Hidden_Size, Vocabulary_Size]`（词表大小，通常在 32000 到 128000 左右）。
3. **计算出 Logits**：  
   LM Head 执行一次纯粹的矩阵乘法：

![](https://cdn.nlark.com/yuque/__latex/598299f606454ffa7ff8afb40328d978.svg)

乘完之后的矩阵维度瞬间膨胀为了 `[Batch_Size, Sequence_Length, Vocabulary_Size]`。**针对当前要预测的这一个位置，它变成了一个长度等于词表大小的、充满任意实数的一维数组——这就是 Logits。**

---

### 二、 Transformer 中 Logits 的物理特征与转化示例

假设我们的 Transformer 词表里只有 4 个词：`["苹果", "编程", "好的", "香蕉"]`。在某一步前向传播结束时，LM Head 吐出的 **Logits** 数组可能长这样：

![](https://cdn.nlark.com/yuque/__latex/0a87453b7d3119f75eba574087ccf518.svg)

此时它具有以下三个底层特征：

- **数值无边界**：它可以是很大的正数（`12.8` 代表模型强力推荐“好的”），也可以是负数（`-4.5` 代表极度排斥“编程”）。
- **物理含义**：它是未标准化的对数几率（Log-Odds）。在数学上，两个词的 Logits 差值（如 ![](https://cdn.nlark.com/yuque/__latex/cb7f0278241b4849cd1e566471aac166.svg)），代表了它们在进入 Softmax 后概率**指数级缩放**的倍数。
- **流向 Softmax**：接下来，为了抽签采样，这个 Logits 数组会被塞进 `Softmax` 函数（如果设置了温度 ![](https://cdn.nlark.com/yuque/__latex/1553dae3cc5c15cddb4f5b5a367b0aba.svg)，会先执行 ![](https://cdn.nlark.com/yuque/__latex/82db29afe1203586b5146da2be41e689.svg)）：

![](https://cdn.nlark.com/yuque/__latex/f6ccfc658c8d47b0066b382392919c9a.svg)

通过 Softmax 归一化后，数据才变成了相加等于 100% 的真实概率分布，进而交由 `top_k` / `top_p` 采样器去摇号输出字符。

---

### 三、 在 Transformer 工程开发中，我们可以对 Logits 做什么？

在搞大模型 Infra 开发、训练或高级推理调优时，操作 Logits 的经典玩法有：

1. **训练期的损失计算（Cross-Entropy Loss）**：  
   在 Transformer 的训练（预训练或微调）阶段，我们**完全不需要执行昂贵的采样和具体的文本生成**。模型吐出这一步的 Logits 后，直接与真实的标签（Token ID）一起塞进交叉熵损失函数（Cross-Entropy Loss）计算梯度。因为 PyTorch 内部的 `nn.CrossEntropyLoss` 底层将 Softmax 和负对数似然损失合并优化了，直接吃原始的 Logits 算得最快、数值最稳定。
2. **生成期的 LogitsProcessor（动态算子干预）**：  
   在推理解析时（如使用 HuggingFace `generate()` 或 vLLM 后端），引擎允许你挂载一系列 `LogitsProcessor` 算子。在 Logits 进入 Softmax 之前，你可以用代码暴力篡改它：

- **Repetition Penalty（重复惩罚）**：如果发现某个 Token 已经被生成过了，当场把该 Token 对应的 Logits 乘以一个衰减系数（或减去一个常数），从物理上直接遏制大模型疯狂复读机。
- **Muted Tokens（违禁词物理抹杀）**：配合安全对齐，如果要绝对封杀某些敏感词，直接在 Logits 阶段把对应位置强行赋值为 `-inf`（负无穷大），Softmax 之后其概率绝对为 0。

**极简总结：** Transformer 中的 Logits 是**大模型在连续的向量空间中暴算完所有逻辑后，正准备翻译成人类语言概率的“原始半成品得分矩阵”**。它是神经网络层面的“算力终点”，也是文本空间采样的“逻辑起点”。
