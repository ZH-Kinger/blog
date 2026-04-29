---
title: Jenkins + Ansible + ECS/物理机
icon: docker
date: 2026-04-03
category:
  - 云原生
---

## helm下载

### wget安装

```
#wget安装
dnf install wget -y
```

### 手动安装 Helm

```
# 1. 下载压缩包
wget https://mirrors.huaweicloud.com/helm/v3.12.0/helm-v3.12.0-linux-amd64.tar.gz

# 2. 解压它
tar -zxvf helm-v3.12.0-linux-amd64.tar.gz

# 3. 把里面的二进制文件挪到系统目录
mv linux-amd64/helm /usr/local/bin/helm

# 4. 验证一下
helm version
```

下载成功

![](https://cdn.nlark.com/yuque/0/2026/png/62301513/1775194666265-053f1601-961e-4da2-868a-0cfaaf79b53c.png)

## Jenkins下载

### 准备命名空间与仓库

在 **master**上执行：

```
# 1. 创建专门存放 DevOps 工具的房间
kubectl create ns devops

# 2. 添加 Jenkins 官方图表库
helm repo add jenkins https://charts.jenkins.io
helm repo update
```
<hr id="c0hEl" class="ne-hr">
### 🛠️ 第二步：正式安装 Jenkins

为了确保 Jenkins 能像刚才一样正确使用你修好的 **local-path** 存储，我们要在安装时指定参数。

**请直接执行这一条大命令：**

```
helm install my-jenkins jenkins/jenkins -n devops \
  --set persistence.storageClass=local-path \
  --set persistence.size=10Gi \
  --set controller.serviceType=NodePort \
  --set controller.admin.password=Kinger@2026
```