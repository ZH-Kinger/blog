---
title: LLM调用规范
icon: robot
date: 2026-03-22
category:
  - AI大模型
---

大模型调用规范是保障调用过程**稳定、安全、合规、高效**的一套标准化准则，涵盖**接口调用、参数配置、安全合规、异常处理、性能优化**等核心维度，是企业和开发者落地大模型应用的必备准则。

下面从 **核心规范（通用）→ 接口调用规范 → 安全合规规范 → 性能与稳定性规范 → 最佳实践** 四个层面，系统讲解大模型调用的核心准则，覆盖 OpenAI、阿里云、Google 等主流平台。
<hr id="dAfjz" class="ne-hr">
## 一、核心通用规范（所有平台通用）

### 1. 接口版本与兼容性


- **固定模型版本**：避免使用 latest/default 等动态版本，指定具体版本（如 gpt-3.5-turbo-0125、qwen-max-202404、gemini-1.5-pro-001），防止模型迭代导致调用结果异常。
- **兼容新旧版本**：若平台接口升级（如 OpenAI v0.x → v1.x、阿里云 DashScope 1.0 → 2.0），需做好版本适配，保留降级方案。

### 2. 参数标准化配置
<table id="SYAhi" class="ne-table" style="width: 750px"><tbody><tr style="height: 33px"><td width="250">
参数
</td><td width="250">
规范要求
</td><td width="250">
推荐值（通用）
</td></tr><tr style="height: 33px"><td width="250">
model
</td><td width="250">
明确指定，避免模糊匹配
</td><td width="250">
gpt-3.5-turbo/qwen-max
</td></tr><tr style="height: 33px"><td width="250">
temperature
</td><td width="250">
按场景固定：精准任务（0~0.3）、创意任务（0.7~1.2）、禁止动态调整
</td><td width="250">
0.3（通用）/0.7（创意）
</td></tr><tr style="height: 33px"><td width="250">
max_tokens
</td><td width="250">
按场景限制（如客服问答≤500，长文本生成≤2000），避免无限制消耗 Token
</td><td width="250">
500~1000
</td></tr><tr style="height: 33px"><td width="250">
top_p
</td><td width="250">
与 temperature 二选一，固定值（如 0.9），避免同时调整导致结果不可控
</td><td width="250">
0.9
</td></tr><tr style="height: 33px"><td width="250">
stop
</td><td width="250">
定义终止符（如 ["\n", "###"]），防止生成无关内容
</td><td width="250">
按需配置
</td></tr></tbody></table>
### 3. 输入输出规范

#### 输入（Prompt）规范


- **结构化 Prompt**：统一使用「系统指令 + 用户输入」格式，避免杂乱的自然语言拼接：

```
messages = [
    {"role": "system", "content": "你是合规客服，仅回答订单相关问题，拒绝无关请求"},
    {"role": "user", "content": user_input}
]
```


- **输入长度限制**：严格控制单轮输入 Token 数（如 GPT-3.5 单轮≤4096），超长内容需分段/摘要后传入。
- **输入清洗**：过滤敏感字符（如 \n\n 重复换行、特殊符号）、恶意输入（如 Prompt 注入）。

#### 输出规范


- **格式约束**：要求模型输出结构化内容（JSON/XML/固定模板），便于解析：

系统指令："你的回答必须以 JSON 格式返回，包含 code（状态码）、content（内容）、reason（原因）字段"


- **输出校验**：对模型返回结果做格式校验（如 JSON 解析、字段检查），异常时重试或降级。
<hr id="d6A9S" class="ne-hr">
## 二、接口调用规范（技术层面）

### 1. 调用方式规范


- **优先使用官方 SDK**：如 OpenAI openai、阿里云 dashscope、Google vertexai，避免直接调用 HTTP API（SDK 内置重试、鉴权、格式校验）。
- **异步 vs 同步**：


- 短文本交互（≤10 秒）：用同步调用；
- 长任务（如文档生成、数据分析）：用异步调用（如 OpenAI stream=True、阿里云 async_call），避免阻塞。


- **流式调用规范**：流式返回时需处理断流、乱序问题，逐段拼接结果，设置超时时间。

### 2. 鉴权与密钥管理规范


- **密钥不硬编码**：禁止将 API Key/AccessKey 写死在代码中，通过环境变量/配置中心/密钥管理服务（如阿里云 KMS、AWS KMS）存储：

```
# 正确方式
from openai import OpenAI
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))  # 从环境变量读取
```


- **密钥权限最小化**：创建专用子账号，仅授予「模型调用」权限，禁止管理员权限。
- **密钥轮换**：定期（如 90 天）轮换密钥，泄露后立即禁用。

### 3. 异常处理规范（核心）

生产环境必须覆盖以下异常类型，并制定重试/降级策略：

```
import time
from openai import APIError, RateLimitError, APIConnectionError

def call_llm_safely(messages):
    max_retries = 3  # 最大重试次数
    retry_delay = 1  # 重试间隔（秒）
    for attempt in range(max_retries):
        try:
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=messages,
                timeout=10  # 超时时间（秒）
            )
            return response.choices[0].message.content
        # 1. 限流异常：等待后重试（遵守平台限流规则）
        except RateLimitError as e:
            print(f"限流：{e}，等待 {retry_delay*(attempt+1)} 秒")
            time.sleep(retry_delay*(attempt+1))  # 指数退避
        # 2. 连接异常：重试
        except APIConnectionError as e:
            print(f"连接失败：{e}，第 {attempt+1} 次重试")
            time.sleep(retry_delay)
        # 3. 其他 API 异常：重试
        except APIError as e:
            print(f"API 错误：{e}，第 {attempt+1} 次重试")
            time.sleep(retry_delay)
        # 4. 最终失败：降级处理
        if attempt == max_retries - 1:
            return "抱歉，服务暂时不可用"  # 降级返回
```

**异常类型与处理策略**：
<table id="cckLC" class="ne-table" style="width: 750px"><tbody><tr style="height: 33px"><td width="375">
异常类型
</td><td width="375">
处理策略
</td></tr><tr style="height: 33px"><td width="375">
限流（RateLimit）
</td><td width="375">
指数退避重试（如 1s→2s→4s）、扩容 API Key
</td></tr><tr style="height: 33px"><td width="375">
连接超时
</td><td width="375">
重试 + 缩短超时时间
</td></tr><tr style="height: 33px"><td width="375">
模型不可用
</td><td width="375">
降级到备用模型（如 gpt-4o → gpt-3.5）
</td></tr><tr style="height: 33px"><td width="375">
权限错误
</td><td width="375">
告警 + 人工介入
</td></tr></tbody></table>
### 4. 日志与监控规范


- **必打日志字段**：


- 调用维度：request_id（请求ID）、model、tokens_used（消耗Token）、cost（成本）、duration（耗时）；
- 业务维度：user_id（用户ID）、prompt（脱敏后）、response（脱敏后）、error_msg（异常信息）。


- **监控指标**：


- 核心指标：调用成功率（≥99.9%）、平均耗时（≤5s）、Token 消耗、限流次数；
- 告警阈值：成功率＜99%、耗时＞10s、异常率＞1% 触发告警。

<hr id="ffFaT" class="ne-hr">
## 三、安全与合规规范（企业级核心）

### 1. 数据合规


- **数据脱敏**：用户输入/模型输出中的敏感信息（手机号、身份证、银行卡）必须脱敏（如 138****1234），禁止明文存储。
- **数据留存**：遵循「最小留存」原则，仅留存必要的调用日志，且留存时间符合法规（如 GDPR/《个人信息保护法》）。
- **数据传输**：调用接口时使用 HTTPS 协议，禁止明文传输。

### 2. 内容合规


- **输入过滤**：禁止调用模型处理违法、违规内容（如暴力、色情、政治敏感），接入内容审核接口（如阿里云内容安全、腾讯云内容审核）前置过滤。
- **输出审核**：模型返回结果需经过内容审核，违规内容直接拦截，禁止返回给用户。
- **功能限制**：禁止利用大模型生成恶意代码、虚假信息、侵权内容，明确模型使用场景边界。

### 3. 隐私保护


- **禁止传敏感数据**：除非获得用户授权，否则禁止将用户隐私数据（如医疗记录、财务数据）传入大模型。
- **私有化部署**：核心业务/高敏感场景，优先使用私有化部署的大模型（如通义千问私有化、GPT-4 企业私有化），避免数据上云。
<hr id="Pp5VU" class="ne-hr">
## 四、性能与成本优化规范

### 1. 成本控制


- **Token 管控**：


- 限制单用户/单会话的 Token 消耗（如单用户每日≤10万 Token）；
- 长文本交互时，仅传入上下文的关键部分（如最近3轮对话），而非全部历史。


- **模型选择**：非核心场景用低成本模型（如 gpt-3.5-turbo、qwen-turbo），核心场景才用高端模型（gpt-4o、qwen-max）。
- **缓存策略**：对高频、重复的查询（如常见问题）缓存模型回复，避免重复调用（缓存 Key 建议：MD5(标准化 Prompt)）。

### 2. 性能优化


- **批量调用**：支持批量处理的场景（如文本嵌入），批量传入数据（如一次传入10条文本），减少接口调用次数。
- **就近调用**：选择离业务服务器最近的接口地域（如阿里云选 cn-hangzhou、OpenAI 选 us-east-1），降低网络延迟。
- **并发控制**：避免高并发下瞬时大量调用导致限流，设置并发数上限（如每秒≤100次调用）。
<hr id="cA65c" class="ne-hr">
## 五、Function Calling 专项规范

若涉及工具调用（ReAct 智能体），需额外遵守：


- **工具描述标准化**：严格按照 JSON Schema 定义工具名称、参数、描述，避免模糊表述（如“城市”需明确“中文全称，如北京市”）。
- **工具调用校验**：模型调用工具前，校验参数合法性（如城市名是否存在、数值是否合理），避免无效调用。
- **工具权限隔离**：不同工具（如查订单、查物流）绑定不同的权限，禁止一个工具调用接口拥有所有业务权限。
<hr id="azo60" class="ne-hr">
## 总结


- **核心准则**：调用规范的核心是「标准化（参数/格式）+ 稳定性（异常/重试）+ 合规性（数据/内容）+ 经济性（成本/Token）」。
- **落地关键**：优先使用官方 SDK、做好异常重试与降级、严格管控密钥与敏感数据、监控核心指标。
- **企业级重点**：内容审核、数据脱敏、隐私保护是合规底线，成本控制与性能优化是落地关键。

遵循以上规范，可大幅降低大模型调用的故障率、合规风险和成本，是从“测试级调用”走向“生产级应用”的必经之路。如果需要针对某一平台（如阿里云/OpenAI）制定专属的调用规范模板，我可以提供可直接落地的文档/代码示例。