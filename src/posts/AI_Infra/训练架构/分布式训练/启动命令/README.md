---
title: 启动命令
icon: server
date: 2026-07-13
order: 31
category:
  - AI基础设施
tag:
  - AI Infra
dir:
  order: 31
  collapsible: true
---

在GPU分布式训练中，启动命令取决于你所使用的**分布式训练框架**（如原生 PyTorch、DeepSpeed 还是千亿参数级的 Megatron-LM）。

以下是目前 AI 工业界最常用的 3 种启动命令及其参数配置，以及如何将我们之前聊过的 **NCCL 环境变量**和 **3D 并行策略**优雅地融入到启动脚本中：

---

### 1. 现代 PyTorch 官方标准：`torchrun` (推荐)

`torchrun` 是目前 PyTorch 官方推荐的弹性分布式启动工具（取代了已经废弃的 `torch.distributed.launch`），它能自动处理节点掉线、自动分配进程 Rank，是 K8s 容器化部署的首选。

#### 单机多卡（例如单机 8 卡）

这是最简单的多卡启动，一行命令搞定：

```
torchrun --nproc_per_node=8 train.py --batch_size 32
```

#### 多机多卡（例如 2 台 8 卡服务器，共 16 张 GPU）

你需要分别在两台物理机上运行命令，并且要在启动前**注入我们之前提到过的网络调优环境变量**：

- **在 0号机器 (Master 节点，假设 IP 为** `10.0.0.1`**) 运行：**

```
# 1. 强制注入无损网络和通信调优参数
export NCCL_DEBUG=INFO
export NCCL_IB_GID_INDEX=3
export NCCL_IB_HCA=mlx5_0,mlx5_1,mlx5_2,mlx5_3 # 指定使用的RDMA网卡

# 2. 启动分布式进程
torchrun --nnodes=2 \
         --node_rank=0 \
         --master_addr="10.0.0.1" \
         --master_port=1234 \
         --nproc_per_node=8 \
         train.py --batch_size 32
```

- **在 1号机器 (Worker 节点) 运行：**

```
# 1. 保持一致的网络配置
export NCCL_DEBUG=INFO
export NCCL_IB_GID_INDEX=3
export NCCL_IB_HCA=mlx5_0,mlx5_1,mlx5_2,mlx5_3

# 2. 启动进程（注意将 node_rank 设为 1）
torchrun --nnodes=2 \
         --node_rank=1 \
         --master_addr="10.0.0.1" \
         --master_port=1234 \
         --nproc_per_node=8 \
         train.py --batch_size 32
```

---

### 2. 大模型微调加速器：`deepspeed` 启动

如果你正在使用 Microsoft DeepSpeed（配合其强大的 ZeRO 显存切片技术），它提供了高度封装的命令行工具。

#### 单机多卡启动

```
deepspeed --num_gpus=8 train.py \
          --deepspeed \
          --deepspeed_config ds_config.json
```

#### 多机多卡启动

DeepSpeed 采用极其经典的 `hostfile` 机制。你需要在 Master 节点创建一个名叫 `hostfile` 的文本文件，记录所有机器的 IP 和可用 GPU 数量：

```
# hostfile 内容示例
10.0.0.1 slots=8
10.0.0.2 slots=8
```

然后只需在 Master 节点敲入一行命令，DeepSpeed 会通过 SSH 自动拉起所有机器的训练进程：

```
deepspeed --hostfile=hostfile \
          --master_addr="10.0.0.1" \
          train.py --deepspeed_config ds_config.json
```

---

### 3. 百亿/千亿大模型预训练：Megatron-LM 经典启动（Bash 脚本封装）

在做真正的 LLM 预训练时，由于涉及**张量并行 (TP)** 和 **流水线并行 (PP)** 这种硬核的模型切分，算法工程师通常会写一个 `run.sh` 脚本来管理繁多的参数。

一个工业级标准的 Megatron-LM 启动脚本通常长这样：

```
#!/bin/bash
# ==========================================================
# 1. 底层物理网络与NCCL调优 (SRE保命配置)
# ==========================================================
export NCCL_DEBUG=INFO
export NCCL_IB_DISABLE=0
export NCCL_IB_GID_INDEX=3
export NCCL_BUFFSIZE=16777216  # 拓宽卡间通信环形缓冲区到 16MB

# ==========================================================
# 2. 智算集群节点拓扑配置
# ==========================================================
export GPUS_PER_NODE=8
export MASTER_ADDR=10.0.0.1
export MASTER_PORT=6000
export NNODES=2
export NODE_RANK=0 # 另一台机器上此值需要修改为 1

# ==========================================================
# 3. 3D 并行策略与 Transformer Engine (TE) 配置
# ==========================================================
export TP_SIZE=8           # 张量并行度限制在单机 8 卡内（走极速 NVLink）
export PP_SIZE=2           # 流水线并行度为 2（跨越 2 台物理机）
export FP8_FORMAT=E4M3     # 启用 Hopper 架构的 Transformer Engine FP8 计算

# ==========================================================
# 4. 执行 torchrun 启动大模型训练
# ==========================================================
torchrun \
    --nproc_per_node=$GPUS_PER_NODE \
    --nnodes=$NNODES \
    --node_rank=$NODE_RANK \
    --master_addr=$MASTER_ADDR \
    --master_port=$MASTER_PORT \
    pretrain_gpt.py \
    --tensor-model-parallel-size $TP_SIZE \
    --pipeline-model-parallel-size $PP_SIZE \
    --num-layers 32 \
    --hidden-size 4096 \
    --num-attention-heads 32 \
    --seq-length 2048 \
    --fp8-hybrid \
    --micro-batch-size 4 \
    --global-batch-size 64
```

---

### 💡 云原生 SRE 避坑小贴士：

如果你是在 **K8s 集群（如 Kubeflow 提供的 PyTorchJob）** 中部署训练任务，你**不需要**手动去拼接 `master_addr`、`node_rank` 等参数。

K8s 的 Operator 会自动在各个 Pod 的容器中注入以下环境变量：

- `MASTER_ADDR` / `MASTER_PORT`
- `WORLD_SIZE` (总卡数)
- `RANK` (全局进程ID)

此时，你容器内的启动命令可以极其精简，`torchrun` 会自动识别并接管这些环境变量：

```
torchrun train.py --args...
```
