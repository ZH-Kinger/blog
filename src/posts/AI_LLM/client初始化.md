---
title: client初始化
icon: robot
date: 2026-03-23
category:
  - AI大模型
---

我们可以把 client 想象成一个“翻译官+速递员”，它拿着你的 Key（通行证），去指定的 URL（官邸）找模型办事。

## 标准初始化代码

这是最推荐的工程化写法，直接引用你之前的 settings 对象：

```
from openai import OpenAI
from config.settings import settings 

# 初始化 client
# 这一步只是在内存中创建一个配置对象，并不会产生网络请求（不耗流量，不花钱）
client = OpenAI(
    api_key=settings.API_KEY,      # 你的百炼 API Key
    base_url=settings.BASE_URL     # https://dashscope.aliyuncs.com/compatible-mode/v1
)
```

## 初始化时到底发生了什么？

当你运行这行代码时，SDK 内部做了三件大事：


- **权限封装**：它把你的 API_KEY 放在 HTTP 请求的 Authorization 头部，确保每次对话模型都知道你是谁。
- **路由绑定**：它记住了 BASE_URL。以后你调用 chat.completions.create 时，它会自动在后面拼接路径（如 /chat/completions）。
- **连接池管理**：它准备好了一个 HTTP 连接池（基于 httpx 库），这样你在进行多轮对话时，不需要反复握手，速度更快。
<hr id="LTQRn" class="ne-hr">
## 常见的初始化“进阶参数”

除了 Key 和 URL，在真实的 **AIOps 平台**开发中，你可能还会用到这两个参数：
<table id="BRgMk" class="ne-table" style="width: 750px"><tbody><tr style="height: 33px"><td width="250">
**参数**
</td><td width="250">
**作用**
</td><td width="250">
**推荐场景**
</td></tr><tr style="height: 33px"><td width="250">
**timeout**
</td><td width="250">
设置超时时间（秒）
</td><td width="250">
默认通常是 60s。如果你查日志的任务很重，建议设为 120.0

。
</td></tr><tr style="height: 33px"><td width="250">
**max_retries**
</td><td width="250">
自动重试次数
</td><td width="250">
网络抖动时很有用。默认是 2 次。
</td></tr></tbody></table>
**示例：**

```
client = OpenAI(
    api_key=settings.API_KEY,
    base_url=settings.BASE_URL,
    timeout=60.0,
    max_retries=3
)
```
<hr id="dzJC4" class="ne-hr">
##