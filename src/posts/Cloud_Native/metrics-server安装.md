---
title: metrics server安装
icon: docker
date: 2026-03-03
category:
  - 云原生
---

## 获取官方 components.yaml文件

### 在master中中执行

```
wget https://github.com/kubernetes-sigs/metrics-server/releases/download/v0.8.1/components.yaml
```

## 修改官方的yaml文件（修改镜像源和跳过TLS证书验证）

在你的yaml文件下载目录执行

```
# 1. 替换镜像地址为阿里云私有源
sed -i 's|registry.k8s.io/metrics-server/metrics-server|registry.cn-hangzhou.aliyuncs.com/google_containers/metrics-server|g' components.yaml

# 2. 在指定行后面插入跳过 TLS 校验的参数
# 这里的逻辑是：找到 --secure-port 这一行，在它下面追加一行配置
sed -i '/- --secure-port=10250/a \        - --kubelet-insecure-tls' components.yaml
```

### YAML 到底改了哪里？

#### 1. 镜像地址转换 (Image Mirroring)


- **官方原版**：registry.k8s.io/metrics-server/metrics-server:v0.7.1
- **你的版本**：registry.cn-hangzhou.aliyuncs.com/google_containers/metrics-server:v0.7.1
- **目的**：解决国内无法访问 registry.k8s.io 导致的镜像拉取失败。

#### 2. 跳过 TLS 证书校验 (Insecure TLS)


- **官方原版**：默认要求 Kubelet 提供受信任的证书。
- **你的版本**：在 args 列表里新增了 - --kubelet-insecure-tls。
- **目的**：自建集群（kubeadm）的 Kubelet 证书是自签名的，Metrics Server 默认不信任它。加上这个参数后，监控数据才能正常抓取。

## 启动 Metrics Server

应用yaml文件

```
kubectl apply -f components.yaml
```

查看节点的状态

```
kubectl get pods
kubectl top nodes
```

![](https://cdn.nlark.com/yuque/0/2026/png/62301513/1772527129769-6a9afd87-4e28-4f53-96e6-32a9f608a003.png)