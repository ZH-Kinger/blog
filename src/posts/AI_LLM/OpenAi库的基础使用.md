---
title: OpenAi库的基础使用
icon: robot
date: 2026-03-22
category:
  - AI大模型
---

学习 openai 库（Python 官方 SDK）是掌握 OpenAI API 核心能力的关键，它能让你轻松调用 GPT 系列模型、实现 Function Calling、构建 ReAct 智能体等。下面我会从**基础入门 → 核心功能 → 高级实战 → 最佳实践** 逐步讲解，全程用可运行的代码示例，新手也能快速上手。
<hr id="JWkcd" class="ne-hr">
## 一、前置准备

### 1. 环境安装

```
# 安装最新版 openai 库（注意：v1.x 版本和旧版 v0.x 接口差异较大，推荐用 v1+）
pip install openai --upgrade
```

### 2. 配置 API Key

有两种方式配置（任选其一）：

#### 方式1：环境变量（推荐，安全）

```
# Linux/Mac
export OPENAI_API_KEY="你的sk-xxx密钥"

# Windows（cmd）
set OPENAI_API_KEY="你的sk-xxx密钥"
```

#### 方式2：代码中直接配置

```
from openai import OpenAI

# 初始化客户端
client = OpenAI(
    api_key="你的sk-xxx密钥",  # 替换为真实密钥
    # 国内访问需配置代理（可选）
    # base_url="https://api.openai-proxy.com/v1"
)
```
<hr id="Gpdve" class="ne-hr">
## 二、核心功能：从基础对话到高级能力

### 1. 基础对话（Chat Completions）

最核心的功能，调用 GPT 生成对话回复，对应 ChatGPT 核心能力。

```
# 基础对话示例
def basic_chat():
    # 调用 chat.completions.create 接口
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",  # 模型选择：gpt-3.5-turbo/gpt-4o/gpt-4-turbo
        messages=[
            {"role": "system", "content": "你是一个友好的助手，回答简洁明了"},
            {"role": "user", "content": "什么是 Function Calling？"}
        ],
        temperature=0.7,  # 随机性：0（严谨）~2（创意）
        max_tokens=500  # 最大生成字符数
    )

    # 提取回复内容
    answer = response.choices[0].message.content
    print("模型回复：", answer)

if __name__ == "__main__":
    basic_chat()
```

**关键参数解释**：


- model：模型版本，新手优先用 gpt-3.5-turbo（性价比高），复杂任务用 gpt-4o。
- messages：对话历史，包含 system（系统指令，定义角色）、user（用户提问）、assistant（模型回复）。
- temperature：控制生成的随机性，数值越小越精准，越大越有创意。

### 2. 多轮对话（上下文记忆）

通过保留 messages 列表实现多轮对话，让模型记住前文。

```
def multi_turn_chat():
    # 初始化对话历史
    messages = [{"role": "system", "content": "你是数学老师，只回答数学问题"}]

    # 模拟多轮对话
    while True:
        user_input = input("你：")
        if user_input.lower() in ["退出", "q"]:
            break
        
        # 添加用户输入到对话历史
        messages.append({"role": "user", "content": user_input})
        
        # 调用模型
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=messages
        )
        
        # 提取模型回复并添加到对话历史
        assistant_reply = response.choices[0].message.content
        messages.append({"role": "assistant", "content": assistant_reply})
        
        print("老师：", assistant_reply)

# 运行测试
multi_turn_chat()
```

### 3. 核心实战：Function Calling（工具调用）

这是构建 ReAct 智能体的核心，也是 openai 库最有价值的功能之一。

```
# 步骤1：定义工具函数（模拟查天气）
def get_weather(city: str) -> str:
    """模拟获取天气的工具函数"""
    weather_data = {
        "北京": "晴，15-25°C",
        "上海": "多云，18-28°C",
        "广州": "小雨，20-30°C"
    }
    return weather_data.get(city, "未查询到该城市天气")

# 步骤2：定义工具描述（告诉模型有哪些工具可用）
tools = [
    {
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "获取指定城市的实时天气信息",
            "parameters": {
                "type": "object",
                "properties": {
                    "city": {
                        "type": "string",
                        "description": "城市名称，如北京、上海"
                    }
                },
                "required": ["city"]
            }
        }
    }
]

# 步骤3：调用模型，让其判断是否调用工具
def function_calling_demo(user_query: str):
    # 第一步：让模型决定是否调用工具
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": user_query}],
        tools=tools,
        tool_choice="auto"  # 让模型自动决定是否调用工具
    )

    response_message = response.choices[0].message
    print("模型思考结果：", response_message)

    # 第二步：如果模型选择调用工具，则执行对应的函数
    if response_message.tool_calls:
        # 提取工具调用信息
        tool_call = response_message.tool_calls[0]
        function_name = tool_call.function.name
        function_args = eval(tool_call.function.arguments)  # 解析参数（推荐用 json.loads）

        # 执行工具函数
        if function_name == "get_weather":
            tool_result = get_weather(city=function_args["city"])
        else:
            tool_result = "未知工具"

        # 第三步：将工具结果回传给模型，生成最终回答
        final_response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "user", "content": user_query},
                response_message,  # 模型之前的工具调用指令
                {
                    "role": "tool",
                    "tool_call_id": tool_call.id,
                    "name": function_name,
                    "content": tool_result
                }
            ]
        )

        return final_response.choices[0].message.content
    else:
        # 不需要调用工具，直接返回模型回答
        return response_message.content

# 测试
print(function_calling_demo("北京今天的天气怎么样？"))
# 输出：北京今天的天气为晴，15-25°C。
```

### 4. 其他常用功能

#### （1）文本嵌入（Embeddings）

将文本转换为向量，用于相似度匹配、RAG 等场景：

```
def text_embedding():
    # 生成文本嵌入
    response = client.embeddings.create(
        model="text-embedding-3-small",
        input=["今天天气很好", "我想去公园玩"]
    )
    # 提取向量
    embeddings = [item.embedding for item in response.data]
    print("文本1的向量长度：", len(embeddings[0]))  # 输出：1536（text-embedding-3-small 维度）

text_embedding()
```

#### （2）文件处理（比如解析PDF）

需结合 openai 的 Files API，适合处理长文本：

```
# 上传文件（需先安装 openai[files]）
def upload_file():
    file = client.files.create(
        file=open("文档.pdf", "rb"),
        purpose="assistants"
    )
    print("文件ID：", file.id)
    return file.id
```
<hr id="zI86l" class="ne-hr">
## 三、高级实战：构建 ReAct 智能体

结合 Function Calling 和多轮对话，实现“思考→行动→观察”的 ReAct 闭环：

```
def react_agent():
    # 定义工具列表
    tools = [
        {
            "type": "function",
            "function": {
                "name": "get_weather",
                "description": "获取指定城市的实时天气",
                "parameters": {
                    "type": "object",
                    "properties": {"city": {"type": "string"}},
                    "required": ["city"]
                }
            }
        },
        {
            "type": "function",
            "function": {
                "name": "calculate",
                "description": "计算加减乘除",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "a": {"type": "number"},
                        "b": {"type": "number"},
                        "op": {"type": "string", "enum": ["+", "-", "*", "/"]}
                    },
                    "required": ["a", "b", "op"]
                }
            }
        }
    ]

    # 工具函数映射
    tool_functions = {
        "get_weather": get_weather,
        "calculate": lambda a, b, op: eval(f"{a}{op}{b}")  # 简单计算器
    }

    # 对话循环
    messages = [{"role": "system", "content": "你是ReAct智能体，需要时调用工具解决问题"}]
    while True:
        user_input = input("你：")
        if user_input.lower() in ["退出", "q"]:
            break
        
        messages.append({"role": "user", "content": user_input})
        
        # 第一步：思考并决定是否调用工具
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=messages,
            tools=tools,
            tool_choice="auto"
        )
        response_message = response.choices[0].message
        messages.append(response_message)

        # 第二步：执行工具（如果需要）
        if response_message.tool_calls:
            for tool_call in response_message.tool_calls:
                func_name = tool_call.function.name
                func_args = eval(tool_call.function.arguments)
                # 执行工具函数
                func_result = tool_functions[func_name](**func_args)
                # 添加工具结果到对话历史
                messages.append({
                    "role": "tool",
                    "tool_call_id": tool_call.id,
                    "name": func_name,
                    "content": str(func_result)
                })
            
            # 第三步：基于工具结果生成最终回答
            final_response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=messages
            )
            final_answer = final_response.choices[0].message.content
            messages.append({"role": "assistant", "content": final_answer})
        else:
            final_answer = response_message.content
        
        print("智能体：", final_answer)

# 运行ReAct智能体
react_agent()
```
<hr id="IhsxE" class="ne-hr">
## 四、学习要点与最佳实践

### 1. 版本注意事项


- openai 库 v1.x 是最新版本，接口和 v0.x 完全不同（比如 client.chat.completions.create 替代旧版 Completion.create）。
- 优先参考官方文档的 v1.x 示例，避免版本兼容问题。

### 2. 性能与成本优化


- 选择合适的模型：gpt-3.5-turbo 适合大部分场景，成本仅为 gpt-4o 的 1/10。
- 控制 max_tokens：避免生成过长文本，减少token消耗。
- 缓存重复请求：比如相同的嵌入请求、相同的工具调用结果，避免重复计费。

### 3. 错误处理

生产环境中需添加异常捕获：

```
import time

def safe_chat(user_input):
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": user_input}]
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"调用失败：{e}")
        # 重试逻辑（可选）
        time.sleep(1)
        return "抱歉，暂时无法回答你的问题"
```

### 4. 学习资源


- **官方文档**：[https://platform.openai.com/docs/libraries/python（最权威）](https://platform.openai.com/docs/libraries/python（最权威）)
- **官方示例仓库**：[https://github.com/openai/openai-python（含大量代码示例）](https://github.com/openai/openai-python（含大量代码示例）)
- **LangChain 文档**：结合 LangChain 可快速封装 openai 为智能体。
<hr id="okYDq" class="ne-hr">
## 总结


- **核心基础**：openai 库的核心是 Chat Completions 接口，通过 messages 控制对话，model 选择不同算力的模型。
- **核心价值**：Function Calling 是构建 ReAct 智能体的关键，实现“思考→行动”闭环。
- **实战重点**：多轮对话需保留 messages 上下文，生产环境需注意错误处理和成本优化。

从基础对话入手，先掌握 Function Calling，再结合 ReAct 逻辑构建智能体，是学习 openai 库的最优路径。如果有具体的学习目标（比如做一个智能客服、数据分析助手），可以告诉我，我会针对性给出代码模板。