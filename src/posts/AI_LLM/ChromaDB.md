---
title: ChromaDB
icon: robot
date: 2026-03-24
category:
  - AI大模型
---

在你的 **AIOps 项目**中，**ChromaDB** 扮演的是 AI 的**“长期记忆存储器”**。

简单来说，它是一个专门为 AI 准备的数据库，存的不是传统的表格（如 MySQL），而是由文字转换而来的**向量（Vectors）**。
<hr id="c5xas" class="ne-hr">
## 1. 为什么 AI 需要 ChromaDB？

普通的数据库（比如 Excel 或 MySQL）是靠**关键词**搜索的。


- **普通数据库**：搜“内存不足”，如果文档里写的是 Out of Memory，它就找不到。
- **ChromaDB**：它通过 **Embedding（嵌入）** 技术理解语义。它知道“内存不足”和 OOM 是一个意思，所以能精准定位。
<hr id="pks6g" class="ne-hr">
## 2. ChromaDB 的三个核心功能

#### A. 存储向量 (Storage)

当你运行 ingest.py 时，ChromaDB 把你的运维文档（.txt, .md）切成小块，并把它们转换成一串长长的数字（向量），然后永久存在你硬盘的 vector_db 文件夹里。

#### B. 语义检索 (Retrieval)

当你提问时，ChromaDB 会迅速在数千个向量中找到离你的问题“距离最近”的那几个片段。它不像在翻书，更像是在地图上找邻居。

#### C. 元数据管理 (Metadata)

它不仅存文字，还能存**元数据**（比如：这是哪个服务器的日志？这是哪一行的报错？）。这让你的 AIOps 平台可以实现“精准排障”。
<hr id="QAOYM" class="ne-hr">
## 3. 在你项目中的位置
<table id="WNR2g" class="ne-table" style="width: 750px"><tbody><tr style="height: 33px"><td width="250">
**组件**
</td><td width="250">
**角色**
</td><td width="250">
**对应你项目中的内容**
</td></tr><tr style="height: 33px"><td width="250">
**Qwen (LLM)**
</td><td width="250">
**大脑**
</td><td width="250">
负责逻辑推理和组织语言。
</td></tr><tr style="height: 33px"><td width="250">
**ChromaDB**
</td><td width="250">
**知识库**
</td><td width="250">
负责提供 K8s 手册和历史故障数据。
</td></tr><tr style="height: 33px"><td width="250">
**LangChain**
</td><td width="250">
**神经系统**
</td><td width="250">
负责把大脑和知识库串联起来。
</td></tr></tbody></table><hr id="rNUik" class="ne-hr">
## 4. 为什么选 ChromaDB 而不是别的？


- **轻量且本地化**：它不需要安装复杂的服务器（比如 Pinecone 或 Milvus），直接在你的 Python 环境里运行，数据完全存在你本地，符合你**“不使用第三方存储”**的安全需求。
- **开源免费**：非常适合大学生创业项目和 AIOps 实验。
- **集成简单**：它和 LangChain 是“原生配对”，几行代码就能搞定。
<hr id="KSRut" class="ne-hr">
## 你的现状与风险提示

你现在已经成功通过 Chroma(persist_directory="./vector_db", ...) 连上了它。

**需要注意的是：**

由于 ChromaDB 升级很快，你看到的 LangChainDeprecationWarning 提醒你，未来可能需要安装 langchain-chroma 独立包。但在你目前的 **3.11 环境** 下，现在的写法是最稳妥的。

**你想看看你的 ****vector_db**** 文件夹里到底存了多少条“记忆”吗？** 我们可以写一行简单的代码，打印出你数据库里的文档总数，帮你确认 ingest.py 是否真的把所有文件都吃进去了。你要试试吗？