---
title: 堡垒机配置（JumpServer）
icon: server
date: 2026-03-04
category:
  - 运维
---

## docker下载

因为 JumpServer 是**多组件复杂系统**，官方只提供 **Docker 一键部署**方式：


- Docker 能把所有依赖、环境打包好，**不用手动配环境**
- 装完 Docker 才能运行 JumpServer 镜像，所以必须先装 Docker

```
# 1. 卸载旧版本（如果有）
yum remove docker docker-client docker-client-latest docker-common docker-latest docker-latest-logrotate docker-logrotate docker-engine

# 2. 安装必要工具
yum install -y yum-utils device-mapper-persistent-data lvm2

# 3. 添加阿里云的 Docker 源 (比官方快得多)
yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo

# 4. 安装 Docker 引擎
yum install -y docker-ce docker-ce-cli containerd.io

# 5. 启动并设置开机自启
systemctl start docker
systemctl enable docker
```

## 配置docker 镜像加速器

为了防止后面下载 JumpServer 的几十个镜像（Images）时再次失败，请配置阿里云或华为云的加速器：

```
mkdir -p /etc/docker
tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": [
    "https://do.nark.eu.org",
    "https://dc.jessestuart.com",
    "https://docker.m.daocloud.io",
    "https://auth.docker.nanoda.net",
    "https://dockerhub.timeweb.cloud"
  ]
}
EOF

# 重启 Docker 生效
systemctl daemon-reload
systemctl restart docker
```

## 下载jumpserver

```
# 创建安装目录
mkdir -p /opt/jumpserver
cd /opt/jumpserver

# 下载并运行在线安装脚本
curl -sSL https://resource.fit2cloud.com/jumpserver/jumpserver/releases/latest/download/quick_start.sh | bash
```

## 安装完成

![](https://cdn.nlark.com/yuque/0/2026/png/62301513/1772597109183-60fd724e-3095-41c4-97e7-85f1b407479c.png)

![](https://cdn.nlark.com/yuque/0/2026/png/62301513/1772597133337-c92be94c-c2c0-4623-8f15-aecb14fc779b.png)

### 首次登录与初始化设置


- **访问地址**：打开浏览器，输入 http://192.168.31.136:80。
- **默认账号**：admin
- **默认密码**：ChangeMe
- **改密与 MFA**：首次登录会强制要求修改密码，并强烈建议绑定 **MFA (手机验证码)**，这是堡垒机的“灵魂”。

![](https://cdn.nlark.com/yuque/0/2026/png/62301513/1772597572164-85c93304-67cd-40fd-9109-4dee7fb1af85.png)

### 登录后会提示修改密码，修改密码后重新登录

![](https://cdn.nlark.com/yuque/0/2026/png/62301513/1772597744126-af33b9bb-68d9-4083-abe3-19373d15d2a9.png)