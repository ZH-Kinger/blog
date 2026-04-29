---
title: Agent简介
icon: robot
date: 2026-04-29
category:
  - AI大模型
---

# Agent简介

![AI Agent(智能体) 教程| 菜鸟教程](https://www.runoob.com/wp-content/uploads/2025/12/0_0_ezapX2F_7BOysP.png)

在 LangChain 中，Agent 和你之前写的 Chain 最大的区别在于：Chain 是**预设好的死逻辑**（A -> B -> C），而 Agent 是以 LLM 为大脑，**自主决定**调用哪些工具（Tools）来完成任务。

------

## 1. Agent 的核心公式

一个成熟的 Agent 由以下四个部分组成：

**Agent = LLM (大脑) + Tools (手脚) + Planning (思维过程) + Memory (记性)**

- **大脑**：Qwen 等大模型，负责理解意图和逻辑推理。
- **手脚 (Tools)**：你给它的权限。比如：执行 `kubectl` 命令、查询 Prometheus 指标、搜索知识库、发送钉钉告警。
- **思维过程 (Chain of Thought)**：Agent 会自己在那琢磨：“我要先查日志，如果发现 OOM，再去查节点内存。”
- **记性**：对话上下文，确保它记得前一分钟刚执行过什么操作。

------

## 2. 你的 AIOps 助手如何“Agent 化”？

既然你之前的图里已经有了 `KnowledgeBaseService`，我们可以把它包装成 Agent 的一个**工具**。

| **阶段**     | **RAG 模式 (你现在的)**      | **Agent 模式 (我们要做的)**                                  |
| ------------ | ---------------------------- | ------------------------------------------------------------ |
| **用户指令** | “帮我查查 K8s 重启命令。”    | “现在生产环境有个 Pod 挂了，帮我查查原因并修复它。”          |
| **执行逻辑** | 直接去数据库里捞出那几行字。 | 1. 调用 `get_logs` 工具看日志。 2. 发现报错，调用 `vector_search` 查手册。 3. 调用 `execute_cmd` 尝试重启。 |
| **结果**     | 返回一段话。                 | **解决了一个实际问题。**                                     |

------

## 3. Agent 开发的第一步：定义工具（Tools）

在 LangChain 里，把你的函数变成工具非常简单，只需要一个装饰器 `@tool`。

Python

```
from langchain.tools import tool

@tool
def search_knowledge_base(query: str):
    """当需要查询 K8s、Kafka 或公司内部运维手册时，使用此工具。输入应该是具体的运维问题。"""
    # 这里调用你之前的 rag_chain 或者 retriever
    return retriever.invoke(query)

@tool
def execute_linux_cmd(command: str):
    """执行 Linux 命令。仅限执行查看类命令，如 ls, top, kubectl get pods 等。"""
    # 这里写你真正的执行逻辑（注意安全！）
    return f"执行结果: {command} 运行正常"
```

------

## 4. 为什么 Agent 需要那个 MD5 架构？

回到你上一张架构图，那个 `KnowledgeBaseService` 对 Agent 极其重要：

- **实时性**：如果 Agent 在排障时发现知识库里没这个案例，它可以引导用户：“请上传最新的插件说明书”，然后通过你的 `upload_by_str` 流程实时入库。
- **闭环**：Agent 学习完新知识后，立刻就能用新知识解决当前的报错。

------

## “入坑”第一条铁律：**控制权**

开发 Agent 最忌讳的是给它太大的权限。

> **警告**：千万不要给 Agent 赋予 `rm -rf /` 的权限！在 AIOps 阶段，我们通常先做 **“只读 Agent”**（只查不改）或者 **“半自动 Agent”**（输出命令，人点确定再执行）。

------

## 总结

**Agent = 拥有工具箱的 AI。** 它不再是被动回答问题，而是主动解决问题。

**既然我们已经准备好起航了，你想先从哪一步开始？** 1.  **包装工具**：把你之前的向量检索封装成 Agent 的第一个“技能点”？

2. **构建大脑**：写一个支持 **Function Calling（函数调用）** 的 Agent 主逻辑？
3. **安全防护**：写一个过滤危险命令的“安全检查工具”？

你想先试试哪一个？建议从 **1** 开始，把你的 RAG 变成 Agent 的一个插件。