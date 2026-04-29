---
title: memory（历史记录多轮对话）
icon: robot
date: 2026-04-29
category:
  - AI大模型
---

# memory（历史记录多轮对话）

在你的 **AIOps 助手**中，实现“多轮对话”和“记忆”是让 AI 从“一次性问答机”进化为“运维专家”的关键。

目前你运行的 `app.py` 每次输入都是独立的，AI 不记得你上一句说了什么。要解决这个问题，我们需要在 LangChain 的 **LCEL 管道**中引入 **Chat History（对话历史）**。

------

## 1. 记忆的原理：它是怎么实现的？

大模型（如 Qwen）本身是“无记忆”的（Stateless）。LangChain 实现记忆的方法非常暴力但也最有效：**把之前的对话记录全部抓出来，塞进下一次请求的 Prompt 里。**

- **第一轮**：用户说“K8s 节点 A 挂了”。
- **第二轮**：用户问“怎么重启它？”
- **AI 看到的**：`历史记录: [用户: 节点 A 挂了] + 当前问题: [怎么重启它]`。这样 AI 才知道这个“它”是指“节点 A”。

------

## 2. 核心组件：`ChatMessageHistory`

在 LangChain 中，管理这段“历史”主要靠两个东西：

1. **存储 (Store)**：把对话存起来（存内存、磁盘、或 Redis）。
2. **包装器 (RunnableWithMessageHistory)**：自动帮你把历史记录插进管道里。

------

## 3. 如何在你的 `app.py` 中增加记忆？

你需要对现有的代码进行三处微调：

#### A. 修改 Prompt 模板

你需要告诉 Prompt，这里会有一个叫 `chat_history` 的占位符。

Python

```
template = """你是一个 AIOps 专家。
根据上下文和对话历史回答问题。

上下文: {context}
对话历史: {chat_history}
问题: {question}
回答:"""
prompt = ChatPromptTemplate.from_template(template)
```

#### B. 引入内存存储

最简单的办法是先存在内存里（程序重启就没了）：

Python

```
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory

# 这是一个字典，用来存不同用户的对话（比如你和你的同事）
store = {}

def get_session_history(session_id: str):
    if session_id not in store:
        store[session_id] = ChatMessageHistory()
    return store[session_id]
```

#### C. 包装你的 `rag_chain`

使用 `RunnableWithMessageHistory` 把你之前的 `rag_chain` 嵌套进去：

Python

```
with_message_history = RunnableWithMessageHistory(
    rag_chain,
    get_session_history,
    input_messages_key="question", # 对应你 rag_chain 里的输入键
    history_messages_key="chat_history", # 对应 Prompt 里的历史键
)
```

------

## 4. 为什么 RAG 的记忆比普通对话更复杂？

在 AIOps 场景下，记忆面临一个挑战：**“问题重写” (Query Rephrasing)**。

- **场景**：
  1. 用户：“查询集群 A 的 CPU 占用。”
  2. 用户：“那内存呢？”
- **问题**：如果直接拿“那内存呢？”去 **ChromaDB** 检索，数据库根本不知道你在搜哪个集群。
- **解决方案**：先让一个轻量级 AI 把“那内存呢？”重写为“查询集群 A 的内存占用”，再拿这个完整的句子去检索。

------

## 进阶建议

既然你在做**分布式平台**，内存存储（Store）肯定不够。

- **初级**：使用 `ChatMessageHistory` (存内存)。
- **中级**：使用 `FileChatMessageHistory` (存成本地的 JSON 文件，程序重启记忆还在)。
- **高级**：使用 **Redis** 存储。这样当你以后把 AIOps 部署到多台服务器上时，用户的记忆在不同服务器间是同步的。

**你想在你的 `app.py` 里实装这个“打字机效果+持久化记忆”吗？** 加上记忆后，你可以问它：“刚才那个报错可能是什么原因？”，它会结合你之前的对话给你深度分析。你要试试看完整的改写代码吗？