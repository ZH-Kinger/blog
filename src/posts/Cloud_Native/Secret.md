---
title: Secret
icon: docker
date: 2026-04-29
category:
  - 云原生
---

# Secret

如果说 **ConfigMap** 是你随手记参数的“笔记本”，那么 **Secret** 就是 Kubernetes 为你准备的“保险柜”。

它们两个在用法上几乎一模一样，但 **Secret** 专门用来存放那些不能随便给人看的敏感数据，比如：**密码、Token、SSH 密钥、TLS 证书**等。

------

## 一、 Secret 的核心本质

虽然它叫“保险柜”，但有一个冷知识你必须知道：**K8s 默认对 Secret 只做了 Base64 编码，并没有加密。**

这意味着任何能访问集群 API 的人，只要拿到那一串乱码，随手一个 `base64 -d` 就能看到你的明文密码。所以，它的核心作用是**防止你把密码误传到 GitHub**，而不是绝对的加密。

------

## 二、 Secret 怎么写？（三种常见类型）

K8s 针对不同的场景提供了几种专用的 Secret 类型：

## 1. Opaque（最通用型）

用来存普通的键值对（比如数据库密码）。

YAML

```
apiVersion: v1
kind: Secret
metadata:
  name: db-secret
type: Opaque  # 默认类型
data:
  # 注意：这里的内容必须是 Base64 编码后的字符串
  # 命令：echo -n 'root123' | base64
  username: cm9vdA==
  password: cm9vdDEyMw==
```

## 2. kubernetes.io/dockerconfigjson（拉取私有镜像）

如果你要从私有仓库（如阿里云私有镜像仓）拉镜像，必须创建这种 Secret。

Bash

```
kubectl create secret docker-registry my-registry-key \
  --docker-server=DOCKER_REGISTRY_SERVER \
  --docker-username=DOCKER_USER \
  --docker-password=DOCKER_PASSWORD
```

## 3. kubernetes.io/tls（存放 HTTPS 证书）

专门存证书和私钥。

Bash

```
kubectl create secret tls my-tls-cert --cert=path/to/tls.crt --key=path/to/tls.key
```

------

## 三、 Secret 怎么用？

和 ConfigMap 一样，Pod 也有两种方式“拿”走这些敏感数据：

## 1. 注入为环境变量（适合程序读取密码）

YAML

```
spec:
  containers:
  - name: my-app
    env:
    - name: DB_PASSWORD
      valueFrom:
        secretKeyRef:
          name: db-secret
          key: password
```

## 2. 挂载为文件卷（适合证书或密钥文件）

Secret 挂载后，内容会出现在内存文件系统（tmpfs）中，Pod 删掉后数据不留痕迹。

YAML

```
spec:
  volumes:
  - name: cert-volume
    secret:
      secretName: my-tls-cert
  containers:
  - name: nginx
    volumeMounts:
    - name: cert-volume
      mountPath: "/etc/nginx/ssl"
      readOnly: true
```

------

## 四、 ConfigMap vs Secret 对比

| **特性**     | **ConfigMap**          | **Secret**                    |
| ------------ | ---------------------- | ----------------------------- |
| **存储内容** | 配置文件、环境变量开关 | 密码、密钥、证书              |
| **安全性**   | 明文存储               | **Base64 编码**（默认不加密） |
| **使用场景** | 业务逻辑配置           | 权限鉴权、机密信息            |
| **大小限制** | 1 MB                   | 1 MB                          |

------

## 五、 进阶：如何让“保险柜”更安全？

既然 Base64 不安全，专业的 DevOps 都是怎么做的？

1. **RBAC 权限控制**：限制哪些用户或 ServiceAccount 能查看 Secret。
2. **Encryption at Rest**：在 K8s 后端的 **etcd** 层面开启静态加密，这样就算有人偷走了数据库磁盘，也看不见密码。
3. **外部托管**：集成如 **HashiCorp Vault** 或阿里云/华为云的 KMS（密钥管理服务）。

------

## 💡 总结建议

- 如果是改个 Nginx 页面、设个并发数，选 **ConfigMap**。
- 如果是数据库密码、连接 Kafka 的 Token，选 **Secret**。

**既然你已经搞定了 Ingress 和证书，想不想试试把那 20% 流量的金丝雀发布加上“密码访问”？只有输入正确 Secret 里的 Token 才能访问 v2 版本。**