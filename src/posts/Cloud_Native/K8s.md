---
title: Kubernetes
cover: /assets/images/cover2.jpg
icon: pen-to-square
date: 2025-9.5
category:
  - 云原生
tag:
  - 云原生
  - 容器
star: true
sticky: true
---


简单来说，**Kubernetes**（通常简称为 **K8s**，因为 K 和 s 之间有 8 个字母）是一个开源的**容器编排平台**。

如果把 Docker 容器比作一只只“运货的集装箱”，那么 K8s 就是那台巨大的“自动化起重机”和“港口调度系统”。

---

# 部署Kubernetes+docker
## 1. 为什么需要 K8s？
在只有几个容器时，手动管理很简单。但当你有成百上千个容器在几十台服务器上运行，且需要处理升级、扩容、宕机恢复时，靠人工是不可能的。K8s 解决了以下痛点：

+ **自动化部署与回滚**：你只需要告诉 K8s “我要运行 5 个版本的 A 应用”，它会自动帮你部署。如果更新出错了，它能一键退回。
+ **自我修复 (Self-healing)**：如果某个容器挂了，K8s 会立即发现并重启一个新的；如果某台服务器坏了，它会把上面的容器搬到其他健康的机器上。
+ **水平伸缩 (Scaling)**：根据流量大小，自动增加或减少容器的数量。
+ **负载均衡**：它会自动给一组容器分配统一的 IP 和域名，并平衡进入的流量。



k8s本质上就是一个管理容器的软件



<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2026/png/62301513/1770173006549-1dba9305-079e-42d8-8ce9-32969f14dd34.png)



### k8s里有非常经典的3大接口
| **<font style="color:rgb(31, 31, 31);">接口</font>** | **<font style="color:rgb(31, 31, 31);">负责什么</font>** | **<font style="color:rgb(31, 31, 31);">通俗理解</font>** | **<font style="color:rgb(31, 31, 31);">典型插件</font>** |
| --- | --- | --- | --- |
| **<font style="color:rgb(31, 31, 31);">CRI</font>**<font style="color:rgb(31, 31, 31);"> (运行时)</font> | **<font style="color:rgb(31, 31, 31);">怎么跑容器？</font>** | <font style="color:rgb(31, 31, 31);">就像电脑的</font>**<font style="color:rgb(31, 31, 31);">CPU插槽</font>**<font style="color:rgb(31, 31, 31);">，不论是 Intel 还是 AMD，只要接口对就能跑。</font> | <font style="color:rgb(31, 31, 31);">containerd, CRI-O</font> |
| **<font style="color:rgb(31, 31, 31);">CNI</font>**<font style="color:rgb(31, 31, 31);"> (网络)</font> | **<font style="color:rgb(31, 31, 31);">怎么通信？</font>** | <font style="color:rgb(31, 31, 31);">就像电脑的</font>**<font style="color:rgb(31, 31, 31);">网卡驱动</font>**<font style="color:rgb(31, 31, 31);">，决定了你是走拨号、光纤还是 5G。</font> | <font style="color:rgb(31, 31, 31);">Flannel, Calico</font> |
| **<font style="color:rgb(31, 31, 31);">CSI</font>**<font style="color:rgb(31, 31, 31);"> (存储)</font> | **<font style="color:rgb(31, 31, 31);">数据存哪？</font>** | <font style="color:rgb(31, 31, 31);">就像电脑的</font>**<font style="color:rgb(31, 31, 31);">USB接口</font>**<font style="color:rgb(31, 31, 31);">，你可以插 U 盘、移动硬盘或外接阵列。</font> | <font style="color:rgb(31, 31, 31);">Ceph, NFS, 云硬盘</font> |




核心组件

# 
kube-apiserver：

etcd：是一个数据库软件的名字 --》key：value --》go语言开发一致且高可用的键值存储，用作Kubernetes所有集群数据后台数据库。

scheduler：调度器 --》安排我们需要启动的pod到那个node上去运行，有哪些调度策略/方法

controller-manager		控制器管理员



## 一些常用的kubernetes命令




## 虚拟机配置
### 为所有虚拟机器配置防火墙
```plain
#禁用firewalld和selinux
systemctl stop firewalld
systemctl disable firewalld
```

### 关闭selinux和防火墙
```plain
setenforce 0
sed -i '/^SELINUX=/ s/enforcing/disabled/' /etc/selinux/config
```



### 配置静态ip
```plain
ip add										#先查看你的网卡信息
ip route									#查看你的网关
```

```plain
nmcli con mod "ens160" \						#填你的网卡名
ipv4.method manual \								#修改为手动模式
ipv4.addresses "192.168.1.8/24" \		#修改为你预留的ip地址
ipv4.gateway "192.168.1.1" \				#修改为你之前ip route看到的网关地址
```



### 添加ip映射（每个机器都需要脚本没有写）
```plain
vi /etc/hosts
```

末尾添加以下内容

```plain
192.168.245.143 master-1
192.168.245.144 node-1
192.168.245.145 node-2
```



### 配置 Docker 加速器（每个节点）  
### 1. 修改/创建 Docker 配置文件
Docker 的官方配置文件位于 `/etc/docker/daemon.json`。如果该文件不存在，直接创建；如果已存在，则修改其内容。

```plain
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

**注意**：`"exec-opts": ["native.cgroupdriver=systemd"]` 是 Kubernetes 集群必需的配置，它能确保 Docker 和 Kubelet 使用相同的 Cgroup 驱动，防止集群崩溃。

---

#### 2. 重启 Docker 服务
配置写入后，必须重新加载配置并重启服务才能生效。

```plain
# 1. 重新加载系统配置
sudo systemctl daemon-reload

# 2. 重启 Docker
sudo systemctl restart docker
```

---

#### 3. 验证是否配置成功
执行以下命令，查看输出信息中的 `Registry Mirrors` 部分：

```plain
docker info | grep -A 5 "Registry Mirrors"
```

**预期输出：**

```plain
Registry Mirrors:
  https://docker.m.daocloud.io/
  https://hub-mirror.c.163.com/
  https://mirror.baidubce.com/
  https://docker.land007.top/
```

### 机器初始化脚本（关闭selinux和防火墙，配置静态ip）
```plain
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
```plain
#先安装一些docker的必要依赖
yum install -y yum-utils device-mapper-persistent-data lvm2  
#添加阿里云Docker源（国内下载快） 
yum-config-manager --add-repo https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo  
#安装最新版Docker 
yum install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin 
```

### 设置systemctl管理
```plain
#启动并设置开机自启 
systemctl start docker&& systemctl enable docker
验证安装
#docker --version
```

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2026/png/62301513/1770038471657-db5244ff-1085-44a1-8a8c-1c2072c89d6e.png)



## **cri-docker源码安装**
去官方网站获取压缩包[https://github.com/Mirantis/cri-dockerd/releases](https://github.com/Mirantis/cri-dockerd/releases)，

https://github.com/Mirantis/cri-dockerd/releases/download/v0.3.23/cri-dockerd-0.3.23.amd64.tgz

上传文件到虚拟机

### 1、准备二进制文件
**确保你的可执行文件位于正确路径，并拥有运行权限。**

```plain
# 赋予执行权限
chmod +x /root/cri-dockerd/cri-dockerd
```

---

### 2、创建 Socket 文件
**Socket 文件负责定义 Kubernetes 与 Docker 通信的端点。**

+ **文件路径****：**`**/etc/systemd/system/cri-docker.socket**`
+ **配置内容：**

```plain
[Unit]
Description=Docker Systemd Container Runtime Interface Socket
PartOf=cri-docker.service

[Socket]
# Kubernetes 访问 Docker 的通信路径
ListenStream=/var/run/cri-dockerd.sock

[Install]
WantedBy=sockets.target
```

---

### 3、创建 Service 服务文件
**该文件定义了后台进程的启动参数和依赖关系。**

+ **文件路径****：**`**/etc/systemd/system/cri-docker.service**`
+ **配置内容：**

```plain
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

---

### 4、启动并验证服务
**按照以下顺序执行命令以生效配置：**

```plain
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
| **<font style="color:rgb(31, 31, 31);">检查点</font>** | **<font style="color:rgb(31, 31, 31);">描述</font>** |
| --- | --- |
| **<font style="color:rgb(31, 31, 31);">绝对路径</font>** | `<font style="color:rgb(68, 71, 70);">ExecStart</font>`<br/><font style="color:rgb(31, 31, 31);"> 必须指向 </font>`<font style="color:rgb(68, 71, 70);">/root/cri-dockerd/cri-dockerd</font>`<br/><font style="color:rgb(31, 31, 31);">。</font> |
| **<font style="color:rgb(31, 31, 31);">依赖关系</font>** | `<font style="color:rgb(68, 71, 70);">Service</font>`<br/><font style="color:rgb(31, 31, 31);"> 依赖于 </font>`<font style="color:rgb(68, 71, 70);">Socket</font>`<br/><font style="color:rgb(31, 31, 31);">，必须确保 Socket 先启动。</font> |
| **<font style="color:rgb(31, 31, 31);">权限</font>** | <font style="color:rgb(31, 31, 31);">二进制文件必须有 </font>`<font style="color:rgb(68, 71, 70);">+x</font>`<br/><font style="color:rgb(31, 31, 31);"> 权限，否则会报 </font>`<font style="color:rgb(68, 71, 70);">Permission denied</font>`<br/><font style="color:rgb(31, 31, 31);">。</font> |




## Kubernetes安装
### **1. 配置 Kubernetes Yum 源**
**国内环境建议使用阿里云镜像源，速度最快：**

```plain
cat <<EOF | tee /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://mirrors.aliyun.com/kubernetes-new/core/stable/v1.35/rpm/
enabled=1
gpgcheck=1
gpgkey=https://mirrors.aliyun.com/kubernetes-new/core/stable/v1.35/rpm/repodata/repomd.xml.key
EOF
```

### **2. 安装 K8s 核心三件套**
```plain
# 安装最新版
yum install -y kubelet kubeadm kubectl

# 设置 kubelet 开机自启（现在还起不来，因为没初始化，但要设为 enable）
systemctl enable kubelet
```

### **3. 初始化集群（最关键的一步）**
**这一步必须告诉 **`**kubeadm**`** 使用你刚才配置好的 **`**cri-dockerd**`**。**

**执行初始化命令：**

**Bash**

```plain
kubeadm init \
  --apiserver-advertise-address=$(hostname -I | awk '{print $1}') \
  --image-repository registry.aliyuncs.com/google_containers \
  --kubernetes-version v1.35.0 \
  --cri-socket unix:///var/run/cri-dockerd.sock \
  --pod-network-cidr=10.244.0.0/16
```

**参数解释：**

+ `**--cri-socket**`**: 必须指向 **`**/var/run/cri-dockerd.sock**`**，否则它会去找默认的 containerd。**
+ `**--image-repository**`**: 使用阿里云镜像源，避免被墙。**
+ `**--pod-network-cidr**`**: 这是给 Flannel 等网络插件预留的地址段。**

---

### **4. 必备的小工具：conntrack**
**还记得刚才 **`**cri-dockerd**`** 日志里的警告吗？在初始化前，最好把这个装上：**

```plain
yum install -y conntrack-tools
```

---





## 关闭分区
### 1. 关闭 Swap（内存交换分区）
**为什么要关？** Kubernetes 的调度器（Scheduler）在分配资源时，是假设你的物理内存是“实打实”的。如果允许使用 Swap，当物理内存不足时，系统会把数据存到磁盘上，这会导致程序运行速度极度变慢，且会让 Kubelet 无法准确判断节点的压力情况。

**操作步骤：**

```plain
# 临时关闭（立即生效，重启后失效）
swapoff -a

# 永久关闭（防止重启后又开了）
# 使用 sed 命令直接注释掉 /etc/fstab 中包含 swap 的那一行
sed -i '/swap/s/^\(.*\)$/#\1/g' /etc/fstab
```

---

### 2. 开启内核转发（IP Forwarding）
**为什么要开？** Kubernetes 本质上是一个复杂的虚拟网络。Pod 运行在不同的节点上，它们之间的通信需要通过 Linux 内核进行数据包的转发。如果不开启，你的 Pod 可能连外网都上不了，甚至 Node 之间都无法通信。

**操作步骤：**

```plain
# 1. 创建转发配置文件
cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-iptables  = 1
net.bridge.bridge-nf-call-ip6tables = 1
net.ipv4.ip_forward                 = 1
EOF

# 2. 立即应用配置
sysctl --system
```

---

### 3. 安装 conntrack
**为什么要装？**`conntrack`（Connection Tracking）是 Linux 内核用于跟踪网络连接状态的工具。Kubernetes 的 Service（比如负载均衡）重度依赖 `iptables` 或 `IPVS` 规则，而这些规则需要 `conntrack` 来追踪数据包到底属于哪个连接。

如果你不装，你会发现 `cri-dockerd` 日志里一直在报错，且 K8s 的网络服务会变得极其不稳定。

**操作步骤：**

```plain
# CentOS / RHEL / AlmaLinux
yum install -y conntrack-tools

# Ubuntu / Debian
# apt-get install -y conntrack
```

---

### 总结：如何验证？
配置完这三项后，你的机器就从“普通服务器”变身为“准 K8s 节点”了。

+ **验证 Swap**：输入 `free -h`，看到 `Swap` 那一行显示为 `0B` 即可。
+ **验证转发**：输入 `sysctl net.ipv4.ip_forward`，看到 `= 1` 即可。
+ **验证 conntrack**：输入 `conntrack --version`，有输出版本号即可。

















## init集群初始化（仅在master节点执行）
### 初始化
```plain
kubeadm init \
  --apiserver-advertise-address=<你master节点的ip> \				
  --image-repository registry.aliyuncs.com/google_containers \
  --kubernetes-version v1.35.0 \
  --cri-socket unix:///var/run/cri-dockerd.sock \
  --pod-network-cidr=192.168.0.0/16
```



### 成功执行后会得到
<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2026/png/62301513/1770039224593-a5ec79e0-1643-4776-8db4-af7c33fa7f27.png)

### 记住你的token和256
```plain
kubeadm join 192.168.245.143:6443 --token 2fbmo4.jolz018zlx9rmzd1 \
	--discovery-token-ca-cert-hash sha256:b63a2cf1e05115f8260a81afc4198b98653ecf4e5f7dc60a539225afe0e2c3f0 
```



### 创建配置目录并给用户执行权限（在master节点上执行）
```plain
# 创建配置目录
mkdir -p $HOME/.kube

# 拷贝集群管理配置文件到当前用户目录下
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config

# 赋予当前用户对配置文件的读写权限
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```



### 将node节点加入集群
```plain
# 在 Node 节点上运行（请替换为你自己的 token 和 hash）
kubeadm join 192.168.245.143:6443 --token 1q9lrd.wy04lh4odezywttl \
    --discovery-token-ca-cert-hash sha256:b63a2cf1e05115f8260a81afc4198b98653ecf4e5f7dc60a539225afe0e2c3f0 \
    --cri-socket unix:///var/run/cri-dockerd.sock
```



### 添加成功的标志
```plain
kubectl get nodes						#查看节点信息
```

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2026/png/62301513/1770039707672-200a240e-d9dd-4cf4-b2ca-fb9a9069c554.png)

现在还是Notready的状态，需要配置网络插件





### 在 Worker 节点（k8s-node-2）上配置 `kubectl` 命令行工具的访问权限。
简单来说，你在把 Master 节点的“钥匙”复制到 Node 节点上，这样你在 Node 节点上也能直接运行 `kubectl get nodes` 等命令来管理集群了。

---

#### 具体步骤解析：
1. **创建目录**：`mkdir -p $HOME/.kube`
    - 在当前用户（root）家目录下创建一个隐藏文件夹 `.kube`，这是 `kubectl` 默认读取配置的地方。
2. **远程拷贝配置文件 (scp)**：`scp k8s-master-1:/etc/kubernetes/admin.conf /root/.kube/config`
    - 从主节点（k8s-master-1）把集群的**最高权限配置文件**`admin.conf` 拷贝过来，并重命名为 `config`。
    - **核心原理**：这个 `config` 文件包含了集群 API Server 的地址以及用于身份验证的证书。没有它，`kubectl` 就像没有账号密码的客户端，连不上集群。
3. **修改权限 (chown)**：`chown $(id -u):$(id -g) $HOME/.kube/config`
    - 将配置文件的所有者修改为当前用户和当前组。虽然你现在是用 root 操作，但这是一个标准的官方推荐动作，确保当前用户有权读写这个“钥匙”。

---

#### 这样做的目的是什么？
通常情况下，只有 Master 节点能执行 `kubectl` 命令。你完成这些操作后，**k8s-node-2** 就变成了一个“管理终端”。



## 安装Calico网络插件
### 1. 基础环境准备
在应用 YAML 之前，所有节点（Master & Nodes）必须确保：

+ **禁用防火墙**：`systemctl stop firewalld && systemctl disable firewalld`
+ **禁用 Swap**：`swapoff -a`
+ **内核转发**：`net.bridge.bridge-nf-call-iptables` 设置为 1。

**清理残留**（如果曾安装过其他插件）：

```plain
rm -rf /etc/cni/net.d/*
rm -rf /var/lib/calico
```

---

### 2. 下载 Calico 的官方定义文件
```plain
curl -O https://raw.githubusercontent.com/projectcalico/calico/v3.25.0/manifests/calico.yaml
```

或者直接复制这个文件

:::info
[calico.yaml](https://www.yuque.com/attachments/yuque/0/2026/yaml/62301513/1770051399180-7fb1f41b-c40a-47b9-8fcc-991f11217d02.yaml)

:::

### 3.修改calico.yaml文件的下载源
```plain
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

```plain
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
+ **CIDR 匹配**：确保 `calico.yaml` 中的 `CALICO_IPV4POOL_CIDR` 字段与 `kubeadm init` 时的 `--pod-network-cidr` 完全一致（通常是 `10.244.0.0/16` 或 `172.16.0.0/16`）。
+ **网卡识别**：如果服务器有多块网卡，需在 YAML 中添加 `IP_AUTODETECTION_METHOD` 过滤，防止 Calico 绑定到错误的 IP 上。

### 3. 运行时维护常用命令
+ **查看详细报错**（镜像问题的照妖镜）：

`kubectl describe pod <pod名> -n kube-system`

+ **强制刷新 Pod**（打完 Tag 后手动触发）：

`kubectl delete pod <pod名> -n kube-system`

+ **移除 Master 污点**（让插件能在 Master 运行）：

`kubectl taint nodes --all node-role.kubernetes.io/control-plane-`

---

### 三、 终极避坑
| **检查项** | **操作目的** |
| --- | --- |
| **Docker 加速器** | 确保 `/etc/docker/daemon.json`<br/> 配置了国内镜像源。 |
| **镜像全量性** | 确认 `node`<br/>, `cni`<br/>, `controllers`<br/>, `flexvol`<br/> 四个镜像是否都已就位。 |
| **标签一致性** | `docker images`<br/> 看到的名字必须和 `kubectl describe`<br/> 看到的一字不差。 |
| **节点全覆盖** | 每一个 Node 节点都要手动重复一遍镜像 Tag 操作。 |




#### 常见状态
| **<font style="color:rgb(31, 31, 31);">状态 (Status)</font>** | **<font style="color:rgb(31, 31, 31);">核心原因</font>** | **<font style="color:rgb(31, 31, 31);">解决方法</font>** |
| --- | --- | --- |
| **<font style="color:rgb(31, 31, 31);">ImagePullBackOff</font>** | <font style="color:rgb(31, 31, 31);">镜像地址不对或网络不通</font> | <font style="color:rgb(31, 31, 31);">检查 </font>`<font style="color:rgb(68, 71, 70);">describe pod</font>`<br/><font style="color:rgb(31, 31, 31);"> 中的镜像地址；在对应节点手动 </font>`<font style="color:rgb(68, 71, 70);">docker pull</font>` |
| **<font style="color:rgb(31, 31, 31);">Init:Error</font>** | <font style="color:rgb(31, 31, 31);">初始化脚本执行失败</font> | <font style="color:rgb(31, 31, 31);">查看日志：</font>`<font style="color:rgb(68, 71, 70);">kubectl logs <pod> -n kube-system -c install-cni</font>` |
| **<font style="color:rgb(31, 31, 31);">Init:Error (flexvol)</font>** | <font style="color:rgb(31, 31, 31);">宿主机路径不存在</font> | <font style="color:rgb(31, 31, 31);">设置环境变量 </font>`<font style="color:rgb(68, 71, 70);">FLEXVOL_DIR=none</font>`<br/><font style="color:rgb(31, 31, 31);"> 或直接从 YAML 中删除 </font>`<font style="color:rgb(68, 71, 70);">flexvol</font>`<br/><font style="color:rgb(31, 31, 31);"> 容器</font> |
| **<font style="color:rgb(31, 31, 31);">CrashLoopBackOff</font>** | <font style="color:rgb(31, 31, 31);">控制器连不上 API Server</font> | <font style="color:rgb(31, 31, 31);">检查 </font>`<font style="color:rgb(68, 71, 70);">calico-node</font>`<br/><font style="color:rgb(31, 31, 31);"> 是否全部 Ready (1/1)；检查 Master 节点网络</font> |






##  Kubectl 运维实战命令速查表  
###  1. 核心查看 (Get) — 集群监控  
| **<font style="color:rgb(31, 31, 31);">命令</font>** | **<font style="color:rgb(31, 31, 31);">功能描述</font>** | **<font style="color:rgb(31, 31, 31);">常用参数</font>** |
| --- | --- | --- |
| `<font style="color:rgb(68, 71, 70);">kubectl get nodes</font>` | <font style="color:rgb(31, 31, 31);">查看节点状态（Ready/NotReady）</font> | `<font style="color:rgb(68, 71, 70);">-o wide</font>`<br/><font style="color:rgb(31, 31, 31);"> (查看 IP/内核)</font> |
| `<font style="color:rgb(68, 71, 70);">kubectl get pods</font>` | <font style="color:rgb(31, 31, 31);">查看当前 Namespace 下的 Pod</font> | `<font style="color:rgb(68, 71, 70);">-A</font>`<br/><font style="color:rgb(31, 31, 31);"> (所有空间), </font>`<font style="color:rgb(68, 71, 70);">-w</font>`<br/><font style="color:rgb(31, 31, 31);"> (持续监听)</font> |
| `<font style="color:rgb(68, 71, 70);">kubectl get svc</font>` | <font style="color:rgb(31, 31, 31);">查看 Service（映射端口/ClusterIP）</font> | `<font style="color:rgb(68, 71, 70);">--show-labels</font>` |
| `<font style="color:rgb(68, 71, 70);">kubectl get deploy</font>` | <font style="color:rgb(31, 31, 31);">查看控制器（副本数/可用数）</font> | `<font style="color:rgb(68, 71, 70);">-n <namespace></font>` |
| `<font style="color:rgb(68, 71, 70);">kubectl get events</font>` | <font style="color:rgb(31, 31, 31);">查看集群最近的事件（排错神器）</font> | `<font style="color:rgb(68, 71, 70);">--sort-by='.lastTimestamp'</font>` |


###  2. 深度诊断 (Debug) — 故障排查  
| **<font style="color:rgb(31, 31, 31);">命令</font>** | **<font style="color:rgb(31, 31, 31);">功能描述</font>** | **<font style="color:rgb(31, 31, 31);">场景技巧</font>** |
| --- | --- | --- |
| `<font style="color:rgb(68, 71, 70);">kubectl describe po <name></font>` | <font style="color:rgb(31, 31, 31);">查看资源详情和</font>**<font style="color:rgb(31, 31, 31);">系统事件</font>** | <font style="color:rgb(31, 31, 31);">镜像拉不动、调度失败时必看</font> |
| `<font style="color:rgb(68, 71, 70);">kubectl logs <name></font>` | <font style="color:rgb(31, 31, 31);">查看容器输出的</font>**<font style="color:rgb(31, 31, 31);">程序日志</font>** | `<font style="color:rgb(68, 71, 70);">-f</font>`<br/><font style="color:rgb(31, 31, 31);"> (流式), </font>`<font style="color:rgb(68, 71, 70);">--tail 100</font>`<br/><font style="color:rgb(31, 31, 31);"> (末尾 100 行)</font> |
| `<font style="color:rgb(68, 71, 70);">kubectl exec -it <name> -- sh</font>` | **<font style="color:rgb(31, 31, 31);">进入容器</font>**<font style="color:rgb(31, 31, 31);">内部交互</font> | <font style="color:rgb(31, 31, 31);">测试网络连通性或查看内部配置</font> |
| `<font style="color:rgb(68, 71, 70);">kubectl logs <name> -c <container></font>` | <font style="color:rgb(31, 31, 31);">查看多容器 Pod 中的指定容器日志</font> | <font style="color:rgb(31, 31, 31);">当 Pod 含有 Sidecar 时使用</font> |
| `<font style="color:rgb(68, 71, 70);">kubectl top pod/node</font>` | <font style="color:rgb(31, 31, 31);">查看资源占用 (CPU/内存)</font> | <font style="color:rgb(31, 31, 31);">需安装 Metrics Server</font> |


###  3. 资源操纵 (Action) — 状态变更  
| **<font style="color:rgb(31, 31, 31);">命令</font>** | **<font style="color:rgb(31, 31, 31);">功能描述</font>** | **<font style="color:rgb(31, 31, 31);">场景技巧</font>** |
| --- | --- | --- |
| `<font style="color:rgb(68, 71, 70);">kubectl apply -f <file>.yaml</font>` | **<font style="color:rgb(31, 31, 31);">创建或更新</font>**<font style="color:rgb(31, 31, 31);">资源</font> | <font style="color:rgb(31, 31, 31);">声明式运维的核心命令</font> |
| `<font style="color:rgb(68, 71, 70);">kubectl delete po <name></font>` | <font style="color:rgb(31, 31, 31);">删除 Pod</font> | `<font style="color:rgb(68, 71, 70);">--force --grace-period=0</font>`<br/><font style="color:rgb(31, 31, 31);"> (强制删除)</font> |
| `<font style="color:rgb(68, 71, 70);">kubectl scale deploy <name> --replicas=5</font>` | <font style="color:rgb(31, 31, 31);">动态调整副本数量</font> | <font style="color:rgb(31, 31, 31);">应对突发流量</font> |
| `<font style="color:rgb(68, 71, 70);">kubectl rollout restart deploy <name></font>` | **<font style="color:rgb(31, 31, 31);">平滑重启</font>**<font style="color:rgb(31, 31, 31);">所有 Pod</font> | <font style="color:rgb(31, 31, 31);">修改配置后让 Pod 重新加载镜像</font> |
| `<font style="color:rgb(68, 71, 70);">kubectl rollout undo deploy <name></font>` | **<font style="color:rgb(31, 31, 31);">版本回滚</font>** | <font style="color:rgb(31, 31, 31);">上线出错后秒回上一版本</font> |


###  4. 快捷生成 (Dry-run) — YAML 模版  
| **<font style="color:rgb(31, 31, 31);">命令</font>** | **<font style="color:rgb(31, 31, 31);">功能描述</font>** |
| --- | --- |
| `<font style="color:rgb(68, 71, 70);">kubectl run <name> --image=<img-name> --dry-run=client -o yaml > pod.yaml</font>` | <font style="color:rgb(31, 31, 31);">快速生成 Pod 的 YAML 模版</font> |
| `<font style="color:rgb(68, 71, 70);">kubectl create deploy <name> --image=... --dry-run=client -o yaml > deploy.yaml</font>` | <font style="color:rgb(31, 31, 31);">快速生成 Deployment 模版</font> |
| `<font style="color:rgb(68, 71, 70);">kubectl expose deploy <name> --port=80 --type=NodePort --dry-run=client -o yaml > svc.yaml</font>` | <font style="color:rgb(31, 31, 31);">快速生成 Service 模版</font> |






## kubectl run启动和yaml文件启动的区别
### 1. 核心区别对比表
| **特性** | **kubectl run (命令行)** | **kubectl apply -f (YAML 文件)** |
| --- | --- | --- |
| **操作模式** | **命令式 (Imperative)**：直接告诉 K8s “去做什么”。 | **声明式 (Declarative)**：告诉 K8s “最终状态是什么”。 |
| **持久化** | 随敲随写，命令执行完很难找回配置细节。 | **配置即代码**。文件可以存在 Git 中，版本可追溯。 |
| **复杂度** | 只能配置简单的参数（镜像、环境变量）。 | 支持 100% 的 K8s 特性（存储、资源限制、调度策略）。 |
| **资源类型** | 在新版本中通常只创建单独立的 **Pod**。 | 可以创建 **Deployment** (带副本控制)、Service 等复杂组合。 |
| **适用场景** | 临时调试、快速验证镜像、简单的工具运行。 | **生产环境**、正式项目部署、自动化 CI/CD。 |


---

### 2. 逻辑架构差异
+ `**kubectl run**`：你就像一个指挥官，一个口令一个动作。如果你不小心把 Pod 删了，除非你记得之前的长命令，否则很难复原一个一模一样的环境。
+ **YAML (apply)**：你就像一个建筑师。你把蓝图交给 K8s，K8s 负责维持这个蓝图的现状。如果 Pod 掉了，K8s 会根据 YAML 里的副本数定义（Replicas）自动帮你拉起一个新的。

---

### 3. 举个例子：启动 MySQL 8.4
#### 命令式创建 (`run`)
你只能在命令行里拼凑参数，很容易漏掉东西：

```plain
kubectl run mysql-db --image=mysql:8.4 --env="MYSQL_ROOT_PASSWORD=123"
```



#### 获取已经创建进程的yaml文件
```plain
kubectl get pod <podname> -o yaml
```



#### 声明式创建 (`YAML`)
你可以把所有的细节都写清楚。创建一个 `mysql.yaml`：

```plain
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

**执行命令：**`kubectl apply -f mysql.yaml`

---

### 4. 为什么生产环境禁用 `run`？
在你的运维笔记中，一定要写下这一条：**“生产环境严禁直接 run。”** 原因如下：

1. **无法版本回滚**：YAML 配合 Git 可以轻松回滚到昨天的配置，`run` 做不到。
2. **管理混乱**：过了一个月，没人记得当初 `run` 的时候加了哪些特殊的环境变量。
3. **单点故障**：`kubectl run` 创建的通常是裸 Pod。一旦该 Pod 所在的 Node 宕机，这个 Pod **不会**在其他节点自动重启。而 YAML 创建的 Deployment 会自动在其他节点拉起新 Pod。

---

### 运维提效小技巧：将 `run` 转化为 `yaml`
如果你不想手写复杂的 YAML，可以先用 `run` 生成一个“草稿”，然后保存成文件：

```plain
# --dry-run=client 表示不真正创建，只模拟执行
# -o yaml 表示输出成 YAML 格式
kubectl run my-web --image=nginx:alpine --dry-run=client -o yaml > web-template.yaml
```

#### 


## pod的启动流程
在 Kubernetes 中，Pod 的状态主要分为两个维度：**生命周期阶段 (Phase)** 和 **具体状况 (Condition)**。

### 1. 五大核心生命周期阶段 (Pod Phase)
这是通过 `kubectl get pods` 最常看到的五个一级状态：

| **状态** | **含义** |
| --- | --- |
| **Pending** | **挂起**。Pod 已被 API Server 创建，但由于镜像拉取中、资源不足或正在调度，容器尚未启动。 |
| **Running** | **运行中**。Pod 已绑定到节点，且至少有一个容器正在运行，或正处于启动/重启状态。 |
| **Succeeded** | **成功**。Pod 中的所有容器都已成功运行并退出（通常指一次性任务 Job），且不会再重启。 |
| **Failed** | **失败**。Pod 中所有容器都已终止，但至少有一个容器是因为出错（退出码非 0）而终止的。 |
| **Unknown** | **未知**。通常是因为 Master 无法与 Node 通信（比如 Node 挂了或网络断了），导致无法获取 Pod 状态。 |


---

### 2. 常见的“非正常”运行状态 (Detail Status)
在 `Running` 或 `Pending` 阶段，你经常会看到具体的 `REASON`，这些才是排障的关键：

+ **ContainerCreating**: 正在创建容器，通常是在拉镜像或挂载存储。
+ **CrashLoopBackOff**: 容器启动后又崩溃了，K8s 正在尝试反复重启（通常是代码报错、配置文件不对）。
+ **ImagePullBackOff / ErrImagePull**: 镜像拉不下来（地址写错、网络不通、加速器没配好）。
+ **Terminating**: 正在删除中。如果一直卡在这个状态，通常是优雅退出超时（需用 `--force`）。
+ **Evicted**: 驱逐状态。节点资源（如磁盘、内存）快耗尽了，K8s 强制杀掉 Pod 以保护节点。
+ **OOMKilled**: 内存溢出。容器申请的内存超过了 `limits` 限制。

---

### 3. Pod 的四大状况 (Conditions)
如果你执行 `kubectl describe pod <name>`，在输出的底部会看到 `Conditions` 列表，这是更底层的健康指标：

1. **PodScheduled**: Pod 是否已经成功调度到某个 Node 上。
2. **Initialized**: 所有的 `initContainers`（初始化容器）是否已成功完成。
3. **ContainersReady**: Pod 内的所有容器是否都已经准备就绪。
4. **Ready**: Pod 是否已经可以开始处理请求（并会被加入到 Service 的负载均衡中）。







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
<font style="color:rgb(31, 31, 31);">简单来说，</font>**<font style="color:rgb(31, 31, 31);">CronJob</font>**<font style="color:rgb(31, 31, 31);"> 就是 Kubernetes 版的“闹钟”或“计划任务”。</font>

<font style="color:rgb(31, 31, 31);">如果你熟悉 Linux 的 </font>`<font style="color:rgb(68, 71, 70);">crontab</font>`<font style="color:rgb(31, 31, 31);">，那么 CronJob 就是把那种定时执行脚本的功能搬到了容器集群里。它不负责让程序“一直运行”，而是负责在</font>**<font style="color:rgb(31, 31, 31);">特定的时间点</font>**<font style="color:rgb(31, 31, 31);">拉起一个 </font>**<font style="color:rgb(31, 31, 31);">Job</font>**<font style="color:rgb(31, 31, 31);">（一次性任务），干完活就走。</font>

---

### <font style="color:rgb(31, 31, 31);">1. CronJob 的核心逻辑</font>
+ **<font style="color:rgb(31, 31, 31);">CronJob</font>**<font style="color:rgb(31, 31, 31);">: 策略层，规定“什么时候干”。</font>
+ **<font style="color:rgb(31, 31, 31);">Job</font>**<font style="color:rgb(31, 31, 31);">: 执行层，规定“干什么”。</font>
+ **<font style="color:rgb(31, 31, 31);">Pod</font>**<font style="color:rgb(31, 31, 31);">: 落地层，真正的容器在干活。</font>

---

### <font style="color:rgb(31, 31, 31);">2. 时间格式 (Schedule)</font>
<font style="color:rgb(31, 31, 31);">它的时间表达式由 5 位组成：</font>

`<font style="color:rgb(68, 71, 70);">分 时 日 月 周</font>`

+ `<font style="color:rgb(68, 71, 70);">*/5 * * * *</font>`<font style="color:rgb(31, 31, 31);">: 每 5 分钟执行一次。</font>
+ `<font style="color:rgb(68, 71, 70);">0 2 * * *</font>`<font style="color:rgb(31, 31, 31);">: 每天凌晨 2 点整执行一次。</font>
+ `<font style="color:rgb(68, 71, 70);">0 9 * * 1-5</font>`<font style="color:rgb(31, 31, 31);">: 每个工作日（周一到周五）早上 9 点执行。</font>

---

### <font style="color:rgb(31, 31, 31);">3. 如何使用（YAML 示例）</font>
<font style="color:rgb(31, 31, 31);">这是一个每分钟打印一次“Hello World”并退出的 CronJob：</font>

```plain
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

---

### <font style="color:rgb(31, 31, 31);">4. 关键参数（避坑指南）</font>
<font style="color:rgb(31, 31, 31);">写 CronJob 时，这几个参数非常重要：</font>

+ `**<font style="color:rgb(68, 71, 70);">concurrencyPolicy</font>**`**<font style="color:rgb(31, 31, 31);"> (并发策略)</font>**<font style="color:rgb(31, 31, 31);">:</font>
    - `<font style="color:rgb(68, 71, 70);">Allow</font>`<font style="color:rgb(31, 31, 31);"> (默认): 允许同时跑多个任务。</font>
    - `<font style="color:rgb(68, 71, 70);">Forbid</font>`<font style="color:rgb(31, 31, 31);">: 如果上一个还没跑完，下一个就先别开（防止任务堆积）。</font>
+ `**<font style="color:rgb(68, 71, 70);">startingDeadlineSeconds</font>**`<font style="color:rgb(31, 31, 31);">: 如果因为某种原因（如集群挂了）错过了触发时间，超过这个秒数就不再补跑了。</font>
+ `**<font style="color:rgb(68, 71, 70);">successfulJobsHistoryLimit</font>**`<font style="color:rgb(31, 31, 31);">: 保留多少个成功的 Pod 记录。默认 3 个。如果设为 0，你执行完就看不见日志了。</font>

---

### <font style="color:rgb(31, 31, 31);">5. 常用命令</font>
+ **<font style="color:rgb(31, 31, 31);">查看状态</font>**<font style="color:rgb(31, 31, 31);">:</font>

`<font style="color:rgb(68, 71, 70);">kubectl get cronjob</font>`<font style="color:rgb(31, 31, 31);"> (可以看到上次是什么时候执行的)</font>

+ **<font style="color:rgb(31, 31, 31);">查看执行历史</font>**<font style="color:rgb(31, 31, 31);">:</font>

`<font style="color:rgb(68, 71, 70);">kubectl get jobs</font>`<font style="color:rgb(31, 31, 31);"> (CronJob 每次执行都会生成一个 Job)</font>

+ **<font style="color:rgb(31, 31, 31);">手动触发一次</font>**<font style="color:rgb(31, 31, 31);">:</font>

<font style="color:rgb(31, 31, 31);">有时候没到时间，你想测试一下，可以手动根据 CronJob 生成一个 Job：</font>

`<font style="color:rgb(68, 71, 70);">kubectl create job --from=cronjob/my-cronjob test-run-01</font>`

+ **<font style="color:rgb(31, 31, 31);">删除</font>**<font style="color:rgb(31, 31, 31);">:</font>

`<font style="color:rgb(68, 71, 70);">kubectl delete cronjob my-cronjob</font>`

---

### <font style="color:rgb(31, 31, 31);">常见用途</font>
1. **<font style="color:rgb(31, 31, 31);">数据库备份</font>**<font style="color:rgb(31, 31, 31);">：每天凌晨自动 dump 数据库并上传云存储。</font>
2. **<font style="color:rgb(31, 31, 31);">清理临时文件</font>**<font style="color:rgb(31, 31, 31);">：每小时清理一次日志或缓存。</font>
3. **<font style="color:rgb(31, 31, 31);">发送报告</font>**<font style="color:rgb(31, 31, 31);">：每周一早上统计上周业务数据。</font>





## daemonSet-守护进程控制器	
**<font style="color:rgb(31, 31, 31);">DaemonSet (简称 DS)</font>**<font style="color:rgb(31, 31, 31);"> 是 Kubernetes 中一个非常特殊的控制器。</font>

<font style="color:rgb(31, 31, 31);">如果说 </font>**<font style="color:rgb(31, 31, 31);">Deployment</font>**<font style="color:rgb(31, 31, 31);"> 的目标是“不论在哪，只要帮我跑够 </font><font style="color:rgb(31, 31, 31);">$N$</font><font style="color:rgb(31, 31, 31);"> 个副本就行”，那么 </font>**<font style="color:rgb(31, 31, 31);">DaemonSet</font>**<font style="color:rgb(31, 31, 31);"> 的目标就是“</font>**<font style="color:rgb(31, 31, 31);">全员集结</font>**<font style="color:rgb(31, 31, 31);">”：它确保在集群的</font>**<font style="color:rgb(31, 31, 31);">每一个</font>**<font style="color:rgb(31, 31, 31);">（或指定的）Node 节点上，都运行且只运行一个 Pod 副本。</font>

---

### <font style="color:rgb(31, 31, 31);">1. 核心特性：如影随形</font>
+ **<font style="color:rgb(31, 31, 31);">自动覆盖</font>**<font style="color:rgb(31, 31, 31);">：每当有新节点加入集群，DaemonSet 会自动在该节点上启动一个 Pod。</font>
+ **<font style="color:rgb(31, 31, 31);">自动回收</font>**<font style="color:rgb(31, 31, 31);">：当节点从集群中移除时，DaemonSet 也会自动删除该节点上的 Pod。</font>
+ **<font style="color:rgb(31, 31, 31);">唯一性</font>**<font style="color:rgb(31, 31, 31);">：它能保证一个 Node 上不会运行两个相同的 DS Pod，避免资源冲突。</font>

---

### <font style="color:rgb(31, 31, 31);">2. 典型的使用场景（基础设施类）</font>
<font style="color:rgb(31, 31, 31);">DaemonSet 通常不用于跑业务（比如 Nginx 或 Java 应用），而是用于</font>**<font style="color:rgb(31, 31, 31);">支撑集群运行的后台服务</font>**<font style="color:rgb(31, 31, 31);">：</font>

+ **<font style="color:rgb(31, 31, 31);">网络插件 (CNI)</font>**<font style="color:rgb(31, 31, 31);">：例如 </font>`<font style="color:rgb(68, 71, 70);">calico-node</font>`<font style="color:rgb(31, 31, 31);"> 或 </font>`<font style="color:rgb(68, 71, 70);">flannel</font>`<font style="color:rgb(31, 31, 31);">。每个节点必须跑一个，否则节点无法通信。</font>
+ **<font style="color:rgb(31, 31, 31);">日志收集器</font>**<font style="color:rgb(31, 31, 31);">：例如 </font>`<font style="color:rgb(68, 71, 70);">fluentd</font>`<font style="color:rgb(31, 31, 31);"> 或 </font>`<font style="color:rgb(68, 71, 70);">logstash</font>`<font style="color:rgb(31, 31, 31);">。它们驻留在每个节点上，收集该节点上所有容器的日志。</font>
+ **<font style="color:rgb(31, 31, 31);">监控代理 (Agent)</font>**<font style="color:rgb(31, 31, 31);">：例如 </font>`<font style="color:rgb(68, 71, 70);">Prometheus Node Exporter</font>`<font style="color:rgb(31, 31, 31);">。它需要读取每个物理节点的 CPU、内存等硬件数据。</font>

---

### <font style="color:rgb(31, 31, 31);">3. 动手实践：编写一个 DaemonSet</font>
<font style="color:rgb(31, 31, 31);">假设我们要部署一个监控代理，其 YAML 结构如下：</font>

<font style="color:rgb(68, 71, 70);">YAML</font>

```plain
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

---

### <font style="color:rgb(31, 31, 31);">4. 进阶玩法：精准投放</font>
<font style="color:rgb(31, 31, 31);">虽然 DaemonSet 默认是“全员集结”，但你也可以通过 </font>**<font style="color:rgb(31, 31, 31);">标签 (Labels)</font>**<font style="color:rgb(31, 31, 31);"> 让它只在特定节点运行。</font>

#### <font style="color:rgb(31, 31, 31);">① 使用 nodeSelector</font>
<font style="color:rgb(31, 31, 31);">如果你只想在带 GPU 的节点上跑采集程序：</font>

<font style="color:rgb(68, 71, 70);">YAML</font>

```plain
spec:
  template:
    spec:
      nodeSelector:
        hardware: gpu  # 只有打了这个标签的节点才会运行该 Pod
```

#### <font style="color:rgb(31, 31, 31);">② 容忍污点 (Tolerations)</font>
<font style="color:rgb(31, 31, 31);">默认情况下，Master 节点是不跑 Pod 的（因为有污点）。但 DaemonSet 往往需要覆盖 Master，此时需要添加容忍度：</font>

<font style="color:rgb(68, 71, 70);">YAML</font>

```plain
spec:
  template:
    spec:
      tolerations:
      - key: node-role.kubernetes.io/master
        effect: NoSchedule
        operator: Exists
```

---

### <font style="color:rgb(31, 31, 31);">5. 常用管理命令</font>
+ **<font style="color:rgb(31, 31, 31);">查看状态</font>**<font style="color:rgb(31, 31, 31);">：</font>

`<font style="color:rgb(68, 71, 70);">kubectl get ds -n kube-system</font>`

_<font style="color:rgb(31, 31, 31);">你会发现 </font>_`_<font style="color:rgb(68, 71, 70);">DESIRED</font>_`_<font style="color:rgb(31, 31, 31);">（期望数）永远等于你的可用 </font>_`_<font style="color:rgb(68, 71, 70);">NODE</font>_`_<font style="color:rgb(31, 31, 31);"> 数量。</font>_

+ **<font style="color:rgb(31, 31, 31);">滚动更新</font>**<font style="color:rgb(31, 31, 31);">：</font>

<font style="color:rgb(31, 31, 31);">当你修改了 DS 的镜像，它会一个节点接一个节点地重启 Pod，保证监控或网络不中断。</font>

`<font style="color:rgb(68, 71, 70);">kubectl rollout status ds/node-exporter -n kube-system</font>`

---

### <font style="color:rgb(31, 31, 31);">总结对比</font>
| **<font style="color:rgb(31, 31, 31);">特性</font>** | **<font style="color:rgb(31, 31, 31);">Deployment</font>** | **<font style="color:rgb(31, 31, 31);">DaemonSet</font>** |
| --- | --- | --- |
| **<font style="color:rgb(31, 31, 31);">副本数</font>** | <font style="color:rgb(31, 31, 31);">手动指定（如 3 或 5）</font> | **<font style="color:rgb(31, 31, 31);">由节点数量决定</font>** |
| **<font style="color:rgb(31, 31, 31);">调度</font>** | <font style="color:rgb(31, 31, 31);">调度器选（哪空闲去哪）</font> | **<font style="color:rgb(31, 31, 31);">固定（每个节点一个）</font>** |
| **<font style="color:rgb(31, 31, 31);">删除节点时</font>** | <font style="color:rgb(31, 31, 31);">副本会在其他节点漂移重启</font> | **<font style="color:rgb(31, 31, 31);">副本随节点销毁，不漂移</font>** |
| **<font style="color:rgb(31, 31, 31);">典型用途</font>** | <font style="color:rgb(31, 31, 31);">业务应用、微服务</font> | **<font style="color:rgb(31, 31, 31);">网络、日志、监控等插件</font>** |








## pod的资源限制


### <font style="color:rgb(34, 34, 34);">为容器和 Pod 分配内存资源</font>




### <font style="color:rgb(34, 34, 34);">为容器和 Pods 分配 CPU 资源</font>
