---
title: 标准skill
icon: robot
date: 2026-04-29
category:
  - AI大模型
---

# 标准化skill

在 Prometheus 生态中，Python 脚本的核心逻辑其实就是：**构造 PromQL 查询语句 -> 发送 HTTP 请求给 Prometheus API -> 用 Pandas 解析返回的 JSON 结果。**

下面我为你手写一个**工业级标准**的结构化 Skill，直接针对你的 Web 集群监控。

------

## 第一步：核心 Python 监控脚本 (逻辑层)

这是最底层、不带任何 AI 痕迹的纯 Python 逻辑。我们需要用到 `requests` 和 `pandas`。

Python

```
import requests
import pandas as pd
from datetime import datetime

def fetch_prometheus_metric(prometheus_url, promql_query):
    """底层函数：负责与 Prometheus API 通讯"""
    try:
        response = requests.get(
            f"{prometheus_url}/api/v1/query",
            params={'query': promql_query}
        )
        data = response.json()
        
        if data['status'] != 'success' or not data['data']['result']:
            return None
            
        # 将结果转换为简洁的列表
        results = []
        for item in data['data']['result']:
            results.append({
                "node": item['metric'].get('instance', 'unknown'),
                "value": float(item['value'][1])
            })
        return results
    except Exception as e:
        return f"连接失败: {str(e)}"
```

------

## 第二步：封装成结构化 Skill (Agent 接口层)

现在我们用 **Pydantic** 给这个脚本套上“说明书”，让 Agent 知道怎么传参。

Python

```
from langchain.pydantic_v1 import BaseModel, Field
from langchain.tools import StructuredTool

# 1. 定义参数模型
class WebClusterMonitorSchema(BaseModel):
    metric_type: str = Field(
        description="监控指标类型，可选：'cpu' (利用率), 'mem' (内存占用), 'disk' (磁盘使用)"
    )
    cluster_name: str = Field(
        default="web-cluster", 
        description="集群名称，用于在 PromQL 中过滤，例如 'web-prod'"
    )

# 2. 编写 Agent 调用的业务逻辑
def monitor_web_cluster(metric_type: str, cluster_name: str):
    # 配置你的 Prometheus 地址
    PROMETHEUS_URL = "http://localhost:9090" 
    
    # 根据参数动态生成 PromQL (针对 Node Exporter)
    queries = {
        "cpu": f'100 - (avg by (instance) (irate(node_cpu_seconds_total{{mode="idle", cluster="{cluster_name}"}}[5m])) * 100)',
        "mem": f'100 * (1 - (node_memory_MemAvailable_bytes{{cluster="{cluster_name}"}} / node_memory_MemTotal_bytes{{cluster="{cluster_name}"}}))',
        "disk": f'100 * (1 - node_filesystem_avail_bytes{{mountpoint="/", cluster="{cluster_name}"}} / node_filesystem_size_bytes{{mountpoint="/", cluster="{cluster_name}"}})'
    }
    
    query = queries.get(metric_type)
    if not query:
        return "不支持的指标类型，请选择 cpu/mem/disk。"

    # 执行底层查询
    raw_data = fetch_prometheus_metric(PROMETHEUS_URL, query)
    
    if not raw_data:
        return f"未查询到集群 {cluster_name} 的相关数据，请检查集群名称或 Node Exporter 状态。"

    # 使用 Pandas 进行简单的降维处理，只给 Agent 返回核心结论
    df = pd.DataFrame(raw_data)
    summary = df.to_string(index=False)
    
    return f"--- {cluster_name} 集群 {metric_type} 监控报表 ---\n{summary}"

# 3. 最终导出工具
web_monitor_tool = StructuredTool.from_function(
    func=monitor_web_cluster,
    name="get_web_cluster_status",
    description="专门用于实时监控 Web 集群各节点的 CPU、内存、磁盘健康状况。",
    args_schema=WebClusterMonitorSchema
)
```

------

## 为什么这个脚本在 AIOps 中很专业？

1. **动态 PromQL 生成**：你没有写死一个查询，而是让 Agent 根据用户的意图（想看 CPU 还是内存）动态选择语句。
2. **数据过滤与清洗**：你没有把 Prometheus 返回的原始复杂 JSON 扔给 Agent（那会耗尽 Token），而是用 **Pandas** 提取了关键的 `instance` 和 `value`，整理成了易读的表格。
3. **结构化约束**：通过 `args_schema`，Agent 永远不会传出 `metric_type="weather"` 这种离谱的参数。

------

## 接下来你可以这么玩：

1. **把这个工具加到你的 `agent.py` 的 `tools` 列表里。**
2. **在 CLI 里试着问：** “帮我检查一下 `web-prod` 集群的内存，看看有没有哪个节点快爆了？”
3. **Agent 会自动完成：** 解析出 `cluster_name="web-prod"` -> 调用工具生成 PromQL -> 拿到表格 -> 分析表格数据 -> 告诉你“节点 A 内存 95%，需要注意”。

**这就是你简历里提到的“全流程告警闭环”的起点！** **你想不想再加一个 Skill：当发现 CPU 过高时，让 Agent 自动去查该节点上负载最高的进程名？**（这需要用到 SSH 相关的工具了）