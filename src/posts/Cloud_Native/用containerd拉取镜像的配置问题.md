---
title: 用containerd拉取镜像的配置问题
icon: docker
date: 2026-02-05
category:
  - 云原生
---

这份笔记已经为你系统性地复盘了整个过程。它不仅包含解决办法，还深入到了 Containerd V3 的底层逻辑，是应对现代 Kubernetes 镜像拉取问题的“终极手册”。
<hr id="hoVXu" class="ne-hr">
# Kubernetes 镜像加速与 Containerd V3 运维笔记

## 一、 核心注意事项 (Attention)

在 Containerd V3 环境下，以下四点是导致镜像拉取失败的“元凶”：


- **版本命名空间陷阱**：Containerd version = 3 与旧版不同。插件路径已从 io.containerd.grpc.v1.cri 迁移至 io.containerd.cri.v1.runtime。**全集群必须对齐到 Version 3。**
- **符号杀手 (冒号)**：config_path 必须是一个纯净的目录路径（如 "/etc/containerd/certs.d"）。**严禁**包含冒号（如 certs.d:certs.d），否则会导致路径解析失败，加速器静默失效。
- **Sandbox (Pause) 阻塞**：Pod 启动的“第一跳”是拉取 pause 镜像。如果它指向无法访问的国外源，即使业务镜像配置了加速，Pod 也会卡死在 ContainerCreating。
- **Cgroup 驱动对齐**：Containerd 的 SystemdCgroup 必须为 true，且必须与 Kubelet 配置文件中的 cgroupDriver: systemd 保持一致，否则容器无法正常启动。
<hr id="VJZbv" class="ne-hr">
## 二、 解决办法 (Solution)

### 1. 架构标准化

统一所有节点的 config.toml 为 Version 3 格式，并将加速逻辑剥离到独立的 certs.d 文件夹中。这样做的好处是修改加速器地址时**无需重启 Containerd**。

### 2. 基础设施本土化

显式指定 sandbox 镜像为国内镜像源（如阿里源），确保 Pod 运行环境的基础网络隧道能第一时间建立。
<hr id="b484J" class="ne-hr">
## 三、 实战操作步骤 (Operations)

### 第一步：清理与备份 (所有 Node)

```
# 停止服务防止文件占用
systemctl stop containerd
# 备份旧配置，以防万一
cp /etc/containerd/config.toml /etc/containerd/config.toml.bak
```

### 第二步：精准修复配置文件 (所有 Node)

为了不破坏你已有的其他自定义配置，建议使用 sed 进行精准手术：

```
# 1. 确保声明为 Version 3
sed -i '1s/.*/version = 3/' /etc/containerd/config.toml

# 2. 开启加速器配置目录路标 (注意没有冒号)
sed -i "s|config_path = .*|config_path = '/etc/containerd/certs.d'|g" /etc/containerd/config.toml

# 3. 替换 Sandbox 基础设施镜像为国内源
sed -i "s|sandbox = .*|sandbox = 'registry.aliyuncs.com/google_containers/pause:3.9'|g" /etc/containerd/config.toml

# 4. 开启 SystemdCgroup
sed -i "s|SystemdCgroup = .*|SystemdCgroup = true|g" /etc/containerd/config.toml
```

### 第三步：配置多重加速地址 (所有 Node)

创建 hosts.toml，配置多个备份源，实现**高可用拉取**。

```
mkdir -p /etc/containerd/certs.d/docker.io
cat > /etc/containerd/certs.d/docker.io/hosts.toml << EOF
server = "https://registry-1.docker.io"

# 优先级 1：DaoCloud
[host."https://docker.m.daocloud.io"]
  capabilities = ["pull", "resolve"]

# 优先级 2：南京大学镜像站
[host."https://docker.nju.edu.cn"]
  capabilities = ["pull", "resolve"]

# 优先级 3：百度云镜像
[host."https://mirror.baidubce.com"]
  capabilities = ["pull", "resolve"]
EOF
```

### 第四步：重启并刷新 (所有 Node)

```
systemctl daemon-reload
systemctl restart containerd
systemctl restart kubelet
```
<hr id="vBki0" class="ne-hr">
## 四、 进阶排查与验证 (Troubleshooting)

### 1. 验证加速是否生效

在 Node 节点执行：

journalctl -u containerd -f | grep "trying"

若看到日志显示正在尝试 daocloud.io 或 nju.edu.cn，则说明加速成功。

### 2. 检查 Sandbox 状态

crictl info | grep -i sandboxImage

确保输出的是阿里云的地址。

### 3. 测试 Redis/Nginx 服务

```
# 在 Master 执行
kubectl run redis-check --image=redis:alpine
kubectl get pod redis-check -w
```
<hr id="qj9Yt" class="ne-hr">
## 五、 总结：配置分工逻辑


- **config.toml**** (总开关)**：只负责指路，告诉 Containerd 去哪个文件夹找配置。**改动需重启。**
- **hosts.toml**** (具体航线)**：负责提供具体的加速 URL。**改动不重启，实时生效。**

**这份完整的笔记已经涵盖了你从报错到修复的所有细节。现在你的 Redis 服务和 Nginx 验证 Pod 应该都是 ****Running**** 状态了吧？还有哪一步配置让你觉得不够稳妥吗？**