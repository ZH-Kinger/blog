---
title: MFU（模型算力利用率）
icon: server
date: 2026-07-13
order: 20
category:
  - AI基础设施
tag:
  - AI Infra
---

在大模型和 AI Infra 的世界里，**MFU（Model FLOPs Utilization，模型算力利用率）** 是整个机房里最神圣、最致命，也是老板和 SRE 最死死盯着的**终极 KPI**。

用大白话来说：**MFU 衡量的是，你花几百万买来的极其昂贵的 GPU，到底有百分之几的时间在“真正地算大模型”，又有百分之几的时间在“摸鱼等数据”。**

---

### 一、 MFU 的硬核数学定义

MFU 的核心计算公式非常直接：

![](https://cdn.nlark.com/yuque/__latex/0d43dd53fbfd2ce67c85ca1915b28e15.svg)

- **分母（理论峰值）：** 就是我们上一节在算力表里看到的“稠密算力”。比如 H100 的 BF16 理论峰值是 989 TFLOPS（每秒 989 万亿次浮点运算）。
- **分子（实际消耗）：** 是算法团队根据模型的参数量、Batch Size 和处理的 Token 数量，严格推算出来的**有效数学计算量**。

### 二、 为什么 MFU 永远达不到 100%？（SRE 的噩梦）

如果你买了一张 H100，你肯定希望它的 MFU 是 100%，也就是它每一秒钟都在以 989 TFLOPS 的满血状态狂飙。

**但在物理现实中，这绝对不可能。** 还记得我们之前聊过的“显卡微观工厂”和“网卡通信”吗？只要 GPU 在干下面这三件事，它的计算核心（Tensor Core）就处于**停机摸鱼**状态，MFU 就会往下掉：

1. **Memory Bound（等显存搬砖）：** 数据正在从 HBM 显存艰难地搬运到 SRAM 工作台上。计算核心在干等。
2. **Communication Bound（等网卡同步）：** 跑分布式训练时，卡与卡之间正在通过 RDMA 网络（AllReduce）对答案、同步梯度。在网卡传完数据之前，计算核心只能干等。
3. **IO Bound（等硬盘加载）：** 固态硬盘读取训练文本（语料库）的速度太慢，GPU 算完了一波，下一波文本还没解压出来。

---

### 三、 工业界的 MFU 真实水位线

作为一个 SRE 或者架构师，当你看到监控大盘上的 MFU 数字时，你的心脏应该有以下几种跳动频率：

- ![](https://cdn.nlark.com/yuque/__latex/d254ed3940bdd530402a0d9dbcaa856b.svg)**：警报拉响，纯属败家。** 说明你的底层系统千疮百孔，要么是网络有严重瓶颈，要么是没有用 FlashAttention 等算子融合技术，算力全浪费在等数据搬运上了。
- ![](https://cdn.nlark.com/yuque/__latex/c446db2de5e042362d0d6d4903fe06b7.svg)**：及格线，大多数公司的常态。** 底层总线和网络配置得比较正常，跑主流的框架（如 Megatron-LM 或 DeepSpeed）基本能达到这个水平。
- ![](https://cdn.nlark.com/yuque/__latex/e0b8ec79b172ecff119f4b3a957ece04.svg)**：业界顶尖水平！** 这是 Meta 跑 Llama 3，或者 OpenAI 跑 GPT-4 时的极致表现。SRE 把通信和计算做了极其完美的重叠（Overlap），压榨干了硬件的最后一丝潜能。
- ![](https://cdn.nlark.com/yuque/__latex/932726feac7ba1a66f56fd7a7affcc20.svg)**：不可能的物理奇迹（或者有人在造假）。** 极少数情况下（比如没有网络通信的纯单卡极简任务），或者有人故意把重计算（Activation Checkpointing）的无效算力也算进了分子里，才会出现这种虚高数字。

**一句话总结：**  
GPU 的纸面算力决定了你能跑多快，但最终跑出来的 **MFU**，才是检验一个 AI 架构师和底层 SRE 功底的唯一真理。
