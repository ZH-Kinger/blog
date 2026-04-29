---
title: 九、AIops改造
icon: server
date: 2026-03-05
category:
  - 运维
---

## DMZ 集群 AIOps 智能化运维方案

### 第一阶段：稳固基石 —— 全栈可观测性构建

**目标**：消除盲区，实现指标（Metrics）与日志（Logs）的统一。


- **自动化部署 (Ansible)**：


- 编写 Playbook 批量完成 130-135 节点的 node_exporter 安装、Systemd 服务配置及 firewalld 9100 端口放行。


- **引入日志聚合 (Grafana Loki)**：


- 在堡垒机（136）部署 Loki 容器。
- 在各节点部署 **Promtail**，实时抓取 /var/log/messages 和应用日志。
- **价值**：在 Grafana 中实现“点击异常指标曲线，直接弹出对应时间点的系统日志”，排障效率提升 80%。


### 第二阶段：预警升级 —— 从“死阈值”转向“趋势预测”

**目标**：在故障发生前解决问题。


- **配置趋势预警 (PromQL)**：


- 在 Prometheus 中添加记录规则（Recording Rules），利用 predict_linear 函数监控磁盘和内存。
- **示例逻辑**：如果预测磁盘空间在 4 小时内将耗尽，即刻触发 Warning 告警，而非等到 90% 才报 Critical。


- **多渠道告警路由 (Alertmanager)**：


- 集成钉钉/企业微信 Webhook。根据告警级别实现分类：普通波动发群聊，关键服务挂掉直接触发短信/电话。

<hr id="PIvza" class="ne-hr">
### 第三阶段：AI 赋能 —— 故障快速定位与根因分析

**目标**：利用 AI 减少人工分析链路，实现“辅助决策”。


- **集成 AI 诊断助手 (基于 LLM API)**：


- **开发逻辑**：编写一个 Python 中间件。
- **流程**：当 Alertmanager 触发告警时，中间件自动调用 Prometheus API 抓取该节点过去 15 分钟的 CPU、IO、Load 指标及 Loki 日志片段。
- **AI 处理**：将数据脱敏后传给大模型提示词：“*分析以下监控快照，给出可能的 3 个故障点及修复建议*”。
- **反馈**：将 AI 分析报告随告警信息一并推送到你的手机。


- **动态阈值异常检测 (Grafana ML)**：


- 启用 Grafana 自带的 Machine Learning 模块。
- 针对 Web 访问量和 CPU 负载开启训练，自动生成**置信区间（阴影带）**。偏离阴影带即视为异常，能有效识别隐蔽的内存泄漏。

<hr id="lK63r" class="ne-hr">
### 第四阶段：闭环自动化 —— 故障自愈 (Self-Healing)

**目标**：实现无人值守的运维闭环。


- **事件驱动修复**：


- 利用 Alertmanager 的 Webhook 触发 136 堡垒机上的 **FastAPI 脚本**。
- **脚本逻辑**：如果告警类型是 service_down，脚本自动运行 ansible-playbook restart_service.yml 尝试重启。
- **反馈**：修复成功后，发送“故障已自愈”通知；若失败，再转人工介入。

<hr id="jol95" class="ne-hr">
## 方案落地清单（你可以直接用于博客目录）
<table id="zBLhP" class="ne-table" style="width: 750px"><tbody><tr style="height: 33px"><td width="250">
**模块**
</td><td width="250">
**技术栈**
</td><td width="250">
**核心价值**
</td></tr><tr style="height: 38px"><td width="250">
**基础监控**
</td><td width="250">
Prometheus + Node Exporter
</td><td width="250">
硬件实时数据采集
</td></tr><tr style="height: 33px"><td width="250">
**可观测性**
</td><td width="250">
Grafana + Loki + Promtail
</td><td width="250">
指标与日志关联分析
</td></tr><tr style="height: 33px"><td width="250">
**智能告警**
</td><td width="250">
Alertmanager + PromQL 预测
</td><td width="250">
提前 4 小时发现隐患
</td></tr><tr style="height: 33px"><td width="250">
**AI 诊断**
</td><td width="250">
Python + GPT API
</td><td width="250">
自动输出根因分析报告
</td></tr><tr style="height: 33px"><td width="250">
**故障自愈**
</td><td width="250">
Webhook + Ansible
</td><td width="250">
缩短平均修复时间 (MTTR)
</td></tr></tbody></table><hr id="R8tF7" class="ne-hr">