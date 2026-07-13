---
title: ETL清洗
icon: server
date: 2026-07-13
order: 65
category:
  - AI基础设施
tag:
  - AI Infra
---

**ETL 清洗（Data Cleaning / Data Cleansing）** 是 ETL（Extract 提取、Transform 转换、Load 加载）流程中 **Transform（转换）** 阶段的核心步骤。

简单来说，数据从源头系统（如业务数据库、日志文件、API）刚提取出来时，往往充斥着各种“脏数据”（重复、缺失、格式混乱、逻辑错误）。**ETL 清洗的目的，就是通过一系列规范的算法和业务规则，把这些“脏数据”洗净，变成准确、完整、格式统一的“高价值数据”，从而确保后续进入数据仓库（Data Warehouse）或喂给大模型、AI 算子的数据是绝对可靠的。**

在工业界，大数据的治理有一句名言：**“Garbage in, garbage out（垃圾进，垃圾出）”**。ETL 清洗就是卡在中间的“质检员”。

---

### 一、 ETL 清洗到底在“洗”什么？（常见脏数据类型）

1. **缺失值（Missing Data）**：有些记录的某些字段是空的，比如用户注册信息里缺了“年龄”或“手机号”。
2. **重复值（Duplicate Data）**：因为系统重试机制（如网关重发）或日志高频上报，导致同一条业务数据被录入多次。
3. **格式不一致（Inconsistent Format）**：

- *日期*：有的写 `2026-07-07`，有的写 `07/07/2026`，有的干脆是时间戳。
- *大小写*：`Mail`、`mail`、`MAIL` 混杂。

4. **异常值/逻辑错误（Outliers & Logic Errors）**：

- 用户的年龄写着 `200` 岁，或者 `-5` 岁。
- 订单的“发货时间”居然早于“下单时间”。

5. **不合规数据（Invalid Data）**：手机号不是 11 位，或者邮箱格式没有 `@` 符号。

---

### 二、 ETL 清洗具体是怎么做的？（五大核心物理步骤）

在实际的大数据工程（如使用 Spark、Flink、Pandas 或专用 ETL 工具 Kettle、Informatica）中，清洗标准管线如下：

#### 1. 统一格式与标准化（Standardization）

- **做法**：将所有非标准字段强行对齐。
- **时间戳归一**：一律转化为标准 ISO 8601 格式（如 `YYYY-MM-DD HH:mm:ss`）。
- **文本规范**：字符串统一做 `trim()` 去除前后空格，英文统一转小写或大写。
- **单位换算**：比如把海外数据的“华氏度”统一换算为“摄氏度”，或者把“磅”换算为“公斤”。

#### 2. 去重处理（De-duplication）

- **做法**：根据全局唯一标识（如 `order_id`、`user_id + timestamp`）作为 Key 寻找重复记录。
- 如果是完全相同的行，直接丢弃（`drop_duplicates()`）。
- 如果物理主键相同但部分内容有冲突，通常根据时间戳排布流水线，**只保留最新（Latest）的一条记录**，或者将多条记录合并。

#### 3. 缺失值填充或剔除（Handling Missing Values）

面对缺失数据，清洗策略通常根据业务严重程度三选一：

- **直接剔除（Drop）**：如果核心关键主键（如 `user_id` 或 `amount` 金额）缺失，这条数据完全失去业务价值，直接丢弃。
- **填充默认值（Fill）**：字符型缺失填 `Unknown`（未知），类别型缺失填 `Default`。
- **统计学插补（Imputation）**：如果是数值型缺失（如传感器温度、大模型日志指标），可以根据上下文填充**均值（Mean）、中位数（Median）**，或利用时序关系进行前后插值。

#### 4. 逻辑异常检测与过滤（Outlier Detection & Filtering）

- **业务规则检查（Hard Rules）**：编写断言逻辑（Assertion）。例如 `if age < 0 or age > 120: drop()`，或者 `if pay_time < create_time: flag_error()`。
- **统计学剔除（Soft Rules）**：利用 ![](https://cdn.nlark.com/yuque/__latex/a377ef68ce1839956e95215ae8e6e5a6.svg) 原则（拉普拉斯分布）或箱线图（IQR），识别出偏离正常业务范围几个数量级的极端异常值（可能是黑客刷量或系统 Bug 产生），进行标记隔离。

#### 5. 数据富化与脱敏（Enrichment & Masking）

在合规和业务流的最后，通常会顺手做以下清洗动作：

- **数据脱敏（Security）**：根据安全隐私合规，利用掩码强行把手机号洗成 `138****8888`，身份证或姓名进行哈希（MD5/SHA256）或者加盐遮蔽。
- **维度扩充（Enrichment）**：根据 IP 地址，当场查表将其清洗富化为具体的 `省份-城市-运营商` 标签，方便后续数仓直接调用。

---

### 三、 工业界典型的代码实现（以 Python Pandas 为例）

在写底层数据脚本时，一段极简的 ETL 清洗核心逻辑通常长这样：

```
import pandas as pd

def clean_sales_data(filepath):
    # 1. Extract: 提取数据
    df = pd.read_csv(filepath)
    
    # 2. Transform -> Clean: 清洗数据
    # 步骤 A: 强行去除用户名的前后空格，统一小写
    df['username'] = df['username'].str.strip().str.lower()
    
    # 步骤 B: 统一日期格式，无法解析的变成 NaT (空值)
    df['order_date'] = pd.to_datetime(df['order_date'], errors='coerce')
    
    # 步骤 C: 根据订单ID去重，只保留最新的记录
    df = df.sort_values('order_date').drop_duplicates(subset=['order_id'], keep='last')
    
    # 步骤 D: 处理缺失值，金额缺失的直接剔除，地区缺失的填 Unknown
    df = df.dropna(subset=['amount'])
    df['region'] = df['region'].fillna('Unknown')
    
    # 步骤 E: 异常值过滤 (金额不能为负数)
    df = df[df['amount'] >= 0]
    
    # 3. Load: 加载回清洁干净的数据集
    return df
```

### 💡 总结

**ETL 清洗，就是把来自现实世界各个角落、充满噪声和污染的“原始数据矿石”，经过格式对齐、去重、填补缺失、剔除逻辑错误等现代化工业流水线，精炼成“干净、高纯度、结构标准”的数据。**

你目前是在为具体的业务数仓（如互联网日志、电商订单）设计数据清洗规则，还是在使用特定的分布式工具（如 Spark/Flink）遇到了性能瓶颈，需要做算子级别的优化？
