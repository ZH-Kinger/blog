---
title: LangChain下载
icon: robot
date: 2026-03-23
category:
  - AI大模型
---

这份笔记专门为你从 **“基础对话”** 向 **“Agent 开发”** 转型而准备。在 PyCharm 环境下，建议按照以下结构记录你的部署流程：
<hr id="JOMis" class="ne-hr">
# LangChain 开发环境部署笔记

## 一、 核心组件清单 (Why we download these?)

在执行安装命令前，需理解每个包在 **Agent 架构** 中的生态定位：
<table id="uJUqS" class="ne-table" style="width: 750px"><tbody><tr style="height: 33px"><td width="250">
**软件包**
</td><td width="250">
**定位**
</td><td width="250">
**核心作用**
</td></tr><tr style="height: 33px"><td width="250">
**langchain**
</td><td width="250">
**核心框架**
</td><td width="250">
Agent 的“骨架”，负责连接 Prompt、LLM 和工具链。
</td></tr><tr style="height: 33px"><td width="250">
**langchain-community**
</td><td width="250">
**工具生态**
</td><td width="250">
包含各种第三方集成（如数据库连接、本地文件读取）。
</td></tr><tr style="height: 33px"><td width="250">
**langchain-openai**
</td><td width="250">
**协议适配**
</td><td width="250">
让 LangChain 能通过 OpenAI 标准协议调用 **阿里云百炼 (Qwen)**。
</td></tr><tr style="height: 33px"><td width="250">
**langchain-ollama**
</td><td width="250">
**本地大脑**
</td><td width="250">
支持在本地私有化部署 Llama 3 或 Qwen 2 模型。
</td></tr><tr style="height: 33px"><td width="250">
**dashscope**
</td><td width="250">
**官方 SDK**
</td><td width="250">
阿里云百炼的原生工具包，处理高级功能（如多模态、长文本）。
</td></tr><tr style="height: 33px"><td width="250">
**chromadb**
</td><td width="250">
**向量数据库**
</td><td width="250">
Agent 的“长期硬盘”，用于存储运维手册、日志知识（RAG）。
</td></tr></tbody></table><hr id="O4cVA" class="ne-hr">
## 二、 部署步骤 (Step-by-Step)

### 1. 创建并激活虚拟环境

在 PyCharm 的 **Terminal** 中执行，防止包版本冲突。

```
# 创建虚拟环境 (venv)
python -m venv venv

# 激活环境 (Windows)
.\venv\Scripts\activate
```

### 2. 一键安装全家桶 (加速镜像版)

使用清华源加速，避免因网络问题导致的 Timeout。

```
pip install langchain==0.3.0 langchain-core==0.3.0 langchain-community==0.3.0 langchain-openai==0.2.0 langchain-huggingface -i https://mirrors.aliyun.com/pypi/simple/ --no-cache-dir

# 1. 安装核心驱动
pip install chromadb -i https://mirrors.aliyun.com/pypi/simple/

# 2. 安装 LangChain 最新的 Chroma 适配器（消除那个弃用警告）
pip install langchain-chroma -i https://mirrors.aliyun.com/pypi/simple/
```
<hr id="CFSnu" class="ne-hr">
## 三、 验证与配置 (Verification)

### 1. 验证安装版本

新建 check_env.py，确保所有组件已就绪：

```
import langchain
import chromadb
from langchain_openai import ChatOpenAI

print(f"LangChain 版本: {langchain.__version__}")
print(f"ChromaDB 已就绪")
```

#### 查看langchain版本

```
pip show langchain
```

#### 导出当前依赖

```
pip freeze
```

### 2. 环境变量配置 (.env 文件)

在项目根目录创建 .env，统一管理你的 **百炼 API Key**：

```
# 阿里云百炼配置
DASHSCOPE_API_KEY="你的API_KEY"
# OpenAI 兼容模式地址
OPENAI_API_BASE="https://dashscope.aliyuncs.com/compatible-mode/v1"
```
<hr id="iswlZ" class="ne-hr">
## 四、 避坑与技巧 (Troubleshooting)


- **Pydantic 版本冲突**：LangChain 深度依赖 Pydantic。如果报错，通常是因为版本太旧，尝试执行 pip install -U pydantic。
- **PyCharm 识别不到包**：如果 Terminal 装好了但代码报红，请点击 PyCharm 右下角的解释器名称，重新选择当前项目的 venv/Scripts/python.exe。
- **ChromaDB 编译失败**：在 Windows 上安装 chromadb 有时需要 C++ 编译环境。若报错，请先安装 [Visual Studio 生成工具](https://www.google.com/search?q=https://visualstudio.microsoft.com/zh-hans/visual-cpp-build-tools/)。
<hr id="QV7Hm" class="ne-hr">
## 💡笔记小结：接下来的实战方向

现在你的“工厂”已经建好了，接下来的 **Agent 第一阶段** 任务是：


- **封装模型**：利用 ChatOpenAI 类把百炼模型实例化。
- **构建 RAG**：用 ChromaDB 把你的 sidebar.ts（博客配置）变成 AI 可以检索的知识库。

**既然笔记已经整理好了，我们要不要试着写一个“最简 LangChain 脚本”，让你安装的这些包第一次协同工作？** 我们可以做一个“读取本地笔记并回答”的小 Demo。你要试试吗？