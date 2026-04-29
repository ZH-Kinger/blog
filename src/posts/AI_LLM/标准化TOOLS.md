---
title: 标准化TOOLS
icon: robot
date: 2026-03-23
category:
  - AI大模型
---

在 **Agent 开发**的工程实践中，函数的存放方式直接决定了你的代码是“玩具”还是“工业级平台”。

建议按照“**逻辑分离**”的原则来存放。千万不要把所有的业务逻辑都堆在 main.py 里。
<hr id="WhNK0" class="ne-hr">
## 1. 推荐目录结构：tools/ 文件夹

建议在项目根目录下创建一个 tools/ 包，将不同类别的“手脚”（函数）分开存放。

```
E:\code\blog\ZH-Kinger\  (你的项目根目录)
├── config/
│   └── settings.py      # 你的 API Key 和 URL
├── tools/
│   ├── __init__.py      # 让 tools 成为一个 Python 包
│   ├── system_tools.py  # 存放 CPU、内存、磁盘相关的函数
│   └── kafka_tools.py   # 存放 Kafka 查询、Topic 管理的函数
└── main.py              # 主程序：初始化 Client 并运行 ReAct 循环
```
<hr id="l84vT" class="ne-hr">
## 2. 编写函数：工具函数 (The Implementation)

在 tools/system_tools.py 中，编写纯粹的 Python 逻辑。

```
import psutil

def get_cpu_info():
    """这是真实的执行逻辑"""
    usage = psutil.cpu_percent(interval=1)
    return f"当前系统 CPU 占用率为 {usage}%"

def get_mem_info():
    usage = psutil.virtual_memory().percent
    return f"当前系统内存占用率为 {usage}%"
```
<hr id="R2vSM" class="ne-hr">
## 3. 映射逻辑：工具注册表 (The Registry)

这是 Agent 开发中最巧妙的地方。你需要建立一个“函数名”到“函数对象”的映射表。

在 main.py 中，你可以这样写：

```
from tools.system_tools import get_cpu_info, get_mem_info

# 1. 建立一个“工具字典”
# Key 是你在 JSON Schema 里定义的 name，Value 是真实的函数对象
node_tools_map = {
    "get_cpu_usage": get_cpu_info,
    "get_mem_usage": get_mem_info
}

# 2. 当 AI 传回 tool_calls 时，直接根据名字查找并运行
for tool_call in response.choices[0].message.tool_calls:
    func_name = tool_call.function.name  # AI 说：我想用 get_cpu_usage
    
    if func_name in node_tools_map:
        # 动态调用函数
        real_func = node_tools_map[func_name]
        result = real_func() 
        print(f"执行成功，结果是: {result}")
```
<hr id="j66ih" class="ne-hr">
## 4. 进阶存放方式：使用装饰器 (Decorator)

如果你以后用了像 **OpenClaw** 或 **Smolagents** 这样的框架，它们通常使用装饰器。这种方式最优雅，因为它能同时生成 **函数** 和 **JSON Schema**。

```
# 伪代码示例：
@tool
def query_kafka_log(topic: str):
    """
    查询 Kafka 日志的工具。 (这里的注释会被自动提取为 Schema 的 description)
    """
    # 你的业务逻辑
    return "logs..."
```
<hr id="aASP6" class="ne-hr">
## 5. 为什么要这样放？（运维角度）


- **权限控制**：你可以给 system_tools 极高的权限，但给 user_tools 极低的权限。
- **易于测试**：你可以单独运行 pytest tools/kafka_tools.py，确保工具本身没问题，再去调 AI。
- **动态加载**：在分布式平台中，你可以根据用户权限，动态地把不同的工具集（tools 列表）发给 AI。
<hr id="LAJM0" class="ne-hr">
## 总结：你的“第一阶段”实战建议

现在，你可以在你的项目中创建一个 tools.py，把 get_cpu_usage 放进去。

**你想看一眼如何利用 Python 的 ****getattr**** 或者刚才提到的“工具字典”，写一段不到 10 行的代码，就能自动处理 AI 发回来的任何工具调用吗？** 这种“通用执行器”是 Agent 框架的核心逻辑。你要试试吗？