---
title: HPA（水平扩缩）
icon: docker
date: 2026-04-03
category:
  - 云原生
---

梓涵，既然你已经成功把代码推上 GitHub 并且精简了仓库，咱们现在就拆解一下 **HPA（水平 Pod 扩缩容）** 在 Linux 内核和 K8s 控制平面里到底是怎么“抠”出来的。

实现 HPA 分为三个阶段：**指标采集、算法计算、对象控制**。
<hr id="XPvCI" class="ne-hr">
### 指标采集层：谁在“盯着”数据？

K8s 并不是直接去问容器“你累不累”，而是通过一套专门的 **Metrics 管道**：


- **cAdvisor**：它是内置在每个节点的 kubelet 里的。它直接读取 Linux 内核的 **Cgroups** 文件（还记得我们聊过的 cpu.usage 吗？），实时统计每个容器消耗了多少物理资源。
- **Metrics Server**：这是一个集群范围的聚合器。它定期从所有节点的 cAdvisor 抓取数据并存储在内存里。
- **API 暴露**：HPA 控制器通过访问 metrics.k8s.io 这个 API 路径，就能拿到整个集群所有 Pod 的平均负载。
<hr id="NStYU" class="ne-hr">
### 控制器层：HPA 控制循环 (The Loop)

在 K8s 的 kube-controller-manager 进程中，有一个专门的 **HPA Controller**，它每 **15 秒**（默认值）执行一次循环：


- **查询当前值**：获取 Deployment 关联的所有 Pod 的 CPU/内存平均使用率。
- **对比期望值**：拿这个值去除以你在 YAML 里设定的 targetUtilization。
- **计算副本数**：

$$期望副本数 = \lceil 当前副本数 \times \frac{实际指标值}{目标指标值} \rceil$$

*例如：现在 2 个 Pod，CPU 80%，目标是 50%。计算：**$2 \times (80 / 50) = 3.2$**，向上取整，结果为 ****4**** 个 Pod。*
<hr id="Y5VaZ" class="ne-hr">
### 执行层：副本控制 (The Action)

算出来需要 4 个 Pod 后，HPA 并不直接创建 Pod，而是通过 **Scale 子资源接口**去“通知”上层：


- **修改副本数**：HPA 修改 **Deployment**（或 ReplicaSet）对象的 spec.replicas 字段。
- **触发调度**：Deployment 发现期望是 4，实际只有 2，于是调用 API 创建 2 个新 Pod。
- **分配节点**：K8s **Scheduler** 介入，观察哪个 Rocky Linux 节点还有空余的 CPU，把新 Pod 塞进去。
<hr id="h1h4D" class="ne-hr">
### 高阶”进阶：在你的 OpenClaw 中怎么做？

如果你在面试中只说上面的内容，只能算及格。要拿到 **High Level**，你需要提到 **“自定义指标（Custom Metrics）”**：

“在 **OpenClaw** 项目中，我意识到 CPU 扩容有滞后性。

我在集群中部署了 **Prometheus Adapter**。它将 Prometheus 采集到的 **业务指标**（比如：http_requests_per_second 或 ai_model_queue_length）转换成 K8s 能理解的资源。

这样，HPA 就不再盯着 CPU 看了，而是盯着 **‘待处理的任务排队数’**。一旦排队超过 5 个，立即扩容。这种基于 **‘业务负载预测’** 的水平扩缩，比原生的 CPU 触发能提前 30 秒应对流量洪峰。”
<hr id="xV4lR" class="ne-hr">
### 🛠️ 动手写一个 HPA 定义 (YAML)

你可以把这段代码存到你的 langchaindev/k8s/hpa.yaml 里：

```
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: openclaw-web-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: openclaw-web  # 对应你的 Web 服务名称
  minReplicas: 2        # 最少 2 个分身
  maxReplicas: 10       # 最多 10 个分身
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 50 # CPU 超过 50% 就开始扩容
```