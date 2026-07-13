---
title: TSDF底层原理
icon: server
date: 2026-07-13
order: 85
category:
  - AI基础设施
tag:
  - AI Infra
---

既然我们要深入到 **TSDF（Truncated Signed Distance Function，截断符号距离函数）** 的最底层，我们就需要抛开表面的概念，直接进入它的数学本质、算法推演以及在 GPU 上的显存工程实践。

TSDF 是目前微软 KinectFusion 及其所有衍生 3D 重建算法（包括各种机器人的实时环境感知系统）的绝对核心。它的出现，本质上是为了解决一个极度复杂的统计学和计算机图形学问题：**如何在充满大量不可预测噪声的连续 2.5D 深度帧中，求导出一个绝对稳定、平滑的 3D 物理表面？**

以下是 TSDF 算法的深度技术解剖：

### 一、 TSDF 的数学本质

我们先从最基础的 SDF 说起，再看它是如何被“截断（Truncated）”的。

#### 1. SDF（符号距离函数）

假设在 3D 空间中有一个真实的物理表面 ![](https://cdn.nlark.com/yuque/__latex/55fc237afbe535f7d8434985b848a6a7.svg)。对于空间中的任意一个点 ![](https://cdn.nlark.com/yuque/__latex/426ef6370889049f0bf0ff324a3bf736.svg)，它的 SDF 值被定义为：该点到表面 ![](https://cdn.nlark.com/yuque/__latex/55fc237afbe535f7d8434985b848a6a7.svg) 的**最短欧几里得距离**。

- 如果 ![](https://cdn.nlark.com/yuque/__latex/2adf48e1cf80858f0604d2b51eeed4b8.svg) 在空气中（物体外部），值为正（![](https://cdn.nlark.com/yuque/__latex/2decd0ea034409c29205a35932b926c0.svg)）。
- 如果 ![](https://cdn.nlark.com/yuque/__latex/2adf48e1cf80858f0604d2b51eeed4b8.svg) 在物体内部，值为负（![](https://cdn.nlark.com/yuque/__latex/eb9b76590953754b0624a46c955af90d.svg)）。
- 如果 ![](https://cdn.nlark.com/yuque/__latex/2adf48e1cf80858f0604d2b51eeed4b8.svg) 恰好在表面上，值为 0。

#### 2. Truncation（截断机制）

真实的物理世界空间无限大，如果我们计算所有空间的 SDF，算力会瞬间崩溃。此外，深度相机只能看到物体的“前表面”，它根本不知道物体背面的 SDF 是多少。  
因此，引入了一个极小的值 ![](https://cdn.nlark.com/yuque/__latex/756a643380ff53c0692dbc2e7e930a35.svg)（通常设置为几厘米，比如 5cm），作为**截断带（Truncation Band）**。

TSDF 的数学定义为：

![](https://cdn.nlark.com/yuque/__latex/e6d325b8a87fae8e2563c4a9a6e17dc5.svg)

- **物理意义：** 我们只关心距离物体表面 ![](https://cdn.nlark.com/yuque/__latex/77050bed4dd2acc9b317b15b8ed6923f.svg) 范围内的薄薄一层空间。在这个带内，距离被线性归一化到了 ![](https://cdn.nlark.com/yuque/__latex/6f2d7acc821a4b49fb6271ec04a220e9.svg)。超出这个范围的空间，TSDF 值直接被强行截断为 1（太远）或 -1（太深），系统不再对它们进行高精度的浮点运算。

---

### 二、 核心算法：TSDF 的加权融合流水线 (Fusion)

深度相机每秒会吐出 30 帧深度图，TSDF 是如何把这 30 帧图像融合成一个 3D 模型的？这是一个极其精妙的投影与加权更新（Projective Update）过程。

假设我们在显存里开辟了一个巨大的 3D 体素网格（Voxel Grid），每个格子 ![](https://cdn.nlark.com/yuque/__latex/e6d60d28f7edfe91c18b5dd1b44349cc.svg) 里存两个值：当前的 ![](https://cdn.nlark.com/yuque/__latex/2d7f8cdf60ea5f73aa52407c19f92764.svg) 值，以及一个权重 ![](https://cdn.nlark.com/yuque/__latex/a36915ecf0b5605493f5aeaf1480a9ac.svg)。

当新的一帧深度图（带有相机的 6DoF 位姿）到来时，算法会在 GPU 上并行执行以下步骤：

#### 第一步：全局到局部的投影 (Projection)

对于显存里的每一个体素 ![](https://cdn.nlark.com/yuque/__latex/15f33db170769d90832e9fa442c03cdd.svg)，利用当前相机的外参矩阵（旋转和平移 ![](https://cdn.nlark.com/yuque/__latex/4dee3c9215c220e1c053e4b2e5cefe2d.svg)）和内参矩阵（焦距等 ![](https://cdn.nlark.com/yuque/__latex/fbd2339328b7567cf8beb0c5239de4f5.svg)），将这个 3D 体素**投影**到当前相机的 2D 像素平面上，找到它对应的像素坐标 ![](https://cdn.nlark.com/yuque/__latex/5491c374963eeab353202bae7eb1b59d.svg)。

#### 第二步：计算瞬时 SDF

在这个 2D 像素 ![](https://cdn.nlark.com/yuque/__latex/5491c374963eeab353202bae7eb1b59d.svg) 处，读取深度相机拍到的真实深度值 ![](https://cdn.nlark.com/yuque/__latex/e7e114e3112bb765309fc96ba91c7141.svg)。  
同时，计算体素 ![](https://cdn.nlark.com/yuque/__latex/e6d60d28f7edfe91c18b5dd1b44349cc.svg) 到相机的理论深度 ![](https://cdn.nlark.com/yuque/__latex/930d2a7230430368e1a3a10466de2142.svg)。  
瞬时的符号距离即为：

![](https://cdn.nlark.com/yuque/__latex/291ac22fa7700ce82cee0ac200c67207.svg)

如果 ![](https://cdn.nlark.com/yuque/__latex/1d6ab64cc48446f4db025a614732a81a.svg)，说明体素在表面前方；如果 ![](https://cdn.nlark.com/yuque/__latex/414d946d5da79b9e66f6e51add0e305f.svg)，说明体素陷入了表面后方。

#### 第三步：状态更新（噪声过滤的终极杀器）

将上述算出的 ![](https://cdn.nlark.com/yuque/__latex/9631b9f5f2bf3b1dd046a3f7a9ea16f5.svg) 经过 ![](https://cdn.nlark.com/yuque/__latex/756a643380ff53c0692dbc2e7e930a35.svg) 截断后，得到这一帧的瞬时 ![](https://cdn.nlark.com/yuque/__latex/9a02c4299bb92f93137e8217189dc3c8.svg)。接下来使用经典的加权平均公式更新体素的全局状态：

![](https://cdn.nlark.com/yuque/__latex/f3ae85a65a78e476baf8d0d4d6e2e869.svg)

![](https://cdn.nlark.com/yuque/__latex/8e8931a11754e8808ff917cb6181cbb3.svg)

- **为什么这能过滤噪声？** 深度相机的噪声是符合高斯分布的随机跳动。当你在同一位置累加了 100 帧数据后，全局的权重 ![](https://cdn.nlark.com/yuque/__latex/a36915ecf0b5605493f5aeaf1480a9ac.svg) 变得非常大。此时即使第 101 帧因为反光出现了一个极其荒谬的噪点，它在加权公式中也会被庞大的历史数据直接“稀释”掉。这就把剧烈闪烁的深度图，变成了一个坚如磐石的 3D 场。

---

### 三、 架构师视角的显存优化战役

在工程落地时，TSDF 最大的敌人是**空间复杂度** ![](https://cdn.nlark.com/yuque/__latex/35eba765a94b1013b883bd710f4f4a5a.svg)。  
如果我们在一个 ![](https://cdn.nlark.com/yuque/__latex/462316b8c0f8e8da24ba0f16853cd588.svg) 的房间里，想要达到 5 毫米精度的 3D 重建，我们需要划分 ![](https://cdn.nlark.com/yuque/__latex/ca36b38de3755c350c401ed7bc1f8a89.svg) 个体素。每个体素存 TSDF 和 Weight（各 16-bit），一瞬间就会吃掉几 GB 到十几 GB 的显存。而房间里 99% 的空间都是空的（空气）。

为了把 TSDF 塞进普通的 GPU 或边缘计算设备，业界演化出了极度硬核的数据结构：

#### 1. 八叉树 (Octree)

将 3D 空间不断八等分。如果一个区域里全是空气，或者全在物体极深处，就不再往下细分。只有在 TSDF 零交叉点（表面）附近，才将格子切分到最细。这种方法大幅压缩了内存，但指针跳转会导致 GPU 并行计算效率下降。

#### 2. Voxel Hashing (体素哈希)

这是由 Niessner 等人提出的神级优化（目前多数现代重建管线的底层逻辑）。  
不再维护一个巨大的 3D 数组，而是只在物体表面附近分配 ![](https://cdn.nlark.com/yuque/__latex/d7e38d52a1deea7af316ae89868da8c7.svg) 的“体素块（Voxel Blocks）”。系统维护一个巨大的哈希表（Hash Table）。GPU 计算时，通过空间坐标算出一个 Hash 值，用 ![](https://cdn.nlark.com/yuque/__latex/a2006f1ac61cb1902beacb3e29fff089.svg) 的时间复杂度瞬间找到对应的体素块。这让大场景的实时高精度 TSDF 重建成为可能。

---

### 四、 从 TSDF 到物理网格的终跃

经过成百上千帧的加权融合，GPU 显存里现在有了一个完美的 TSDF 场。但物理引擎（如 PhysX、MuJoCo）依然不认识它，物理引擎只认识顶点和三角形。

最后一步，是运行 **Marching Cubes（移动立方体）算法** 或 **Raycasting（光线投射）**：  
遍历所有的体素，寻找 TSDF 值从正数变为负数的相邻格子（这意味着恰好穿过了表面）。算法在这些格子的连线上进行线性插值，精确计算出 0 值所在的精确 3D 坐标，并在这些坐标上自动生成三角面片（Mesh）。

至此，冰冷的传感器电流，彻底变成了一个可以在虚拟元宇宙中进行碰撞、抓取和重力计算的数字孪生物体。
