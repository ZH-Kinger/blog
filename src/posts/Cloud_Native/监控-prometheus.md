---
title: 监控-prometheus
icon: docker
date: 2026-01-30
category:
  - 云原生
---

Prometheus 是一款**开源的时序数据库监控告警系统**，由 SoundCloud 开发并捐赠给 CNCF（云原生计算基金会），是云原生生态的核心监控组件，专为容器化、微服务架构设计，也适配传统物理机 / 虚拟机环境，目前是监控领域的事实标准之一。

![](https://cdn.nlark.com/yuque/0/2026/jpeg/62301513/1772624125329-54e08a9a-2dc1-4806-9c9b-b336133edc3d.jpeg)

### Prometheus 核心组件

Prometheus 是一个生态体系，核心组件相互配合实现完整监控能力，核心组件包括：
<table id="yJGqv" class="ne-table" style="width: 750px"><tbody><tr style="height: 33px"><td width="375" style="background-color: rgba(0, 0, 0, 0)">
**组件**
</td><td width="375" style="background-color: rgba(0, 0, 0, 0)">
**核心作用**
</td></tr><tr style="height: 33px"><td width="375" style="background-color: rgba(0, 0, 0, 0)">
**Prometheus Server**
</td><td width="375" style="background-color: rgba(0, 0, 0, 0)">
核心组件，负责数据采集、存储、PromQL 查询、告警规则评估
</td></tr><tr style="height: 33px"><td width="375" style="background-color: rgba(0, 0, 0, 0)">
**Alertmanager**
</td><td width="375" style="background-color: rgba(0, 0, 0, 0)">
处理 Server 发送的告警，实现去重、分组、静默、路由至不同告警渠道
</td></tr><tr style="height: 33px"><td width="375" style="background-color: rgba(0, 0, 0, 0)">
**PushGateway**
</td><td width="375" style="background-color: rgba(0, 0, 0, 0)">
接收推送的指标数据，供 Server 拉取，适配短生命周期任务
</td></tr><tr style="height: 33px"><td width="375" style="background-color: rgba(0, 0, 0, 0)">
**Exporters**
</td><td width="375" style="background-color: rgba(0, 0, 0, 0)">
指标采集器，将第三方系统 / 组件的指标转换为 Prometheus 可识别的格式，暴露/metrics

接口（如 node_exporter 采集服务器指标、mysql_exporter 采集 MySQL 指标、cadvisor 采集容器指标）
</td></tr><tr style="height: 33px"><td width="375" style="background-color: rgba(0, 0, 0, 0)">
**Grafana**
</td><td width="375" style="background-color: rgba(0, 0, 0, 0)">
可视化面板（非 Prometheus 官方，但强绑定），通过 PromQL 从 Server 拉取数据，生成可视化图表、仪表盘
</td></tr></tbody></table>
为什么要进行监控，监控的意义？

提前发现问题，将问题消灭在萌芽阶段 --》防止重大事故的发生

监控什么东西？

容器的使用情况 --》消耗了多少cpu，内存，磁盘IO，网络IO的使用等情况 --》docker stats

运行容器的宿主机cpu，内存，磁盘IO，网络IO等情况 -->得到数据

docker stats

top

free

BLock块 	--》磁盘属于块设备，用来存储工具

监控工具

[https://prometheus.io/](https://prometheus.io/)

grafana	-->根据prometheus提供的数据展示图形		--》出图工具

云原生 ：k8s，docker，containerd，Prometheus		--go语言

Open source metrics and monitoring for your systems and services

metrics --指标

Prometheus	是一个开源工具

Prometheus架构

ssd	（固态硬盘）

hdd	（机械硬盘）

二者核心差异在于**存储介质和工作原理**，进而导致速度、稳定性、功耗等全维度表现不同，HDD 靠机械结构读写，SSD 为纯电子芯片式存储。
<table id="pXoOl" class="ne-table" style="width: 750px"><tbody><tr style="height: 33px"><td width="250" style="background-color: rgba(0, 0, 0, 0)">
**对比维度**
</td><td width="250" style="background-color: rgba(0, 0, 0, 0)">
**SSD（固态硬盘）**
</td><td width="250" style="background-color: rgba(0, 0, 0, 0)">
**HDD（机械硬盘）**
</td></tr><tr style="height: 33px"><td width="250" style="background-color: rgba(0, 0, 0, 0)">
核心介质
</td><td width="250" style="background-color: rgba(0, 0, 0, 0)">
闪存芯片（NAND）
</td><td width="250" style="background-color: rgba(0, 0, 0, 0)">
磁性盘片 + 机械磁头
</td></tr><tr style="height: 33px"><td width="250" style="background-color: rgba(0, 0, 0, 0)">
读写速度
</td><td width="250" style="background-color: rgba(0, 0, 0, 0)">
极快（连续读写 GB/s 级，4K 随机读写毫秒级）
</td><td width="250" style="background-color: rgba(0, 0, 0, 0)">
较慢（连续读写百 MB/s 级，4K 随机读写秒级）
</td></tr><tr style="height: 33px"><td width="250" style="background-color: rgba(0, 0, 0, 0)">
物理特性
</td><td width="250" style="background-color: rgba(0, 0, 0, 0)">
无机械部件，抗摔、抗震、无噪音
</td><td width="250" style="background-color: rgba(0, 0, 0, 0)">
有机械转动 / 寻道，怕震动、有轻微噪音
</td></tr><tr style="height: 33px"><td width="250" style="background-color: rgba(0, 0, 0, 0)">
功耗发热
</td><td width="250" style="background-color: rgba(0, 0, 0, 0)">
功耗低、发热少
</td><td width="250" style="background-color: rgba(0, 0, 0, 0)">
功耗较高、发热明显
</td></tr><tr style="height: 33px"><td width="250" style="background-color: rgba(0, 0, 0, 0)">
容量 / 价格
</td><td width="250" style="background-color: rgba(0, 0, 0, 0)">
同容量价格更高，大容价比低
</td><td width="250" style="background-color: rgba(0, 0, 0, 0)">
容价比高，大容量（数 TB）更划算
</td></tr><tr style="height: 33px"><td width="250" style="background-color: rgba(0, 0, 0, 0)">
使用寿命
</td><td width="250" style="background-color: rgba(0, 0, 0, 0)">
有擦写次数限制（民用级完全够用，可写数百 TBW）
</td><td width="250" style="background-color: rgba(0, 0, 0, 0)">
无擦写限制，机械故障为主要损耗原因
</td></tr><tr style="height: 33px"><td width="250" style="background-color: rgba(0, 0, 0, 0)">
体积重量
</td><td width="250" style="background-color: rgba(0, 0, 0, 0)">
体积小巧（可做 M.2/2.5 寸）、重量轻
</td><td width="250" style="background-color: rgba(0, 0, 0, 0)">
2.5/3.5 寸为主，重量更大
</td></tr></tbody></table>
Prometheus核心主件

1.Prometheus server：	http server ，tsdb，retrieval

2.Prometheus targets：exporter		：安装在被监控的机器上的，是一个采集数据的程序

木马，间谍

mysqld_exporter	:	获取mysqld数据库的信息

node_exporter	:	获取服务器节点的cpu，内存，磁盘IO，网络IO的数据

3.数据可视化 ： Prometheus web UI ，grafana

user interface		用户接口

4.告警 ： altermanager		通知用户，根据某个指标的阈值，发通知告诉运维人员

5.pushgateway  ：中间件，替其他的短作业的程序保留数据，Prometheus server到pushgateway里获取数据--》中间存放数据的软件

![](https://cdn.nlark.com/yuque/0/2026/svg/62301513/1769753287162-a6a12b32-443a-4a81-b74d-67acf542507f.svg)

## Prometheus部署（docker）

### 一、软件的下载

#### 拉取docker镜像

```
# 使用你环境里看起来能用的加速器拉取
docker pull swr.cn-north-4.myhuaweicloud.com/ddn-k8s/docker.io/prom/prometheus:latest

# 拉取成功后，为了方便使用，给它打个短标签
docker tag swr.cn-north-4.myhuaweicloud.com/ddn-k8s/docker.io/prom/prometheus:latest prom/prometheus:latest
```

#### 启动prom

```
docker  run -d   -p9090:9090  --name prom-1  prom/prometheus
docker ps
```

在浏览器上访问localhost：9090（[http://192.168.245.147:9090/](http://192.168.245.147:9090/)）

![](https://cdn.nlark.com/yuque/0/2026/png/62301513/1769948450937-77c0ccad-30c7-4f6b-8434-8f35352c553e.png)

然后就可以开始查看数据了

#### 访问之后他就会创建一个主配置文件放在prom-1:/etc/prometheus/prometheus.yml
<table id="hHtzh" class="ne-table" style="width: 750px"><tbody><tr style="height: 33px"><td width="375">
**组成部分**
</td><td width="375">
**含义**
</td></tr><tr style="height: 33px"><td width="375">
**docker cp**
</td><td width="375">
Docker 的复制命令（Copy）。
</td></tr><tr style="height: 33px"><td width="375">
**prom-1**
</td><td width="375">
**源容器的名字**。这说明你有一个叫 sc-prom-1

的容器（通常是 Prometheus）。
</td></tr><tr style="height: 33px"><td width="375">
**:/etc/prometheus/prometheus.yml**
</td><td width="375">
**容器内部的绝对路径**。这是 Prometheus 在容器里存放主配置文件的默认位置。
</td></tr><tr style="height: 33px"><td width="375">
**.**
</td><td width="375">
**目的地**。在 Linux 中，点号 .

代表 **当前目录**（即你现在输入命令时所在的文件夹）。
</td></tr></tbody></table>
### 将prometheus的主配置文件prometheus.yml复制出来（方便修改，持久化，挂载和备份）

```
docker cp sc-prom-1:/etc/prometheus/prometheus.yml  .
```

### 为什么要将这个文件复制出来？

简单来说，将文件从容器中 docker cp 出来，主要就是为了 **“好改、好存、好控制”**。

**1. 修改方便（容器里没工具）**

容器通常是精简版的 Linux，没有 vim 或 nano 等编辑器。把文件拷贝到宿主机，你可以用任何你喜欢的工具（甚至可以在 Windows 上用 VS Code）修改后再放回去。

**2. 配置持久化（防止丢失）**

容器是易失性的。如果你直接在容器里改配置文件，一旦容器被删除（docker rm），你的修改就全没了。拷贝到宿主机意味着文件真正保存在了硬盘上。

**3. 实现挂载（Volume Mapping）**

这是最高级的设计：先把默认配置拷出来，然后在启动容器时通过 -v 参数建立 **“映射”**。


- 这样你修改宿主机的这个文件，容器内部会**实时同步**。
- 以后升级容器版本，只需挂载这个文件，配置依然有效。

**4. 备份与安全**

在宿主机上，你可以轻松地给文件重命名备份（如 cp prometheus.yml prometheus.yml.bak），或者在操作失误时快速恢复。

#### 同步时间，如果时间不对

```
timedatectl set-timezone Asia/Shanghai
```

![](https://cdn.nlark.com/yuque/0/2026/png/62301513/1769949091077-7f82d8e6-90cb-4295-8ad9-d67ca6923f96.png)

### 为什么需要配置文件prometheus.yml？

**我们需要修改主配置文件，添加需要监控的主机？**

### 安装cAdvisor

在 Prometheus 监控体系中，**cAdvisor** 扮演的是“数据生产者”（Exporter）的角色，专门负责向 Prometheus 提供容器层面的监控指标。

#### 拉取cAdvisor镜像（下载最新版本最新版本与老版本api不一致）

```
docker pull swr.cn-north-4.myhuaweicloud.com/ddn-k8s/ghcr.io/google/cadvisor:0.56.2
docker tag  swr.cn-north-4.myhuaweicloud.com/ddn-k8s/ghcr.io/google/cadvisor:0.56.2  ghcr.io/google/cadvisor:0.56.2
```

#### 修改配置文件，添加cAdvisor作为目标容器

```
vim /prom/prometheus.yml
```

修改为以下内容

```
# my global config
global:
  scrape_interval: 15s # Set the scrape interval to every 15 seconds. Default is every 1 minute.
  evaluation_interval: 15s # Evaluate rules every 15 seconds. The default is every 1 minute.
  # scrape_timeout is set to the global default (10s).

# Alertmanager configuration
alerting:
  alertmanagers:
    - static_configs:
        - targets:
          # - alertmanager:9093

# Load rules once and periodically evaluate them according to the global 'evaluation_interval'.
rule_files:
  # - "first_rules.yml"
  # - "second_rules.yml"

# A scrape configuration containing exactly one endpoint to scrape:
# Here it's Prometheus itself.
scrape_configs:
  - job_name: "prometheus"
    static_configs:
      - targets: ["localhost:9090"]
        labels:
          app: "prometheus"
  - job_name: "cadvisor"
    scrape_interval: 5s
    static_configs:
      - targets: ["cadvisor:8080"]
        labels:
          app: "cadvisor"

```

### 安装redis

#### 拉取镜像

```
# 从加速镜像站拉取
docker pull swr.cn-north-4.myhuaweicloud.com/ddn-k8s/docker.io/library/redis:latest

# 打回原名方便后续使用
docker tag swr.cn-north-4.myhuaweicloud.com/ddn-k8s/docker.io/library/redis:latest redis:latest
```

#### 修改docker compose.yml配置文件通过docker compose启动Prometheus ，cadvisor ，redis容器

```
cd /prom
vim docker-compose.yml
```

添加内容

```
services:
  prometheus:
    image: prom/prometheus:latest
    container_name: prometheus
    ports:
      - 9090:9090
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml:ro
    depends_on:
      - cadvisor

  cadvisor:
    # 替换为你刚下载的超新版本
    image: ghcr.io/google/cadvisor:0.56.2
    container_name: cadvisor
    privileged: true 
    ports:
      - 8080:8080
    volumes:
      - /:/rootfs:ro
      - /var/run:/var/run:rw
      - /sys:/sys:ro
      - /var/lib/docker/:/var/lib/docker:ro
      - /dev/disk/:/dev/disk:ro
      - /var/run/docker.sock:/var/run/docker.sock:ro
      # --- 针对新版 Linux (Cgroup v2) 的关键挂载，必须加上 ---
      - /sys/fs/cgroup:/sys/fs/cgroup:ro
    environment:
      - DOCKER_API_VERSION=1.44
    command:
      - "--docker_only=true"
      - "--housekeeping_interval=10s"
    depends_on:
      - redis

  redis:
    image: redis:latest
    container_name: redis
    ports:
      - 6379:6379

```

#### 使用docker compose启动这些容器

```
cd /prom	#进入prom配置文件的文件夹，确保使用这个配置文件
docker compose up -d			#创建容器并启动
```

### 访问宿主机的端口查看效果

Prometheus

[http://192.168.245.147:9090](http://192.168.245.147:9090/)

cAdvisor

[http://192.168.245.147:8080](http://192.168.245.147:8080/)

Grafana

[http://192.168.245.147:3000](http://192.168.245.147:3000/)

### 安装grafana出图工具

```
# 拉取镜像
docker pull swr.cn-north-4.myhuaweicloud.com/ddn-k8s/docker.io/grafana/grafana:latest

# 打回原名
docker tag swr.cn-north-4.myhuaweicloud.com/ddn-k8s/docker.io/grafana/grafana:latest grafana/grafana:latest
```

#### 启动容器

```
docker run -d --name=grafana -p 3000:3000 grafana/grafana:latest
```

#### 在grafana的web UI中添加数据源为Prometheus（点击connection搜索Prometheus）

![](https://cdn.nlark.com/yuque/0/2026/png/62301513/1769951082489-5691d222-2b9f-4c2e-ab89-6b5579701798.png)

通过web方式登录

[http://192.168.100.128:3000](http://192.168.100.128:3000)

#### 默认的用户名和密码都是

admin

admin

#### 创建新的仪表盘

添加模板可视化分析不同来源的数据		---官方模板网站（ [https://grafana.com/grafana/dashboards/](https://grafana.com/grafana/dashboards/)）

![](https://cdn.nlark.com/yuque/0/2026/png/62301513/1769951239226-38fcf99d-f70c-48c5-8eb7-d23e92d5e320.png)

![](https://cdn.nlark.com/yuque/0/2026/png/62301513/1769951372031-910e7bbb-b88f-4fb5-a80d-89741666487d.png)

## 总结

容器的监控

1.cadvisor --》数据采集容器（工具）

2.Prometheus --》数据存储软件（时序数据库）

3.grafana --》出图工具--》模板（定义好了很多的监控指标，不需要自己去画图）

cadvisor --》Prometheus--》grafana--》出图模版

## 部署node_exporter监控主机

### 方案一：二进制部署（推荐，作为 Systemd 服务）

这是最稳妥的生产环境部署方式，能确保服务器重启后自动运行。

#### 1. 下载并解压

```
cd /usr/local/src
# 下载（如果 GitHub 慢，可以使用 ghproxy 等代理）
wget https://github.com/prometheus/node_exporter/releases/download/v1.8.2/node_exporter-1.8.2.linux-amd64.tar.gz
tar -xvf node_exporter-1.8.2.linux-amd64.tar.gz
mv node_exporter-1.8.2.linux-amd64/node_exporter /usr/local/bin/
```

#### 2. 创建 Systemd 服务文件

为了让它像 Nginx 一样后台运行，我们需要创建一个服务配置文件：

```
vim /etc/systemd/system/node_exporter.service
```

写入以下内容：

```
[Unit]
Description=Node Exporter
Wants=network-online.target
After=network-online.target

[Service]
User=root
ExecStart=/usr/local/bin/node_exporter
Restart=always

[Install]
WantedBy=multi-user.target
```

#### 3. 启动并设置开机自启

```
systemctl daemon-reload
systemctl start node_exporter
systemctl enable node_exporter
```
<hr id="eDK0C" class="ne-hr">
### 方案二：Docker Compose 部署

如果你希望所有监控组件都在 Compose 里统一管理，可以把以下内容加入你的 docker-compose.yml。

**注意：** 必须挂载宿主机的根目录，并使用 host 网络模式，否则它只能监控到容器内部的一点点数据。

```
services:
  node-exporter:
    image: prom/node-exporter:latest
    container_name: node-exporter
    restart: unless-stopped
    network_mode: "host"
    pid: "host"
    volumes:
      - /:/host:ro,rslave
    command:
      - '--path.rootfs=/host'
```
<hr id="JIZnf" class="ne-hr">
### 方案三：Prometheus 侧的配置（最后一步）

部署完 node_exporter 之后，Prometheus 还没法自动看到它。你得修改你之前 docker cp 出来的 prometheus.yml 文件：

**编辑配置**：

```
scrape_configs:
  - job_name: 'node'
    static_configs:
      - targets: ['192.168.245.129:9100'] # 填入部署了 node_exporter 的服务器 IP
```

**让配置生效**： 如果你是用 Docker 跑的 Prometheus，记得把改好的文件 cp 回去并重启：

```
docker cp prometheus.yml sc-prom-1:/etc/prometheus/prometheus.yml
docker restart sc-prom-1
```

## 设置开机自启动的几种方法

### 方法一：systemd 服务（CentOS 7/8/9 官方标准）

这是最专业、最推荐的方式，适合长期运行的后台任务。

**创建服务文件：**


- 

```
vi /etc/systemd/system/my_app.service
```

**写入配置：**


- 

```
[Unit]
Description=CentOS 自启动示例
After=network.target

[Service]
Type=simple
# 执行脚本的路径
ExecStart=/bin/bash /root/scripts/start.sh
# 挂了自动重启
Restart=always
User=root

[Install]
WantedBy=multi-user.target
```

**激活并启动：**


- 

```
systemctl daemon-reload
systemctl enable my_app    # 设置开机自启
systemctl start my_app     # 立即启动
```
<hr id="rraPC" class="ne-hr">
### 方法二：Crontab @reboot（最省事）

CentOS 默认通常都安装并启用了 crond 服务，这种方法非常适合不需要复杂管理的个人脚本。

**编辑定时任务：**


- 

```
crontab -e
```

**添加一行代码：**


- 

```
@reboot /bin/bash /root/scripts/start.sh > /root/scripts/cron_log.txt 2>&1
```


- **保存退出：** 在 vi 中按 Esc 后输入 :wq 即可。
<hr id="JqhWj" class="ne-hr">
### 方法三：/etc/rc.d/rc.local（CentOS 特色坑）

在 CentOS 中，/etc/rc.local 其实是 /etc/rc.d/rc.local 的软链接。**重点是：CentOS 为了安全，默认禁止了该文件的执行权限，你必须手动开启。**

**编辑文件：**


- 

```
vi /etc/rc.d/rc.local
```

**在文件末尾加入你的命令（确保在 ****exit 0**** 之前）：**


- 

```
/root/scripts/start.sh &
```

**手动授予执行权限（最关键的一步）：**


- 

```
chmod +x /etc/rc.d/rc.local
```

*如果不执行这一步，CentOS 启动时会直接跳过这个文件。*

**

### 软连接是什么

简单来说，**软链接**（Soft Link，也叫 Symbolic Link 或 Symlink）就像是 Windows 系统里的**“快捷方式”**。

它本身是一个独立的文件，但它的内容并不包含实际的数据，而是包含**指向另一个文件或目录的“路径”**。
<hr id="Nkn6P" class="ne-hr">
### 1. 它是如何工作的？

当你打开一个软链接时，Linux 系统会看到这个文件是一个链接，然后自动“跳转”到它指向的目标文件。


- **本质：** 一个特殊的文件，存储的是目标文件的**路径名**。
- **灵活性：** 软链接可以跨越不同的磁盘分区（文件系统），甚至可以指向一个目录。
- **后果：** 如果你删除了**原始文件**，软链接就会失效，变成一个“死链接”（也叫断链，通常在终端里会显示为红色闪烁）。但如果你删除**软链接本身**，原始文件毫发无损。