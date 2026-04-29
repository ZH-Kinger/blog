---
title: K8s
icon: docker
date: 2026-02-02
category:
  - 云原生
---

简单来说，**Kubernetes**（通常简称为 **K8s**，因为 K 和 s 之间有 8 个字母）是一个开源的**容器编排平台**。

如果把 Docker 容器比作一只只“运货的集装箱”，那么 K8s 就是那台巨大的“自动化起重机”和“港口调度系统”。
<hr id="MjWFJ" class="ne-hr">
# 部署Kubernetes+docker

## 1. 为什么需要 K8s？

在只有几个容器时，手动管理很简单。但当你有成百上千个容器在几十台服务器上运行，且需要处理升级、扩容、宕机恢复时，靠人工是不可能的。K8s 解决了以下痛点：


- **自动化部署与回滚**：你只需要告诉 K8s “我要运行 5 个版本的 A 应用”，它会自动帮你部署。如果更新出错了，它能一键退回。
- **自我修复 (Self-healing)**：如果某个容器挂了，K8s 会立即发现并重启一个新的；如果某台服务器坏了，它会把上面的容器搬到其他健康的机器上。
- **水平伸缩 (Scaling)**：根据流量大小，自动增加或减少容器的数量。
- **负载均衡**：它会自动给一组容器分配统一的 IP 和域名，并平衡进入的流量。

k8s本质上就是一个管理容器的软件

![](https://cdn.nlark.com/yuque/0/2026/png/62301513/1770173006549-1dba9305-079e-42d8-8ce9-32969f14dd34.png)

### k8s里有非常经典的3大接口
<table id="rThpz" class="ne-table" style="width: 748px"><tbody><tr style="height: 33px"><td width="187">
**接口**
</td><td width="187">
**负责什么**
</td><td width="187">
**通俗理解**
</td><td width="187">
**典型插件**
</td></tr><tr style="height: 33px"><td width="187">
**CRI** (运行时)
</td><td width="187">
**怎么跑容器？**
</td><td width="187">
就像电脑的**CPU插槽**，不论是 Intel 还是 AMD，只要接口对就能跑。
</td><td width="187">
containerd, CRI-O
</td></tr><tr style="height: 33px"><td width="187">
**CNI** (网络)
</td><td width="187">
**怎么通信？**
</td><td width="187">
就像电脑的**网卡驱动**，决定了你是走拨号、光纤还是 5G。
</td><td width="187">
Flannel, Calico
</td></tr><tr style="height: 33px"><td width="187">
**CSI** (存储)
</td><td width="187">
**数据存哪？**
</td><td width="187">
就像电脑的**USB接口**，你可以插 U 盘、移动硬盘或外接阵列。
</td><td width="187">
Ceph, NFS, 云硬盘
</td></tr></tbody></table>
核心组件

# 

kube-apiserver：

etcd：是一个数据库软件的名字 --》key：value --》go语言开发一致且高可用的键值存储，用作Kubernetes所有集群数据后台数据库。

scheduler：调度器 --》安排我们需要启动的pod到那个node上去运行，有哪些调度策略/方法

controller-manager		控制器管理员

## 一些常用的kubernetes命令

## 虚拟机配置

### 为所有虚拟机器配置防火墙

```
#禁用firewalld和selinux
systemctl stop firewalld
systemctl disable firewalld
```

### 关闭selinux和防火墙

```
setenforce 0
sed -i '/^SELINUX=/ s/enforcing/disabled/' /etc/selinux/config
```

### 配置静态ip

```
ip add										#先查看你的网卡信息
ip route									#查看你的网关
```

```
nmcli con mod "ens160" \						#填你的网卡名
ipv4.method manual \								#修改为手动模式
ipv4.addresses "192.168.1.8/24" \		#修改为你预留的ip地址
ipv4.gateway "192.168.1.1" \				#修改为你之前ip route看到的网关地址
```

### 添加ip映射（每个机器都需要脚本没有写）

```
vi /etc/hosts
```

末尾添加以下内容

```
192.168.245.143 master-1
192.168.245.144 node-1
192.168.245.145 node-2
```

### 配置 Docker 加速器（每个节点）

### 1. 修改/创建 Docker 配置文件

Docker 的官方配置文件位于 /etc/docker/daemon.json。如果该文件不存在，直接创建；如果已存在，则修改其内容。

```
# 1. 创建目录
sudo mkdir -p /etc/docker

# 2. 写入加速器配置
sudo tee /etc/docker/daemon.json <<EOF
{
  "registry-mirrors": [
    "https://docker.m.daocloud.io",
    "https://hub-mirror.c.163.com",
    "https://mirror.baidubce.com",
    "https://docker.land007.top"
  ],
  "exec-opts": ["native.cgroupdriver=systemd"]
}
EOF
```

**注意**："exec-opts": ["native.cgroupdriver=systemd"] 是 Kubernetes 集群必需的配置，它能确保 Docker 和 Kubelet 使用相同的 Cgroup 驱动，防止集群崩溃。
<hr id="f8XZl" class="ne-hr">
#### 2. 重启 Docker 服务

配置写入后，必须重新加载配置并重启服务才能生效。

```
# 1. 重新加载系统配置
sudo systemctl daemon-reload

# 2. 重启 Docker
sudo systemctl restart docker
```
<hr id="MLJdn" class="ne-hr">
#### 3. 验证是否配置成功

执行以下命令，查看输出信息中的 Registry Mirrors 部分：

```
docker info | grep -A 5 "Registry Mirrors"
```

**预期输出：**

```
Registry Mirrors:
  https://docker.m.daocloud.io/
  https://hub-mirror.c.163.com/
  https://mirror.baidubce.com/
  https://docker.land007.top/
```

### 机器初始化脚本（关闭selinux和防火墙，配置静态ip）

```
#!/bin/bash

# 1. 修改主机名
read -p "请输入这台机器的主机名 (例如 node-1): " NEW_HOSTNAME
if [ -n "$NEW_HOSTNAME" ]; then
    hostnamectl set-hostname "$NEW_HOSTNAME"
    echo "主机名已修改为: $NEW_HOSTNAME"
else
    echo "未输入主机名，保持原样。"
fi

# 2. 禁用防火墙和 SELinux
echo "--- 正在处理防火墙和 SELinux ---"
systemctl stop firewalld
systemctl disable firewalld
setenforce 0
sed -i '/^SELINUX=/ s/enforcing/disabled/' /etc/selinux/config

# 3. 自动检测网络环境
IFACE=$(ip -o link show | awk -F': ' '{print $2}' | grep -vE 'lo|docker|cni|veth|cali' | head -n 1)
GATEWAY=$(ip route | grep default | awk '{print $3}')

# 4. 交互式配置静态 IP
echo "检测到默认网卡: $IFACE"
read -p "请输入静态 IP (当前网关 $GATEWAY): " TARGET_IP
read -p "请输入掩码长度 (默认 24): " NETMASK
NETMASK=${NETMASK:-24}

if [ -n "$TARGET_IP" ]; then
    nmcli con mod "$IFACE" \
        ipv4.method manual \
        ipv4.addresses "$TARGET_IP/$NETMASK" \
        ipv4.gateway "$GATEWAY" \
        ipv4.dns "114.114.114.114,8.8.8.8"
    nmcli con up "$IFACE"
    echo "静态 IP $TARGET_IP 配置成功！"
else
    echo "跳过 IP 配置。"
fi

# 5. K8s 内核参数优化 (重要)
echo "--- 正在优化 K8s 内核参数 ---"
cat <<EOF > /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-iptables  = 1
net.bridge.bridge-nf-call-ip6tables = 1
net.ipv4.ip_forward                 = 1
EOF
sysctl --system

echo "------------------------------------------------"
echo "基础环境配置完成！"
echo "当前主机名: $(hostname)"
echo "当前 IP 地址: $(ip addr show $IFACE | grep 'inet ' | awk '{print $2}')"
echo "------------------------------------------------"
```

## docker安装

### 镜像下载docker

```
#先安装一些docker的必要依赖
yum install -y yum-utils device-mapper-persistent-data lvm2  
#添加阿里云Docker源（国内下载快） 
yum-config-manager --add-repo https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo  
#安装最新版Docker 
yum install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin 
```

### 设置systemctl管理

```
#启动并设置开机自启 
systemctl start docker&& systemctl enable docker
验证安装
#docker --version
```

![](https://cdn.nlark.com/yuque/0/2026/png/62301513/1770038471657-db5244ff-1085-44a1-8a8c-1c2072c89d6e.png)

## cri-docker源码安装

去官方网站获取压缩包[https://github.com/Mirantis/cri-dockerd/releases](https://github.com/Mirantis/cri-dockerd/releases)，

https://github.com/Mirantis/cri-dockerd/releases/download/v0.3.23/cri-dockerd-0.3.23.amd64.tgz

上传文件到虚拟机

### 1、准备二进制文件

**确保你的可执行文件位于正确路径，并拥有运行权限。**

```
# 赋予执行权限
chmod +x /root/cri-dockerd/cri-dockerd
```
<hr id="KrZZG" class="ne-hr">
### 2、创建 Socket 文件

**Socket 文件负责定义 Kubernetes 与 Docker 通信的端点。**


- **文件路径****：****/etc/systemd/system/cri-docker.socket**
- **配置内容：**

```
[Unit]
Description=Docker Systemd Container Runtime Interface Socket
PartOf=cri-docker.service

[Socket]
# Kubernetes 访问 Docker 的通信路径
ListenStream=/var/run/cri-dockerd.sock

[Install]
WantedBy=sockets.target
```
<hr id="IRHRC" class="ne-hr">
### 3、创建 Service 服务文件

**该文件定义了后台进程的启动参数和依赖关系。**


- **文件路径****：****/etc/systemd/system/cri-docker.service**
- **配置内容：**

```
[Unit]
Description=Docker Systemd Container Runtime Interface
After=network-online.target docker.service
Requires=cri-docker.socket

[Service]
Type=notify
# 重点：这里使用绝对路径指向你当前的位置
ExecStart=/root/cri-dockerd/cri-dockerd --container-runtime-endpoint fd:// --pod-infra-container-image=registry.aliyuncs.com/google_containers/pause:3.10
# 如果程序需要读取当前目录下的配置文件，建议加上这一行
WorkingDirectory=/root/cri-dockerd/
ExecReload=/bin/kill -s HUP $MAINPID
TimeoutSec=0
RestartSec=2
Restart=always

[Install]
WantedBy=multi-user.target

```
<hr id="PZWzp" class="ne-hr">
### 4、启动并验证服务

**按照以下顺序执行命令以生效配置：**

```
# 1. 重新加载 systemd 守护进程
systemctl daemon-reload

# 2. 启用并立即启动 Socket
systemctl enable --now cri-docker.socket

# 3. 启用并立即启动 Service
systemctl enable --now cri-docker.service

# 4. 检查运行状态
systemctl status cri-docker
```

### cri-docker总结
<table id="eJ7E2" class="ne-table" style="width: 750px"><tbody><tr style="height: 33px"><td width="375">
**检查点**
</td><td width="375">
**描述**
</td></tr><tr style="height: 33px"><td width="375">
**绝对路径**
</td><td width="375">
ExecStart

必须指向 /root/cri-dockerd/cri-dockerd

。
</td></tr><tr style="height: 33px"><td width="375">
**依赖关系**
</td><td width="375">
Service

依赖于 Socket

，必须确保 Socket 先启动。
</td></tr><tr style="height: 33px"><td width="375">
**权限**
</td><td width="375">
二进制文件必须有 +x

权限，否则会报 Permission denied

。
</td></tr></tbody></table>
## Kubernetes安装

### 1. 配置 Kubernetes Yum 源

**国内环境建议使用阿里云镜像源，速度最快：**

```
cat <<EOF | tee /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://mirrors.aliyun.com/kubernetes-new/core/stable/v1.35/rpm/
enabled=1
gpgcheck=1
gpgkey=https://mirrors.aliyun.com/kubernetes-new/core/stable/v1.35/rpm/repodata/repomd.xml.key
EOF
```

### 2. 安装 K8s 核心三件套

```
# 安装最新版
yum install -y kubelet kubeadm kubectl

# 设置 kubelet 开机自启（现在还起不来，因为没初始化，但要设为 enable）
systemctl enable kubelet
```

### 3. 初始化集群（最关键的一步）

**这一步必须告诉 ****kubeadm**** 使用你刚才配置好的 ****cri-dockerd****。**

**执行初始化命令：**

**Bash**

```
kubeadm init \
  --apiserver-advertise-address=$(hostname -I | awk '{print $1}') \
  --image-repository registry.aliyuncs.com/google_containers \
  --kubernetes-version v1.35.0 \
  --cri-socket unix:///var/run/cri-dockerd.sock \
  --pod-network-cidr=10.244.0.0/16
```

**参数解释：**


- **--cri-socket****: 必须指向 ****/var/run/cri-dockerd.sock****，否则它会去找默认的 containerd。**
- **--image-repository****: 使用阿里云镜像源，避免被墙。**
- **--pod-network-cidr****: 这是给 Flannel 等网络插件预留的地址段。**
<hr id="MY24y" class="ne-hr">
### 4. 必备的小工具：conntrack

**还记得刚才 ****cri-dockerd**** 日志里的警告吗？在初始化前，最好把这个装上：**

```
yum install -y conntrack-tools
```
<hr id="I0fuU" class="ne-hr">
## 关闭分区

### 1. 关闭 Swap（内存交换分区）

**为什么要关？** Kubernetes 的调度器（Scheduler）在分配资源时，是假设你的物理内存是“实打实”的。如果允许使用 Swap，当物理内存不足时，系统会把数据存到磁盘上，这会导致程序运行速度极度变慢，且会让 Kubelet 无法准确判断节点的压力情况。

**操作步骤：**

```
# 临时关闭（立即生效，重启后失效）
swapoff -a

# 永久关闭（防止重启后又开了）
# 使用 sed 命令直接注释掉 /etc/fstab 中包含 swap 的那一行
sed -i '/swap/s/^\(.*\)$/#\1/g' /etc/fstab
```
<hr id="Cojsr" class="ne-hr">
### 2. 开启内核转发（IP Forwarding）

**为什么要开？** Kubernetes 本质上是一个复杂的虚拟网络。Pod 运行在不同的节点上，它们之间的通信需要通过 Linux 内核进行数据包的转发。如果不开启，你的 Pod 可能连外网都上不了，甚至 Node 之间都无法通信。

**操作步骤：**

```
# 1. 创建转发配置文件
cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-iptables  = 1
net.bridge.bridge-nf-call-ip6tables = 1
net.ipv4.ip_forward                 = 1
EOF

# 2. 立即应用配置
sysctl --system
```
<hr id="qnhZ3" class="ne-hr">
### 3. 安装 conntrack

**为什么要装？**conntrack（Connection Tracking）是 Linux 内核用于跟踪网络连接状态的工具。Kubernetes 的 Service（比如负载均衡）重度依赖 iptables 或 IPVS 规则，而这些规则需要 conntrack 来追踪数据包到底属于哪个连接。

如果你不装，你会发现 cri-dockerd 日志里一直在报错，且 K8s 的网络服务会变得极其不稳定。

**操作步骤：**

```
# CentOS / RHEL / AlmaLinux
yum install -y conntrack-tools

# Ubuntu / Debian
# apt-get install -y conntrack
```
<hr id="XO4H4" class="ne-hr">
### 总结：如何验证？

配置完这三项后，你的机器就从“普通服务器”变身为“准 K8s 节点”了。


- **验证 Swap**：输入 free -h，看到 Swap 那一行显示为 0B 即可。
- **验证转发**：输入 sysctl net.ipv4.ip_forward，看到 = 1 即可。
- **验证 conntrack**：输入 conntrack --version，有输出版本号即可。

## init集群初始化（仅在master节点执行）

### 初始化

```
kubeadm init \
  --apiserver-advertise-address=<你master节点的ip> \				
  --image-repository registry.aliyuncs.com/google_containers \
  --kubernetes-version v1.35.0 \
  --cri-socket unix:///var/run/cri-dockerd.sock \
  --pod-network-cidr=192.168.0.0/16
```

### 成功执行后会得到

![](https://cdn.nlark.com/yuque/0/2026/png/62301513/1770039224593-a5ec79e0-1643-4776-8db4-af7c33fa7f27.png)

### 记住你的token和256

```
kubeadm join 192.168.245.143:6443 --token 2fbmo4.jolz018zlx9rmzd1 \
	--discovery-token-ca-cert-hash sha256:b63a2cf1e05115f8260a81afc4198b98653ecf4e5f7dc60a539225afe0e2c3f0 
```

### 创建配置目录并给用户执行权限（在master节点上执行）

```
# 创建配置目录
mkdir -p $HOME/.kube

# 拷贝集群管理配置文件到当前用户目录下
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config

# 赋予当前用户对配置文件的读写权限
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

### 将node节点加入集群

```
# 在 Node 节点上运行（请替换为你自己的 token 和 hash）
kubeadm join 192.168.245.143:6443 --token 1q9lrd.wy04lh4odezywttl \
    --discovery-token-ca-cert-hash sha256:b63a2cf1e05115f8260a81afc4198b98653ecf4e5f7dc60a539225afe0e2c3f0 \
    --cri-socket unix:///var/run/cri-dockerd.sock
```

### 添加成功的标志

```
kubectl get nodes						#查看节点信息
```

![](https://cdn.nlark.com/yuque/0/2026/png/62301513/1770039707672-200a240e-d9dd-4cf4-b2ca-fb9a9069c554.png?x-oss-process=image%2Fcrop%2Cx_0%2Cy_0%2Cw_431%2Ch_104)

现在还是Notready的状态，需要配置网络插件

### 在 Worker 节点（k8s-node-2）上配置 kubectl 命令行工具的访问权限。

简单来说，你在把 Master 节点的“钥匙”复制到 Node 节点上，这样你在 Node 节点上也能直接运行 kubectl get nodes 等命令来管理集群了。
<hr id="SDt6I" class="ne-hr">
#### 具体步骤解析：


- **创建目录**：mkdir -p $HOME/.kube


- 在当前用户（root）家目录下创建一个隐藏文件夹 .kube，这是 kubectl 默认读取配置的地方。


- **远程拷贝配置文件 (scp)**：scp k8s-master-1:/etc/kubernetes/admin.conf /root/.kube/config


- 从主节点（k8s-master-1）把集群的**最高权限配置文件**admin.conf 拷贝过来，并重命名为 config。
- **核心原理**：这个 config 文件包含了集群 API Server 的地址以及用于身份验证的证书。没有它，kubectl 就像没有账号密码的客户端，连不上集群。


- **修改权限 (chown)**：chown $(id -u):$(id -g) $HOME/.kube/config


- 将配置文件的所有者修改为当前用户和当前组。虽然你现在是用 root 操作，但这是一个标准的官方推荐动作，确保当前用户有权读写这个“钥匙”。

<hr id="lCRnS" class="ne-hr">
#### 这样做的目的是什么？

通常情况下，只有 Master 节点能执行 kubectl 命令。你完成这些操作后，**k8s-node-2** 就变成了一个“管理终端”。

## 安装Calico网络插件

### 1. 基础环境准备

在应用 YAML 之前，所有节点（Master & Nodes）必须确保：


- **禁用防火墙**：systemctl stop firewalld && systemctl disable firewalld
- **禁用 Swap**：swapoff -a
- **内核转发**：net.bridge.bridge-nf-call-iptables 设置为 1。

**清理残留**（如果曾安装过其他插件）：

```
rm -rf /etc/cni/net.d/*
rm -rf /var/lib/calico
```
<hr id="Yjypw" class="ne-hr">
### 2. 下载 Calico 的官方定义文件

```
curl -O https://raw.githubusercontent.com/projectcalico/calico/v3.25.0/manifests/calico.yaml
```

或者直接复制这个文件

[📎calico.yaml](https://www.yuque.com/attachments/yuque/0/2026/yaml/62301513/1770051399180-7fb1f41b-c40a-47b9-8fcc-991f11217d02.yaml)

### 3.修改calico.yaml文件的下载源

```
# 1. 确保你在 calico.yaml 所在的目录
# 2. 替换所有可能的镜像前缀（覆盖 docker.io, quay.io 以及你之前的阿里云错地址）
sed -i 's|docker.io/calico/|docker.m.daocloud.io/calico/|g' calico.yaml
sed -i 's|quay.io/calico/|docker.m.daocloud.io/calico/|g' calico.yaml
sed -i 's|registry.cn-hangzhou.aliyuncs.com/google_containers|docker.m.daocloud.io/calico|g' calico.yaml

# 3. 重新安装 Calico
kubectl apply -f calico.yaml
```

## 二、Calico 配置与解决办法总结

### 1. 镜像准备：手动“投喂”策略

既然自动拉取不通，我们采用 **“先拉取代理源、后伪装官方名”** 的策略。

**在集群所有节点执行：**

```
# 1. 定义需要拉取的镜像列表
# cni, node, kube-controllers, pod2daemon-flexvol

# 2. 从国内代理源拉取 (以 v3.25.0 为例)
docker pull m.daocloud.io/docker.io/calico/node:v3.25.0
docker pull m.daocloud.io/docker.io/calico/cni:v3.25.0
docker pull m.daocloud.io/docker.io/calico/kube-controllers:v3.25.0
docker pull m.daocloud.io/docker.io/calico/pod2daemon-flexvol:v3.25.0

# 3. 核心步骤：根据 kubectl describe 看到的具体需求进行打标 (Tag)
# 必须完全匹配 YAML 里的 image 字段
docker tag <镜像ID> registry.cn-hangzhou.aliyuncs.com/google_containers/node:v3.25.0
docker tag <镜像ID> registry.cn-hangzhou.aliyuncs.com/google_containers/cni:v3.25.0
# ...以此类推
```

### 2. 配置文件修正


- **CIDR 匹配**：确保 calico.yaml 中的 CALICO_IPV4POOL_CIDR 字段与 kubeadm init 时的 --pod-network-cidr 完全一致（通常是 10.244.0.0/16 或 172.16.0.0/16）。
- **网卡识别**：如果服务器有多块网卡，需在 YAML 中添加 IP_AUTODETECTION_METHOD 过滤，防止 Calico 绑定到错误的 IP 上。

### 3. 运行时维护常用命令


- **查看详细报错**（镜像问题的照妖镜）：

kubectl describe pod <pod名> -n kube-system


- **强制刷新 Pod**（打完 Tag 后手动触发）：

kubectl delete pod <pod名> -n kube-system


- **移除 Master 污点**（让插件能在 Master 运行）：

kubectl taint nodes --all node-role.kubernetes.io/control-plane-
<hr id="C2viN" class="ne-hr">
### 三、 终极避坑
<table id="sMd61" class="ne-table" style="width: 750px"><tbody><tr style="height: 33px"><td width="375">
**检查项**
</td><td width="375">
**操作目的**
</td></tr><tr style="height: 33px"><td width="375">
**Docker 加速器**
</td><td width="375">
确保 /etc/docker/daemon.json

配置了国内镜像源。
</td></tr><tr style="height: 33px"><td width="375">
**镜像全量性**
</td><td width="375">
确认 node

, cni

, controllers

, flexvol

四个镜像是否都已就位。
</td></tr><tr style="height: 33px"><td width="375">
**标签一致性**
</td><td width="375">
docker images

看到的名字必须和 kubectl describe

看到的一字不差。
</td></tr><tr style="height: 33px"><td width="375">
**节点全覆盖**
</td><td width="375">
每一个 Node 节点都要手动重复一遍镜像 Tag 操作。
</td></tr></tbody></table>
#### 常见状态
<table id="LBugI" class="ne-table" style="width: 750px"><tbody><tr style="height: 33px"><td width="250">
**状态 (Status)**
</td><td width="250">
**核心原因**
</td><td width="250">
**解决方法**
</td></tr><tr style="height: 33px"><td width="250">
**ImagePullBackOff**
</td><td width="250">
镜像地址不对或网络不通
</td><td width="250">
检查 describe pod

中的镜像地址；在对应节点手动 docker pull
</td></tr><tr style="height: 33px"><td width="250">
**Init:Error**
</td><td width="250">
初始化脚本执行失败
</td><td width="250">
查看日志：kubectl logs <code>&lt;pod&gt;</code> -n kube-system -c install-cni
</td></tr><tr style="height: 33px"><td width="250">
**Init:Error (flexvol)**
</td><td width="250">
宿主机路径不存在
</td><td width="250">
设置环境变量 FLEXVOL_DIR=none

或直接从 YAML 中删除 flexvol

容器
</td></tr><tr style="height: 33px"><td width="250">
**CrashLoopBackOff**
</td><td width="250">
控制器连不上 API Server
</td><td width="250">
检查 calico-node

是否全部 Ready (1/1)；检查 Master 节点网络
</td></tr></tbody></table>
## Kubectl 运维实战命令速查表

### 1. 核心查看 (Get) — 集群监控
<table id="wNZJY" class="ne-table" style="width: 750px"><tbody><tr style="height: 33px"><td width="250">
**命令**
</td><td width="250">
**功能描述**
</td><td width="250">
**常用参数**
</td></tr><tr style="height: 33px"><td width="250">
kubectl get nodes
</td><td width="250">
查看节点状态（Ready/NotReady）
</td><td width="250">
-o wide

(查看 IP/内核)
</td></tr><tr style="height: 33px"><td width="250">
kubectl get pods
</td><td width="250">
查看当前 Namespace 下的 Pod
</td><td width="250">
-A

(所有空间), -w

(持续监听)
</td></tr><tr style="height: 33px"><td width="250">
kubectl get svc
</td><td width="250">
查看 Service（映射端口/ClusterIP）
</td><td width="250">
--show-labels
</td></tr><tr style="height: 33px"><td width="250">
kubectl get deploy
</td><td width="250">
查看控制器（副本数/可用数）
</td><td width="250">
-n <code>&lt;namespace&gt;</code>
</td></tr><tr style="height: 33px"><td width="250">
kubectl get events
</td><td width="250">
查看集群最近的事件（排错神器）
</td><td width="250">
--sort-by='.lastTimestamp'
</td></tr></tbody></table>
### 2. 深度诊断 (Debug) — 故障排查
<table id="bMrun" class="ne-table" style="width: 750px"><tbody><tr style="height: 33px"><td width="250">
**命令**
</td><td width="250">
**功能描述**
</td><td width="250">
**场景技巧**
</td></tr><tr style="height: 33px"><td width="250">
kubectl describe po <code>&lt;name&gt;</code>
</td><td width="250">
查看资源详情和**系统事件**
</td><td width="250">
镜像拉不动、调度失败时必看
</td></tr><tr style="height: 33px"><td width="250">
kubectl logs <code>&lt;name&gt;</code>
</td><td width="250">
查看容器输出的**程序日志**
</td><td width="250">
-f

(流式), --tail 100

(末尾 100 行)
</td></tr><tr style="height: 33px"><td width="250">
kubectl exec -it <code>&lt;name&gt;</code> -- sh
</td><td width="250">
**进入容器**内部交互
</td><td width="250">
测试网络连通性或查看内部配置
</td></tr><tr style="height: 33px"><td width="250">
kubectl logs <code>&lt;name&gt;</code> -c <code>&lt;container&gt;</code>
</td><td width="250">
查看多容器 Pod 中的指定容器日志
</td><td width="250">
当 Pod 含有 Sidecar 时使用
</td></tr><tr style="height: 33px"><td width="250">
kubectl top pod/node
</td><td width="250">
查看资源占用 (CPU/内存)
</td><td width="250">
需安装 Metrics Server
</td></tr></tbody></table>
### 3. 资源操纵 (Action) — 状态变更
<table id="wxtfh" class="ne-table" style="width: 803px"><tbody><tr style="height: 33px"><td width="303">
**命令**
</td><td width="250">
**功能描述**
</td><td width="250">
**场景技巧**
</td></tr><tr style="height: 33px"><td width="303">
kubectl apply -f <code>&lt;file&gt;</code>.yaml
</td><td width="250">
**创建或更新**资源
</td><td width="250">
声明式运维的核心命令
</td></tr><tr style="height: 33px"><td width="303">
kubectl delete pod <code>&lt;name&gt;</code>
</td><td width="250">
删除 Pod
</td><td width="250">
--force --grace-period=0

(强制删除)
</td></tr><tr style="height: 33px"><td width="303">
kubectl scale deploy <code>&lt;name&gt;</code> --replicas=5
</td><td width="250">
动态调整副本数量
</td><td width="250">
应对突发流量
</td></tr><tr style="height: 33px"><td width="303">
kubectl rollout restart deploy <code>&lt;name&gt;</code>
</td><td width="250">
**平滑重启**所有 Pod
</td><td width="250">
修改配置后让 Pod 重新加载镜像
</td></tr><tr style="height: 33px"><td width="303">
kubectl rollout undo deploy <code>&lt;name&gt;</code>
</td><td width="250">
**版本回滚**
</td><td width="250">
上线出错后秒回上一版本
</td></tr></tbody></table>
### 4. 快捷生成 (Dry-run) — YAML 模版
<table id="KTvPV" class="ne-table" style="width: 750px"><tbody><tr style="height: 33px"><td width="375">
**命令**
</td><td width="375">
**功能描述**
</td></tr><tr style="height: 33px"><td width="375">
kubectl run <code>&lt;name&gt;</code> --image=<code>&lt;img-name&gt;</code> --dry-run=client -o yaml > pod.yaml
</td><td width="375">
快速生成 Pod 的 YAML 模版
</td></tr><tr style="height: 33px"><td width="375">
kubectl create deploy <code>&lt;name&gt;</code> --image=... --dry-run=client -o yaml > deploy.yaml
</td><td width="375">
快速生成 Deployment 模版
</td></tr><tr style="height: 33px"><td width="375">
kubectl expose deploy <code>&lt;name&gt;</code> --port=80 --type=NodePort --dry-run=client -o yaml > svc.yaml
</td><td width="375">
快速生成 Service 模版
</td></tr></tbody></table>
### 5.创建一个YAML文件

不需要自己手写，利用 kubectl 的 --dry-run 参数，可以让系统帮你生成一个最标准的模板。

**生成 Deployment 模板：**

```
kubectl create deploy my-nginx --image=nginx --dry-run=client -o yaml > nginx-all.yaml
```

**生成 Service 模板（追加到同一个文件）：**

```
echo "---" >> nginx-all.yaml
kubectl expose deploy my-nginx --port=80 --target-port=80 --type=NodePort --dry-run=client -o yaml >> nginx-all.yaml
```

**优点：** 语法绝对正确，包含了所有必须的字段。

## kubectl run启动和yaml文件启动的区别

### 1. 核心区别对比表
<table id="YShpn" class="ne-table" style="width: 750px"><tbody><tr style="height: 33px"><td width="250">
**特性**
</td><td width="250">
**kubectl run (命令行)**
</td><td width="250">
**kubectl apply -f (YAML 文件)**
</td></tr><tr style="height: 33px"><td width="250">
**操作模式**
</td><td width="250">
**命令式 (Imperative)**：直接告诉 K8s “去做什么”。
</td><td width="250">
**声明式 (Declarative)**：告诉 K8s “最终状态是什么”。
</td></tr><tr style="height: 33px"><td width="250">
**持久化**
</td><td width="250">
随敲随写，命令执行完很难找回配置细节。
</td><td width="250">
**配置即代码**。文件可以存在 Git 中，版本可追溯。
</td></tr><tr style="height: 33px"><td width="250">
**复杂度**
</td><td width="250">
只能配置简单的参数（镜像、环境变量）。
</td><td width="250">
支持 100% 的 K8s 特性（存储、资源限制、调度策略）。
</td></tr><tr style="height: 33px"><td width="250">
**资源类型**
</td><td width="250">
在新版本中通常只创建单独立的 **Pod**。
</td><td width="250">
可以创建 **Deployment** (带副本控制)、Service 等复杂组合。
</td></tr><tr style="height: 33px"><td width="250">
**适用场景**
</td><td width="250">
临时调试、快速验证镜像、简单的工具运行。
</td><td width="250">
**生产环境**、正式项目部署、自动化 CI/CD。
</td></tr></tbody></table><hr id="Ptjqv" class="ne-hr">
### 2. 逻辑架构差异


- **kubectl run**：你就像一个指挥官，一个口令一个动作。如果你不小心把 Pod 删了，除非你记得之前的长命令，否则很难复原一个一模一样的环境。
- **YAML (apply)**：你就像一个建筑师。你把蓝图交给 K8s，K8s 负责维持这个蓝图的现状。如果 Pod 掉了，K8s 会根据 YAML 里的副本数定义（Replicas）自动帮你拉起一个新的。
<hr id="jLS5L" class="ne-hr">
### 3. 举个例子：启动 MySQL 8.4

#### 命令式创建 (run)

你只能在命令行里拼凑参数，很容易漏掉东西：

```
kubectl run mysql-db --image=mysql:8.4 --env="MYSQL_ROOT_PASSWORD=123"
```

#### 获取已经创建进程的yaml文件

```
kubectl get pod 
-o yaml
```

#### 声明式创建 (YAML)

你可以把所有的细节都写清楚。创建一个 mysql.yaml：

```
apiVersion: apps/v1
kind: Deployment        # 注意这里是 Deployment，带自动恢复功能
metadata:
  name: mysql-deploy
spec:
  replicas: 1
  selector:
    matchLabels:
      app: mysql
  template:
    metadata:
      labels:
        app: mysql
    spec:
      containers:
      - name: mysql
        image: mysql:8.4
        env:
        - name: MYSQL_ROOT_PASSWORD
          value: "123"
        resources:      # YAML 方便定义资源限制
          limits:
            memory: "512Mi"
            cpu: "500m"
```

**执行命令：**kubectl apply -f mysql.yaml
<hr id="QRXJy" class="ne-hr">
### 4. 为什么生产环境禁用 run？

在你的运维笔记中，一定要写下这一条：**“生产环境严禁直接 run。”** 原因如下：


- **无法版本回滚**：YAML 配合 Git 可以轻松回滚到昨天的配置，run 做不到。
- **管理混乱**：过了一个月，没人记得当初 run 的时候加了哪些特殊的环境变量。
- **单点故障**：kubectl run 创建的通常是裸 Pod。一旦该 Pod 所在的 Node 宕机，这个 Pod **不会**在其他节点自动重启。而 YAML 创建的 Deployment 会自动在其他节点拉起新 Pod。
<hr id="yMAn6" class="ne-hr">
### 运维提效小技巧：将 run 转化为 yaml

如果你不想手写复杂的 YAML，可以先用 run 生成一个“草稿”，然后保存成文件：

```
# --dry-run=client 表示不真正创建，只模拟执行
# -o yaml 表示输出成 YAML 格式
kubectl run my-web --image=nginx:alpine --dry-run=client -o yaml > web-template.yaml
```

#### 

## pod的启动流程

在 Kubernetes 中，Pod 的状态主要分为两个维度：**生命周期阶段 (Phase)** 和 **具体状况 (Condition)**。

### 1. 五大核心生命周期阶段 (Pod Phase)

这是通过 kubectl get pods 最常看到的五个一级状态：
<table id="mSfWh" class="ne-table" style="width: 750px"><tbody><tr style="height: 33px"><td width="375">
**状态**
</td><td width="375">
**含义**
</td></tr><tr style="height: 33px"><td width="375">
**Pending**
</td><td width="375">
**挂起**。Pod 已被 API Server 创建，但由于镜像拉取中、资源不足或正在调度，容器尚未启动。
</td></tr><tr style="height: 33px"><td width="375">
**Running**
</td><td width="375">
**运行中**。Pod 已绑定到节点，且至少有一个容器正在运行，或正处于启动/重启状态。
</td></tr><tr style="height: 33px"><td width="375">
**Succeeded**
</td><td width="375">
**成功**。Pod 中的所有容器都已成功运行并退出（通常指一次性任务 Job），且不会再重启。
</td></tr><tr style="height: 33px"><td width="375">
**Failed**
</td><td width="375">
**失败**。Pod 中所有容器都已终止，但至少有一个容器是因为出错（退出码非 0）而终止的。
</td></tr><tr style="height: 33px"><td width="375">
**Unknown**
</td><td width="375">
**未知**。通常是因为 Master 无法与 Node 通信（比如 Node 挂了或网络断了），导致无法获取 Pod 状态。
</td></tr></tbody></table><hr id="eMyBG" class="ne-hr">
### 2. 常见的“非正常”运行状态 (Detail Status)

在 Running 或 Pending 阶段，你经常会看到具体的 REASON，这些才是排障的关键：


- **ContainerCreating**: 正在创建容器，通常是在拉镜像或挂载存储。
- **CrashLoopBackOff**: 容器启动后又崩溃了，K8s 正在尝试反复重启（通常是代码报错、配置文件不对）。
- **ImagePullBackOff / ErrImagePull**: 镜像拉不下来（地址写错、网络不通、加速器没配好）。
- **Terminating**: 正在删除中。如果一直卡在这个状态，通常是优雅退出超时（需用 --force）。
- **Evicted**: 驱逐状态。节点资源（如磁盘、内存）快耗尽了，K8s 强制杀掉 Pod 以保护节点。
- **OOMKilled**: 内存溢出。容器申请的内存超过了 limits 限制。
<hr id="uas1m" class="ne-hr">
### 3. Pod 的四大状况 (Conditions)

如果你执行 kubectl describe pod <code>&lt;name&gt;</code>，在输出的底部会看到 Conditions 列表，这是更底层的健康指标：


- **PodScheduled**: Pod 是否已经成功调度到某个 Node 上。
- **Initialized**: 所有的 initContainers（初始化容器）是否已成功完成。
- **ContainersReady**: Pod 内的所有容器是否都已经准备就绪。
- **Ready**: Pod 是否已经可以开始处理请求（并会被加入到 Service 的负载均衡中）。

1.标准的正确输出文件

2.标准的错误输出文件

文件描述符（file desctipotor，简称FD）

默认情况下linux系统一个进程允许打开1024个进程

操作系统知识：

内核、系统调用、shell、其他

内核：=

cpu、内存、进程、网络、磁盘

内核的信息

## cronjob定时任务

简单来说，**CronJob** 就是 Kubernetes 版的“闹钟”或“计划任务”。

如果你熟悉 Linux 的 crontab，那么 CronJob 就是把那种定时执行脚本的功能搬到了容器集群里。它不负责让程序“一直运行”，而是负责在**特定的时间点**拉起一个 **Job**（一次性任务），干完活就走。
<hr id="oU72Q" class="ne-hr">
### 1. CronJob 的核心逻辑


- **CronJob**: 策略层，规定“什么时候干”。
- **Job**: 执行层，规定“干什么”。
- **Pod**: 落地层，真正的容器在干活。
<hr id="IGVB9" class="ne-hr">
### 2. 时间格式 (Schedule)

它的时间表达式由 5 位组成：

分 时 日 月 周


- */5 * * * *: 每 5 分钟执行一次。
- 0 2 * * *: 每天凌晨 2 点整执行一次。
- 0 9 * * 1-5: 每个工作日（周一到周五）早上 9 点执行。
<hr id="C8gKO" class="ne-hr">
### 3. 如何使用（YAML 示例）

这是一个每分钟打印一次“Hello World”并退出的 CronJob：

```
apiVersion: batch/v1
kind: CronJob
metadata:
  name: my-cronjob
spec:
  schedule: "*/1 * * * *"       # 核心：每分钟运行一次
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: hello
            image: busybox:1.28
            command:
            - /bin/sh
            - -c
            - date; echo "Hello from K8s CronJob"
          restartPolicy: OnFailure  # 任务失败时重启容器，成功则停止
```
<hr id="oJlf7" class="ne-hr">
### 4. 关键参数（避坑指南）

写 CronJob 时，这几个参数非常重要：


- **concurrencyPolicy**** (并发策略)**:


- Allow (默认): 允许同时跑多个任务。
- Forbid: 如果上一个还没跑完，下一个就先别开（防止任务堆积）。


- **startingDeadlineSeconds**: 如果因为某种原因（如集群挂了）错过了触发时间，超过这个秒数就不再补跑了。
- **successfulJobsHistoryLimit**: 保留多少个成功的 Pod 记录。默认 3 个。如果设为 0，你执行完就看不见日志了。
<hr id="lY6ug" class="ne-hr">
### 5. 常用命令


- **查看状态**:

kubectl get cronjob (可以看到上次是什么时候执行的)


- **查看执行历史**:

kubectl get jobs (CronJob 每次执行都会生成一个 Job)


- **手动触发一次**:

有时候没到时间，你想测试一下，可以手动根据 CronJob 生成一个 Job：

kubectl create job --from=cronjob/my-cronjob test-run-01


- **删除**:

kubectl delete cronjob my-cronjob
<hr id="zEXcs" class="ne-hr">
### 常见用途


- **数据库备份**：每天凌晨自动 dump 数据库并上传云存储。
- **清理临时文件**：每小时清理一次日志或缓存。
- **发送报告**：每周一早上统计上周业务数据。

## daemonSet-守护进程控制器

**DaemonSet (简称 DS)** 是 Kubernetes 中一个非常特殊的控制器。

如果说 **Deployment** 的目标是“不论在哪，只要帮我跑够 $N$ 个副本就行”，那么 **DaemonSet** 的目标就是“**全员集结**”：它确保在集群的**每一个**（或指定的）Node 节点上，都运行且只运行一个 Pod 副本。
<hr id="q2sBG" class="ne-hr">
### 1. 核心特性：如影随形


- **自动覆盖**：每当有新节点加入集群，DaemonSet 会自动在该节点上启动一个 Pod。
- **自动回收**：当节点从集群中移除时，DaemonSet 也会自动删除该节点上的 Pod。
- **唯一性**：它能保证一个 Node 上不会运行两个相同的 DS Pod，避免资源冲突。
<hr id="hWIxw" class="ne-hr">
### 2. 典型的使用场景（基础设施类）

DaemonSet 通常不用于跑业务（比如 Nginx 或 Java 应用），而是用于**支撑集群运行的后台服务**：


- **网络插件 (CNI)**：例如 calico-node 或 flannel。每个节点必须跑一个，否则节点无法通信。
- **日志收集器**：例如 fluentd 或 logstash。它们驻留在每个节点上，收集该节点上所有容器的日志。
- **监控代理 (Agent)**：例如 Prometheus Node Exporter。它需要读取每个物理节点的 CPU、内存等硬件数据。
<hr id="u8hrG" class="ne-hr">
### 3. 动手实践：编写一个 DaemonSet

假设我们要部署一个监控代理，其 YAML 结构如下：

YAML

```
apiVersion: apps/v1
kind: DaemonSet        # 资源类型
metadata:
  name: node-exporter
  namespace: kube-system
spec:
  selector:
    matchLabels:
      app: node-exporter
  template:
    metadata:
      labels:
        app: node-exporter
    spec:
      # 重点 1: 通常 DS 需要访问宿主机资源
      hostNetwork: true 
      hostPID: true
      containers:
      - name: node-exporter
        image: prom/node-exporter:v1.3.1
        ports:
        - containerPort: 9100
          hostPort: 9100 # 直接映射到物理机端口
```
<hr id="DmSU4" class="ne-hr">
### 4. 进阶玩法：精准投放

虽然 DaemonSet 默认是“全员集结”，但你也可以通过 **标签 (Labels)** 让它只在特定节点运行。

#### ① 使用 nodeSelector

如果你只想在带 GPU 的节点上跑采集程序：

YAML

```
spec:
  template:
    spec:
      nodeSelector:
        hardware: gpu  # 只有打了这个标签的节点才会运行该 Pod
```

#### ② 容忍污点 (Tolerations)

默认情况下，Master 节点是不跑 Pod 的（因为有污点）。但 DaemonSet 往往需要覆盖 Master，此时需要添加容忍度：

YAML

```
spec:
  template:
    spec:
      tolerations:
      - key: node-role.kubernetes.io/master
        effect: NoSchedule
        operator: Exists
```
<hr id="dNJfV" class="ne-hr">
### 5. 常用管理命令


- **查看状态**：

kubectl get ds -n kube-system

*你会发现 **DESIRED**（期望数）永远等于你的可用 **NODE** 数量。*


- **滚动更新**：

当你修改了 DS 的镜像，它会一个节点接一个节点地重启 Pod，保证监控或网络不中断。

kubectl rollout status ds/node-exporter -n kube-system
<hr id="fsqfR" class="ne-hr">
### 总结对比
<table id="EOpLC" class="ne-table" style="width: 750px"><tbody><tr style="height: 33px"><td width="250">
**特性**
</td><td width="250">
**Deployment**
</td><td width="250">
**DaemonSet**
</td></tr><tr style="height: 33px"><td width="250">
**副本数**
</td><td width="250">
手动指定（如 3 或 5）
</td><td width="250">
**由节点数量决定**
</td></tr><tr style="height: 33px"><td width="250">
**调度**
</td><td width="250">
调度器选（哪空闲去哪）
</td><td width="250">
**固定（每个节点一个）**
</td></tr><tr style="height: 33px"><td width="250">
**删除节点时**
</td><td width="250">
副本会在其他节点漂移重启
</td><td width="250">
**副本随节点销毁，不漂移**
</td></tr><tr style="height: 33px"><td width="250">
**典型用途**
</td><td width="250">
业务应用、微服务
</td><td width="250">
**网络、日志、监控等插件**
</td></tr></tbody></table>
## pod的资源限制

### 一、 CPU 资源分配：算力的“量化”

K8s 中的 CPU 单位是 m (millicores)。1000m 等于 **1 个逻辑 CPU 核心**。

#### 1. 配置示例

```
resources:
  requests:
    cpu: "250m"  # 初始保证 0.25 核，底层对应 cgroups 的 cpu.shares
  limits:
    cpu: "500m"  # 最高占用 0.5 核，底层对应 cgroups 的 cpu.cfs_quota_us
```

#### 2. 核心避坑指南


- **Requests**：调度器（Scheduler）根据这个值决定 Pod 放在哪台 Node 上。如果 Node 剩余 CPU 不足 250m，Pod 就进不去。
- **Limits**：这是硬上限。如果 Pod 试图超过 0.5 核，内核会触发 **CPU Throttling（限流）**。
- **面试点**：CPU 是“可压缩资源”。超过 limit 不会死掉，只是会变慢（延迟增加）。
<hr id="eLBIj" class="ne-hr">
### 二、 内存资源分配：空间的“死线”

内存的单位通常是 Mi (Mebibytes) 或 Gi (Gibibytes)。

#### 1. 配置示例

```
resources:
  requests:
    memory: "128Mi" # 调度参考值
  limits:
    memory: "512Mi" # 物理上限
```

#### 2. 核心避坑指南


- **OOM Kill**：内存是“不可压缩资源”。如果 Pod 使用的内存超过了 limits，K8s 会直接触发 **OOM Kill**，状态变为 OOMKilled，然后尝试重启。
- **面试点**：如果 requests 设得太小而 limits 很大，可能会导致 Node 内存耗尽（Overcommit），引发系统级别的稳定性问题。
<hr id="yIbKB" class="ne-hr">
### 三、 深度进阶：服务质量等级 (QoS Classes)

K8s 会根据你设置的 requests 和 limits 自动给 Pod 分成三个等级，这直接决定了**当 Node 资源不足时，先杀谁**：


- **Guaranteed (最高级)**：requests 和 limits 完全相等。


- *待遇*：最稳定，除非万不得已，否则不会被杀。


- **Burstable (中等级)**：limits 大于 requests（或者只设了其中一个）。


- *待遇*：平常用得爽，但 Node 压力大时，它是第一批被针对的目标。


- **BestEffort (最低级)**：啥都没设。


- *待遇*：典型的“临时工”，  资源够你就用，不够第一个踢你走。