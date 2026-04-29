---
title: Transformer架构
icon: robot
date: 2026-02-16
category:
  - AI大模型
---

Transformer 架构是目前人工智能领域（尤其是大语言模型，如 GPT、Claude、Gemini）的**核心基石**。它由 Google 在 2017 年的论文 *《Attention is All You Need》* 中首次提出，彻底改变了自然语言处理（NLP）的格局。

简单来说，Transformer 是一种基于**注意力机制（Attention Mechanism）**的神经网络架构，它放弃了传统的循环神经网络（RNN）和长短期记忆网络（LSTM）的序列处理方式。
<hr id="ZIE7J" class="ne-hr">
## 1. 核心设计思想：为什么要取代 RNN？

在 Transformer 出现之前，主流是序列模型。


- **RNN 的痛点：** 必须按顺序处理（先读第一个字，再读第二个字）。这导致两个问题：一是**无法并行计算**，训练速度慢；二是**长程记忆差**，读到句子结尾可能就忘了开头。
- **Transformer 的突破：** 它利用“自注意力”机制，让模型在处理一个词时，能**同时**看到句子中所有的词。这种全局视野让它处理长文本的能力实现了质的飞跃。
<hr id="jCtai" class="ne-hr">
## 2. Transformer 的宏观结构

Transformer 采用了经典的 **Encoder-Decoder（编码器-解码器）** 结构：


- **Encoder（编码器）：** 负责“理解”输入。它将输入的文字序列转换成高维的连续向量（特征表示）。
- **Decoder（解码器）：** 负责“生成”输出。它根据编码器提供的上下文信息以及已经生成的词，来预测下一个词。

**注意：** 现在的模型根据任务不同会有所取舍。例如 **BERT** 只有 Encoder（擅长理解），而 **GPT** 系列只有 Decoder（擅长生成）。
<hr id="yR0Xs" class="ne-hr">
## 3. 三大关键组件

要深入理解 Transformer，必须掌握以下三个核心技术：

### A. 自注意力机制 (Self-Attention)

这是 Transformer 的“灵魂”。它允许模型计算句子中每个词与其他所有词之间的**相关性得分**。


- **例子：** 在句子“动物没过马路，因为它太累了”中，自注意力机制能让模型明确意识到“它”指的是“动物”而不是“马路”。
- 它通过三个向量来计算：**Query (查询)**、**Key (键)** 和 **Value (值)**。

$$Attention(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V$$

### B. 多头注意力 (Multi-Head Attention)

模型不是只运行一次注意力机制，而是并行运行多次（即多个“头”）。每个头关注不同的特征：一个头可能关注语法结构，另一个头关注语义代词，第三个头关注时间顺序。最后将这些信息汇总。

### C. 位置编码 (Positional Encoding)

因为 Transformer 是并行处理所有词的，它本身并不知道词的先后顺序（比如“我爱你”和“你爱我”在它看来是一样的）。为了弥补这一点，研究者在输入向量中加入了**位置编码**，给每个词打上一个“坐标”，让模型知道这个词在句子中的位置。
<hr id="gpAl2" class="ne-hr">
## 4. 为什么 Transformer 这么强？
<table id="SiTKH" class="ne-table" style="width: 750px"><tbody><tr style="height: 33px"><td width="375">
**特性**
</td><td width="375">
**描述**
</td></tr><tr style="height: 33px"><td width="375">
**并行性**
</td><td width="375">
训练时不需要等待前一个词处理完，极大地提高了 GPU 利用率。
</td></tr><tr style="height: 33px"><td width="375">
**全局关联**
</td><td width="375">
无论两个词离得有多远，它们之间的交互距离始终是 1。
</td></tr><tr style="height: 33px"><td width="375">
**可扩展性**
</td><td width="375">
模型规模可以做得非常大（参数量从千万级到万亿级），且性能随数据量持续提升。
</td></tr></tbody></table><hr id="fGUUV" class="ne-hr">
## 5. 它的应用与现状

虽然最初是为翻译设计的，但 Transformer 现在无处不在：


- **NLP：** 翻译、摘要、对话、代码编写（GPT-4 等）。
- **计算机视觉 (ViT)：** 把图片切成小块当作“词”来处理，性能已超越传统卷积神经网络 (CNN)。
- **多模态：** 像 DALL-E 或 Sora 这样理解文本并生成图像/视频的模型，底层也离不开 Transformer 或其变体。
<hr id="Kfky6" class="ne-hr">
**你想深入了解 Transformer 内部具体的数学计算过程（如 QKV 矩阵是如何运算的），还是想了解它在 Vision Transformer (ViT) 中的具体变体应用？**