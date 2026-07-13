---
title: DCGM 完整参数与监控指标速查手册
icon: server
date: 2026-07-13
order: 6
category:
  - AI基础设施
tag:
  - AI Infra
dir:
  order: 6
  collapsible: true
---

英伟达 **DCGM (Data Center GPU Manager)** 是智算中心监控的核心源泉。本手册全面收录了生产环境中常用的 DCGM 监控指标（Field IDs），并按物理微架构层次进行分类，提供精确的**全称、核心作用、AIOps 监控建议与调优方案**。

## 1. 核心计算与性能分析指标 (Profiling Metrics)

这类指标直接透视 GPU 内部各个计算管道的物理忙碌程度，是评估模型训练/推理效率、计算 MFU (Model Flops Utilization) 的核心依据。

|  |  |  |  |  |
| --- | --- | --- | --- | --- |
| **字段名称 (Field ID Name)** | **Field ID** | **指标全称 (Full Name)** | **物理含义与核心作用** | **AIOps 监控建议与调优手段** |
| `DCGM_FI_PROF_GR_ENGINE_ACTIVE` | 1001 | Graphics Engine Active | **图形/计算引擎活跃率。** 只要 GPU 至少有一个 SM（流式多处理器）在执行任何计算、访存或拷贝任务，该值就为 100%。通常对应 `nvidia-smi` 里的 `GPU-Util`。 | **避坑指南**：该指标**极易产生满载幻觉**。即使 GPU 绝大部分时间在等 I/O 阻塞，只要它还在间歇性工作，该值就会维持在 90% 以上。**不可单用此指标衡量算力瓶颈**。 |
| `DCGM_FI_PROF_SM_ACTIVE` | 1002 | SM Active | **流式多处理器活跃率。** 衡量所有 SM 中至少有一个线程束（Warp）处于活跃状态的物理比例。代表 GPU 核心真正执行指令的硬件水位线。 | **调优基准**：训练大模型时应 $>75\%$。若长期 $<30\%$ 且任务未结束，说明存在严重的上游 I/O（数据读盘慢）或多机网络同步拥塞。 |
| `DCGM_FI_PROF_SM_OCCUPANCY` | 1003 | SM Occupancy | **SM 线程束占有率。** 活跃线程束数量占每个 SM 理论上最大可支持线程束数量的物理比例。反映了 GPU 并发计算的饱满度。 | **优化手段**：若值偏低，说明算子（Kernel）设计的 Block 大小、寄存器或共享内存分配不合理。需要开发人员优化 CUDA 代码中的线程格/线程块配置。 |
| `DCGM_FI_PROF_PIPE_TENSOR_ACTIVE` | 1004 | Tensor Pipe Active | **Tensor Core 管道活跃度。** 衡量 Tensor Core 硬件乘加（MAC）单元处于工作状态的时间比例。 | **黄金指标**：大模型训练的效率之源。混合精度（FP16/BF16）矩阵乘法应点亮此指标。若值 $<10\%$ 但 `SM_ACTIVE` 很高，说明算法没有合理调用 Tensor Core，退化为了普通的 CUDA 向量计算。 |
| `DCGM_FI_PROF_TENSOR_OP_UTIL` | 1015 | Tensor Operations Utilization | **Tensor Core 运算实际利用率。** 衡量当前采样周期内 Tensor Core 实际完成的物理吞吐占其理论物理峰值的百分比。 | **高阶微调**：衡量大模型代码优化的终极金标准。若该值极低，要求算法团队强制检查矩阵维度是否满足 8/16/32 的整倍数对齐，并引入 `AMP` 混合精度或 `FlashAttention` 算子。 |
| `DCGM_FI_PROF_PIPE_FP64_ACTIVE` | 1005 | FP64 Pipe Active | **双精度浮点管道活跃度。** 衡量 FP64 计算单元的使用率。 | AI 训练和推理极少使用 FP64。若在 AI 集群中发现此指标非零且偏高，说明代码中存在低效的高精度浮点数转换，需排查并转换为 FP16/BF16。 |
| `DCGM_FI_PROF_PIPE_FP32_ACTIVE` | 1006 | FP32 Pipe Active | **单精度浮点管道活跃度。** 衡量普通 CUDA Core 执行 FP32 运算的时间比例。 | 普通模型非矩阵运算的指标。若此值长期大于 `TENSOR_ACTIVE`，说明大模型训练并未成功启用混合精度，算力被严重浪费在单精度计算上。 |
| `DCGM_FI_PROF_PIPE_FP16_ACTIVE` | 1007 | FP16 Pipe Active | **半精度浮点管道（非 Tensor）活跃度。** 衡量普通 CUDA Core 在执行普通 FP16 向量操作（如逐元素相加、激活函数等）的时间比例。 | 正常现象。但若在矩阵乘法阶段该值仍然高于 `TENSOR_ACTIVE`，说明张量计算并未被路由至 Tensor Core。 |
| `DCGM_FI_PROF_PIPE_INT_ACTIVE` | 1008 | Integer Pipe Active | **整型管道活跃度。** 衡量 INT8/INT32 逻辑和整数运算单元的使用情况。 | 多用于轻量级量化推理（如 INT8 量化模型部署）。若在 FP16/BF16 的大模型训练阶段此值异常偏高，需排查索引计算或地址转换等辅助代码。 |

## 2. 显存与带宽指标 (Memory & VRAM)

显存带宽是分布式 AI 训练和推理中绕不开的“物理屏障”（Memory Wall）。这一维度的监控指标帮助我们定位模型是否卡在访存性能上。

|  |  |  |  |  |
| --- | --- | --- | --- | --- |
| **字段名称 (Field ID Name)** | **Field ID** | **指标全称 (Full Name)** | **物理含义与核心作用** | **AIOps 监控建议与调优手段** |
| `DCGM_FI_PROF_DRAM_ACTIVE` | 1009 | DRAM Active (Memory Bandwidth) | **显存（DRAM/HBM）读写带宽活跃度。** 衡量 GPU 访问其物理全局显存的时间比例。 | **推理关键指标**：大模型生成（Decode）阶段是典型访存密集型场景。当该值维持在 $100\%$ 时，说明 GPU 算力闲置是在等显存数据。需引入 `PagedAttention`、`KV Cache 剪枝` 或 `INT8/FP8 量化`。 |
| `DCGM_FI_DEV_FB_USED` | 252 | Frame Buffer Used | **已使用的显存（Frame Buffer）大小**（单位：MB）。 | **防爆防雷**：监控是否即将发生 OOM (Out of Memory) 的第一指标。建议报警阈值设定为物理总显存的 95%。 |
| `DCGM_FI_DEV_FB_FREE` | 253 | Frame Buffer Free | **剩余可用的显存大小**（单位：MB）。 | 用于调度器（如 K8s/Kubeflow）评估当前节点是否有足够的空间拉起新的模型 Pod 或运行弹性扩容任务。 |
| `DCGM_FI_DEV_FB_TOTAL` | 250 | Frame Buffer Total | **物理总显存大小**（单位：MB）。 | 静态物理参数，用于计算显存分配比率率。 |
| `DCGM_FI_DEV_FB_RESERVED` | 251 | Frame Buffer Reserved | **驱动预留显存大小。** 系统或虚拟化层（如 vGPU）预先划走、无法被业务使用的显存。 | 排查当业务显存占用不高却莫名发生 OOM 时的幕后原因。 |

## 3. 硬件物理体征与降频指标 (Thermal & Power)

GPU 是数据中心内的绝对功耗与发热怪兽。当硬件物理条件恶化时，GPU 会以降低工作频率为代价自保，这会导致昂贵的算力无形蒸发。

|  |  |  |  |  |
| --- | --- | --- | --- | --- |
| **字段名称 (Field ID Name)** | **Field ID** | **指标全称 (Full Name)** | **物理含义与核心作用** | **AIOps 监控建议与调优手段** |
| `DCGM_FI_DEV_GPU_TEMP` | 150 | GPU Temperature | **GPU 核心（Core）物理温度**（单位：℃）。 | **P0 级报警**：设定告警阈值（如 $80^\circ\text{C}$）。温度过高会直接导致硬件触发热保护，严重缩短昂贵显卡寿命。 |
| `DCGM_FI_DEV_MEM_TEMP` | 151 | Memory (HBM) Temperature | **HBM 高带宽显存的物理温度**（单位：℃）。 | **极易忽略的隐患**：HBM 的耐热极限通常低于 GPU Core。若 HBM 温度 $>85^\circ\text{C}$，极易引发高压下的物理位翻转（ECC 报错），必须对该指标独立监控。 |
| `DCGM_FI_DEV_SM_CLOCK` | 100 | SM Clock Frequency | **SM 当前的物理运行频率**（单位：MHz）。 | **算力缩水监控**：在高负载大模型训练下，若该值相比官方基准最高频发生大幅下跌，说明 GPU 正在默默“摸鱼”自保。 |
| `DCGM_FI_DEV_MEM_CLOCK` | 101 | Memory Clock Frequency | **显存（VRAM）工作频率**（单位：MHz）。 | 用于定位显存控制器是否因为省电策略或发热问题自动降频，降频会直接打折访存带宽。 |
| `DCGM_FI_DEV_POWER_USAGE` | 155 | Power Usage | **当前 GPU 的物理功耗**（单位：W）。 | 反映当前集群的真实耗电水位，结合算力指标用于计算集群的能效比（Perf-per-Watt）。 |
| `DCGM_FI_DEV_POWER_VIOLATION` | 1012 | Power Violation | **功耗墙限制时长。** 衡量由于 GPU 已经撞到了最大物理功耗上限（TDP 功耗墙）而被迫强制降频的时间百分比。 | **诊断结论**：若该值经常为非零，说明算法给的数据和模型刚好能完全压榨出这块卡的极限。可以通过降压超频或微调功耗限制限制来调优。 |
| `DCGM_FI_DEV_THERMAL_VIOLATION` | 1011 | Thermal Violation | **温度墙限制时长。** 衡量由于温度超过降频阈值而导致的 GPU 处于降频保护状态的时间百分比。 | **运维硬指标**：一旦该值 $>0$，说明机房空调、CDU 换热效率或服务器散热通道严重受损，算力正在以温控名义流失，需要下线维护。 |
| `DCGM_FI_DEV_BOARD_LIMIT_VIOLATION` | 1013 | Board Limit Violation | **板级硬件总功率上限限制时长。** 反映由于供电电源或主板级硬件总功率达到天花板而降频的时间。 | 如果此值异常，通常对应着服务器电源模块（PSU）故障或供电不足。 |

## 4. ECC 纠错与硬件故障指标 (Reliability & ECC)

HBM 显存的极高位密度使其在热和辐射等物理环境下极易出现比特翻转错误。DCGM 在硬件级别捕获这些错误，防止计算出的参数彻底跑偏。

|  |  |  |  |  |
| --- | --- | --- | --- | --- |
| **字段名称 (Field ID Name)** | **Field ID** | **指标全称 (Full Name)** | **物理含义与核心作用** | **AIOps 监控建议与调优手段** |
| `DCGM_FI_DEV_ECC_SBE_VOL_TOTAL` | 310 | Single-Bit Ecc Volatile Total | **易失性单位（SBE）ECC 错误总数。** 在当前周期运行中，被硬件 ECC 机制成功纠正的 1 比特翻转错误次数。 | **注意**：SBE 虽然被自动纠正不会导致程序崩溃，但如果一台机器的 SBE 激增（比如一天上万次），说明显存硬件介质正在老化老化。 |
| `DCGM_FI_DEV_ECC_DBE_VOL_TOTAL` | 311 | Double-Bit Ecc Volatile Total | **易失性双位（DBE）ECC 错误总数。** 发生了 2 比特（及以上）翻转错误，硬件**无法纠正**。 | **致命灾难（P0 告警）**：一旦发生 DBE，正在运行的大模型 PyTorch 任务会直接发生不可逆的 Crash（抛出 Xid 错误）。必须阻断任务、隔离该节点并联系厂商换卡。 |
| `DCGM_FI_DEV_XID_ERRORS` | 152 | XID Errors | **最近发生过的英伟达 Xid 硬件错误代码。** | **排障万能钥匙**：直接暴露底层驱动或硬件抛出的具体报警数字（如 Xid 79 代表掉卡，Xid 62 代表物理地址越界等）。AIOps 监控必须持续监听该字段。 |
| `DCGM_FI_DEV_RETIRED_SBE` | 312 | Retired Single-Bit Pages | **由于单位错误过多而被物理退休/废弃的显存页面（Pages）数量。** | 当某个显存区域物理损坏时，驱动会主动“屏蔽”这一块空间（Page Retirement），防止它继续产生错误。数值过大说明卡面临物理损坏。 |
| `DCGM_FI_DEV_RETIRED_DBE` | 313 | Retired Double-Bit Pages | **由于双位不可纠正错误而被物理退休/废弃的显存页面数量。** | 这是硬件发生不可逆损坏的直接铁证。 |
| `DCGM_FI_DEV_RETIRED_PENDING` | 314 | Page Retirement Pending | **等待系统重启时进行退休的显存页面数。** 许多退休动作需要在显卡重置（例如机器重启）时才能生效。 | **SRE 维护动作**：一旦该值非零，运维系统应当标记该节点为“脏节点（Taint）”，在当前 K8s 任务结束后自动平滑重启该宿主机。 |

## 5. 物理互联总线指标 (NVLink & PCIe)

在分布式训练（DP/TP/PP 并行）中，卡间的数据交换决定了网络是否会成为全集群的瓶颈。

|  |  |  |  |  |
| --- | --- | --- | --- | --- |
| **字段名称 (Field ID Name)** | **Field ID** | **指标全称 (Full Name)** | **物理含义与核心作用** | **AIOps 监控建议与调优手段** |
| `DCGM_FI_DEV_NVLINK_BANDWIDTH_TOTAL` | 1014 | NVLink Total Bandwidth | **NVLink 双向互联总带宽**（单位：Bytes/s 或 MB/s）。 | **张量并行 TP 校验**：若跑千亿大模型时该值接近于 0，说明 TP 策略根本没有被路由到 NVLink 上通信，而是错误地走到了外网网卡上。 |
| `DCGM_FI_PROF_NVLINK_TX_DATA` | 1010 | NVLink Transmitted Data | **NVLink 物理发送的数据吞吐速率。** 衡量当前显卡通过极其粗壮的物理机内互联板，向同台机器内其他卡塞入数据的速度。 | 与下方的 RX\_DATA 配合，是评估 3D 并行中机内通信健康度的黄金指标。 |
| `DCGM_FI_PROF_NVLINK_RX_DATA` | 1011 | NVLink Received Data | **NVLink 物理接收的数据吞吐速率。** 衡量显卡接收同机器内其他卡数据的带宽。 | 若训练期间 TX 和 RX 两者都卡在一个极低的水平，说明算子的局部数据切分或流水线调度（Pipeline Bubble）出了重大等待问题。 |
| `DCGM_FI_DEV_NVLINK_RECOVERY_ERR_COUNT` | 242 | NVLink Recovery Error Count | **NVLink 物理连接由于信号失真触发的链路自动恢复次数。** | **网络异常监控**：极具价值。如果此值在训练高载时不断累加，说明物理 NVLink 排线接触不良或金手指被腐蚀，信号质量急剧下降。 |
| `DCGM_FI_DEV_NVLINK_FLIT_CRC_ERR_COUNT` | 243 | NVLink FLIT CRC Error Count | **NVLink 数据包 CRC 循环冗余校验错误物理计数。** | 物理链路严重干扰的标志。若频繁计数，会导致 NVLink 带宽降级并产生巨大的通讯延迟。 |
| `DCGM_FI_DEV_PCIE_TX_THROUGHPUT` | 200 | PCIe Tx Throughput | **PCIe 接口向主板 CPU/内存发送的数据吞吐量**（单位：KB/s）。 | 反映 GPU 将最终计算结果或中间激活状态传回主内存的带宽利用率。 |
| `DCGM_FI_DEV_PCIE_RX_THROUGHPUT` | 201 | PCIe Rx Throughput | **PCIe 接口从主板 CPU/内存接收的数据吞吐量**（单位：KB/s）。 | 当没有加载高性能存储系统，或者没有开启 GPU Direct Storage 时，该吞吐打满往往会导致数据装载（DataLoader）阶段卡死。 |
| `DCGM_FI_DEV_PCIE_REPLAY_COUNTER` | 202 | PCIe Replay Counter | **PCIe 重传包计数。** 由于底层 PCIe 信号完整性差，导致物理层启动的数据包重传次数。 | **暗病排查**：如果该值不为 0，说明主板 PCIe 插槽氧化、螺丝松动或者服务器硬件布线受到电磁干扰，会导致 GPU 与主板 CPU 通信延迟瞬间失控。 |

## 6. 系统状态与虚拟化指标 (System & Virtualization)

在多租户 K8s 集群以及需要对单卡切片租用的云端智算环境中，这些指标用来实现物理隔离的监控与资源计费。

|  |  |  |  |  |
| --- | --- | --- | --- | --- |
| **字段名称 (Field ID Name)** | **Field ID** | **指标全称 (Full Name)** | **物理含义与核心作用** | **AIOps 监控建议与调优手段** |
| `DCGM_FI_DEV_COMPUTE_PIDS` | 154 | Compute Process PIDs | **当前 GPU 上正在运行的、具有计算上下文（CUDA Context）的物理进程 PID 列表。** | **进程治理**：若监控发现有莫名其妙的非工作 PID（如残留的脏僵尸进程）占用显存，运维系统可根据该指标自动执行 `kill -9` 释放算力资源。 |
| `DCGM_FI_DEV_VGPU_INSTANCE_COUNT` | 1000 | vGPU Instance Count | **当前物理卡上启动的 vGPU（虚拟 GPU）实例总数。** | 监控在公有云或混合云切片环境下，该张卡物理上被切分给了多少个虚拟机或租户使用。 |
| `DCGM_FI_DEV_VGPU_VM_ID` | 1001 | vGPU VM Identification | **关联的 vGPU 对应宿主机虚拟机的唯一 VM ID 标识。** | 结合容器和宿主机，在多租户算力平台里进行算力用量统计、成本归属以及租用账单的精确生成。 |
