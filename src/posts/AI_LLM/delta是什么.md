---
title: delta是什么？
icon: robot
date: 2026-03-23
category:
  - AI大模型
---

在流式输出（Streaming）的语境下，**delta**** 意为“增量”或“变化量”**。

如果你把普通的 API 回复比作一封“写好的信”**，那么流式输出里的 ****delta**** 就是**“一个个蹦出来的字符”。
<hr id="sYxNM" class="ne-hr">
## 1. 形象对比：Message vs. Delta


- **非流式 (****message****)**：模型憋了大招，最后给你一个完整的 {"role": "assistant", "content": "你好，我是 Qwen。"}。
- **流式 (****delta****)**：模型每产生一个字就发一个包。


- 第一个包：`{"role": "assistant"}`（只有角色，内容为空）
- 第二个包：`{"content": "你"}`
- 第三个包：`{"content": "好"}`
- 第四个包：`{"content": "，"}`
- ...以此类推。


**这些只包含“新产生的碎片”的对象，就叫 ****delta****。**
<hr id="XjhlY" class="ne-hr">
## 2. 为什么字段名变了？

这是为了在编程逻辑上做区分：


- **response.choices[0].message**：代表这是一个**完整的、确定的**消息对象。
- **chunk.choices[0].delta**：代表这是一个**暂时的、不完整的**增量片段。

在 Python 字典中，它的结构看起来是这样的：

```
# 普通回复的 message
"message": {
    "role": "assistant",
    "content": "你好"
}

# 流式回复的其中一个 delta
"delta": {
    "content": "好"
}
```
<hr id="RgR18" class="ne-hr">
## 3. 在 Agent (Function Calling) 中的 delta

当你以后进阶到 **Agent 开发**，你会发现 delta 变得非常关键。

如果 AI 决定调用一个工具（比如 query_kafka_logs），它的函数参数可能很长。在流式状态下，参数也是通过 delta 一点点传回来的：


- delta 1: {"tool_calls": [{"function": {"arguments": "{\"topic\""}}]}
- delta 2: {"tool_calls": [{"function": {"arguments": ": \"test\""}}]}
- delta 3: {"tool_calls": [{"function": {"arguments": "}"}}]}

**你需要手动把这些 ****delta**** 里的字符串拼接起来**，才能得到完整的 JSON 参数 {"topic": "test"}。
<hr id="OF4CP" class="ne-hr">
## 4. 总结：如何处理 delta

在代码中处理 delta 时，最核心的操作就是**“检查并拼接”**：

```
full_response = ""
for chunk in response:
    # 必须检查 content 是否存在，因为第一个和最后一个 chunk 可能没有内容
    delta_content = chunk.choices[0].delta.content
    if delta_content:
        print(delta_content, end="")
        full_response += delta_content # 像接雨水一样把它接住
```