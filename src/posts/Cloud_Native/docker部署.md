---
title: docker部署
icon: docker
date: 2026-01-21
category:
  - 云原生
---

## docker是什么？

Docker 是一款**开源的容器化平台**，核心作用是将应用程序及其所有依赖（代码、运行环境、库、配置文件等）打包成一个标准化的**容器**，让应用能在任意支持 Docker 的环境中（Linux/Windows/macOS、物理机 / 虚拟机 / 云服务器）**一致、无差异地运行**，解决了开发中 “本地运行正常，部署到服务器就出问题” 的**环境不一致痛点**。

简单来说：**Docker 把应用和它的 “运行环境” 一起打包成一个独立的 “容器盒子”，这个盒子能在任何装了 Docker 的机器上直接运行**。

![](https://cdn.nlark.com/yuque/0/2026/jpeg/62301513/1768961733174-4fc2c922-542a-4b47-a3f8-8ad5fb222ae7.jpeg)

docker是一个容器

k8s是一个软件，是一个docker容器集群管理工具		--go语言

## docker下载

### 先安装一些docker的必要依赖

yum install -y yum-utils device-mapper-persistent-data lvm2

### 添加阿里云Docker源（国内下载快）

yum-config-manager --add-repo https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo

### 安装最新版Docker

yum install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

### 启动并设置开机自启

systemctl start docker&& systemctl enable docker

### 验证安装

docker --version

### rpm查看docker是否安装

# 如果是新版 Docker（Docker CE），通常包名是 docker-ce

rpm-q docker-ce

# 查看所有 docker 相关的已安装包（最推荐）

rpm-qa|grep-idocker

查看启动的容器

[root@localhost yum.repos.d]# docker  ps  查看启动的容器

CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES

### 测试docker

#### mysql部署

##### 用docker.aityp.com查找镜像源

```
docker pull swr.cn-north-4.myhuaweicloud.com/ddn-k8s/docker.io/mysql:8.4.6
docker tag  swr.cn-north-4.myhuaweicloud.com/ddn-k8s/docker.io/mysql:8.4.6  docker.io/mysql:8.4.6
```

##### 启动sc-mysql-1容器

```
 docker run  -d  --name sc-mysql-1  -e "MYSQL_ROOT_PASSWORD=sc123456" -p 3306:3306  mysql:8.4.6
```

-d		deamon		后台运行

这条命令的核心作用是：**基于 ****mysql:8.4.6**** 镜像，创建并后台运行一个名为 ****sc-mysql-1**** 的 MySQL 容器，设置 root 密码为 ****sc123456****，并将主机的 3306 端口映射到容器的 3306 端口**。

##### 进入容器

```
docker exec -it sc-mysql-1 bash
```

##### 启动mysql

```
mysql -uroot -p'sc123456'
```

##### 退出mysql

```
exit
```

远程连接到Mysql里的客户端工具

1.Pycharm

2.Linux系统的mysql

3.navicat

#### nginx部署

nginx是web服务器软件，做网站的一个软件

docker	run	-d	--name	sc-nginx-1	-p 8080:80	nginx

没有找到就会从官方源拉取

##### 拉取nginx镜像文件

```
docker pull swr.cn-north-4.myhuaweicloud.com/ddn-k8s/docker.io/nginx:latest
docker tag  swr.cn-north-4.myhuaweicloud.com/ddn-k8s/docker.io/nginx:latest  docker.io/nginx:latest
```

##### 创建一个容器

docker create --name sc-nginx-1 nginx

```
[root@docker1 ~]# docker create --name sc-nginx-1 nginx
d432019f538bb264fe5613bd0666dedf92a61829ea1dd0d07155d17d9cd70d95
```

##### 运行nginx容器

docker start sc-nginx-1

```
[root@docker1 ~]# docker ps
CONTAINER ID   IMAGE         COMMAND                   CREATED         STATUS          PORTS                                                    NAMES
d432019f538b   nginx         "/bin/bash /etc/app/…"   3 minutes ago   Up 13 seconds   80/tcp                                                   sc-nginx-1
7dbfd3d69a8a   mysql:8.4.6   "docker-entrypoint.s…"   3 hours ago     Up 3 hours      0.0.0.0:3306->3306/tcp, [::]:3306->3306/tcp, 33060/tcp   sc-mysql-1
```

docker run =docker pull +镜像 +docker create +docker  start

##### 启动nginx

-it开启一个中断进行操作，交互式

bash进入容器内部运行的终端和

docker exec -it sc-nginx-1 bash

### 一些简单的docker命令

docker  images		 列出本地 Docker 主机上已经下载（拉取）或构建好的所有镜像（Image）

docker  ps			列出当前正在运行的 Docker 容器

docker  pull			拉取

docker  tag			为同一个镜像创建一个或多个别名（标签），方便镜像的识别、管理和推送

docker  run			运行容器

docker log 容器名		查看容器命令

docker rm 容器名		  删除容器

docker exec			 启动容器里的程序

docker top			  查看容器中运行的进程

docker stats 容器名	  查看容器占用的资源

docker inspect 容器名	  查看容器的详细信息（ip，网关）

docker cp while.sh sc-mysql-2:/	将主机上的文件复制到docker容器中

### socket文件

#### 文件socket文件，实现进程之间进行通讯

实现同一台机器里的不同的进程进行通信

#### 网络socket：ip+端口（port）

port端口号，不同程序占用不同的端口

#### 面试题：容器有多少种状态

docker ps查看容器状态

Exited

up

生命周期

Created 创建一个容器 --》start --》up ---》退出 --》Exited

#### C/S 架构（客户端 / 服务器架构）

C/S 架构是**Client/Server（客户端 / 服务器）** 的简称，是一种经典的软件体系架构，核心是将系统拆分为**客户端**和**服务器**两个独立部分，通过网络完成数据交互和功能协作，也是你日常使用 Docker 部署 MySQL、中间件等服务时最常接触的架构模式之一。

简单来说：**服务器负责提供核心的资源、数据、计算或服务能力，客户端负责向用户提供交互界面、接收用户操作并向服务器发起请求，再将服务器的响应结果展示给用户**。

### 停止docker进程docker里的容器也会暂停

```
[root@docker1 ~]# systemctl restart docker
[root@docker1 ~]# docker ps -a
CONTAINER ID   IMAGE          COMMAND                   CREATED             STATUS                      PORTS     NAMES
813ba12c8517   nginx:latest   "/docker-entrypoint.…"   3 minutes ago       Exited (0) 11 seconds ago             nginx-1
8b4a3ff12035   mysql:8.4.6    "docker-entrypoint.s…"   About an hour ago   Exited (0) 8 seconds ago              sc-mysql-3
7dbfd3d69a8a   mysql:8.4.6    "docker-entrypoint.s…"   4 hours ago         Exited (0) 8 seconds ago              sc-mysql-1
[root@docker1 ~]# 

```

### docker中的网络

![](https://cdn.nlark.com/yuque/0/2026/jpeg/62301513/1768985560954-10a20250-6ce6-44b5-86c9-68cf100e108e.jpeg)

![](https://cdn.nlark.com/yuque/0/2026/jpeg/62301513/1768985520975-e02e15a6-b717-4105-8db0-da03897fff42.jpeg)

![](https://cdn.nlark.com/yuque/0/2026/png/62301513/1769053756668-70abf08b-8a83-4e8b-b25e-ab7de40f3df4.png)

### 文件传输

#### scp传文件到不同机器上

scp 是基于 SSH 协议的安全文件传输工具，能在**本地主机 ****↔**** 远程主机**、**远程主机 ****↔**** 远程主机**之间安全复制文件 / 目录

```
scp [可选参数] 源文件/目录 目标地址
#把本地 /root/test.txt 复制到远程主机 192.168.1.100 的 /tmp 目录，登录用户为 root
# 基础格式（默认22端口）
scp /root/test.txt root@192.168.1.100:/tmp

# 若远程SSH端口非22（比如2222），加 -P 参数
scp -P 2222 /root/test.txt root@192.168.1.100:/tmp
```

#### 将宿主机的文件复制到docker容器中

docker cp while.sh sc-mysql-2:/

### docker容器在底层是如何限制一个进程使用的cpu和内存资源的，而且容器和容器之间如何做隔离的？

本质上 Docker 是基于 Linux 内核的**命名空间（Namespaces）、控制组（cgroups）、联合文件系统（UnionFS）** 三大核心技术实现的。

限制cpu，内存，磁盘I/O等资源	--》Linux内核的cgroup技术实现

#### 容器运行起来就是一个进程

启动容器 = 启动容器内的「PID 1 进程」

#### 查看容器的宿主机 PID（核心参数：Pid）

```
# 查看容器的宿主机 PID（核心参数：Pid）
docker inspect -f "{{.State.Pid}}" <容器名/容器ID>

# 示例：查看名为 test-nginx 的容器 PID
docker inspect -f "{{.State.Pid}}" test-nginx
# 输出：12345（宿主机上的真实 PID）
```

### Linux内核是什么？

内核就是一个软件，使用c语言开发的，用来控制硬件（内存，cpu，磁盘）

### 操作系统由什么组成？

![](https://cdn.nlark.com/yuque/0/2026/png/62301513/1769064698435-6424a1eb-abe9-48c2-8a95-9d0cd8a02d12.png)

operating system		--》os

#### 1.内核

对cpu的调度进行管理

对内存分配进行管理

会进程进行管理

对磁盘进行管理

对网络进行管理	--》tcp/ip

对其他硬件进行管理

#### 2.应用程序：实现某个功能的具体软件		--》企业和个人

#### 3.系统调用：systemctl call	就是内核给应用调用的一个接口

#### 4.shell	解释器：执行命令，查找命令，告诉内核去执行，然后将结果返回给用户

库函数，第三方

每启动一个docker，将会启动一个进程

```
[root@docker1 ~]# ps aux|grep containerd-shim
root        3314  0.0  0.5 1234088 15292 ?       Sl   12:23   0:01 /usr/bin/containerd-shim-runc-v2 -namespace moby -id 39836905871a5ef003e548f7439a592a42956cb2d36bc6a080aeb3a0a39f997b -address /run/containerd/containerd.sock
root        4742  0.0  0.6 1233832 15692 ?       Sl   13:06   0:05 /usr/bin/containerd-shim-runc-v2 -namespace moby -id d39e8478cd2d2296cb32ea15a77534fa6b2c2ccf9616f0134084fc667e9b3d60 -address /run/containerd/containerd.sock
root        5617  0.0  0.0   6616  2196 pts/2    S+   15:06   0:00 grep --color=auto containerd-shim
[root@docker1 ~]# 

```

### 限制虚拟机资源

如何知道我有多少个cpu核心

1.lscpu

2.top

3.cat /proc/cpuinfo

-c，  --cpu-share int			 cpu  shares(relative weight) 可以分享多少cpu的算力资源

```
docker  run   -d  --name sc-mysql-2 --cpu-shares 500  -m 500000000 -e "MYSQL_ROOT_PASSWORD=sc123456"  -p33062:3306  mysql:8.4.6
```

限制cpu，磁盘资源

#### Linux 原生的 cgroups 工具限制

cgroup v2 不再区分 cpu.cfs_quota_us/cpu.cfs_period_us，而是通过 cpu.max 统一配置 CPU 配额，语法更简洁。

```
# 1. 切换到 cgroup v2 根目录（统一挂载点）
cd /sys/fs/cgroup

# 2. 创建自定义控制组（命名为 cpu_limit_50）
sudo mkdir cpu_limit_50
sudo chmod 775 cpu_limit_50  # 赋予读写权限（方便后续操作）

# 配置 CPU 最大使用率为 50%
echo "50000 100000" | sudo tee cpu_limit_50/cpu.max

# 验证配置（输出 50000 100000 表示生效）
cat cpu_limit_50/cpu.max

# 将进程 12345 加入 cpu_limit_50 控制组
echo 12345 | sudo tee cpu_limit_50/cgroup.procs

# 验证：查看控制组内的进程（输出 12345 表示绑定成功）
cat cpu_limit_50/cgroup.procs

# 实时监控进程 CPU 使用率（按 P 按 CPU 排序）
top -p 12345
```

****

##### 解除cpu限制

```
# 1. 解除单个进程的 CPU 限制（从控制组移除）
sed -i '/12345/d' /sys/fs/cgroup/cpu_limit_50/cgroup.procs

# 2. 彻底删除控制组（需先清空进程）
sudo rmdir /sys/fs/cgroup/cpu_limit_50
```

****

#### Docker 容器限制

##### 一、核心命令示例（Nginx 容器）

运行

```
docker run -d --name nginx-2 -c 300 -m 200000000 --device-read-bps /dev/sda:20M nginx:latest
```

##### 二、参数逐行拆解
<table id="zNxti" class="ne-table" style="width: 750px"><tbody><tr style="height: 33px"><td width="250" style="background-color: rgba(0, 0, 0, 0)">
**参数**
</td><td width="250" style="background-color: rgba(0, 0, 0, 0)">
**等价写法**
</td><td width="250" style="background-color: rgba(0, 0, 0, 0)">
**含义说明**
</td></tr><tr style="height: 33px"><td width="250" style="background-color: rgba(0, 0, 0, 0)">
docker run
</td><td width="250" style="background-color: rgba(0, 0, 0, 0)">
-
</td><td width="250" style="background-color: rgba(0, 0, 0, 0)">
Docker 创建并启动容器的基础命令
</td></tr><tr style="height: 33px"><td width="250" style="background-color: rgba(0, 0, 0, 0)">
-d
</td><td width="250" style="background-color: rgba(0, 0, 0, 0)">
-
</td><td width="250" style="background-color: rgba(0, 0, 0, 0)">
后台运行（守护进程模式），不占用终端，容器后台持续提供服务
</td></tr><tr style="height: 33px"><td width="250" style="background-color: rgba(0, 0, 0, 0)">
--name nginx-2
</td><td width="250" style="background-color: rgba(0, 0, 0, 0)">
-
</td><td width="250" style="background-color: rgba(0, 0, 0, 0)">
自定义容器名称为 nginx-2

，方便后续管理（如 docker stop nginx-2

）
</td></tr><tr style="height: 33px"><td width="250" style="background-color: rgba(0, 0, 0, 0)">
-c 300
</td><td width="250" style="background-color: rgba(0, 0, 0, 0)">
--cpu-shares=300
</td><td width="250" style="background-color: rgba(0, 0, 0, 0)">
CPU 权重限制（软限制）：1. 默认权重 1024，值越低竞争优先级越低；2. 仅宿主机 CPU 紧张时生效，空闲时可使用全部 CPU；3. 示例：与权重 1024 的容器竞争时，本容器约占 29%（300/1024）CPU 资源
</td></tr><tr style="height: 33px"><td width="250" style="background-color: rgba(0, 0, 0, 0)">
-m 200000000
</td><td width="250" style="background-color: rgba(0, 0, 0, 0)">
--memory=200m
</td><td width="250" style="background-color: rgba(0, 0, 0, 0)">
内存硬限制：1. 限制容器最大可用内存为 200MB（200000000 字节）；2. 超量时 Docker 会触发 OOM，限制内存或终止容器；3. 推荐用 200m

简写，更易读
</td></tr><tr style="height: 33px"><td width="250" style="background-color: rgba(0, 0, 0, 0)">
--device-read-bps /dev/sda:20M
</td><td width="250" style="background-color: rgba(0, 0, 0, 0)">
-
</td><td width="250" style="background-color: rgba(0, 0, 0, 0)">
磁盘读速度限制：1. 限制容器对宿主机 /dev/sda

磁盘的读取速度≤20MB/s；2. /dev/sda

为宿主机主磁盘（可通过 lsblk

确认设备名）；3. 避免容器大量读盘拖慢宿主机
</td></tr><tr style="height: 33px"><td width="250" style="background-color: rgba(0, 0, 0, 0)">
nginx:latest
</td><td width="250" style="background-color: rgba(0, 0, 0, 0)">
-
</td><td width="250" style="background-color: rgba(0, 0, 0, 0)">
基于官方最新版 Nginx 镜像创建容器（本地无镜像时自动拉取）
</td></tr></tbody></table>
##### 三、补充说明

###### 1. 资源限制类型区分


- **软限制**：仅资源紧张时生效（如 --cpu-shares），不限制空闲资源使用；
- **硬限制**：严格限制最大使用量（如 -m、--device-read-bps），超量即触发限制。

###### 2. 常用扩展参数
<table id="msYsd" class="ne-table" style="width: 750px"><tbody><tr style="height: 33px"><td width="250" style="background-color: rgba(0, 0, 0, 0)">
**需求场景**
</td><td width="250" style="background-color: rgba(0, 0, 0, 0)">
**扩展参数示例**
</td><td width="250" style="background-color: rgba(0, 0, 0, 0)">
**说明**
</td></tr><tr style="height: 33px"><td width="250" style="background-color: rgba(0, 0, 0, 0)">
严格限制 CPU 核数
</td><td width="250" style="background-color: rgba(0, 0, 0, 0)">
--cpus=0.5
</td><td width="250" style="background-color: rgba(0, 0, 0, 0)">
限制最多使用 0.5 个 CPU 核（比 --cpu-shares

更精准）
</td></tr><tr style="height: 33px"><td width="250" style="background-color: rgba(0, 0, 0, 0)">
磁盘写速度限制
</td><td width="250" style="background-color: rgba(0, 0, 0, 0)">
--device-write-bps /dev/sda:10M
</td><td width="250" style="background-color: rgba(0, 0, 0, 0)">
限制磁盘写入速度≤10MB/s
</td></tr><tr style="height: 33px"><td width="250" style="background-color: rgba(0, 0, 0, 0)">
端口映射（外部访问）
</td><td width="250" style="background-color: rgba(0, 0, 0, 0)">
-p 8080:80
</td><td width="250" style="background-color: rgba(0, 0, 0, 0)">
宿主机 8080 端口映射到容器 80 端口，外部可通过 宿主机IP:8080

访问 Nginx
</td></tr></tbody></table>
###### 3. 验证与管理命令

运行

```
# 查看容器是否启动成功
docker ps

# 查看容器详细资源限制配置（HostConfig 字段）
docker inspect nginx-2

# 停止容器
docker stop nginx-2

# 删除容器（需先停止）
docker rm nginx-2
```

##### 四、同类命令对

运行

```
# 限制 CPU 权重 500 + 内存 500MB + 端口映射 + 环境变量
docker run -d --name sc-mysql-2 --cpu-shares 500 -m 500m -e "MYSQL_ROOT_PASSWORD=sc123456" -p 33062:3306 mysql:8.4.6
```


- 核心差异：多了 -e（设置环境变量）和 -p（端口映射），资源限制逻辑与 Nginx 容器一致。

##### 五、总结


- 核心逻辑：通过 docker run 参数直接限制 CPU、内存、磁盘等资源，避免容器过度占用宿主机资源；
- 实用原则： - 内存用硬限制（-m），避免 OOM 影响宿主机； - CPU 按需求选择：权重（--cpu-shares）或核数（--cpus）； - 磁盘 IO 限制根据宿主机磁盘设备名调整（/dev/sda 需确认）；
- 扩展建议：需外部访问时添加 -p 宿主机端口:容器端口 映射。

****

****

### dd是一个可以备份的命令

dd 备份文件的优势是保留文件权限、时间戳，且支持按大小 / 块数精准备份，适合备份日志文件、数据库文件等。

#### 备份单个文件

```
# 备份 test.txt 到 backup_test.txt，4K 块大小提升效率​
dd if=test.txt of=backup_test.txt bs=4K
```

#### 部分备份文件（按大小 / 块数）

```
# 从备份文件恢复到原文件（覆盖原文件，需谨慎！）
dd if=backup_test.txt of=test.txt bs=4K
```

#### 恢复文件（反向执行 dd）

```
# 从备份文件恢复到原文件（覆盖原文件，需谨慎！）
dd if=backup_test.txt of=test.txt bs=4K
```

![](https://cdn.nlark.com/yuque/0/2026/jpeg/62301513/1769073610257-020c5ba0-5692-47e6-887d-53a586aac180.jpeg)

cgroup和namespace 都是linux内核里本来就有的

docker 只是做针对用户端的界面，整合资源

### 微服务： 微小的服务 ---》部署使用容器--》app

集中式的服务--》拆分成很多微小服务--》单独部署和运维、开发

### 云计算 ---》云是有小水珠组成 ---》机房里有很多的服务器--》互联网机房大量的服务器

可扩展和伸缩

cloud computing

### 云原生：  k8s和docker  云原生基金会

Cloud Native Computing Foundation（云原生计算基金会），简称 CNCF

K8S、Prometheus、ETCD、docker

### IAAS，PAAS，SAAS

#### IaaS（Infrastructure as a Service，基础设施即服务）---》买服务器 --》业务

基础设施--》硬件服务器

将服务器、存储、网络、操作系统等底层 IT 基础设施封装为服务，通过互联网交付给用户，用户无需购买物理硬件，按需租用虚拟资源。

#### PaaS（Platform as a Service，平台即服务） --》买平台软件--》平台里可以有很多功能和软件

#### SaaS（Software as a Service，软件即服务） --》买软件

serverless  不需要服务器 --》函数计算

## 查看磁盘

块设备	--》磁盘设备	block device

sda	代表一块磁盘

sda1代表第一个磁盘

```
[root@docker1 ~]# lsblk
NAME        MAJ:MIN RM  SIZE RO TYPE MOUNTPOINTS
sda           8:0    0   20G  0 disk 
├─sda1        8:1    0    1M  0 part 
├─sda2        8:2    0    1G  0 part /boot
└─sda3        8:3    0   19G  0 part 
  ├─cs-root 253:0    0   17G  0 lvm  /
  └─cs-swap 253:1    0    2G  0 lvm  [SWAP]
sr0          11:0    1  7.3G  0 rom  
```

## docker镜像相关命令

镜像	--》本质就是一个软件

实现windows和linux之间的文件传输

### xtft

### lrzsz工具

[root@docker1 /]# yum install lrzsz

rz	从windows里接收文件

sz	从服务器下载指定文件到你的本地电脑

```
# 覆盖已存在的文件（默认不覆盖，会报错）
rz -y

# 上传时显示详细进度
rz -v
```

#### 一些例子

```
# 1. 进入服务器的 /tmp 目录（方便测试）
cd /tmp

# 2. 上传本地文件（比如本地的 test.txt）
rz -y  # 弹出窗口选 test.txt，上传到 /tmp 下

# 3. 查看上传的文件
ls -l test.txt

# 4. 下载该文件到本地
sz test.txt  # 自动下载到本地终端的下载目录

# 5. 验证：本地打开下载目录，能看到 test.txt 即为成功
```

### docker镜像命令

#### docker load - 从 tar 包加载镜像（还原 save 打包的镜像）

**作用**：将 docker save 生成的 tar 包还原为本地镜像，保留原镜像的分层、标签等信息。**核心特点**：只能加载 docker save 打包的镜像包，不能加载 docker export 的容器包。

```
# 加载 mysql-8.4.6.tar 包为本地镜像
docker load -i mysql-8.4.6.tar

# 加载后查看镜像（验证是否成功）
docker images | grep mysql
# 输出示例：mysql    8.4.6    xxxxxxxx    2 hours ago    500MB
```

#### docker save - 保存镜像为 tar 包（带分层 / 元数据）

**作用**：将**本地镜像**打包成 tar 归档文件，保留镜像的分层结构、标签、历史记录等完整元数据，适合镜像的备份 / 迁移。**核心特点**：操作对象是「镜像」，打包后可通过 docker load 还原为镜像。

```
# 保存 mysql:8.4.6 镜像为 tar 包（指定输出文件名）
docker save mysql:8.4.6 -o mysql-8.4.6.tar

# 同时保存多个镜像到一个 tar 包
docker save nginx:latest redis:7.0 -o multi-images.tar

# 查看打包后的文件（验证是否生成）
ls -l mysql-8.4.6.tar
```

#### docker export - 导出容器为 tar 包（扁平化，无分层）

**作用**：将**运行 / 停止的容器**打包成 tar 归档文件，会将容器的文件系统「扁平化」（合并所有分层），只保留最终的文件状态，丢失镜像的分层、历史等元数据。**核心特点**：操作对象是「容器」，打包后体积更小，但还原后是镜像（无历史）。

```
# 先查看运行的容器（获取容器ID/名称，比如你的 sc-mysql-1）
docker ps

# 导出 sc-mysql-1 容器为 tar 包
docker export sc-mysql-1 -o sc-mysql-1-container.tar

# 查看导出的文件
ls -l sc-mysql-1-container.tar
```

#### docker import - 导入 tar 包为镜像（还原 export 打包的容器）

**作用**：将 docker export 生成的容器 tar 包导入为本地镜像，生成的是「扁平化镜像」（无分层、无历史），可指定新标签。**核心区别**：与 docker load 不同，import 针对容器包，load 针对镜像包。

```
# 导入容器包为新镜像（命名为 my-mysql:v1）
docker import sc-mysql-1-container.tar my-mysql:v1

# 查看导入的镜像（验证）
docker images | grep my-mysql
# 输出示例：my-mysql    v1    yyyyyyyy    10 seconds ago    450MB
```

#### docker commit - 将容器修改提交为新镜像

**作用**：基于运行 / 停止的容器的「当前状态」创建新镜像（相当于给容器打快照），适合临时保存容器的修改（比如在容器内安装了软件，想保存为镜像）。**核心特点**：操作对象是「容器」，生成的镜像包含容器的所有修改，有分层（基于原镜像）。

```
# 1. 先进入 sc-mysql-1 容器，做一些修改（比如创建测试文件）
docker exec -it sc-mysql-1 touch /tmp/test.txt

# 2. 提交容器修改为新镜像（命名为 my-mysql:v2）
docker commit sc-mysql-1 my-mysql:v2

# 3. 查看新镜像（验证）
docker images | grep my-mysql
# 输出示例：my-mysql    v2    zzzzzzzz    5 seconds ago    451MB
```

#### docker pull - 拉取镜像（从仓库下载）

**作用**：从 Docker Hub 或私有镜像仓库下载镜像到本地，是使用镜像的第一步。

```
# 拉取官方 MySQL 8.4.6 镜像（指定标签）
docker pull mysql:8.4.6

# 拉取最新版 Nginx 镜像（默认 latest）
docker pull nginx

# 拉取私有仓库镜像（假设私有仓库地址为 192.168.1.100:5000）
docker pull 192.168.1.100:5000/my-nginx:v1
```

#### docker rmi - 删除本地镜像

**作用**：删除本地不需要的镜像，需注意：若镜像被容器（运行 / 停止）引用，需先删除容器（docker rm 容器ID）才能删除镜像。

```
# 删除指定标签的镜像（my-mysql:v1）
docker rmi my-mysql:v1

# 强制删除镜像（比如镜像被容器引用）
docker rmi -f mysql:8.4.6

# 删除所有未打标签的镜像（清理垃圾）
docker rmi $(docker images -f "dangling=true" -q)
```

#### 这些命令的使用场景
<table id="Vf5zO" class="ne-table" style="width: 751px"><tbody><tr style="height: 33px"><td width="187" style="background-color: rgba(0, 0, 0, 0)">
**命令**
</td><td width="188" style="background-color: rgba(0, 0, 0, 0)">
**操作对象**
</td><td width="188" style="background-color: rgba(0, 0, 0, 0)">
**核心特点**
</td><td width="188" style="background-color: rgba(0, 0, 0, 0)">
**适用场景**
</td></tr><tr style="height: 33px"><td width="187" style="background-color: rgba(0, 0, 0, 0)">
save
</td><td width="188" style="background-color: rgba(0, 0, 0, 0)">
镜像
</td><td width="188" style="background-color: rgba(0, 0, 0, 0)">
保留分层 / 元数据，体积大
</td><td width="188" style="background-color: rgba(0, 0, 0, 0)">
镜像备份、迁移
</td></tr><tr style="height: 66px"><td width="187" style="background-color: rgba(0, 0, 0, 0)">
export
</td><td width="188" style="background-color: rgba(0, 0, 0, 0)">
容器
</td><td width="188" style="background-color: rgba(0, 0, 0, 0)">
扁平化，无分层，体积小
</td><td width="188" style="background-color: rgba(0, 0, 0, 0)">
容器快照（仅保留文件）
</td></tr><tr style="height: 33px"><td width="187" style="background-color: rgba(0, 0, 0, 0)">
load
</td><td width="188" style="background-color: rgba(0, 0, 0, 0)">
镜像包
</td><td width="188" style="background-color: rgba(0, 0, 0, 0)">
还原 save 的镜像，保留元数据
</td><td width="188" style="background-color: rgba(0, 0, 0, 0)">
恢复 save 打包的镜像
</td></tr><tr style="height: 33px"><td width="187" style="background-color: rgba(0, 0, 0, 0)">
import
</td><td width="188" style="background-color: rgba(0, 0, 0, 0)">
容器包
</td><td width="188" style="background-color: rgba(0, 0, 0, 0)">
还原 export 的容器，生成扁平镜像
</td><td width="188" style="background-color: rgba(0, 0, 0, 0)">
恢复 export 打包的容器
</td></tr><tr style="height: 33px"><td width="187" style="background-color: rgba(0, 0, 0, 0)">
commit
</td><td width="188" style="background-color: rgba(0, 0, 0, 0)">
容器
</td><td width="188" style="background-color: rgba(0, 0, 0, 0)">
基于容器修改生成新镜像，有分层
</td><td width="188" style="background-color: rgba(0, 0, 0, 0)">
临时保存容器修改
</td></tr></tbody></table>
base image	基础镜像--》地基

为什么镜像文件一般都比较小？跟操作系统的镜像文件比

容器启动的时候，使用的宿主机的内核，而镜像文件里时没有内核的

镜像的组成：微型的操作系统（没有内核，只有必须的库，应用程序，shell）+核心的应用程序+依赖的软件

![](https://cdn.nlark.com/yuque/0/2026/png/62301513/1769153801065-eaba7eb6-1f93-49d9-b4c8-1b87840129b2.png)

## docker容器中的网络

查看docker容器中的网络

docker nertwork ls

```
[root@docker1 overlayfs]# docker network ls
NETWORK ID     NAME      DRIVER    SCOPE
f0649c2614a6   bridge    bridge    local
7930737ccb6d   host      host      local
92becf5d9b09   none      null      local

```

![](https://cdn.nlark.com/yuque/0/2026/jpeg/62301513/1769158211218-d5edaab8-f0ac-44ad-b142-bf089bc947b9.jpeg)

### DHCP 核心概念与工作原理

DHCP（Dynamic Host Configuration Protocol，动态主机配置协议）是一种**局域网网络协议**，核心作用是**自动为接入网络的设备分配 IP 地址、子网掩码、网关、DNS 服务器**等网络配置信息，避免手动配置的繁琐和 IP 冲突问题，实现网络设备的 “即插即用”。

**SNAT**：

修改数据包**源 IP**，内网设备访问外网时，将私有 IP 转为网关公网 IP，实现内网出外网，需指定固定公网 IP；

**DNAT**：

修改数据包**目的 IP**，外网访问内网时，将网关公网 IP 转为内网目标设备私有 IP，实现外网进内网；

**MASQUERADE**：

SNAT 的动态变体，无需指定 IP，自动  适配网关出口网卡的动态 IP（如家庭宽带），场景更灵活

![](https://cdn.nlark.com/yuque/0/2026/png/62301513/1769158024923-1cb1a100-2ff6-4f46-9334-5ed34ebfda62.png)

### 查看linux的防火墙策略 --》内核里的NAT转化策略

iptables -t nat -n -L |grep DNAT

```
[root@docker1 overlayfs]# iptables -t nat -n -L |grep DNAT
DNAT       tcp  --  0.0.0.0/0            0.0.0.0/0            tcp dpt:8080 to:172.17.0.2:80
[root@docker1 overlayfs]# 

```

容器		container

网络		network

driver	驱动 ---》3种不同的类型

```
[root@docker1 ~]# docker network --help
Usage:  docker network COMMAND

Manage networks

Commands:
  connect     Connect a container to a network
  create      Create a network
  disconnect  Disconnect a container from a network
  inspect     Display detailed information on one or more networks
  ls          List networks
  prune       Remove all unused networks
  rm          Remove one or more networks

```

查看网络设备

```
[root@docker1 ~]# docker network ls
NETWORK ID     NAME      DRIVER    SCOPE
9ad9777d5d99   bridge    bridge    local
7930737ccb6d   host      host      local
92becf5d9b09   none      null      local

```

## 网络模式

bridge	桥/桥接		 默认模式，容器有独立私有 IP，需端口映射对外

host 	主机			 共享宿主机 IP / 端口，无独立网络空间，性能最高

null		空/无		 无网络（仅回环地址），完全隔离

创建一个网桥

docker network create sc-net

创建一个容器使用这个网桥

docker run -d --network sc-net --name sc-net-nginx-1 -p 9001:80 nginx:latest

```
[root@docker1 ~]# docker run -d --network sc-net --name sc-net-nginx-1 -p 9001:80 nginx:latest
b9f05e341068ba547ceb00cee16e19b87e6064858196bc626ade22769e2198dc
[root@docker1 ~]# docker ps
CONTAINER ID   IMAGE          COMMAND                   CREATED         STATUS          PORTS                                     NAMES
b9f05e341068   nginx:latest   "/docker-entrypoint.…"   5 seconds ago   Up 4 seconds    0.0.0.0:9001->80/tcp, [::]:9001->80/tcp   sc-net-nginx-1
813ba12c8517   nginx:latest   "/docker-entrypoint.…"   4 days ago      Up 29 minutes   0.0.0.0:8080->80/tcp, [::]:8080->80/tcp   nginx-1

```

查看容器的ip 地址

docker inspect  sc-net-nginx-1|grep -i IPADDR

```
[root@docker1 ~]# docker inspect  sc-net-nginx-1|grep -i IPADDR
                    "IPAddress": "172.18.0.2",
```

### Host 网络模式（最简单，容器共享宿主机 IP）

在 CentOS 中将 Docker 容器 IP**直接映射**到宿主机，核心是让容器使用**宿主机的网络命名空间**（即host网络模式），或通过**macvlan/ipvlan 网络**让容器获得与宿主机同网段的独立 IP（宿主机可直接转发，容器 IP 对外可见），两种方式适配不同场景，以下是详细操作和适用场景（覆盖 CentOS 7/8/9，Docker 环境）。

#### 核心原理

容器不创建独立的网络命名空间，**直接使用宿主机的 IP、端口、网卡**，容器内的端口会直接绑定到宿主机的对应端口，相当于容器进程直接运行在宿主机网络中，**容器无独立 IP**（与宿主机 IP 完全一致）。

#### 适用场景


- 需让容器端口直接暴露，无需端口映射（如服务需要占用宿主机特定端口，无端口冲突）；
- 对网络性能要求高（无网络转发开销）。

#### 操作命令

##### 1. 创建容器时指定--network host（创建后无法修改）

```
# 示例：创建Nginx容器，使用host网络模式
docker run -d --name nginx-host --network host nginx:latest
```

##### 2. 验证效果


- 容器内的端口（如 Nginx 的 80）**直接绑定宿主机 80 端口**，无需加-p 80:80；
- 查看容器网络：容器 IP 与宿主机一致，无独立网桥 IP。

```
# 查看容器网络信息
docker inspect nginx-host | grep -E "IPAddress|Gateway"
# 宿主机直接访问localhost:80即可访问容器Nginx
curl localhost:80
```

容器中的命名空间（ Namespace  ）
<table id="hSuAC" class="ne-table" style="width: 748px"><tbody><tr style="height: 33px"><td width="187" style="background-color: rgba(0, 0, 0, 0)">
**命名空间类型**
</td><td width="187" style="background-color: rgba(0, 0, 0, 0)">
**标识（CLONE_*）**
</td><td width="187" style="background-color: rgba(0, 0, 0, 0)">
**作用（通俗解释）**
</td><td width="187" style="background-color: rgba(0, 0, 0, 0)">
**典型应用场景**
</td></tr><tr style="height: 33px"><td width="187" style="background-color: rgba(0, 0, 0, 0)">
UTS
</td><td width="187" style="background-color: rgba(0, 0, 0, 0)">
CLONE_NEWUTS
</td><td width="187" style="background-color: rgba(0, 0, 0, 0)">
隔离主机名、域名（容器可自定义 hostname）
</td><td width="187" style="background-color: rgba(0, 0, 0, 0)">
Docker 容器独立主机名
</td></tr><tr style="height: 33px"><td width="187" style="background-color: rgba(0, 0, 0, 0)">
IPC
</td><td width="187" style="background-color: rgba(0, 0, 0, 0)">
CLONE_NEWIPC
</td><td width="187" style="background-color: rgba(0, 0, 0, 0)">
隔离进程间通信（如消息队列、共享内存）
</td><td width="187" style="background-color: rgba(0, 0, 0, 0)">
容器间 IPC 互不干扰
</td></tr><tr style="height: 33px"><td width="187" style="background-color: rgba(0, 0, 0, 0)">
PID
</td><td width="187" style="background-color: rgba(0, 0, 0, 0)">
CLONE_NEWPID
</td><td width="187" style="background-color: rgba(0, 0, 0, 0)">
隔离进程 ID（容器内 PID 从 1 开始，与宿主机隔离）
</td><td width="187" style="background-color: rgba(0, 0, 0, 0)">
容器内进程独立 PID 空间
</td></tr><tr style="height: 33px"><td width="187" style="background-color: rgba(0, 0, 0, 0)">
NETWORK
</td><td width="187" style="background-color: rgba(0, 0, 0, 0)">
CLONE_NEWNET
</td><td width="187" style="background-color: rgba(0, 0, 0, 0)">
隔离网络资源（网卡、IP、端口、路由等）
</td><td width="187" style="background-color: rgba(0, 0, 0, 0)">
Docker 的 bridge/host 网络
</td></tr><tr style="height: 33px"><td width="187" style="background-color: rgba(0, 0, 0, 0)">
MOUNT
</td><td width="187" style="background-color: rgba(0, 0, 0, 0)">
CLONE_NEWNS
</td><td width="187" style="background-color: rgba(0, 0, 0, 0)">
隔离文件系统挂载点（容器独立挂载目录）
</td><td width="187" style="background-color: rgba(0, 0, 0, 0)">
容器独立的文件系统
</td></tr><tr style="height: 33px"><td width="187" style="background-color: rgba(0, 0, 0, 0)">
USER
</td><td width="187" style="background-color: rgba(0, 0, 0, 0)">
CLONE_NEWUSER
</td><td width="187" style="background-color: rgba(0, 0, 0, 0)">
隔离用户 / 组 ID（容器内 root≠宿主机 root）
</td><td width="187" style="background-color: rgba(0, 0, 0, 0)">
容器权限隔离（安全）
</td></tr><tr style="height: 33px"><td width="187" style="background-color: rgba(0, 0, 0, 0)">
CGROUP
</td><td width="187" style="background-color: rgba(0, 0, 0, 0)">
CLONE_NEWCGROUP
</td><td width="187" style="background-color: rgba(0, 0, 0, 0)">
隔离 cgroup 根目录（容器独立的 cgroup 视图）
</td><td width="187" style="background-color: rgba(0, 0, 0, 0)">
容器资源限制独立管理
</td></tr><tr style="height: 33px"><td width="187" style="background-color: rgba(0, 0, 0, 0)">
TIME
</td><td width="187" style="background-color: rgba(0, 0, 0, 0)">
CLONE_NEWTIME
</td><td width="187" style="background-color: rgba(0, 0, 0, 0)">
隔离系统时钟（容器可独立设置时间）
</td><td width="187" style="background-color: rgba(0, 0, 0, 0)">
需独立时间的容器（罕见）
</td></tr></tbody></table>
#### 关键补充


- **核心常用的 6 种**：UTS、IPC、PID、NETWORK、MOUNT、USER 是 Docker/K8s 等容器技术最常使用的，也是实现容器 “独立运行环境” 的核心；
- **后两种扩展**：CGROUP（Linux 4.6+）、TIME（Linux 5.6+）是较新的命名空间，主要用于更精细的资源 / 时间隔离，日常使用较少；
- **容器隔离本质**：Docker 创建容器时，会为容器创建上述（核心）命名空间，让容器看起来像 “独立的小系统”，而宿主机可通过命名空间实现对容器的管控。

### overlay

#### 1. Docker 核心：overlay 文件系统（overlay2 为升级版，默认采用）

Linux 内核的**分层联合文件系统**，Docker 用其实现镜像**分层只读存储**+ 容器**写时复制（CoW）**，容器启动时在镜像只读层上创建唯一可写层，修改仅写入该层，节省磁盘且镜像可复用，是容器镜像 / 文件系统的底层核心。

#### 2. Docker Swarm/K8s 核心：overlay 网络（底层基于 VXLAN）

Docker 原生的**跨主机虚拟二层网络**，为集群中所有节点的容器构建统一虚拟网络，实现**跨物理机容器的二层互通**，通过 VNI 标识隔离不同 overlay 网络，是 Swarm 集群跨节点容器通信的默认方案。

![](https://cdn.nlark.com/yuque/0/2026/png/62301513/1769398890937-f35bf0d0-4159-437f-9867-8105c5b3b240.png)

计算机网络五层协议

![](https://cdn.nlark.com/yuque/0/2026/png/62301513/1769397720289-6c69374c-a9c2-480a-8fe2-c6b5451eb503.png)

#### VXLAN

VXLAN（Virtual Extensible LAN，虚拟可扩展局域网）是**三层网络上的二层虚拟网络技术**，核心是把二层以太网帧封装成 UDP 数据包在三层 IP 网络中传输，解决传统二层网络的规模限制（如 VLAN 仅 4096 个），实现跨物理机 / 跨网段的容器 / 虚拟机二层互通，是云原生、容器集群（K8s）的核心网络技术。

![](https://cdn.nlark.com/yuque/0/2026/png/62301513/1769399336467-91323002-3048-4e6b-aa3c-94267f7b3663.png)

### Docker Swarm

Docker Swarm 是**Docker 官方原生的容器编排工具**，轻量易部署，基于 Docker 引擎内置实现，无需额外安装，核心用于将多台 Docker 主机组成**集群（Swarm Cluster）**，实现容器的**分布式部署、高可用、负载均衡和弹性伸缩**，适配中小规模容器集群场景。

coreOS		--》rocket --》容器管理器

podman		--》容器软件

contianerd	--》容器软件

## K8S

kubernetes --》google --》CNCF （云原生基金会） --》IBM google Microsoft redhat 等--》

是容器集群管理软件 --》容器编排软件

K8s 是**开源的容器编排平台**，源自 Google，是容器集群管理的工业级标准，核心解决大规模容器的部署、调度、高可用、扩缩容、自愈、网络互通等问题，适配从中小规模到超大规模（万级节点）的容器集群场景。

容器里的数据

### 容器中「卷（Volume）」

卷是 Docker/K8s 中**用于容器持久化存储、实现容器与宿主机 / 容器间数据共享**的核心机制，本质是**将宿主机的目录 / 文件、网络存储，映射到容器内部的指定路径**，突破容器「存储层临时、销毁即丢失数据」的限制。

```
cd /var/lib/docker
ls
buildkit    engine-id  plugins  runtimes  tmp
containers  network    rootfs   swarm     volumes
```

容器的数据 --》想办法保存到磁盘里 --》持久化存储 --》永久保存

卷：实现容器和宿主之间的数据保存和共享

实现容器之间的数据贡献

卷：volume

卷：容器储存数据的地方

mount 挂载 --》挂车

将U盘或移动硬盘

### 查看所有卷

```
docker volumn ls
```

#### 查看容器文件挂载的位置

```
# 查看king-mysql-1容器的卷挂载信息（重点找Source字段）
docker inspect king-mysql-1 | grep -E "Source|Destination" -A 2 -B 2
```

![](https://cdn.nlark.com/yuque/0/2026/png/62301513/1769411912923-aa2bcce8-a51e-40a1-972a-5e2394ee4aae.png)

#### 进入挂载卷

```
# 替换为你查到的卷ID
cd /var/lib/docker/volumes/70ce2282e17399f2d2a56833b52c8443c228d7726162536bdab033cad873e3ba/_data

# 查看数据库文件（如mysql库、你新建的库）
ls -l
```

![](https://cdn.nlark.com/yuque/0/2026/png/62301513/1769411977788-09bc0c70-fcb8-4f0a-afdc-377f9fe233fe.png)

#### 里面会有你创建的数据库

数据库是一个文件夹

表是一个文件

![](https://cdn.nlark.com/yuque/0/2026/png/62301513/1769412176909-c4fabe3c-58f6-4928-b370-f71699d69c18.png)

### 

### 启动一个nginx容器，挂载一个卷myweb，卷里有一个网站的首页index.html和图片my.jpg

#### 1. 创建卷

首先创建 Docker 命名卷myweb（Docker 会自动在/var/lib/docker/volumes/myweb/_data下创建存储目录）：

```
docker volume create myweb
```

#### 2.查看卷挂载的位置

```
dokcer volumn inspcet myweb
```

#### 3. 准备网站首页index.html到卷中

Docker 命名卷的实际存储路径是/var/lib/docker/volumes/myweb/_data，直接将index.html写入该路径：

```
# 写入自定义首页内容（可替换为你自己的HTML代码）
echo "<!DOCTYPE html>
<html>
<head>
    <title>My Custom Web</title>
</head>
<body>
    
# Hello Docker Volume!

    
这是挂载myweb卷的Nginx首页

</body>
</html>" > /var/lib/docker/volumes/myweb/_data/index.html
```

#### 4. 启动 Nginx 容器并挂载myweb卷

将myweb卷挂载到 Nginx 容器的默认网页目录/usr/share/nginx/html（覆盖容器默认首页），并映射宿主机端口（如 8080）方便访问：

```
docker run -d \
  --name nginx-myweb \  # 容器名
  -p 8080:80 \          # 宿主机8080端口映射到容器80端口
  -v myweb:/usr/share/nginx/html \  # 挂载myweb卷到容器网页目录
  nginx:latest          # Nginx镜像（默认最新版）
```

### 

```
docker volume create logs
docker run --rm \
  --mount src=logs,dst=/logs \
  alpine mkdir -p /logs/app1 /logs/app2
  #实际的功能就是在logs卷对应的目录下啊创建logs/app1和/logs/app2
docker run -d \
  --name=app1 \
  --mount src=logs,dst=/var/log/app1,volume-subpath=app1 \
  app1:latest
 #将指定的
docker run -d \
  --name=app2 \
  --mount src=logs,dst=/var/log/app2,volume-subpath=app2 \
  app2:latest
```

--rm		当容器退出时，自动删除容器

source --》src

destination --》dst

创建容器后之间进入：
<hr id="v93iy" class="ne-hr">
```
docker run -d --rm --name=app1 --mount src=logs,dst=/var/log/app1,volume-subpath=app1 alpine:latest sh -c "sleep 100"
```

sh -c "sleep 100" 让容器启动起来后运行 sh 这个 shell，里面运行 sleep 100 命令 --> 暂停 100 秒
<hr id="J6Jot" class="ne-hr">
```
[root@docker _data]# docker run -d --rm --name=app1 --mount src=logs,dst=/var/log/app1,volume-subpath=app1 alpine:latest sh -c "sleep 100"
```

```
[root@docker _data]# docker run --rm -it --name=app3 --mount src=logs,dst=/var/log/app1,volume-subpath=app1 alpine:latest sh
```

****启动一个容器 app1，容器启动后，立马进入这个容器，当我们退出容器的时候，容器会被立马删除

## 容器的网络类型总结

3种网络类型

bridge	--》snat和dnat	--》默认

host	--》和宿主机使用相同的ip地址

null	没有ip地址

docker network ls

docker network inspect sc-net

容器的卷

docker volume create/inspect/rm

卷的作用：持久化存储

实现宿主机之间的数据共享，容器和容器之间的数据共享

一台宿主机上的卷的使用

多台宿主机之间的数据共享  --》nfs

## NFS部署

nfs共享文件上具有的有时

1.成本低廉

2.安装方便

3.使用传统的tcp/ip网络

![](https://cdn.nlark.com/yuque/0/2026/png/62301513/1769482201224-94851827-9979-40ed-aae1-b78b2d024553.png)

nas设备：具体的网络附加存储服务器，里面可以运行一个nfs服务，对外提供共享文件的功能

oss（Object Storage Service）

![](https://cdn.nlark.com/yuque/0/2026/png/62301513/1769483199418-f0290a6a-b521-425d-9842-be841a4b6de9.png)

![](https://cdn.nlark.com/yuque/0/2026/png/62301513/1769483419495-b283e795-adde-45ac-a61b-a5da2704c1a1.png)

#### 1. NAS（Network Attached Storage，网络附加存储）


- **技术本质**：**文件级**网络存储，基于**文件系统协议**（你用的 NFS、还有 SMB/CIFS），通过局域网（TCP/IP）提供文件共享，多节点可同时挂载。
- **核心特点**：部署简单、成本低、共享性好；但 IO 性能比 SAN 低，适合小文件 / 非核心业务。
- **和你的关联**：你在 web1 上搭建的 NFS 服务器，就是**NAS 的最经典实现**，目的是让 web2 等节点挂载同一个 NFS 目录，实现网页源文件 / 配置的统一管理，这是 NAS 最典型的 “多服务器文件共享” 场景。

#### 2. SAN（Storage Area Network，存储区域网络）


- **技术本质**：**块级**专用网络存储，基于**块协议**（FC 光纤通道 / ISCSI），需要搭建**专用存储网络**（和业务网隔离），给服务器分配 “块设备”（如 /dev/sdb），服务器格式化后当作本地硬盘使用。
- **核心特点**：IO 性能极高（毫秒级延迟）、稳定性强、支持多路径冗余；但部署复杂、成本高（需要光纤交换机 / 专用网卡），适合对性能要求苛刻的场景。
- **关键区别（和 NAS）**：NAS 是**多节点共享一个文件系统**，SAN 是**每个节点独占一个虚拟块设备**，SAN 的隔离性和性能远优于 NAS。

#### 3. OSS（Object Storage Service，对象存储服务）


- **技术本质**：云厂商提供的**托管式对象存储**，基于**对象协议**（S3/OSS API），以**对象**为存储单位（文件 + 元数据 + 唯一 ID），无文件系统层级（无文件夹 / 目录概念，文件夹是逻辑模拟），通过互联网 / 内网访问。
- **核心特点**：无限扩容、按使用量计费、性价比高、数据持久性极强（云厂商承诺 99.999999999%）；但 IO 延迟高，不适合随机读写（如数据库）。
- **典型产品**：阿里云 OSS、腾讯云 COS、亚马逊 S3、华为云 OBS，均兼容 S3 协议，可通过工具挂载到本地服务器 / 容器。

#### 4. 云存储


- **技术本质**：**云厂商的存储产品合集**，不是单一技术，是云平台把 NAS/SAN/ 对象存储 / 本地硬盘等技术打包成**开箱即用的托管服务**，用户无需关注底层部署和维护，按需选购、弹性扩容。
- **核心品类**：


- 云块存储（云硬盘）：对应 SAN，给云服务器分配虚拟块设备（如阿里云 ECS 云盘、腾讯云 CVM 云硬盘）；
- 云文件存储：对应 NAS，提供 NFS/SMB 协议的云共享存储（如阿里云 NAS、腾讯云 CFS）；
- 云对象存储：即 OSS/COS/S3；
- 混合云存储：打通本地和云存储，实现数据同步 / 容灾。


- **核心特点**：零部署成本、弹性扩容、专业运维、按需付费；但依赖云厂商，有网络依赖和数据迁移成本。

#### 5. Ceph（开源分布式统一存储系统）


- **技术本质**：**开源的分布式存储集群**，基于**CRUSH 算法**（无中心节点），由大量普通 x86 服务器组成，一套集群可同时提供**文件存储（Ceph FS，对应 NAS）、块存储（RBD，对应 SAN）、对象存储（RGW，对应 OSS）**，即 **“统一存储”**。
- **核心特点**：


- 无单点故障：任意节点宕机不影响业务，数据多副本存储；
- 线性扩容：增加服务器即可线性提升存储容量和性能；
- 开源免费：无厂商锁定，可基于普通服务器搭建；
- 适配云原生：完美支持 Docker/K8s，是云原生集群的主流存储方案。

<table id="Mr64H" class="ne-table" style="width: 748px"><tbody><tr style="height: 33px"><td width="187" style="background-color: rgba(0, 0, 0, 0)">
**技术 / 产品**
</td><td width="187" style="background-color: rgba(0, 0, 0, 0)">
**核心定位**
</td><td width="187" style="background-color: rgba(0, 0, 0, 0)">
**通俗理解**
</td><td width="187" style="background-color: rgba(0, 0, 0, 0)">
**典型使用场景**
</td></tr><tr style="height: 33px"><td width="187" style="background-color: rgba(0, 0, 0, 0)">
**NAS**
</td><td width="187" style="background-color: rgba(0, 0, 0, 0)">
局域网文件级共享存储
</td><td width="187" style="background-color: rgba(0, 0, 0, 0)">
一台 “局域网专用的超大容量共享 U 盘 / 硬盘”，多台机器（如你的 web1/web2）可直接挂载读写同一个文件夹
</td><td width="187" style="background-color: rgba(0, 0, 0, 0)">
多服务器共享配置 / 网页源文件（你的 NFS 就是 NAS 的一种实现）、办公文件共享、容器集群共享数据
</td></tr><tr style="height: 33px"><td width="187" style="background-color: rgba(0, 0, 0, 0)">
**SAN**
</td><td width="187" style="background-color: rgba(0, 0, 0, 0)">
局域网块级高性能存储
</td><td width="187" style="background-color: rgba(0, 0, 0, 0)">
一台 “局域网专用的高速磁盘阵列”，给每台服务器分配**专属的 “虚拟磁盘”**，服务器把它当本地硬盘用
</td><td width="187" style="background-color: rgba(0, 0, 0, 0)">
数据库（MySQL/PostgreSQL）、虚拟机、对 IO 速度 / 稳定性要求高的核心业务
</td></tr><tr style="height: 33px"><td width="187" style="background-color: rgba(0, 0, 0, 0)">
**OSS**
</td><td width="187" style="background-color: rgba(0, 0, 0, 0)">
云厂商对象存储服务
</td><td width="187" style="background-color: rgba(0, 0, 0, 0)">
云平台提供的 **“无限容量的互联网文件仓库”**，按文件（对象）存储，通过 API / 域名访问
</td><td width="187" style="background-color: rgba(0, 0, 0, 0)">
图片 / 视频 / 日志存储、静态网站托管、云容器 / 云服务器的持久化数据、数据备份
</td></tr><tr style="height: 33px"><td width="187" style="background-color: rgba(0, 0, 0, 0)">
**云存储**
</td><td width="187" style="background-color: rgba(0, 0, 0, 0)">
云厂商全品类存储统称
</td><td width="187" style="background-color: rgba(0, 0, 0, 0)">
云平台打包的 **“存储全家桶”**，包含云 NAS / 云 SAN / 对象存储 / 云硬盘等，按需选购即可
</td><td width="187" style="background-color: rgba(0, 0, 0, 0)">
不想自己搭建存储集群、追求快速上线的云业务，混合云架构（本地 + 云）
</td></tr><tr style="height: 33px"><td width="187" style="background-color: rgba(0, 0, 0, 0)">
**Ceph**
</td><td width="187" style="background-color: rgba(0, 0, 0, 0)">
开源分布式统一存储
</td><td width="187" style="background-color: rgba(0, 0, 0, 0)">
一款**能自己搭建的 “分布式存储万能工具”**，一套集群同时实现**NAS（文件）+SAN（块）+ 对象存储**，无单点故障
</td><td width="187" style="background-color: rgba(0, 0, 0, 0)">
企业自建私有云、容器 /k8s 集群存储、替代传统 SAN/NAS、超大规模数据存储（PB/EB 级）
</td></tr></tbody></table>
## docker中怎么制作镜像

docker	容器技术

1.镜像	image			--》本质上就是一个软件

2.仓库	repository		--》存放镜像的地方		--》网站

3.容器	container		--》运行镜像的地方		--》就是进程

镜像里面到底有哪些内容？

镜像：微型的操作系统（系统工具，依赖的系统库，环境设置）+code（核心代码 --》软件代码）

镜像越小越好

1.存储消耗的空间少

2.传输，消耗的时间短

3.运行，消耗的内存少

镜像的分层思想

Overlayfs		--》对镜像进行分层管理，相同的

## Dockerfile

Dockerfile 是一个**纯文本格式的配置文件 / 脚本**，你可以把它理解成 Docker 镜像的 “制作说明书” 或 “菜谱”—— 里面用一系列预定义的指令（比如 FROM、RUN、COPY）描述了构建一个 Docker 镜像的完整步骤，Docker 引擎能按照这个 “说明书” 自动、精准地构建出符合要求的镜像。

#### 一些dockerdile的命令
<table id="u9haz" class="ne-table" style="width: 750px"><tbody><tr style="height: 33px"><td width="250" style="background-color: rgba(0, 0, 0, 0)">
**指令**
</td><td width="250" style="background-color: rgba(0, 0, 0, 0)">
**核心作用**
</td><td width="250" style="background-color: rgba(0, 0, 0, 0)">
**示例**
</td></tr><tr style="height: 33px"><td width="250" style="background-color: rgba(0, 0, 0, 0)">
FROM
</td><td width="250" style="background-color: rgba(0, 0, 0, 0)">
指定基础镜像（必须是第一条非注释指令）
</td><td width="250" style="background-color: rgba(0, 0, 0, 0)">
FROM python:3.9-slim
</td></tr><tr style="height: 33px"><td width="250" style="background-color: rgba(0, 0, 0, 0)">
WORKDIR
</td><td width="250" style="background-color: rgba(0, 0, 0, 0)">
设置容器内的工作目录（避免路径混乱）
</td><td width="250" style="background-color: rgba(0, 0, 0, 0)">
WORKDIR /app
</td></tr><tr style="height: 33px"><td width="250" style="background-color: rgba(0, 0, 0, 0)">
ENV
</td><td width="250" style="background-color: rgba(0, 0, 0, 0)">
设置环境变量（容器内全局可用）
</td><td width="250" style="background-color: rgba(0, 0, 0, 0)">
ENV PYTHONUNBUFFERED=1
</td></tr><tr style="height: 33px"><td width="250" style="background-color: rgba(0, 0, 0, 0)">
COPY
</td><td width="250" style="background-color: rgba(0, 0, 0, 0)">
从主机复制文件 / 目录到镜像（常用）
</td><td width="250" style="background-color: rgba(0, 0, 0, 0)">
COPY requirements.txt .
</td></tr><tr style="height: 33px"><td width="250" style="background-color: rgba(0, 0, 0, 0)">
RUN
</td><td width="250" style="background-color: rgba(0, 0, 0, 0)">
执行命令（安装依赖、修改配置等）
</td><td width="250" style="background-color: rgba(0, 0, 0, 0)">
RUN pip install -r requirements.txt
</td></tr><tr style="height: 33px"><td width="250" style="background-color: rgba(0, 0, 0, 0)">
EXPOSE
</td><td width="250" style="background-color: rgba(0, 0, 0, 0)">
声明容器要暴露的端口（仅说明，不实际映射）
</td><td width="250" style="background-color: rgba(0, 0, 0, 0)">
EXPOSE 5000
</td></tr><tr style="height: 33px"><td width="250" style="background-color: rgba(0, 0, 0, 0)">
CMD
</td><td width="250" style="background-color: rgba(0, 0, 0, 0)">
定义容器启动时执行的命令（可被覆盖）
</td><td width="250" style="background-color: rgba(0, 0, 0, 0)">
CMD ["python", "app.py"]
</td></tr></tbody></table>
案例1：busybox + shell脚本（核心代码）

mkdir -p /myapp/busybox

vim while.sh

插入以下内容

```
#!/bin/sh

i=1
while true
do
	echo "hello,world,welcome to wang $1"
	sleep 1
	let i++
done

```

拉取镜像

```
docker pull swr.cn-north-4.myhuaweicloud.com/ddn-k8s/quay.io/prometheus/busybox:latest
docker tag  swr.cn-north-4.myhuaweicloud.com/ddn-k8s/quay.io/prometheus/busybox:latest  busybox:latest

```

创建dockerfile

```
vim Dokerfile
```

```
# 基础镜像（busybox轻量级Linux镜像）
FROM    busybox:latest

# 设置容器工作目录为根目录
WORKDIR /

# 将拼写错误的COPT改为正确的COPY，复制当前目录所有文件到镜像根目录
COPY . /

# 当我们制作镜像的时候，会启动一个临时的容器，在这个临时的容器里进行操作（只是在制作镜像时使用）
RUN touch sc.txt && mkdir wang && sleep 5

# 执行while.sh，指定镜像执行完成后，启动容器的时候运行的第一个命令
ENTRYPOINT ["/bin/sh","/while.sh"]                          
```

建立一个镜像

```
docker build -t wangbusybox:1.0 .
```

案例2	python程序制作镜像

![](https://cdn.nlark.com/yuque/0/2026/png/62301513/1769504041123-7d2da3d4-296b-4716-9d6f-1c344e3cdf1e.png)

![](https://cdn.nlark.com/yuque/0/2026/png/62301513/1769504966032-296ebb64-b09a-4291-94d0-c74930906274.png)