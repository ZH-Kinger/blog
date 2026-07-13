---
title: Patch
icon: server
date: 2026-07-13
order: 104
category:
  - AI基础设施
tag:
  - AI Infra
---

在计算机视觉（CV）和大模型领域中，**Patch（图像块 / 视觉块）** 是指**将一张完整的二维图像物理切碎后，得到的固定大小的局部像素方块**。

它是多模态大模型和 Vision Transformer (ViT) 架构的**底层通行证**。

---

### 一、 为什么要引入 Patch？（它干掉了什么痛点）

在传统大语言模型（LLM）中，文字被切成一个个 **Token** 送入模型进行处理。然而，图像是连续的像素点（比如一张 ![](https://cdn.nlark.com/yuque/__latex/79a3ec2c2f857e5c297218e7f94785ae.svg) 的图片，包含约 5 万个像素点）。如果直接把每个像素点当作一个 Token 送进 Transformer 算自注意力（Attention），其平方级的计算量（![](https://cdn.nlark.com/yuque/__latex/44987cdf24dd308d34c4c7af30ad5b0b.svg)）会瞬间引爆 GPU 的显存。

为了解决这个算力灾难，谷歌在 2020 年的 ViT 论文中提出了一个极其简单暴力的物理重构手段：**把图片当成文章来读，把 Patch 当成单词（Token）来看**。

#### 🧱 形象的比喻：切拼图

假设有一张 ![](https://cdn.nlark.com/yuque/__latex/79a3ec2c2f857e5c297218e7f94785ae.svg) 像素的静态图片：

1. **进行 Patch 切分**：规定每个 Patch 的尺寸为 ![](https://cdn.nlark.com/yuque/__latex/5c8213948b3250fd57bd3a27a4232c6a.svg) 像素。
2. **算一下数量**：横向可以切 ![](https://cdn.nlark.com/yuque/__latex/10d71524712b8320b84cf031834c98e0.svg) 块，纵向切 ![](https://cdn.nlark.com/yuque/__latex/7465b87894a1bb676ce782e5acb349be.svg) 块。整张图最终被完美切碎成了 ![](https://cdn.nlark.com/yuque/__latex/510be6af7d7e163f9653d54bf2286dae.svg) 个局部的**物理小方块（Patches）**。
3. **效果**：大模型原本要处理 5 万个像素点，现在只需要处理 **196 个 Patch Tokens**。计算量直接暴跌了成百上千倍。

---

### 二、 从物理像素到向量：Patch Embedding 的转化

切碎后的 Patch 依然是三维的像素点矩阵（![](https://cdn.nlark.com/yuque/__latex/4e5511049cd6b49ef52e69ad2bd546de.svg) 通道，共 768 个像素值），计算机同样无法直接理解其语义。这就需要进行 **Patch Embedding（Patch 嵌入）**，在底层通常由一个 2D 卷积核（Conv2d）瞬间完成：

1. **升维映射**：利用一个 `kernel_size=16`、`stride=16`、输出通道数为 768 的 2D 卷积核直接扫过整张图。
2. **展平（Flatten）**：卷积出来的结果在空间维度上直接被拉平，变成一个 ![](https://cdn.nlark.com/yuque/__latex/537c81d3b51a93dc1cffe8602b85d0ca.svg) 的二维数学矩阵。
3. **物理成果**：每一个 ![](https://cdn.nlark.com/yuque/__latex/5c8213948b3250fd57bd3a27a4232c6a.svg) 的局部小方块，至此被彻底压缩并重构为了一个包含局部视觉特征的 **768 维密集实数向量**。大模型（Transformer）就可以像处理文本的 Embedding 一样，在这个矩阵上疯狂运行 Tensor Core 进行自注意力计算了。

---

### 三、 视频场景下的升级：Spatial-Temporal Patch（时空块）

正如我们前面聊过的视频 Tokenization，在处理视频（Video）时，二维的静态 Patch 会直接进化为三维的 **Spatial-Temporal Patch（时空块 / Tubelet）**。

- **2D Patch**：一刀切下去是**一个平面方块（长** ![](https://cdn.nlark.com/yuque/__latex/e0dc12bed73d85d0c6071ab9b5ed4bf3.svg) **宽）**。
- **3D Patch**：一刀切下去是**一个时空立方体（时间帧数** ![](https://cdn.nlark.com/yuque/__latex/e0dc12bed73d85d0c6071ab9b5ed4bf3.svg) **长** ![](https://cdn.nlark.com/yuque/__latex/e0dc12bed73d85d0c6071ab9b5ed4bf3.svg) **宽）**，比如 ![](https://cdn.nlark.com/yuque/__latex/70a39c585908a58f027f9f74cab20a4c.svg)。它不仅包裹了这 16x16 范围内的画面轮廓，还一口气打包锁定了这块画面在连续 4 帧时间内的运动轨迹和光流变化。

---

### 💡 极简总结与补充说明

在大模型时代，**“Patch”就是视觉世界里的“Token”**。它强行将庞大、连续的像素矩阵，降维、切割成了不失局部语义的离散方块，打通了文本与视觉在 Transformer 内部统一计算的桥梁。

*(注：在传统软件工程或 Linux 运维中，patch*\* 还有另一个含义，指“补丁文件”或用 `patch` 命令给代码/内核打补丁升级。但在机器学习和智算领域，它 100% 指的是图像块。)\*
