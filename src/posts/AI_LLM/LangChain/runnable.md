---
title: runnable
icon: robot
date: 2026-04-29
category:
  - AI大模型
---

# runnable

既然你已经接触了 **LCEL (LangChain Expression Language)**，那么理解 `Runnable` 就等于拿到了开启 LangChain 高阶玩法的钥匙。

简单来说，**`Runnable` 是 LangChain 的“通用协议”**。

------

## 1. 核心定义：标准化

在没有 `Runnable` 之前，LangChain 的各个组件（Prompt, LLM, Retriever, OutputParser）都有各自不同的调用方法。有的叫 `.predict()`，有的叫 `.get_relevant_documents()`。

**`Runnable` 出现后，把它们全部“格式化”了。** 只要一个组件遵循了 `Runnable` 协议，它就必须具备以下标准动作：

- `.invoke()`: 单次调用（输入一个，返回一个）。
- `.stream()`: 流式调用（出一块，给一块）。
- `.batch()`: 批量调用（输入一堆，返回一堆）。
- `.ainvoke()` / `.astream()`: 异步调用（不阻塞程序）。

------

## 2. 为什么它叫“可运行对象”？

在你的 `app.py` 中，你用了 `|`（管道符）。**只有当两个组件都是 `Runnable` 时，它们才能被 `|` 串联起来。**

就像乐高积木：每一个积木块（Runnable）底部都有相同的凹槽，顶部有相同的凸起。

- **Prompt** 是一个 Runnable。
- **LLM** 是一个 Runnable。
- **StrOutputParser** 是一个 Runnable。

当你写 `chain = prompt | llm | parser` 时，LangChain 实际上是把这三个小 `Runnable` 封装成了一个**大的 `Runnable`**。

------

## 3. Runnable 的数据流（Input & Output）

每一个 `Runnable` 都有明确的**输入类型**和**输出类型**。你在之前的报错（`KeyError: 'input'`）中踩的坑，本质上就是**上一个 Runnable 的输出没对准下一个 Runnable 的输入**。

| **组件类型**  | **输入 (Input)**     | **输出 (Output)**         |
| ------------- | -------------------- | ------------------------- |
| **Prompt**    | 字典 (Dict)          | PromptValue 对象          |
| **LLM**       | PromptValue / 字符串 | Message 对象              |
| **Retriever** | 字符串 (String)      | 文档列表 (List[Document]) |
| **Parser**    | Message 对象         | 字符串 (String)           |

------

## 4. 你的代码中哪些是 Runnable？

看看你写的这段：

Python

```
rag_chain = (
    {
        "context": lambda x: format_docs(retriever.invoke(x["input"])), # 这是一个隐式 Runnable
        "input": lambda x: x["input"],
    }
    | prompt  # Runnable
    | llm     # Runnable
    | StrOutputParser() # Runnable
)
```

在这个链条里，甚至连那个 `{...}` 字典和 `lambda` 函数，都被 LangChain 自动转换成了 `RunnableMap` 和 `RunnableLambda`。**这就是为什么你可以直接对整个 `rag_chain` 使用 `.stream()` 的原因。**

------

## “避坑”笔记补充

- **Runnable 的透明性**：因为它是标准的，你可以随时在链条中间插入一个 `RunnableLambda(print)` 来观察数据流（就像你之前做的调试）。
- **包装器的本质**：你问的“包装器” `RunnableWithMessageHistory`，它的名字里就带着 `Runnable`。这意味着它的作用是：**接收一个 Runnable，返回一个增强版的 Runnable**。

------

## 总结

**Runnable = LangChain 里的“插头”和“插座”标准。** 有了这个标准，你才能把 AI 大脑、数据库、记忆系统像接水管一样接起来。

**你想试试看如何利用 Runnable 的 `.batch()` 功能吗？** 比如你想同时分析 10 条不同的运维日志，用 `.batch()` 会比你用 `for` 循环调用 `.invoke()` 快得多，因为 LangChain 会在底层帮你做并行优化。你要试试看代码怎么写吗？