---
title: OpenAI库的流式输出
icon: robot
date: 2026-03-23
category:
  - AI大模型
---

## 流式输出（stream）是什么？

**流式输出（Streaming）** 是提高 AI 交互体验的关键技术。

简单来说，普通的输出是“**等 AI 全部想好了，一次性把整段话塞给你**”；而流式输出是“**AI 每想出一个字，就立刻发给你一个字**”。这就像看真人打字一样，能极大地缓解用户的等待焦虑。
<hr id="jDUkR" class="ne-hr">
## 1. 为什么需要流式输出？

在大模型处理复杂逻辑（比如你的 **AIOps 日志分析**）时，生成一段 500 字的建议可能需要 10 秒钟。


- **非流式（Standard）：** 用户盯着屏幕发呆 10 秒，然后文字突然全部弹出。
- **流式（Streaming）：** 用户在第 1 秒就能看到第一个字，阅读速度和 AI 生成速度基本同步，体感延迟几乎为零。
<hr id="u1WqR" class="ne-hr">
## 2. 代码实现：如何开启流式？

在 openai 库中，你只需要做两件事：


- 在 create 方法中设置 stream=True。
- 用 for 循环遍历返回的“流”。

```
from openai import OpenAI
from config.settings import settings
from openai.types.chat import ChatCompletionMessageParam

def basic_chat():
    client = OpenAI(
        api_key=settings.API_KEY,
        base_url=settings.BASE_URL
    )

    messages: list[ChatCompletionMessageParam] = [
        {"role": "system", "content": "你是一个专业的助手。"},
        {"role": "user", "content": "请详细介绍一下什么是分布式系统。"}
    ]

    # 1. 发起流式请求
    response = client.chat.completions.create(
        model=settings.MODEL_NAME,
        messages=messages,
        temperature=settings.TEMPERATURE,
        max_tokens=settings.MAX_TOKENS,
        stream=True  # 开启流式
    )

    print("模型正在打字：", end="", flush=True)

    # 2. 遍历流式返回的每一个“碎片”
    # 注意：流式输出中，获取内容的路径变为了 .choices[0].delta.content
    full_content = ""
    for chunk in response:
        content = chunk.choices[0].delta.content
        if content:
            print(content, end="", flush=True)  # 实时打印到控制台
            full_content += content            # 同时也存起来，方便后续逻辑使用

    print("\n\n--- 打印完毕 ---")

if __name__ == "__main__":
    basic_chat()
```

### 运行结果


- **for chunk in response**: 这是最关键的改变。response 变成了一个可迭代对象。每当 AI 算出一个新的词，循环就会运行一次。
- **delta**** 取代了 ****message**:
- **普通模式**：response.choices[0].message.content（拿最终结果）。
- **流式模式**：chunk.choices[0].delta.content（拿这次流出来的增量）。
- **end="", flush=True**:
- end=""：告诉 print 不要自动换行，让字连在一起。
- flush=True：强制 Python 立即把缓冲区的内容吐到屏幕上。不加这个的话，系统可能会攒一大段才显示，失去了“打字机”的快感。

![](https://cdn.nlark.com/yuque/0/2026/png/62301513/1774243810706-8bd9b031-8d7c-473d-a04e-8ce32faeae97.png)
<hr id="iUafz" class="ne-hr">
## 3. 流式输出的响应格式有什么不同？

当你开启 stream=True 时，返回的 chunk 结构会发生变化：


- **普通回复**：返回的是 message 对象。
- **流式回复**：返回的是一系列 delta（增量）对象。第一个 chunk 可能是 {"role": "assistant"}，随后的 chunks 才是 {"content": "..."}，最后一个 chunk 的 finish_reason 才会是 "stop"。
<hr id="LnDef" class="ne-hr">
## 4. Agent 开发中的“流式”难点

虽然流式输出对用户很友好，但对 **Agent (Function Calling)** 开发者来说是个挑战：


- **解析复杂：** AI 请求调用工具时，tool_calls 也是流式回传的。你需要手动把多个 chunk 里的参数片段拼接起来，才能得到完整的 JSON。
- **无法撤回：** 一旦第一个字发给了用户，你就没法修改了。
- **Token 计算：** 只有最后一个 chunk 才会包含完整的 usage 统计信息（有些模型甚至在流式下不返回 usage）。
<hr id="hc9nD" class="ne-hr">
## 总结

**流式输出 = 更好的用户体验 + 更复杂的代码处理。**

在你的 **AIOps 平台**中，如果只是给管理员看分析报告，开启流式会显得非常高端且流畅。但如果你是在后台偷偷运行 Agent 自动修 Bug，那就没必要开流式，直接拿最终结果更省事。

**既然你了解了流式输出，我们要不要尝试写一个“打字机效果”的控制台 Demo？** 运行它时，你会看到 Qwen 就像真人在你电脑前写运维报告一样。你想试试吗？