---
title: ConfigMap
icon: docker
date: 2026-04-29
category:
  - 云原生
---

# ConfigMap

简单来说，**ConfigMap** 是 Kubernetes 提供的一个“笔记本”，专门用来存储**非机密**的配置信息（比如环境变量、配置文件、命令行参数等）。

它的核心作用是**解耦**：让你的程序镜像（Code）和配置（Config）分开。这样你修改配置时，不需要重新构建镜像。

------

## 一、 ConfigMap 的四种“写法”

你可以通过命令行快速创建，也可以通过 YAML 文件正式定义。

## 1. 命令行直接创建（最快）

如果你只是想临时塞几个参数进去：

Bash

```
kubectl create configmap my-config --from-literal=APP_COLOR=red --from-literal=MAX_CONN=100
```

## 2. 从本地文件创建

如果你已经有一个 `nginx.conf`，可以直接把它“读”进去：

Bash

```
kubectl create configmap nginx-config --from-file=./nginx.conf
```

## 3. YAML 文件定义（最标准）

这是生产环境最常用的方式，结构如下：

YAML

```
apiVersion: v1
kind: ConfigMap
metadata:
  name: game-config
  namespace: default
data:
  # 简单的键值对
  ui_mode: "dark"
  # 整个配置文件
  game.properties: |
    enemy.types=aliens,monsters
    player.lives=3
```

------

## 二、 ConfigMap 的两种“用法”

光写好“笔记本”没用，你还得告诉 Pod 怎么去读它。通常有两种方式：

## 1. 作为“环境变量”注入

适合存储开关、API 地址等简短参数。

YAML

```
spec:
  containers:
  - name: my-app
    image: my-app-image
    env:
    - name: UI_THEME           # 容器里的变量名
      valueFrom:
        configMapKeyRef:
          name: game-config    # 来源 CM 名字
          key: ui_mode         # 来源 CM 里的键名
```

## 2. 作为“文件卷”挂载

这是最强大的用法。它会把 ConfigMap 里的内容在容器路径下生成真实的文件。

YAML

```
spec:
  containers:
  - name: nginx
    image: nginx
    volumeMounts:
    - name: config-path
      mountPath: /etc/nginx/conf.d  # 挂载到容器里的这个目录
  volumes:
  - name: config-path
    configMap:
      name: nginx-config            # 挂载名为 nginx-config 的 CM
```

------

## 三、 使用时的“潜规则”（必读）

- **不要存敏感信息**：密码、Token、证书请使用 **Secret**。ConfigMap 是明文存储的，谁都能看。
- **同空间约束**：ConfigMap 必须和使用它的 Pod 在同一个 **Namespace** 里。
- **热更新特性**：
  - 如果你用 **Volume（文件卷）** 挂载，修改 ConfigMap 后，容器里的文件通常会在 1 分钟内自动更新（具体取决于同步周期）。
  - 如果你用 **Env（环境变量）** 注入，修改 ConfigMap 后，**变量不会自动更新**，你必须重启 Pod 才会生效。
- **大小限制**：一个 ConfigMap 最多只能存 **1MB** 的数据。

------

## 四、 总结：什么时候用它？

| **场景**                            | **推荐用法**                         |
| ----------------------------------- | ------------------------------------ |
| 设置数据库连接字符串、重试次数      | **环境变量 (Environment Variables)** |
| 注入 Nginx 配置文件、Redis 配置文件 | **存储卷 (Volumes)**                 |
| 多个应用共享同一组全局参数          | **环境变量 (envFrom)**               |

**既然你已经掌握了 ConfigMap 的基础，想不想试试如何实现“配置更新后自动重启 Pod”？（这在 K8s 原生功能里是不直接支持的，通常需要一点小技巧）。**