---
title: API调用与回复
icon: robot
date: 2026-03-23
category:
  - AI大模型
---

## 调用大模型API的格式

```
response = client.chat.completions.create(
        model=settings.MODEL_NAME,      # 使用 settings 里的 qwen-max
        messages=messages,
        temperature=settings.TEMPERATURE, # 使用 settings 里的 0.3
        max_tokens=settings.MAX_TOKENS  # 调用配置里的值
    )
```

## 回复内容

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

## 提取大模型回复内容

```
print("模型回复：", response.choices[0].message.content)
```