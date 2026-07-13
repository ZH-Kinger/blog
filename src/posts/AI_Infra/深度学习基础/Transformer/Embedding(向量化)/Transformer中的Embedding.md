---
title: Transformer中的Embedding
icon: server
date: 2026-07-13
order: 112
category:
  - AI基础设施
tag:
  - AI Infra
---

在标准的 Transformer 架构（如 BERT、GPT、Llama）中，**Embedding 的实现物理上分为两个核心部分**：一个是负责将离散 Token ID 映射为稠密向量的 **Word Embedding（词嵌入）**，另一个是负责注入序列顺序信息的 **Positional Encoding（位置编码）**。两者在输入端会进行**物理相加**，拼装成 Transformer Block 的最终输入。

以下是其底层的工程实现与物理机制：

---

### 第一部分：Word Embedding（词嵌入）的查表实现

在 Transformer 的最开头，离散的文本首先会通过 Tokenizer（分词器）切分成一串数字 ID。随后，这一串 ID 会送入 PyTorch 的 `nn.Embedding` 层。

#### 1. 物理本质：一个巨型特征矩阵

在显存（HBM）中，`nn.Embedding` 物理上就是一个规整的二维浮点数矩阵，其维度为：

![](https://cdn.nlark.com/yuque/__latex/0d05921e3da9599619b5f931168fe6d7.svg)

- 例如，词表大小为 ![](https://cdn.nlark.com/yuque/__latex/7fe04dad42f73364c9ee32f4170dfa45.svg)，隐藏层维度（![](https://cdn.nlark.com/yuque/__latex/d775db00ee6c94e33d1f504cab4e789e.svg)）为 ![](https://cdn.nlark.com/yuque/__latex/3a7895a937166765199e9d23ac7dd4e0.svg)。那么这就是一个 ![](https://cdn.nlark.com/yuque/__latex/9d7698dee79e8ffb96f41eee707d7670.svg) 的二维矩阵。

#### 2. 工程实现：GPU 指令级的“查表（Lookup）”

虽然在数学公式中，词嵌入常被抽象为 **One-Hot 向量** 乘以 **权重矩阵**，但在实际的 GPU 算子实现中，**绝对不会进行这种高耗能的矩阵乘法**。

- **指针偏移寻址**：当一个 Token ID（如“狗”的 ID 是 `142`）输入时，底层算子会直接根据偏置值计算出内存地址，**一行式地把矩阵中第 142 行的那 768 个浮点数“捞出来”**。
- 这一步在计算机底层是纯粹的 I/O 查表操作，没有任何乘法器（Tensor Core）的开销。

---

### 第二部分：Positional Encoding（位置编码）的显式实现

由于 Transformer 的自注意力机制（Self-Attention）是同时对全序列进行并行暴算的，它天然抹去了时间步的先后顺序。为了让模型分清 `"我吃苹果"` 和 `"苹果吃我"`，必须在输入端显式引入位置信息。

在标准的 Transformer 中，最经典的是利用**正弦与余弦三角函数**直接计算出位置矩阵：

#### 1. 数学计算公式

对于序列中第 ![](https://cdn.nlark.com/yuque/__latex/c4b4aed21f876065eeb9187248d57f19.svg) 个位置的 Token，在其 Embedding 向量的第 ![](https://cdn.nlark.com/yuque/__latex/502743f1792bdf8c7c4622db537e4059.svg)（偶数）和 ![](https://cdn.nlark.com/yuque/__latex/c34f8016b9e2fbb16985e33fb6b66d0d.svg)（奇数）个通道上，位置编码的数值计算如下：

![](https://cdn.nlark.com/yuque/__latex/0da11b1b13a42d663a2fd41977de775b.svg)

![](https://cdn.nlark.com/yuque/__latex/9cac21564e6218a68ab1b459c72ef1ae.svg)

#### 2. 物理重构与优势

- **无需训练**：这段代码在初始化时直接通过 CPU/GPU 算好，是一个固定不变的常量矩阵。
- **相对位置泛化**：三角函数的数学特性允许模型通过简单的线性变换，轻松学到 Token 之间的相对距离。
- **外推能力**：即使在训练时只见过长度为 512 的句子，由于三角函数的周期性，它依然能为长度为 1024 的句子提供唯一的位置编码。

---

### 第三部分：完整的输入拼装流水线

在 Transformer 的数据流入口，最终的输入张量是由上述两者物理相加（Element-wise Add）而成的：

```
[输入文本] ──> "我" "爱" "中国"
                  │ (Tokenizer 分词)
                  ▼
              [ 12, 459, 883 ] (离散 Token IDs)
                  │
        ┌─────────┴─────────┐
        ▼                   ▼
[ Word Embedding 查表 ]   [ Positional Encoding 计算 ]
  (从大矩阵里捞出向量)      (三角函数生成位置特征)
  维度: [Seq_Len, 768]     维度: [Seq_Len, 768]
        │                   │
        └─────────┬─────────┘
                  │ (对应位置直接相加)
                  ▼
         [ 最终 Embedding 张量 ] ──> 送入后续的 Transformer Block
         维度: [Seq_Len, 768]
```

### ⚙️ Infra / SRE 视角的显存避坑提示：

在千卡或万卡集群上进行大模型长文本训练（如上下文拉到 ![](https://cdn.nlark.com/yuque/__latex/f1fb928b7652cc0839c48b0a6d078c1b.svg)）时，输入端的 Embedding 会带来一个隐藏的显存与计算陷阱：

1. **RoPE 旋转位置编码的平替**：目前现代大模型（如 Llama、Mistral）基本抛弃了上面这种“输入端直接相加”的静态绝对位置编码，改为了 **RoPE（旋转位置编码）**。RoPE 的实现是在每一个 Transformer Block 的 Attention 算子内部，对 ![](https://cdn.nlark.com/yuque/__latex/4ef7132d0df72d9e3db76f6391960a3d.svg) 和 ![](https://cdn.nlark.com/yuque/__latex/38a3f4d664b7a723d138f9d57be0c783.svg) 矩阵进行旋转变换。
2. **词表开销暴涨**：当算法团队为了支持多语言，将词表从 32K 扩大到 128K 甚至 256K 时，整个输入层的 `nn.Embedding` 矩阵将吃掉数 GB 的显存。在开启 **张量并行（Tensor Parallelism, TP）** 时，作为 Infra 必须配合将这个巨大的 Embedding 矩阵纵向切开，均匀打散到同一物理机内的 8 张 GPU 上，从而防止单卡 HBM 发生 OOM 崩溃。
