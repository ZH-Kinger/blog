---
title: Tokenization
icon: server
date: 2026-07-13
order: 105
category:
  - AI基础设施
tag:
  - AI Infra
---

Tokenization（标记化/分词）是自然语言处理（NLP）和大语言模型（LLM）理解人类语言的第一步。简单来说，**它是将一段连续的文本切分成模型能够处理的最小基本单位——Token 的过程。**

因为计算机和神经网络底层只能处理数字和矩阵，它们无法直接“阅读”文本。Tokenization 就是把人类的字符翻译成机器语言的桥梁。

---

### 1. Tokenization 是如何工作的？

假设你正在开发一个自动诊断系统，并将下面这行服务器日志输入给 AI 模型：  
`Error: Connection timeout`

Tokenizer（分词器）不会把这看作一个完整的句子，而是将其拆解。拆解的方式有几种不同的颗粒度：

- **词级（Word-level）：** 按空格或标点切分。
- 结果：`["Error", ":", "Connection", "timeout"]`
- **字符级（Character-level）：** 彻底打散成单个字母。
- 结果：`["E", "r", "r", "o", "r", ...]`
- **子词级（Subword-level）：** 这是目前大部分主流大模型（如 Qwen、GPT 等）采用的方案。它会将常见的词作为一个整体，而不常见的长词拆分成几个词根或音节。
- 结果可能是：`["Err", "or", ":", " Connect", "ion", " timeout"]`

切分完成后，Tokenizer 会去查一张内部的“字典”，把每一个 Token 映射成一个唯一的数字 ID（例如 `"timeout"` 对应 `14562`）。模型最终接收并计算的，就是这串数字 ID。

### 2. 为什么 Tokenization 对工程开发很重要？

如果你在做后端的 AI Agent 开发或平台集成，Tokenization 会直接影响你的系统设计和资源评估：

- **API 计费与成本：** 绝大多数云端大模型 API（无论是火山引擎还是阿里云上的服务）都是**按 Token 数量计费**的，而不是按字数计费。通常 1000 个 Token 大概对应 700-750 个英文单词，或者 400-500 个汉字。
- **上下文窗口限制（Context Window）：** 每个模型都有最大输入长度（比如 8K、32K、128K）。这个长度指的就是 Token 数量。当你需要将大量的监控日志（Logs）、Prometheus 报警信息一次性塞给模型进行故障恢复分析时，如果 Token 数量超载，模型就会截断信息或报错。
- **多语言差异：** 中文和英文的 Tokenization 效率不同。同样含义的一段话，中文经过 Tokenizer 处理后产生的 Token 数量可能与英文不同，这在设计 Prompt 逻辑时需要提前预估。

### 3. 常见的分词算法

目前工业界最常用的 Tokenization 算法是 **BPE（Byte Pair Encoding，字节对编码）**。它的核心思想是“数据压缩”：统计训练数据中相邻字符出现的频率，把最常挨在一起的字符合并成一个 Token。

这就使得模型在处理计算机领域的专业术语（如 `Kafka`、`vGPU`、`Kubeflow`）时，能够非常高效地将它们识别为独立的 Token，而不是拆解成无意义的字母碎块，从而极大地提升了模型对代码和技术日志的理解能力。
