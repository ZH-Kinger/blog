---
title: chain
icon: robot
date: 2026-04-29
category:
  - AI大模型
---

# chain

在 LangChain 的世界里，**Chain（链）** 是最核心的概念。如果把大模型（LLM）比作一个强大的“引擎”，那么 **Chain 就是“组装线”**。

单个 LLM 只能完成简单的问答，但如果你想实现“**先搜索知识库 -> 再提取信息 -> 结合历史记忆 -> 最后生成回答**”这样复杂的逻辑，你就必须把多个组件像锁链一样扣在一起。

![image-20260325121443267](C:\Users\asus\AppData\Roaming\Typora\typora-user-images\image-20260325121443267.png)

------

## 1. Chain 的核心本质：管道（Pipeline）

在 Linux 里我们用 `|` 来传递数据，LangChain 借鉴了这个设计，发明了 **LCEL (LangChain Expression Language)**。

一个 Chain 的工作流程通常是：

**输入 (Input) -> 组件 A -> 中间数据 -> 组件 B -> 输出 (Output)**

------

## 2. 为什么需要 Chain？（以你的 AIOps 为例）

你现在的 `rag_chain` 就是一个典型的“组合链”。如果没有 Chain，你需要手动写很多逻辑：

1. 手动把用户的问题传给检索器。
2. 手动把检索到的文档拼成字符串。
3. 手动把字符串填进 Prompt 模板。
4. 手动调用 Qwen API。
5. 手动解析 API 返回的复杂 JSON 结果。

**有了 Chain 之后，你只需要一行代码：**

Python

```
# 这是一个典型的 Chain 定义
rag_chain = (
    {"context": retriever, "input": RunnablePassthrough()} 
    | prompt 
    | llm 
    | StrOutputParser()
)
```

当你执行 `rag_chain.invoke("K8s 报错了")` 时，数据会像流水一样自动流经这四个环节。

------

## 3. Chain 的“乐高”属性

所有的 Chain 都是 **Runnable**（可运行对象）。这意味着：

- **链可以嵌套**：你可以把一个“翻译链”和一个“总结链”拼成一个更大的“海外运维日报分析链”。
- **功能增强**：你可以给任何 Chain 套上“包装器”（如 `RunnableWithMessageHistory`），瞬间让它拥有记忆。

------

## 4. 你在代码中看到的几种“链”形态

| **形态**   | **名称**                     | **特点**                                               |
| ---------- | ---------------------------- | ------------------------------------------------------ |
| **基础链** | `LLMChain` (旧版)            | 最简单的 Prompt + LLM。                                |
| **组合链** | `LCEL Chain` (新版)          | 使用 `                                                 |
| **包装链** | `RunnableWithMessageHistory` | 在原有链的基础上，增加了“读写 Redis/JSON 记忆”的功能。 |

------

## 避坑指南

- **数据对齐**：Chain 最容易报错的地方在于“接口不对”。比如 `组件 A` 输出的是列表，但 `组件 B` 想要的是字符串，链条就会断裂。
- **调试技巧**：如果你想看 Chain 中间发生了什么，可以在中间插入一个 `RunnableLambda(print)`，它会像断点一样打印出流经的数据。

------

## 总结

**Chain = 逻辑的自动化。** 它让你不再关注如何调用 API，而是关注**业务逻辑的流向**。

**既然你已经理解了 Chain，你想看看如何给你的 `rag_chain` 加上“条件分支（Routing）”吗？** 比如：如果用户问的是 K8s 问题，就去 K8s 知识库找；如果问的是 Kafka，就去 Kafka 知识库找。这种“会转弯的链”在 AIOps 平台里非常实用，你要试试看怎么写吗？