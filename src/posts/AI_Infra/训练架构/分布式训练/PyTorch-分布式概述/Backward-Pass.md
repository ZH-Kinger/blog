---
title: Backward Pass
icon: server
date: 2026-07-13
order: 48
category:
  - AI基础设施
tag:
  - AI Infra
---

在 PyTorch 和大模型训练中，**Backward Pass（反向传播）** 是整个模型训练生命周期里**最硬核、最烧显存、也最考验分布式网络通信**的绝对核心阶段。

如果说 **Forward Pass（前向传播）** 是模型在“做试卷、猜答案”，那么 **Backward Pass（反向传播）** 就是老师拿着标准答案在“改错题、追究责任、并告诉模型该怎么修正”。

我们直接用最纯粹的 **SRE 物理视角** 和 **数学大白话**，把这个神秘的“反向传播”彻底扒光。

---

## 一、 为什么叫“反向”？（数据的倒车轨迹）

在前向传播时，数据是从输入层开始，一连串矩阵乘法往后算，最后在输出端算出 **Loss（损失值，即猜得有多不准）**。

而 Backward Pass 的核心数学武器是**微积分的“链式法则（Chain Rule）”**。它拿着最终的 Loss，开始**从后往前（从最后一层倒着往第一层）**去计算：**“为了让 Loss 变小，模型里的每一个参数到底该往大调还是往小调？”**

### 举个大白话例子：

假设模型有 3 层：输入 ![](https://cdn.nlark.com/yuque/__latex/33b44e34aa35b8c4ecd0606453ee68e9.svg) A层 ![](https://cdn.nlark.com/yuque/__latex/33b44e34aa35b8c4ecd0606453ee68e9.svg) B层 ![](https://cdn.nlark.com/yuque/__latex/33b44e34aa35b8c4ecd0606453ee68e9.svg) C层 ![](https://cdn.nlark.com/yuque/__latex/33b44e34aa35b8c4ecd0606453ee68e9.svg) 最终Loss。

1. **前向传播（顺车）：** 输入进去，经过 A、B、C 算出了一个很差的答案，Loss 很高。
2. **反向传播（倒车）：** \* 系统先看 C层：“噢，因为 C层 刚才乘以 2 乘多了，导致 Loss 变大。C层 的梯度（修正量）应该记为 -5。”

- 接着根据 C层 倒推 B层：“既然 C层 乘多了，那给 C层 喂数据的 B层 刚才也有责任，B层 的梯度应该记为 -2。”
- 最后倒推 A层……

这种**从输出端倒着一路追究责任到输入端**的过程，就叫 Backward Pass。在这个过程中算出来的“责任修正量”，在数学上就叫做 **Gradient（梯度）**。

---

## 二、 SRE 必知：Backward Pass 是如何吃光显存的？

你在排查 `CUDA Out of Memory`（OOM）时，往往会发现模型一跑前向传播没事，**一进入** `loss.backward()` **这一行代码，显存瞬间像火山爆发一样炸开。**

这是因为 Backward Pass 有一个致命的物理前提：**它必须依赖前向传播的“中间产物”才能算账。**

### 显存暴涨的幕后黑手

在数学上，算导数（求梯度）必须知道当时相乘的两个数是多少。

- 比如前向传播算到某一层：![](https://cdn.nlark.com/yuque/__latex/868d6208f3276ed414287f10f3d77fb7.svg)（![](https://cdn.nlark.com/yuque/__latex/a36915ecf0b5605493f5aeaf1480a9ac.svg) 是模型权重，![](https://cdn.nlark.com/yuque/__latex/94e79ad0c1aabeafef9e2fc4af6adf66.svg) 是输入的激活值）。
- 到了反向传播要算 ![](https://cdn.nlark.com/yuque/__latex/a36915ecf0b5605493f5aeaf1480a9ac.svg) 的梯度时，数学公式规定：![](https://cdn.nlark.com/yuque/__latex/587bb9091b8fc65c9f49652fdc7f05d2.svg)。
- **致命问题：** 为了在反向传播时能用到这个 ![](https://cdn.nlark.com/yuque/__latex/94e79ad0c1aabeafef9e2fc4af6adf66.svg)，PyTorch 在跑前向传播的时候，**必须把全网所有层、所有 Batch 的中间结果** ![](https://cdn.nlark.com/yuque/__latex/94e79ad0c1aabeafef9e2fc4af6adf66.svg)**（Activations 激活值）死死地扣在显存里不准释放！**

这就是为什么我们之前说，在大模型训练中，真正撑爆显存的往往不是模型文件本身，而是在前向传播中攒下来、专门留给 **Backward Pass** 算账用的**海量激活值**。

**SRE 保命大招（重计算）：** 为什么开启 `Activation Checkpointing`（重计算）能救命？因为它的逻辑就是：“前向传播时，我偏不存这些激活值（直接扔掉，释放显存）。等进入 **Backward Pass** 时，GPU 现场原地重新跑一次微型前向传播，把这一层的激活值临时算出来，用完立刻再删掉。” 拿算力换空间！

---

## 三、 分布式战场：Backward Pass 期间的网络风暴

如果你在跑 **DDP（数据并行）** 或 **FSDP2** 多卡训练，Backward Pass 是整个机房网卡最痛苦、流量直接拉出一条直线的恐怖时刻。

因为大模型在分布式训练时，各张卡吃的数据不一样，它们在 Backward Pass 里算出来的梯度（修正量）也完全不同。为了让全网的权重保持步调一致，**GPU 必须在 Backward Pass 期间疯狂互相传小纸条同步梯度**。

### 1. DDP 模式下的 Backward（边算边传的 Overlap 艺术）

正如我们刚才在 **Overlap** 里聊到的，DDP 发明了“梯度分桶”：

- 当 Backward 倒车算到倒数第 3 层，这一层的梯度刚算完，填满了一个 25MB 的桶。
- DDP 会在后台立刻启动 `NCCL AllReduce`，通过 **RDMA** 网络把这个桶发给其他机器对答案。
- **此时，Backward 的倒车还在继续往前开，继续算倒数第 4 层、第 5 层的梯度！** \* 这种“计算”与“通信”在 Backward 阶段的完美重叠，是整个 Infra 架构师的最高追求。

### 2. FSDP2 模式下的 Backward（双重网络轰鸣）

如果在跑最新的 FSDP2，由于模型参数和梯度被大卸八块分在各卡上，Backward 的动作会变得极度高频和复杂：

- **动作一（AllGather）**：Backward 倒车每退回一层，因为本卡没有这一层的完整权重，必须先发起一次 `NCCL AllGather` 向别人要参数，把这一层拼完整。
- **动作二（计算）**：用拼好的参数现场算出这一层的梯度。
- **动作三（ReduceScatter）**：算完梯度后，我不需要全量梯度，我只要属于我负责的那 1/4 碎片。于是立刻发起 `NCCL ReduceScatter`，把属于别人的梯度扔出去，把自己的留下来，然后**当场把这一层的参数和多余梯度再次从显存里抹除**！

---

## 四、 SRE 监控大盘：Backward Pass 时的指标特征

在排障或者看 Grafana 仪表盘时，你如何一眼看出机器正在跑 Backward Pass？

1. **GPU Power（功耗）持续高位轰鸣：** 矩阵求导的计算量极其密集，GPU 芯片会全力运转，功耗直接顶到满载红线（如 400W-700W）。
2. **网卡流量（RDMA/RoCEv2 Traffic）迎来大爆发：** 伴随着 Backward 的倒车轨迹，网络流量会瞬间拉满。因为每一层算完都在疯狂做 `AllReduce` 或者是 `ReduceScatter`。
3. **显存逐渐“卸货”：** 这是一个非常有趣的物理现象。随着 Backward 倒车一路退回第一层，那些一路上被用掉的“前向激活值”完成了历史使命，开始被 PyTorch 批量从显存里垃圾回收（释放）。在监控上看，**显存会经历一个从极其饱和，到反向传播结束时瞬间回落卸载的动态过程**。

**总结一句话：**  
Forward Pass 是大模型显存里**积攒压力（疯狂存激活值）**的阶段，而 **Backward Pass** 则是**释放显存压力、同时把网络带宽（NCCL 通信）彻底干爆**的决战时刻。

现在回看这一整套闭环，你是不是彻底明白为什么算法、网络、显存所有的矛盾，最终都会在 `loss.backward()` 这一行代码里集中爆发了？
