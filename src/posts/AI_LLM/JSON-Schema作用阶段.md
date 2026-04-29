---
title: JSON Schema作用阶段
icon: robot
date: 2026-03-23
category:
  - AI大模型
---

在 Agent 开发的完整生命周期中，**JSON Schema** 并不是只在某一个地方闪现，它更像是一条**贯穿始终的“合同”**。

它主要作用在 **大模型（LLM）** 与 **你的 Python 逻辑（Executor）** 之间的 **三次关键交收** 阶段。
<hr id="S91zZ" class="ne-hr">
## 1. 第一阶段：注册与宣誓 (Registration Phase)

**作用点：**client.chat.completions.create(..., tools=tools)

当你初始化对话，把 tools 列表发给阿里云百炼时，JSON Schema 第一次起作用。


- **它的任务：** 告诉 AI “大脑”，你现在拥有哪些超能力。
- **发生了什么：** 大模型接收到这些 Schema 后，会将它们压缩并“理解”存入临时记忆。它现在知道：如果用户提到“内存”，它应该寻找名为 get_mem_usage 的 Schema。
<hr id="ksrRO" class="ne-hr">
## 2. 第二阶段：决策与生成 (Reasoning Phase)

**作用点：** 模型内部推理，并返回 tool_calls。

这是最神奇的阶段。当 AI 决定要干活时，它会严格按照你给的 Schema **“填表”**。


- **它的任务：** 约束 AI 的输出格式。
- **发生了什么：** 如果你的 Schema 定义了参数 lines 必须是 integer（整数），AI 就绝不会返回 "100"（字符串），而会返回 100。
- **如果不符合：** 如果 AI 生成的 JSON 不符合你的 Schema 规范，百炼的后端（网关层）通常会拦截并报错，或者要求 AI 重新生成。
<hr id="hXoUr" class="ne-hr">
## 3. 第三阶段：解析与分发 (Dispatching Phase)

**作用点：** 你的 Python 代码接收到 response 后。

当你拿到 response.choices[0].message.tool_calls 时，Schema 成了你代码的**“翻译指南”**。


- **它的任务：** 确保代码能直接运行。
- **发生了什么：** 因为你定义了 Schema，你就可以放心地写：

```
# 因为有 Schema 约束，你确信 args 里一定有 'topic' 这个键
args = json.loads(tool_call.function.arguments)
execute_query(topic=args['topic'])
```

如果没有 Schema，你可能需要写几十行 if...else 来检查 AI 有没有写错参数名。
<hr id="CNEyf" class="ne-hr">
## 总结：它到底作用在哪里？
<table id="YsC1S" class="ne-table" style="width: 750px"><tbody><tr style="height: 33px"><td width="250">
**阶段**
</td><td width="250">
**物理位置**
</td><td width="250">
**核心作用**
</td></tr><tr style="height: 33px"><td width="250">
**1. 握手阶段**
</td><td width="250">
发往云端的 HTTP 请求体中
</td><td width="250">
**同步认知**：让 AI 知道工具有什么用。
</td></tr><tr style="height: 33px"><td width="250">
**2. 推理阶段**
</td><td width="250">
大模型的预测计算过程中
</td><td width="250">
**格式约束**：强迫 AI 输出符合规范的参数。
</td></tr><tr style="height: 33px"><td width="250">
**3. 执行阶段**
</td><td width="250">
你的本地 Python 业务逻辑中
</td><td width="250">
**安全契约**：保证代码能解析 AI 发来的数据。
</td></tr></tbody></table><hr id="H6uVy" class="ne-hr">
## 深度理解：它就像一张“投递单”

你可以把 **JSON Schema** 想象成快递公司的**电子投递单格式**：


- **寄件前（第一阶段）**：你告诉快递公司，你只接受填了“收件人、地址、电话”的包裹。
- **填单时（第二阶段）**：寄件人（AI）必须按照格子填，漏填了系统（网关）不让过。
- **收件时（第三阶段）**：你拿到单子，一眼就能看到地址在哪，不用再去猜这一坨文字里哪里是地址。
<hr id="oW66A" class="ne-hr">
## 下一步建议

既然你已经理解了 JSON Schema 是“合同”，**我们要不要在你现有的代码中，真正写一个 Schema 并发给百炼？**

即使你还没写函数体，你也可以先看看：**如果你问 AI 一个相关的问题，它返回的那个 ****tool_calls**** 结构到底长什么样。** 这就是进入第二阶段最直观的体验。你要试试吗？