---
title: LeRobot v3
icon: server
date: 2026-07-13
order: 88
category:
  - AI基础设施
tag:
  - AI Infra
---

在具身智能（Embodied AI）的数据工程中，Hugging Face 推出的 **LeRobot** 是一个里程碑式的开源框架。而你提到的 **LeRobot 数据集标准**（目前生态中广泛采用的统一格式），正是为了解决我们上一节聊到的“数据管线 IO 瓶颈”和“多模态时间戳错位”这两个致命痛点而诞生的。

如果说 USD 是 3D 物理仿真世界的标准协议，那么 **LeRobot 数据集格式就是真实世界机器人模仿学习（Imitation Learning）的数据大一统协议**。

站在数据架构师的视角，让我们直接把你刚才那份散装的 `.csv` 和 `.mkv` 数据，代入到 LeRobot 的标准数据集中进行解剖：

### 一、 LeRobot 标准数据集的物理形态

一个被转化好的 LeRobot 标准数据集，在底层文件系统中看起来是非常干净、高度结构化的。它通常由以下几个核心模块构成：

#### 1. `videos/` (视频压缩仓库：干掉小文件碎片)

在 LeRobot 标准中，**绝对不允许**把相机的每一帧存成独立的 `.png` 或 `.jpg`！

- **它的做法：** 把连续的视觉帧（包括你的 `rgb_head.mp4` 和甚至深度图）用高压缩比的视频编码（如 H.264/FFV1）打包成视频文件，按 `episode`（每次开锁任务）存放在这个目录下。
- **架构收益：** 这完美解决了底层文件系统 `inode` 耗尽和随机读取（IOPS）卡死的灾难。GPU 训练时，DataLoader 只需要顺序读取视频流即可。

#### 2. `data/` (Parquet 极速列式存储：状态与动作)

你的 `head_hands_sixdof2.csv` 和 `hands_keypoint_3d.json` 这些骨骼和坐标数据，在 LeRobot 里会被全部转化为 **Apache Parquet** 格式。

- **它的做法：** 将时间戳、机械臂关节角度、末端 6DoF 坐标、以及人类的指令文本，按列（Columnar）紧密排列在 Parquet 文件中。
- **架构收益：** 相比于解析 JSON 或 CSV，Parquet 支持极速的内存映射（Memory Mapping）和切片读取。当你在集群上跑大批量数据时，读取速度能提升 10 倍以上。

#### 3. `info.json` & `meta/` (元数据与标定大脑)

- 这里存放着整个数据集的超参数（比如帧率 30fps）、任务名称（"开挂锁"），以及我们之前强调过的**最致命的相机/IMU 标定矩阵参数（Calibration）**。

---

### 二、 数据是如何在 LeRobot 格式中对齐的？（核心逻辑）

在 LeRobot 的底层数据结构 `hf_dataset` 中，所有模态的数据被强制收束到一条名为 `frame_index` **(帧索引)** 的主轴上。

每一行数据记录（Row）就像一张切片，严丝合缝地包含：

- `observation.images.head`**：** 指向 `videos/` 里头部相机视频的第 N 帧。
- `observation.state`**：** 这一帧时刻，你的手腕 6DoF 坐标和指尖的关键点坐标。
- `action`**：** 在这一帧画面的刺激下，人类（或者专家算法）在下一帧做出的位移指令或电机电流大小。
- `timestamp`**：** 统一后的绝对时间戳。

**这种强制的结构化，保证了“视觉（看到锁孔）”和“动作（旋转钥匙）”在微秒级别上的绝对绑定。**

---

### 三、 工业界闭环：从 LeRobot 到云端算力

当你的散装数据被 Python 脚本（使用 `lerobot.common.datasets` 提供的 API）成功打包成这个标准格式后，整个 AI 基础设施的齿轮就开始飞速运转了：

1. **数据湖挂载：** 你可以直接将这个打包好的 LeRobot 数据集上传到对象存储中。
2. **极速下发：** 当你在火山引擎这样的云平台上启动算力实例时，训练节点可以直接流式（Streaming）拉取这些 Parquet 和视频块，不需要把几百 GB 的数据全部下载到本地硬盘。
3. **大模型微调：** 此时，你可以直接调用 LeRobot 内置的训练脚本，或者将你偏好的 Qwen 模型作为底座接入。DataLoader 会像拧开水龙头一样，把极其规整的 `(图片, 状态, 动作)` 张量源源不断地泵入 GPU 的 SRAM 中，让 Qwen 模型在极高的 MFU（模型算力利用率）下，快速学会如何看懂挂锁并输出 3D 动作指令。

**总结来说：**  
LeRobot 数据集标准，就是一套给多模态原始数据“立规矩”的工程协议。它用极度硬核的存储和对齐方案，把物理世界里那些脏乱差的 CSV 和视频，变成了能让 VLA 大模型直接“大口吞咽”的高效数字口粮。

```
$env:GOOGLE_GEMINI_BASE_URL = "https://ai.wuji.tech/gemini"
$env:GEMINI_API_KEY = "cr_bd414d2312416afe5c9a2095c8de2e96359e7f824a872dcba3ebdd4e8a84e5c9"
$env:GEMINI_MODEL = "gemini-3.5-Flash"
```

```
[System.Environment]::SetEnvironmentVariable("GOOGLE_GEMINI_BASE_URL", "https://ai.wuji.tech/gemini", [System.EnvironmentVariableTarget]::User)
[System.Environment]::SetEnvironmentVariable("GEMINI_API_KEY", "cr_bd414d2312416afe5c9a2095c8de2e96359e7f824a872dcba3ebdd4e8a84e5c9", [System.EnvironmentVariableTarget]::User)
[System.Environment]::SetEnvironmentVariable("GEMINI_MODEL", "gemini-3.5-Flash", [System.EnvironmentVariableTarget]::User)
```
