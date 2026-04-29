---
title: Function Calling (函数调用)
icon: robot
date: 2026-03-22
category:
  - AI大模型
---

### Function Calling（函数调用）是什么？

![](https://cdn.nlark.com/yuque/0/2026/png/62301513/1774173832486-35ca406c-854c-4e03-84f6-a7daa0c4b700.png)

Function Calling（函数调用）是大语言模型（LLM）的核心能力，指**让模型根据用户需求，主动选择并调用预设的外部函数 / 工具（如 API、数据库查询、计算器、搜索引擎）**，再将函数返回的结果整合为自然语言答案的技术。

简单来说：它解决了 LLM “只懂思考，不会做事” 的问题 —— 模型不再只输出文本，还能像程序员一样 “调用工具函数” 获取精准数据，是 ReAct 框架中 **Action（行动）环节的核心实现方式**。

#### 核心价值


- 突破 LLM 自身局限：解决知识过期（如查 2026 年数据）、计算能力弱（如复杂数学题）、无法交互外部系统（如查订单、控硬件）的问题；
- 输出更精准：基于真实工具返回的结果回答，大幅减少 “幻觉”；
- 可落地：让 LLM 从 “聊天机器人” 变成 “能执行任务的智能体”（如自动订机票、查报表）。

## 调用流程
<table id="DiBlE" class="ne-table" style="width: 748px"><tbody><tr style="height: 33px"><td width="187">
**步骤**
</td><td width="187">
**动作主体**
</td><td width="187">
**发生的事情**
</td><td width="187">
**数据内容示例**
</td></tr><tr style="height: 33px"><td width="187">
**Step 1**
</td><td width="187">
**你 (代码)**
</td><td width="187">
发送用户问题 + **工具定义 (Tools)** 给 AI。
</td><td width="187">
"帮我查订单服务日志" + get_log

函数定义
</td></tr><tr style="height: 33px"><td width="187">
**Step 2**
</td><td width="187">
**AI (大脑)**
</td><td width="187">
判断是否需要工具。如果是，返回 **调用请求**。
</td><td width="187">
tool_calls: { name: "get_log", args: { "service": "order" } }
</td></tr><tr style="height: 33px"><td width="187">
**Step 3**
</td><td width="187">
**你 (代码)**
</td><td width="187">
解析 AI 的请求，在本地 **运行真实函数**。
</td><td width="187">
运行 os.popen

或数据库查询，得到 "Error 500"
</td></tr><tr style="height: 33px"><td width="187">
**Step 4**
</td><td width="187">
**你 (代码)**
</td><td width="187">
将 **函数执行结果** 再次发送给 AI。
</td><td width="187">
role: "tool"

, content: "Error 500"
</td></tr><tr style="height: 33px"><td width="187">
**Step 5**
</td><td width="187">
**AI (大脑)**
</td><td width="187">
结合结果，给出 **最终自然语言回答**。
</td><td width="187">
"订单服务报了 500 错误，可能是数据库连接断了。"
</td></tr></tbody></table>