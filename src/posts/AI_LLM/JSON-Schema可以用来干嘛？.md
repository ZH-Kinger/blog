---
title: JSON Schema可以用来干嘛？
icon: robot
date: 2026-03-23
category:
  - AI大模型
---

在 **Agent 开发**的语境下，JSON Schema 的作用可以概括为一句话：**它是连接“大语言模型（大脑）”和“你的 Python 代码（手脚）”的唯一翻译协议。**

如果没有它，AI 只是一个“只会聊天”的废话机器；有了它，AI 就变成了能操作 Linux、查询数据库、重启服务的**智能体 (Agent)**。

具体来说，它在你的 **AIOps 项目**中能干这四件大事：
<hr id="FCCKj" class="ne-hr">
## 1. 消除“语义模糊”，确保精准调用

AI 理解人类语言是模糊的，但 Python 运行代码是死板的。


- **用户说**： “帮我查下那个订单服务的报错，要最近 10 条。”

**JSON Schema 翻译**： 强制 AI 将其转化为标准的结构化数据：

```
{ "service": "order-service", "log_level": "ERROR", "limit": 10 }
```

这样你的 Python 脚本才能直接用 kwargs 接收参数，而不会因为 AI 乱起名字（比如把 limit 写成 count）而报错。
<hr id="CX3f7" class="ne-hr">
## 2. 充当“参数拦截器” (Validation)

JSON Schema 可以定义**约束条件**。如果 AI 产生的参数不符合规则，OpenAI/百炼的后端会直接拦截并要求 AI 重新生成。


- **限制取值**： 你可以设置 enum: ["CPU", "Memory", "Disk"]。如果用户问“查一下我的心情指数”，AI 发现没这个选项，就不会乱调工具。
- **限制范围**： 设置 minimum: 1, maximum: 100。防止 AI 抽风一次性要查询 100 万行日志导致你的服务器宕机。
<hr id="VtLpU" class="ne-hr">
## 3. 实现“按需决策” (Dynamic Routing)

这是 Agent 最神奇的地方。你可以给 AI 提供 10 个工具的 Schema（查日志、查指标、发钉钉、改配置）。


- **AI 会变聪明**： 它会根据 Schema 里的 description（描述）自动判断：


- 看到“报错” -> 自动去调用 query_logs 的 Schema。
- 看到“太卡” -> 自动去调用 get_system_metrics 的 Schema。


**JSON Schema 就是这些工具的“身份标签”。**
<hr id="w2gTh" class="ne-hr">
## 4. 自动化构建分布式工作流

在你的“分布式智能日志分析平台”中，你可以用 Schema 定义复杂的任务流：


- **工具 A (获取 IP)**： 输出 { "ip": "192.168.1.1" }。
- **工具 B (扫描端口)**： 它的 Schema 定义了必须输入一个 ip。

**AI 看到 Schema 之间的逻辑关联，会自动把 A 的输出塞进 B 的输入。** 这种自动化的“接力赛”就是 Agent 解决复杂运维问题的核心。
<hr id="fOBs1" class="ne-hr">
## 你的第一阶段实战应用

既然你已经有了 settings.py 并且连接了百炼，你现在可以尝试用 JSON Schema 干一件最酷的事：**让 AI 变成你的 Linux 助理。**

## 练习任务：

为一个 execute_linux_command 函数写一个 Schema。


- **要求**： 只能执行 ls, df -h, free -m 这三个命令（用 enum 限制）。
- **意义**： 这样即使 AI 产生了幻觉想运行 rm -rf /，由于不符合 Schema 的 enum 约束，这个指令根本发不出来。

**你想看一眼这个具备“安全护栏”的 JSON Schema 应该怎么写吗？** 这能帮你理解如何通过 Schema 保护你的分布式系统。