---
title: Prompt Enginnering（提示词工程）
icon: robot
date: 2026-03-22
category:
  - AI大模型
---

## Prompt Enginnering是什么？

**Prompt Engineering（提示工程）**，通俗地说，就是“如何与 AI 说话的艺术与科学”。它是一项通过精心设计、优化和精炼输入文本（Prompt），来引导大语言模型（LLM）生成准确、高质量且符合特定需求输出的技术。

在 AIOps 或分布式系统开发的背景下，Prompt Engineering 不仅仅是“换个说法”，它是**控制模型逻辑流**的关键手段。

![](https://cdn.nlark.com/yuque/0/2026/png/62301513/1774247269259-092f0323-d82b-45a1-8dff-d775b09cfd66.png)
<hr id="hcZ7T" class="ne-hr">
## 1. 为什么需要提示工程？

虽然现在的模型（如 Qwen-max 或 GPT-4）非常聪明，但它们本质上是“概率预测机器”。如果你给出的指令模糊，模型就会在概率空间中“迷路”，产生幻觉（胡说八道）或输出格式错误的垃圾数据。


- **减少幻觉：** 强制模型只基于提供的日志数据回答。
- **稳定格式：** 确保模型始终返回合法的 JSON，以便你的 Python 代码解析。
- **思维链引导：** 让模型像专家一样步步推导，而不是直接给一个错误的结论。
<hr id="coGmn" class="ne-hr">
## 2. 核心原则：CRISPE 框架

你可以用这个框架来构思任何复杂的 Prompt：
<table id="yxoeA" class="ne-table" style="width: 750px"><tbody><tr style="height: 33px"><td width="250">
**维度**
</td><td width="250">
**定义**
</td><td width="250">
**运维场景示例**
</td></tr><tr style="height: 33px"><td width="250">
**C**apacity (能力/角色)
</td><td width="250">
赋予模型一个特定身份
</td><td width="250">
"你是一个资深的 K8s 网络排障专家。"
</td></tr><tr style="height: 33px"><td width="250">
**R**esource (资源/上下文)
</td><td width="250">
提供背景数据或文档
</td><td width="250">
"这是过去 5 分钟内 ingress-nginx

的错误日志：[LOGS]"
</td></tr><tr style="height: 33px"><td width="250">
**I**nstruction (指令)
</td><td width="250">
明确要求它做什么
</td><td width="250">
"请找出导致 502 错误的最频繁的上游 IP。"
</td></tr><tr style="height: 33px"><td width="250">
**S**cope (范围/限制)
</td><td width="250">
划定边界，防止发散
</td><td width="250">
"不要解释 HTTP 协议，只列出 IP 和报错频次。"
</td></tr><tr style="height: 33px"><td width="250">
**P**ost-process (后处理)
</td><td width="250">
规定输出格式
</td><td width="250">
"请以 JSON 格式输出，包含 ip

和 count

两个字段。"
</td></tr><tr style="height: 33px"><td width="250">
**E**xample (示例)
</td><td width="250">
提供少样本（Few-shot）
</td><td width="250">
"参考格式：{"192.168.1.1": 50}

"
</td></tr></tbody></table><hr id="uYEYX" class="ne-hr">
## 3. 常用的进阶技巧

## A. Few-Shot Prompting (少样本提示)

给模型 1-2 个具体的例子。模型模仿的能力极强，这比写一堆规则都有效。

**Prompt:** "请将以下非结构化日志转换为 JSON。

例子：'User admin login success' -> {"user": "admin", "status": "success"}

待处理：'Connection reset by peer at 10.0.0.1' -> "

## B. Chain of Thought (CoT, 思维链)

要求模型“**Let's think step by step**（让我们一步步思考）”。这会强制模型在输出最终答案前，先在内部进行逻辑推导，显著提高处理复杂逻辑（如计算或多级关联分析）的准确率。

## C. System Prompt vs. User Prompt

在你的代码里，**System Prompt** 应该存放“长期指令”（如人设、安全准则、输出格式），而 **User Prompt** 存放“临时任务”（如当前的日志片段、用户的提问）。
<hr id="vP6hZ" class="ne-hr">
## 4. 针对 Agent 开发的实战建议

当你开发 **Agentic RAG** 时，Prompt Engineering 是连接代码与大脑的胶水。


- **限制思考路径：** 在 System Prompt 中规定模型必须遵循 Thought -> Action -> Observation 的格式。
- **严格 JSON 控制：** 如果你需要 AI 调用工具，必须在 Prompt 里明确：“你只能回复 JSON，严禁包含任何多余的解释文字。”
- **负面约束（Negative Constraints）：** 明确告诉它“不要做什么”。例如：“如果无法通过工具获取数据，直接回答‘未知’，严禁猜测。”
<hr id="uaeHs" class="ne-hr">
## 5. 总结：如何不断优化？

Prompt Engineering 是一个**迭代过程**：


- **写出初始 Prompt**。
- **观察 Bad Case**（模型回答错误的情况）。
- **分析原因**：是指令模糊？还是背景信息不够？
- **加入约束或示例**，再次测试。

**既然你了解了 Prompt Engineering 的重要性，我们要不要试着为你之前的 ****basic_chat**** 写一个“系统提示词（System Prompt）”？** 我们可以把它设定为一个“只会回复 JSON 格式日志分析报告”的专家，这样你就能直接用 Python 解析它的回复了。你想试试这个 Prompt 怎么写吗？