---
title: Message
icon: robot
date: 2026-03-22
category:
  - AI大模型
---

## Message是什么？

简单来说，**message**** 是你与大模型沟通的“对话档案”**。

在 API 调用中，大模型是“无记忆”的。为了让它知道你之前说了什么，或者给它设定一个特定身份，你必须把**整段对话历史**作为一个列表（List）发送给它。这个列表里的每一个元素就是一个 message。
<hr id="lSaoT" class="ne-hr">
## message 的核心结构

每一个 message 都是一个字典（Dict），由两个最核心的字段组成：


- **role**** (角色)**：指明这句话是谁说的。
- **content**** (内容)**：对话的具体文本信息。
<hr id="rCOii" class="ne-hr">
## 四大核心角色（Roles）

在开发 Agent（智能体）时，你会用到这四种角色：
<table id="v1xG2" class="ne-table" style="width: 748px"><tbody><tr style="height: 33px"><td width="187">
**角色 (Role)**
</td><td width="187">
**谁在说话**
</td><td width="187">
**作用**
</td><td width="187">
**你的运维场景示例**
</td></tr><tr style="height: 33px"><td width="187">
**system**
</td><td width="187">
系统/开发者
</td><td width="187">
**设定人设和规则**。它是 AI 必须遵守的底层指令。
</td><td width="187">
"你是一个 K8s 专家，回答必须严谨。"
</td></tr><tr style="height: 33px"><td width="187">
**user**
</td><td width="187">
用户
</td><td width="187">
**发送指令或提问**。
</td><td width="187">
"查一下订单服务的 Pod 状态。"
</td></tr><tr style="height: 33px"><td width="187">
**assistant**
</td><td width="187">
大模型
</td><td width="187">
**AI 的回复**。手动传入它是为了提供上下文记忆。
</td><td width="187">
"Pod order-v1

运行正常。"
</td></tr><tr style="height: 33px"><td width="187">
**tool**
</td><td width="187">
外部工具/代码
</td><td width="187">
**返回函数执行结果**。这是 Agent 模式特有的。
</td><td width="187">
"CPU 占用率: 98%" (由你的 Python 代码返回)
</td></tr></tbody></table><hr id="i7q8J" class="ne-hr">
## 为什么它是一个列表（List）？

**因为列表代表了“记忆”。**

如果你只发当前的提问给模型，它是记不住上一句的。为了实现多轮对话，你的 messages 列表会像这样不断增长：

Python

```
messages = [
    {"role": "system", "content": "你是一个 AIOps 助手"},  # 设定身份
    {"role": "user", "content": "帮我看看 Kafka 状态"},     # 第一次提问
    {"role": "assistant", "content": "Kafka 目前运行正常"}, # AI 的回答（需存入列表）
    {"role": "user", "content": "那它的堆积情况呢？"}        # 第二次提问（由于有上下文，AI 知道“它”指 Kafka）
]
```
<hr id="SYsOi" class="ne-hr">
## 为什么你在 VS Code 里会看到类型警告？

正如你之前遇到的红线，OpenAI 的 SDK 对 messages 的格式要求极其严苛：


- **必须是列表**：即使只有一句话，也要写成 [{"role": "...", "content": "..."}]。
- **字段不能错**：不能把 content 写成 text，不能把 role 写成 part。
- **角色受限**：只能填那几个固定的字符串。

**总结：**

message 就是 **Agent 的记忆载体**。你通过不断往这个列表中 append（添加）新的对话，来维持 Agent 的连续思考能力。

**既然理解了 ****message**** 是记忆，我们要不要试着写一个“带记忆”的对话程序？** 让 AI 记住你刚才提到的“日志路径”，并在下一轮回答中使用它。你想试试吗？