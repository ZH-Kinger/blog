---
title: GitLab CI + ArgoCD + K8s
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

## 准备Helm基础环境（GitLab下载）