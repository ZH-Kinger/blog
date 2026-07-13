---
title: Transformer
icon: server
date: 2026-07-13
order: 109
category:
  - AI基础设施
tag:
  - AI Infra
dir:
  order: 109
  collapsible: true
---

[一文读懂 Transformer（讲透本质）\_一文读懂transformer-CSDN博客](https://blog.csdn.net/gaones/article/details/160113816?ops_request_misc=elastic_search_misc&request_id=332ec487874ea611e68b42b8ba6718ca&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~all~top_click~default-4-160113816-null-null.142^v102^pc_search_result_base9&utm_term=transformer&spm=1018.2226.3001.4187)

## 什么是Transformer ？

Transformer 是一种神经网络架构，用于各种机器学习任务，尤其是在自然语言处理和计算机视觉领域。它专注于理解数据内部的关系，从而更有效地处理信息。

• 利用注意力机制来捕捉输入之间的关系

• 一次性处理整个序列，而不是逐步处理。

• 提高涉及上下文和依赖关系的任务的性能

• 广泛应用于自然语言处理、视觉和其他人工智能应用领域

![](https://cdn.nlark.com/yuque/0/2026/webp/62301513/1783265020649-a01ed715-925d-4ead-b346-53c2da5b4eb6.webp)

## Transformer模型

Transformer架构利用注意力机制一次性处理整个句子，而不是按顺序读取单词。这有助于克服RNN和LSTM等逐步处理数据的模型的局限性。

• 传统的模型，如循环神经网络（RNN），存在梯度消失问题，会导致长期记忆丧失。

• RNN按顺序处理文本，也就是说它们一次分析一个单词。

例如：

在句子“XYZ 于 2019 年去了法国，当时还没有 COVID 病例，并且在那里他见到了该国总统”中，“该国”指的是“法国”。

然而，RNN 可能难以有效地捕捉长距离依赖关系，尤其是在长序列中，这会使连接远距离的词语变得更加困难。

虽然在长短期记忆网络（LSTM）中添加更多记忆单元有助于解决梯度消失问题，但它们仍然需要逐个处理单词。这种顺序处理方式意味着LSTM无法一次性分析整个句子。

• 传统的 Seq2Seq 模型将整个输入压缩成一个固定大小的上下文向量。

• 这会造成信息瓶颈，尤其对于较长的序列而言。

• 压缩过程中可能会丢失重要的上下文信息，从而降低性能。

• Transformer 通过使用注意力机制直接访问所有令牌而无需压缩来解决这个问题。

例如：

“point”一词在这两个句子中具有不同的含义：

• “针尖很尖。”（针尖 = Tip）

• “用手指指着别人是不礼貌的。”（指着=手势）

## Transformer 的核心概念

![](https://cdn.nlark.com/yuque/0/2026/webp/62301513/1783265164736-8b465778-6a8b-43ac-aceb-03c56ce7239a.webp)

为什么 Transformer 改变了 AI 世界？

在深度学习发展过程中，NLP（自然语言处理）经历了三代核心架构：
