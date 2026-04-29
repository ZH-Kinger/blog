---
title: Docker中的一些进程
icon: docker
date: 2026-01-29
category:
  - 云原生
---

查看docker里的一些进程

```
[root@docker1 ~]# ps -aux
USER         PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
root           1  0.0  0.5  22344 12972 ?        Ss   10:38   0:01 /usr/lib/systemd/systemd --swi
root           2  0.0  0.0      0     0 ?        S    10:38   0:00 [kthreadd]
root           3  0.0  0.0      0     0 ?        S    10:38   0:00 [pool_workqueue_release]
root           4  0.0  0.0      0     0 ?        I<   10:38   0:00 [kworker/R-rcu_gp]
root           5  0.0  0.0      0     0 ?        I<   10:38   0:00 [kworker/R-sync_wq]
root           6  0.0  0.0      0     0 ?        I<   10:38   0:00 [kworker/R-slub_flushwq]
root           7  0.0  0.0      0     0 ?        I<   10:38   0:00 [kworker/R-netns]
root           9  0.0  0.0      0     0 ?        I<   10:38   0:00 [kworker/0:0H-kblockd]

```

process 进程

id	标识符

pid

![](https://cdn.nlark.com/yuque/0/2026/png/62301513/1769657494185-ec4d05a5-ef32-45ac-bfd6-0d55c89d41f3.png)

访问数据库	--》客户端的工具	--》pycharm，mysql，navicat等

浏览器

## proxy	代理 --》中间人

在 Docker 语境中，**proxy（代理）** 主要指**Docker 的网络代理配置**，用于让 Docker 守护进程（dockerd）、Docker 客户端（docker命令）或容器内的应用，通过代理服务器访问外部网络（比如拉取镜像、容器内应用访问外网）；同时也可指 Docker 网络模式 / 组件中的代理相关功能（如反向代理容器、socks5 代理等），**最核心的是 Docker 自身的代理配置**（解决拉取镜像失败、容器网络访问受限问题）。

## docker相关的进程

### 一、Docker 核心进程（按作用分类）

Docker 的运行依赖多个进程协同工作，核心进程主要分为**守护进程**和**容器进程**两大类：

#### 1. Docker 守护进程（Docker Daemon）

这是 Docker 的核心后台进程，也是最关键的进程，所有 Docker 命令（docker run/docker ps等）都通过客户端与它交互。


- **进程名**：dockerd（主进程），可能伴随子进程如containerd、containerd-shim、runc（Docker 1.11 + 后拆分为模块化架构）。
- containerd = 容器管理总管家（负责容器生命周期的核心调度）；
- containerd-shim = 容器与总管家之间的 “隔离垫片”（避免单个容器崩溃影响总管家）；
- runc = 真正创建 / 运行容器的 “工人”（容器运行时的最底层实现）。
- **作用**：


- 监听 Docker API 请求（本地 socket 或 TCP）；
- 管理容器的生命周期（创建、启动、停止、销毁）；
- 管理镜像、网络、存储卷等资源；
- 调用containerd和runc实现容器的底层隔离。


- **查看方式**：bash运行

```
# 查看dockerd进程
ps aux | grep dockerd
# 查看Docker相关的所有进程
ps aux | grep -E 'dockerd|containerd|runc'
```

#### 2. 容器进程

每个运行中的容器对应宿主机上的一个（或多个）进程，是容器内应用的载体：


- **核心进程**：runc（创建容器的底层运行时，每个容器对应一个runc进程）、containerd-shim（隔离容器与containerd，容器退出后保留日志等信息）。
- containerd = 容器管理总管家（负责容器生命周期的核心调度）；
- containerd-shim = 容器与总管家之间的 “隔离垫片”（避免单个容器崩溃影响总管家）；
- runc = 真正创建 / 运行容器的 “工人”（容器运行时的最底层实现）。
- **容器内进程**：容器启动时指定的ENTRYPOINT/CMD（如nginx、mysql、java等），在宿主机上可通过ps aux | grep 容器ID看到。
- **查看方式**：bash运行

```
# 查看运行中容器的宿主机进程ID
docker top <容器ID/名称>
# 查看宿主机上所有容器相关进程
ps aux | grep -E 'runc|containerd-shim'
```

### 二、Docker 核心文件 / 目录（按功能分类）

Docker 的所有配置、镜像、容器数据、日志等都存储在宿主机的特定目录，核心文件 / 目录如下（默认路径，不同系统略有差异）：
<table id="Acvi3" class="ne-table" style="width: 719px"><tbody><tr style="height: 33px"><td width="250" style="background-color: rgba(0, 0, 0, 0)">
**路径**
</td><td width="219" style="background-color: rgba(0, 0, 0, 0)">
**类型**
</td><td width="250" style="background-color: rgba(0, 0, 0, 0)">
**作用**
</td></tr><tr style="height: 33px"><td width="250" style="background-color: rgba(0, 0, 0, 0)">
/var/run/docker.sock
</td><td width="219" style="background-color: rgba(0, 0, 0, 0)">
Socket 文件
</td><td width="250" style="background-color: rgba(0, 0, 0, 0)">
Docker 客户端与dockerd

通信的 Unix 域套接字（核心通信文件）
</td></tr><tr style="height: 33px"><td width="250" style="background-color: rgba(0, 0, 0, 0)">
/etc/docker/
</td><td width="219" style="background-color: rgba(0, 0, 0, 0)">
目录
</td><td width="250" style="background-color: rgba(0, 0, 0, 0)">
Docker 主配置目录
</td></tr><tr style="height: 33px"><td width="250" style="background-color: rgba(0, 0, 0, 0)">
/etc/docker/daemon.json
</td><td width="219" style="background-color: rgba(0, 0, 0, 0)">
配置文件
</td><td width="250" style="background-color: rgba(0, 0, 0, 0)">
Docker 守护进程的核心配置（如镜像加速、存储驱动、网络等）
</td></tr><tr style="height: 33px"><td width="250" style="background-color: rgba(0, 0, 0, 0)">
/var/lib/docker/
</td><td width="219" style="background-color: rgba(0, 0, 0, 0)">
目录
</td><td width="250" style="background-color: rgba(0, 0, 0, 0)">
Docker 的核心数据目录（**最重要**），所有镜像、容器、卷、网络数据都存在这里
</td></tr><tr style="height: 33px"><td width="250" style="background-color: rgba(0, 0, 0, 0)">
/var/lib/docker/images/
</td><td width="219" style="background-color: rgba(0, 0, 0, 0)">
目录
</td><td width="250" style="background-color: rgba(0, 0, 0, 0)">
存储 Docker 镜像的分层文件（镜像的层数据）
</td></tr><tr style="height: 33px"><td width="250" style="background-color: rgba(0, 0, 0, 0)">
/var/lib/docker/containers/
</td><td width="219" style="background-color: rgba(0, 0, 0, 0)">
目录
</td><td width="250" style="background-color: rgba(0, 0, 0, 0)">
存储每个容器的元数据（配置、日志、容器 ID 等）
</td></tr><tr style="height: 33px"><td width="250" style="background-color: rgba(0, 0, 0, 0)">
/var/lib/docker/volumes/
</td><td width="219" style="background-color: rgba(0, 0, 0, 0)">
目录
</td><td width="250" style="background-color: rgba(0, 0, 0, 0)">
存储 Docker 卷（持久化数据），容器删除后卷数据仍保留
</td></tr><tr style="height: 33px"><td width="250" style="background-color: rgba(0, 0, 0, 0)">
/var/lib/docker/network/
</td><td width="219" style="background-color: rgba(0, 0, 0, 0)">
目录
</td><td width="250" style="background-color: rgba(0, 0, 0, 0)">
存储 Docker 网络相关数据（网桥、端口映射、网络配置等）
</td></tr><tr style="height: 33px"><td width="250" style="background-color: rgba(0, 0, 0, 0)">
/var/log/docker/
</td><td width="219" style="background-color: rgba(0, 0, 0, 0)">
目录
</td><td width="250" style="background-color: rgba(0, 0, 0, 0)">
Docker 守护进程的日志文件（如daemon.log

）
</td></tr><tr style="height: 33px"><td width="250" style="background-color: rgba(0, 0, 0, 0)">
/var/lib/docker/overlay2/

（或devicemapper/

）
</td><td width="219" style="background-color: rgba(0, 0, 0, 0)">
目录
</td><td width="250" style="background-color: rgba(0, 0, 0, 0)">
存储镜像 / 容器的分层文件系统（取决于 Docker 的存储驱动，overlay2

是主流）
</td></tr><tr style="height: 33px"><td width="250" style="background-color: rgba(0, 0, 0, 0)">
/usr/bin/docker
</td><td width="219" style="background-color: rgba(0, 0, 0, 0)">
可执行文件
</td><td width="250" style="background-color: rgba(0, 0, 0, 0)">
Docker 客户端命令行工具（docker

命令的执行文件）
</td></tr><tr style="height: 33px"><td width="250" style="background-color: rgba(0, 0, 0, 0)">
/usr/bin/dockerd
</td><td width="219" style="background-color: rgba(0, 0, 0, 0)">
可执行文件
</td><td width="250" style="background-color: rgba(0, 0, 0, 0)">
Docker 守护进程的可执行文件
</td></tr></tbody></table>
### 三、关键补充说明


- **进程依赖关系**：docker客户端 → dockerd → containerd → containerd-shim → runc → 容器内进程这种分层架构让 Docker 更稳定（比如单个容器崩溃不影响dockerd）。
- **文件权限**：/var/run/docker.sock默认属于root和docker组，普通用户需加入docker组才能免 sudo 使用 Docker：

```
usermod -aG docker <用户名>
```


- **日志文件**：容器内应用的日志默认存储在/var/lib/docker/containers/<容器ID>/<容器ID>-json.log，也可通过docker logs <容器ID>查看。
- **配置文件生效**：修改/etc/docker/daemon.json后，需重启dockerd才能生效：bash运行

```
systemctl restart docker
```

## 进程树

进程和线程的区别

进程里包含线程，一个线程理解为一个子进程

线程消耗更少的内存资源的cpu资源

## 容器的生命周期

容器的生命周期：life cycle

容器的生命周期是指容器从**创建**到**终止**的完整状态流转过程，Docker 容器的核心状态及流转关系如下：

### 1. 核心状态以及一些命令
<table id="vLQG9" class="ne-table" style="width: 748px"><tbody><tr style="height: 33px"><td width="187" style="background-color: rgba(0, 0, 0, 0)">
**核心命令**
</td><td width="187" style="background-color: rgba(0, 0, 0, 0)">
**适用容器状态**
</td><td width="187" style="background-color: rgba(0, 0, 0, 0)">
**核心作用**
</td><td width="187" style="background-color: rgba(0, 0, 0, 0)">
**关键参数 / 补充说明**
</td></tr><tr style="height: 33px"><td width="187" style="background-color: rgba(0, 0, 0, 0)">
docker create
</td><td width="187" style="background-color: rgba(0, 0, 0, 0)">
无容器
</td><td width="187" style="background-color: rgba(0, 0, 0, 0)">
创建容器（仅初始化，不运行）
</td><td width="187" style="background-color: rgba(0, 0, 0, 0)">
可搭配 - p/-v/--name 配置端口 / 挂载 / 容器名
</td></tr><tr style="height: 33px"><td width="187" style="background-color: rgba(0, 0, 0, 0)">
docker run
</td><td width="187" style="background-color: rgba(0, 0, 0, 0)">
无容器
</td><td width="187" style="background-color: rgba(0, 0, 0, 0)">
创建并直接运行容器
</td><td width="187" style="background-color: rgba(0, 0, 0, 0)">
-d 后台运行，--restart 设置自动重启策略
</td></tr><tr style="height: 33px"><td width="187" style="background-color: rgba(0, 0, 0, 0)">
docker start
</td><td width="187" style="background-color: rgba(0, 0, 0, 0)">
Created/Exited
</td><td width="187" style="background-color: rgba(0, 0, 0, 0)">
启动容器（进入运行态）
</td><td width="187" style="background-color: rgba(0, 0, 0, 0)">
可批量启动：docker start 容器 1 容器 2
</td></tr><tr style="height: 33px"><td width="187" style="background-color: rgba(0, 0, 0, 0)">
docker pause
</td><td width="187" style="background-color: rgba(0, 0, 0, 0)">
Up/Running
</td><td width="187" style="background-color: rgba(0, 0, 0, 0)">
冻结容器进程（进入暂停态）
</td><td width="187" style="background-color: rgba(0, 0, 0, 0)">
仅冻结进程，不释放资源
</td></tr><tr style="height: 33px"><td width="187" style="background-color: rgba(0, 0, 0, 0)">
docker unpause
</td><td width="187" style="background-color: rgba(0, 0, 0, 0)">
Paused
</td><td width="187" style="background-color: rgba(0, 0, 0, 0)">
解冻容器进程（恢复运行态）
</td><td width="187" style="background-color: rgba(0, 0, 0, 0)">
恢复后容器服务无缝继续
</td></tr><tr style="height: 33px"><td width="187" style="background-color: rgba(0, 0, 0, 0)">
docker stop
</td><td width="187" style="background-color: rgba(0, 0, 0, 0)">
Up/Running/Paused
</td><td width="187" style="background-color: rgba(0, 0, 0, 0)">
优雅停止容器（进入停止态）
</td><td width="187" style="background-color: rgba(0, 0, 0, 0)">
默认等待 10 秒超时，可通过 - t 指定超时时间
</td></tr><tr style="height: 33px"><td width="187" style="background-color: rgba(0, 0, 0, 0)">
docker kill
</td><td width="187" style="background-color: rgba(0, 0, 0, 0)">
Up/Running/Paused
</td><td width="187" style="background-color: rgba(0, 0, 0, 0)">
强制停止容器（进入停止态）
</td><td width="187" style="background-color: rgba(0, 0, 0, 0)">
直接发送 SIGKILL，不等待进程优雅退出
</td></tr><tr style="height: 33px"><td width="187" style="background-color: rgba(0, 0, 0, 0)">
docker restart
</td><td width="187" style="background-color: rgba(0, 0, 0, 0)">
Up/Running/Paused/Exited
</td><td width="187" style="background-color: rgba(0, 0, 0, 0)">
重启容器（停止→运行）
</td><td width="187" style="background-color: rgba(0, 0, 0, 0)">
重启后容器 ID / 数据不变
</td></tr><tr style="height: 33px"><td width="187" style="background-color: rgba(0, 0, 0, 0)">
docker rm
</td><td width="187" style="background-color: rgba(0, 0, 0, 0)">
Exited（默认）
</td><td width="187" style="background-color: rgba(0, 0, 0, 0)">
删除容器（进入删除态）
</td><td width="187" style="background-color: rgba(0, 0, 0, 0)">
-f 强制删除运行中容器，-v 同时删除容器挂载的匿名卷
</td></tr><tr style="height: 33px"><td width="187" style="background-color: rgba(0, 0, 0, 0)">
docker container prune
</td><td width="187" style="background-color: rgba(0, 0, 0, 0)">
所有 Exited 容器
</td><td width="187" style="background-color: rgba(0, 0, 0, 0)">
批量清理已停止容器
</td><td width="187" style="background-color: rgba(0, 0, 0, 0)">
执行前会确认，-f 直接清理无需确认
</td></tr></tbody></table>
### 2. 状态流转顺序

![](https://cdn.nlark.com/yuque/0/2026/png/62301513/1769670392410-aaffe318-b5b9-4d0f-85b0-6d5bf8ae91b9.png)

## OCI

**OCI 的全称是 Open Container Initiative（开放容器倡议）**，是由 Linux 基金会主导的一个开源项目，核心目标是**制定容器技术的开放标准**，避免容器生态碎片化。

### OCI 的核心作用与内容


- **定义容器标准规范**它制定了两个关键标准：


- **镜像规范**：统一容器镜像的格式、结构和分发方式，确保不同容器运行时（如 Docker、containerd）能兼容同一份镜像。
- **运行时规范**：定义容器的生命周期、隔离方式（如 Linux Namespace、Cgroups）等，保证容器在不同环境下的行为一致。


- **推动容器生态标准化**早期 Docker 是容器技术的事实标准，但 OCI 的出现让容器技术脱离单一厂商绑定 —— 现在 Docker、Kubernetes 等主流工具都遵循 OCI 规范，实现了 “镜像跨运行时通用、容器跨平台一致”。

# Harbor使用

### Harbor是什么

Harbor 是**企业级容器镜像仓库系统**，核心用于安全、高效地管理容器镜像（及 Helm Chart 等制品），解决 Docker 原生 Registry 功能不足的问题，是企业云原生环境的核心镜像管理工具：


- **安全管理**：支持镜像漏洞扫描、数字签名，通过 RBAC 做权限控制，保障镜像安全合规；
- **高效分发**：可跨环境同步镜像、自动清理旧镜像，支持对接对象存储扩容；
- **合规运维**：记录操作审计日志，提供图形化界面简化管理；
- **DevOps 集成**：对接 CI/CD 工具，支持高可用部署，适配多团队、多集群场景。

先下载一个Harbor，链接[https://github.com/goharbor/harbor/releases/download/v2.14.2/harbor-offline-installer-v2.14.2.tgz](https://github.com/goharbor/harbor/releases/download/v2.14.2/harbor-offline-installer-v2.14.2.tgz)

建一个harbor文件夹存放harbor压缩包

```
cd /
mkdir /harbor
cd /harbor
```

解压harbor压缩包

```
tar xf harbor-offline-installer-v2.14.2.tgz
```

修改配置文件中的域名为你的主机ip

```
cd /harbor
cp harbor.yml.tmpl harbor.yml
vi harbor.yml										#修改配置文件
#修改hostname为你的主机ip
#hostname: 192.168.245.147
```

Harbor 安装目录下执行的 ./install.sh 。这是 Harbor 官方提供的**一键安装 & 启动脚本**

```
./install.sh
```

查看是否运行成功

```
docker compose ps
```

![](https://cdn.nlark.com/yuque/0/2026/png/62301513/1769678725300-b175fae5-68e5-496b-8c08-4af0c78d0e01.png)

看到这样就是运行成功了

在浏览器中访问你的主机ip

[http://192.168.245.147/](http://192.168.245.147/)

![](https://cdn.nlark.com/yuque/0/2026/png/62301513/1769678778574-ce7aecd6-3d53-47f5-95b0-4dd55dbc2743.png)

登录，账号密码没有修改的话，默认是账号：admin，密码：Harbor12345

新建一个项目

![](https://cdn.nlark.com/yuque/0/2026/png/62301513/1769678906335-e4542c68-632d-4e7d-8ce0-7e725a88dd5d.png)

创建一个用户以后能用到

![](https://cdn.nlark.com/yuque/0/2026/png/62301513/1769679002652-4aee8d86-79eb-4c60-9ce4-c203176fbdfa.png)

回到虚拟机中，查看你的镜像

```
docker images
```

![](https://cdn.nlark.com/yuque/0/2026/png/62301513/1769679112134-f8c5f63e-51df-4459-9da5-86e5d938fa2f.png)

可以看到你之前拉取的一些镜像

编辑Docker守护进程配置 （同一网段的其他虚拟机拉取镜像也需要添加守护进程）

```
# 1. 编辑Docker守护进程配置（若文件不存在则新建）
vi /etc/docker/daemon.json
```

添加内容

```
{
    "registry-mirrors": ["https://docker.xuanyuan.me","https://docker.1panel.live"],  // 可选，加速官方镜像
    "insecure-registries": ["http://192.168.245.147:80"]  // 核心：允许访问Harbor的HTTP仓库
}
```

同一网段的其他虚拟机拉取镜像也需要添加守护进程

修改配置后重新加载

```
systemctl daemon-reload
systemctl restart docker
#进入/harbor/harbor目录
cd /harbor/harbor
docker compose restart
```

给本地镜像打标签（king是我之前新建的项目名）

```
# 给本地nginx:latest打Harbor标签
docker tag nginx:latest 192.168.245.147:80/king/nginx:latest

# 验证标签是否创建成功（能看到新标签的镜像即为成功）
docker images | grep 192.168.245.147:80/king/nginx
```

推送镜像

```
# 执行推送命令
docker push 192.168.245.147:80/king/nginx:latest
```

注意事项

确保已登录 Harbor：若推送时提示unauthorized，先重新登录：

```
docker login http://192.168.245.147:80
# 输入admin + 你的密码（如Harbor12345）
```

登出

```
docker loginout http://192.168.245.147:80
```

同一网段的其他虚拟机访问我的仓库拉取镜像

# 1. 编辑Docker守护进程配置（若文件不存在则新建） vi /etc/docker/daemon.json