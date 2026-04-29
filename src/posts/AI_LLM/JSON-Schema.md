---
title: JSON Schema
icon: robot
date: 2026-03-23
category:
  - AI大模型
---

## JSON Schema是什么?

学习 **Agent 开发**（尤其是 **Function Calling**）的过程中，**JSON Schema** 就是你给 AI 写的“函数操作说明书”。

简单来说，JSON Schema 是一种**元数据**，它是用来“描述数据的数据”。它的作用是告诉 AI：这个函数叫什么、需要什么参数、参数必须是什么类型。
<hr id="aZBXN" class="ne-hr">
## 1. 为什么 Agent 开发必须用它？

大模型（如 Qwen 或 GPT-4）虽然聪明，但它不知道你本地 Python 函数的具体要求。


- **没有 Schema**：AI 可能会乱猜参数名（比如把 user_id 猜成 uid）。
- **有了 Schema**：AI 会严格按照你定义的“模版”生成 JSON，你的代码才能直接解析并运行。
<hr id="jpgcV" class="ne-hr">
## 2. JSON Schema 的标准格式

一个标准的 Function Calling Schema 通常包含四个核心部分：name (函数名), description (功能描述), parameters (参数详情)。

## 基础模版结构：

```
{
  "name": "get_weather",                // 函数名（必须与 Python 函数名一致）
  "description": "获取指定城市的实时天气", // 告诉 AI 什么时候该调用这个工具
  "parameters": {                       // 参数定义开始
    "type": "object",                   // 参数总是一个对象（字典）
    "properties": {                     // 具体有哪些参数
      "city": {
        "type": "string",               // 类型：字符串
        "description": "城市名称，如：北京"
      },
      "unit": {
        "type": "string",
        "enum": ["celsius", "fahrenheit"], // 枚举：只能选这两个
        "default": "celsius"            // 默认值
      }
    },
    "required": ["city"]                // 哪些参数是必填的
  }
}
```
<hr id="RQTcI" class="ne-hr">
## 3. 核心字段详解
<table id="m0uyR" class="ne-table" style="width: 750px"><tbody><tr style="height: 33px"><td width="250">
**字段**
</td><td width="250">
**作用**
</td><td width="250">
**Agent 调优建议**
</td></tr><tr style="height: 33px"><td width="250">
**type**
</td><td width="250">
定义数据类型
</td><td width="250">
常用：string

, number

, integer

, boolean

, array

, object

。
</td></tr><tr style="height: 33px"><td width="250">
**description**
</td><td width="250">
**最重要的地方**
</td><td width="250">
这是写给 AI 看的。描述得越详细，AI 触发工具的准确率就越高。
</td></tr><tr style="height: 33px"><td width="250">
**enum**
</td><td width="250">
限制取值范围
</td><td width="250">
如果参数只能是 high/medium/low

，一定要写死，防止 AI 乱填。
</td></tr><tr style="height: 33px"><td width="250">
**required**
</td><td width="250">
强制约束
</td><td width="250">
如果某些参数缺失会导致 Python 报错，务必放在这个列表里。
</td></tr></tbody></table><hr id="xXCdL" class="ne-hr">
## 4. 实战例子：你的 AIOps 日志分析工具

假设你要写一个查询 Kafka 日志的工具，它的 Schema 应该长这样：

```
# 在 OpenAI SDK 调用中，它是放在 tools 列表里的
{
    "type": "function",
    "function": {
        "name": "query_kafka_logs",
        "description": "从 Kafka 集群中检索特定 Topic 的错误日志。",
        "parameters": {
            "type": "object",
            "properties": {
                "topic_name": {
                    "type": "string",
                    "description": "需要查询的 Kafka Topic 名称，如 'order-service'"
                },
                "lines": {
                    "type": "integer",
                    "description": "需要读取的日志行数，默认 100",
                    "default": 100
                },
                "log_level": {
                    "type": "string",
                    "enum": ["ERROR", "WARN", "INFO"],
                    "description": "日志级别过滤"
                }
            },
            "required": ["topic_name", "log_level"]
        }
    }
}
```
<hr id="SOSer" class="ne-hr">
## 5. 如何在第一阶段练习？

你不需要手动写这些复杂的 JSON。在 Python 中，你可以先定义好函数，然后用一些小技巧生成：


- **手动练习**：先试着把你之前想写的 get_cpu_usage 函数写成这种 JSON 格式。
- **Pydantic 生成**（进阶）：以后你可以用 Pydantic 库直接把 Python 类转成 JSON Schema。

**总结：**

JSON Schema 是 **Agent 的合同**。你写得越严谨，AI 办事就越靠谱。

**既然你理解了格式，我们要不要试着为你那个“分布式日志分析平台”里的一个核心功能（比如重启某个 Service）写一个 JSON Schema？** 这样你就能看到 AI 是如何生成“重启指令”的了。你要试试吗？