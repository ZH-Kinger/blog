---
title: Model Context调用（历史对话）
icon: robot
date: 2026-03-23
category:
  - AI大模型
---

要在调用模型时附带“历史消息”，核心在于维护好那个 messages 列表。

由于大模型 API 本身是**无状态**的（它不记得你上一秒说了什么），所以你必须在每一次发起请求时，把**之前的对话记录**全部打包发给它。
<hr id="KZjQv" class="ne-hr">
## 1. 核心原理：维护一个“记忆列表”

在代码逻辑上，你需要执行以下循环：


- **用户输入** -> append 到 messages。
- **调用模型** -> 传入整个 messages。
- **获取回复** -> 将 AI 的回答也 append 到 messages（角色设为 assistant）。
<hr id="ja2U5" class="ne-hr">
## 2. 带历史记录的流式对话完整代码

我们将你之前的 basic_chat 改造为一个支持多轮对话的循环：

```
from openai import OpenAI
from config.settings import settings
from openai.types.chat import ChatCompletionMessageParam

def continuous_chat():
    client = OpenAI(
        api_key=settings.API_KEY,
        base_url=settings.BASE_URL
    )

    # 1. 初始化对话历史（放入 System 提示词）
    history: list[ChatCompletionMessageParam] = [
        {"role": "system", "content": "你是一个专业的运维助手，记得之前的对话内容。"}
    ]

    print("--- 已进入多轮对话模式（输入 'quit' 退出） ---")

    while True:
        # 2. 获取用户输入
        user_input = input("\n用户 >> ")
        if user_input.lower() in ['quit', 'exit']:
            break

        # 3. 将用户话语加入历史
        history.append({"role": "user", "content": user_input})

        # 4. 发起流式调用，传入完整的 history
        response = client.chat.completions.create(
            model=settings.MODEL_NAME,
            messages=history, # 关键：这里传的是整个列表
            temperature=settings.TEMPERATURE,
            stream=True
        )

        print("AI >> ", end="", flush=True)
        full_reply = ""
        
        for chunk in response:
            content = chunk.choices[0].delta.content
            if content:
                print(content, end="", flush=True)
                full_reply += content # 拼接碎片
        
        # 5. 关键一步：将 AI 的回复也存入历史，否则下一轮它就忘了自己说过什么
        history.append({"role": "assistant", "content": full_reply})
        print() # 换行

if __name__ == "__main__":
    continuous_chat()
```

### 对话结果

![](https://cdn.nlark.com/yuque/0/2026/png/62301513/1774246032855-b5eb6789-efb6-49f7-aa7e-c94672a9eadb.png)
<hr id="QWyb4" class="ne-hr">
## 3. 为什么必须存入 assistant 角色？

如果不把 AI 的回复（assistant）存回列表，下一轮对话时，AI 只会看到：


- System: 你是助手
- User: 什么是 Kafka？
- User: 它的优点呢？

此时 AI 会一脸懵逼，因为它不知道“它”指代的是 Kafka。只有加上了中间那句 Assistant: Kafka 是分布式流处理平台...，它才能通过上下文推断出你的意图。
<hr id="gpHkj" class="ne-hr">
## 4. 进阶：如何防止“历史记录过长”？

随着对话次数增加，messages 列表会越来越长，导致两个问题：


- **费钱**：每一轮都要重复发送前面的所有内容。
- **爆仓**：超过模型的 context_window（上下文窗口限制）后，模型会报错。

**常用的处理方案：**


- **滑动窗口**：只保留最近的 10 轮对话（history = history[-10:]，注意保留第一条 System 消息）。
- **总结记忆**：当记录太长时，让 AI 把之前的对话总结成一段话，替换掉旧记录（这是 **Agentic RAG** 经常干的事）。
<hr id="uhVnS" class="ne-hr">
## 5. 你的下一步挑战

现在你已经实现了**带记忆的流式对话**。在 **Agent** 开发中，这个 history 列表还会包含 tool_calls 和 tool 的返回结果。

**你想试试看，当历史记录里包含了一个“报错日志”时，AI 是如何根据上下文帮你持续排查问题的吗？** 我们可以模拟一个 Kafka 挂掉的场景来测试。