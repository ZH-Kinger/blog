---
title: Vertex ai
icon: robot
date: 2026-03-22
category:
  - AI大模型
---

如果你在学习 Agent 开发，那么 **Vertex AI** 就是 Google 提供的“重型军火库”。

简单来说，**Vertex AI 是 Google Cloud 上的企业级全栈 AI 平台**。它不仅提供大模型（Gemini），还提供了一整套工具来帮你训练、部署和管理这些模型。
<hr id="VxVpd" class="ne-hr">
## 1. Vertex AI 的核心组成部分

你可以把 Vertex AI 看作是一个集成了多个功能的“实验室”：


- **Model Garden（模型花园）：** 这是一个模型库。你可以在里面找到 Google 自家的 **Gemini 2.0**，也可以找到开源的 **Llama 3**、**Mistral** 等。你不需要自己买显卡，点一下就能部署。
- **Vertex AI Studio：** 一个可视化界面，让你直接在网页上测试 Prompt、调整参数、测试 **Function Calling**。
- **Vertex AI Agent Builder：****这是你最需要关注的！** 它是专门为开发 Agent 设计的低代码工具。它把 RAG（搜索）、工具调用、流程控制全部整合在一起，让你能快速捏出一个“客服 Agent”或“运维 Agent”。
- **Gemini API：** Vertex AI 是调用 Gemini 模型的官方企业渠道，安全性（数据不被拿去训练）和稳定性比普通的公开 API 更高。
<hr id="o55Iw" class="ne-hr">
## 2. 为什么 Agent 开发者要用 Vertex AI？

作为一个正在研究 AIOps 和分布式平台的大学生，Vertex AI 对你有几个核心价值：


- **原生集成 Google 搜索（Grounding）：**

你可以让你的 Agent 联网。如果用户问一个最新的 Linux 漏洞，Agent 可以直接调用 Google 搜索获取实时信息，而不是胡编乱造。


- **强大的多模态能力：**

Gemini 能够直接看懂监控图表。你可以把 Grafana 的截图发给 Vertex AI 上的 Agent，它能告诉你曲线哪里异常。


- **长上下文（Long Context）：**

Gemini 支持 **100万到200万** 的 Token。这意味着你可以把整个项目的代码库、或者过去一个月的几万行日志全丢给它，它不会“忘事儿”。


- **推理与管理：**

它提供完善的 API 监控，你可以看到 Agent 每次调用花了多少钱、延迟是多少，非常适合工程化。
<hr id="WA1lw" class="ne-hr">
## 3. Vertex AI vs. OpenAI (ChatGPT)
<table id="f3LMc" class="ne-table" style="width: 750px"><tbody><tr style="height: 33px"><td width="250">
**维度**
</td><td width="250">
**OpenAI**
</td><td width="250">
**Vertex AI (Google)**
</td></tr><tr style="height: 33px"><td width="250">
**核心模型**
</td><td width="250">
GPT-4o / o1
</td><td width="250">
Gemini 1.5 Pro / Flash / 2.0
</td></tr><tr style="height: 33px"><td width="250">
**上下文长度**
</td><td width="250">
128k (标准)
</td><td width="250">
**1M - 2M (极大优势)**
</td></tr><tr style="height: 33px"><td width="250">
**云生态**
</td><td width="250">
绑定 Microsoft Azure
</td><td width="250">
**绑定 Google Cloud (GCP)**
</td></tr><tr style="height: 33px"><td width="250">
**Agent 工具**
</td><td width="250">
Assistants API
</td><td width="250">
**Agent Builder (更系统化)**
</td></tr></tbody></table><hr id="kzFbe" class="ne-hr">
## 4. 如何开始使用？

既然你正在学习 **Function Calling**，在 Vertex AI 上实现它的流程和你之前学的基本一致，只是 SDK 不同：


- **注册 GCP：** 注册 Google Cloud（通常有 300 刀免费额度）。
- **启用 Vertex AI API。**
- **安装 Python SDK：**

```
pip install google-cloud-aiplatform
```


- **调用：** 在代码中定义 tools，然后传给 GenerativeModel.generate_content。
<hr id="mKN4i" class="ne-hr">