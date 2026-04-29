---
title: 六、Prometheus + Grafana 监控
icon: server
date: 2026-01-26
category:
  - 运维
---

## 安装Prometheus（堡垒机）

### docker安装

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

### 二进制源码安装

#### 下载与解压

```
cd /usr/local/src
#下载prometheus
curl -L -O https://ghproxy.net/https://github.com/prometheus/prometheus/releases/download/v2.51.0/prometheus-2.51.0.linux-amd64.tar.gz
#解压
tar -xvf prometheus-2.51.0.linux-amd64.tar.gz
# 移动到安装目录
mv prometheus-2.51.0.linux-amd64 /usr/local/prometheus
```

#### 创建系统服务 (Systemd)：

为了实现开机自启，不要只用 nohup。创建服务文件 /usr/lib/systemd/system/prometheus.service

```
[Unit]
Description=Prometheus
After=network.target

[Service]
Type=simple
ExecStart=/usr/local/prometheus/prometheus --config.file=/usr/local/prometheus/prometheus.yml --storage.tsdb.path=/usr/local/prometheus/data
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

#### 启动服务

```
systemctl daemon-reload
systemctl enable --now prometheus
```

### 配置 Prometheus 监控 DMZ 集群

#### docker安装的Prometheus

**挂载外部配置文件（最推荐的专业做法）**

这种方法直接将宿主机上的 prometheus.yml “映射”到容器内部。这样你只需要用 vi 修改宿主机的文件，然后重启容器即可。

**准备宿主机目录**：

```
mkdir -p /prom/prometheus
```

**创建或拷贝配置文件**： 如果你已经有一个写好的文件，把它放到 /prom/prometheus/prometheus.yml。如果没有，可以先从容器里“偷”一个出来：

```
docker cp prometheus:/etc/prometheus/prometheus.yml /prom/prometheus/prometheus.yml
```

**启动并挂载**： 使用 -v 参数运行容器：

```
docker run -d \
  -p 9090:9090 \
  --name prometheus \
  -v /prom/prometheus/prometheus.yml:/etc/prometheus/prometheus.yml \
  prom/prometheus
```


- **修改方式**：以后只需执行 vi /prom/prometheus/prometheus.yml -> 保存 -> docker restart prometheus。

**配置文件内容**

```
scrape_configs:
  - job_name: "prometheus"
    static_configs:
      - targets: ["dmz"]

  - job_name: "dmz_nodes"
    static_configs:
      - targets:
        - "192.168.31.130:9100"
        - "192.168.31.131:9100"
        - "192.168.31.132:9100"
        - "192.168.31.133:9100"
        - "192.168.31.135:9100"
```

#### 二进制安装的Prometheus

**编辑配置文件**：

```
vi /usr/local/prometheus/prometheus.yml
```

**添加以下内容（注意 YAML 缩进）**：

```
scrape_configs:
  - job_name: "prometheus"
    static_configs:
      - targets: ["dmz"]

  - job_name: "dmz_nodes"
    static_configs:
      - targets:
        - "192.168.31.130:9100"
        - "192.168.31.131:9100"
        - "192.168.31.132:9100"
        - "192.168.31.133:9100"
        - "192.168.31.135:9100"
```

**重载配置使其生效**：

```
kill -HUP 959
```
<hr id="rtRUH" class="ne-hr">
## 安装node_export（DMZ集群所有机器）

### 下载与解压

```
cd /usr/local/src
# 下载 1.8.2 版本（目前较新且稳定的版本）
curl -O https://github.com/prometheus/node_exporter/releases/download/v1.8.2/node_exporter-1.8.2.linux-amd64.tar.gz
# 解压
tar -xvf node_exporter-1.8.2.linux-amd64.tar.gz
# 移动到安装目录
mv node_exporter-1.8.2.linux-amd64 /usr/local/node_exporter
```

### 创建 Systemd 服务（实现开机自启）

为了防止机器重启后监控掉线，**千万不要只用 ****nohup**。请创建一个服务文件：

```
vi /usr/lib/systemd/system/node_exporter.service
```

**写入以下内容：**

```
[Unit]
Description=Node Exporter
After=network.target

[Service]
Type=simple
# 刚才移动到的路径
ExecStart=/usr/local/node_exporter/node_exporter
Restart=on-failure

[Install]
WantedBy=multi-user.target
```
<hr id="mShM6" class="ne-hr">
### 启动并检查

```
# 重载系统服务配置
systemctl daemon-reload
# 启动并设置开机自启
systemctl enable --now node_exporter
# 检查状态
systemctl status node_exporter
```

## 修改防火墙规则开放9100端口

prometheus通过9100端口收集node-export的数据，所以除了开放22，80端口外还需要开放9100端口

```
firewall-cmd --add-port=9100/tcp --permanent
firewall-cmd --reload
```

## 安装Grafana出图工具

### 启动 Grafana 容器

直接运行以下命令。我们将宿主机的 3000 端口映射到容器，并设置数据持久化（防止容器重启后配置丢失）：

安装Grafana可以件Prometheus收集到的数据可视化展示出来

```
docker run -d \
  -p 3000:3000 \
  --name=grafana \
  --restart=always \
  grafana/grafana
```

### 登录与配置


- **访问地址**：浏览器打开 http://192.168.31.136:3000。
- **初始账号**：用户名 admin，密码 admin。首次登录会要求你修改密码。
- **添加数据源 (Data Source)**：


- 点击左侧菜单的 **Connections** -> **Data Sources**。
- 点击 **Add data source**，选择 **Prometheus**。
- 在 **Connection** 的 URL 处填写：http://192.168.31.136:9090。
- 拉到最下方点击 **Save & test**。如果显示绿色的 "Successfully queried the Prometheus API"，说明大脑与显示器接通了。


### 导入“全能型”监控大盘 (ID: 1860)

你不需要从零开始画图。Grafana 社区有一个非常经典的面板（Node Exporter Full），能直接显示 CPU、内存、磁盘和网络的所有细节。


- 点击dashboard的 **+** 号图标，选择 **Import**。

![](https://cdn.nlark.com/yuque/0/2026/png/62301513/1772628295988-e60c87d7-8d30-4385-93b1-c20aeb0fe374.png)


- 在 **Import via grafana.com** 框中输入 ID：1860，然后点击 **Load**。
- ![](https://cdn.nlark.com/yuque/0/2026/png/62301513/1772628310142-2ddb65de-4ecb-4cc4-8771-843fd62838b3.png)
- 点击 **load**。

### 最终效果

![](https://cdn.nlark.com/yuque/0/2026/png/62301513/1772628395457-a08e6f73-3a7b-41f4-9578-7271825d1aca.png)