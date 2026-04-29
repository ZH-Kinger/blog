---
title: response回复格式
icon: robot
date: 2026-03-23
category:
  - AI大模型
---

在使用 OpenAI SDK（包括调用阿里云百炼）时，理解 response 的完整回复格式是进阶 Agent 开发的必经之路。

大模型返回的不是一个字符串，而是一个结构化的 **JSON 对象**（在 Python 中被封装为 ChatCompletion 类）。
<hr id="B4fIi" class="ne-hr">
## 完整回复格式拆解

当你执行 response = client.chat.completions.create(...) 后，返回的数据结构如下：

```
{
  "id": "chatcmpl-9A2b...",       # 此次请求的唯一 ID
  "choices": [                     # 回复内容的列表（核心部分）
    {
      "finish_reason": "stop",     # 停止原因：stop(正常结束), length(达到max_tokens), tool_calls(触发工具)
      "index": 0,                  # 该回复在列表中的索引
      "message": {                 # 消息内容对象
        "content": "你好！我是通义千问。", # AI 说的话
        "role": "assistant",       # 角色：助手
        "tool_calls": null         # 如果是 Agent 模式，这里会存放函数调用指令
      }
    }
  ],
  "created": 1712345678,           # Unix 时间戳
  "model": "qwen-max",             # 实际使用的模型版本
  "object": "chat.completion",     # 对象类型
  "usage": {                       # 计费/消耗统计（非常重要）
    "completion_tokens": 15,       # 回答消耗的 Token
    "prompt_tokens": 10,           # 提问消耗的 Token
    "total_tokens": 25             # 总计消耗
  }
}
```
<hr id="keup3" class="ne-hr">
### 2. 开发者最常用的三个字段

作为运维开发者，你通常只需要关注这三个地方：

#### A. 内容提取：response.choices[0].message.content

这是你刚才已经在用的，直接拿 AI 的文本回复。

#### B. 消耗统计：response.usage

在你的分布式平台中，你可以记录这个字段来监控成本：

```
print(f"本次花费 Token: {response.usage.total_tokens}")
```

#### C. 动作指令：response.choices[0].message.tool_calls

**这是 Agent 开发的灵魂。** 如果 content 是 None，而 tool_calls 有内容，说明 AI 不想说话，而是想“动手”。它会告诉你它想调用的函数名和参数。
<hr id="eI22C" class="ne-hr">
### 3. 为什么设计成“列表 (choices)”？

你可能会问：既然通常只取第一个，为什么不直接给个字典，非要套个列表？


- **多样化生成：** 如果你在请求时设置 n=3，choices 列表里就会有 3 个不同的回复，你可以让用户挑一个最满意的。
- **流式输出兼容：** 这种结构方便了后续扩展更复杂的功能（比如长文本生成）。
<hr id="gKN63" class="ne-hr">
### 4. 最佳实践：如何更安全地读取

在真实项目中，直接用 [0] 有时会因为网络波动或内容审核（被阿里云拦截）导致报错。建议增加一个判断：

```
if response.choices:
    msg = response.choices[0].message
    if msg.content:
        print("AI 回复:", msg.content)
    elif msg.tool_calls:
        print("AI 请求调用工具")
else:
    print("模型没有返回任何有效内容")
```
<hr id="ztUM4" class="ne-hr">