---
title: Dashboard
icon: docker
date: 2026-03-03
category:
  - 云原生
---

## 获取YAML文件

```
wget https://raw.githubusercontent.com/kubernetes/dashboard/v2.7.0/aio/deploy/recommended.yaml
```

## 修改 Service 类型

修改访问模式，将 默认ClusterIP类型修改为  NodePort 支持外部访问

#### 修改recommended.yaml文件

```
kind: Service
apiVersion: v1
metadata:
  labels:
    k8s-app: kubernetes-dashboard
  name: kubernetes-dashboard
  namespace: kubernetes-dashboard
spec:
  type: NodePort  # 👈 1. 添加这一行
  ports:
    - port: 443
      targetPort: 8443
      nodePort: 30443 # 👈 2. 添加这一行（手动指定端口，方便记忆）
  selector:
    k8s-app: kubernetes-dashboard
```

直接使用Sed命令修改（不同版本的yaml可能不同）

```
sed -i '/targetPort: 8443/a \  type: NodePort\n  ports:\n    - port: 443\n      targetPort: 8443\n      nodePort: 30443' recommended.yaml
```

## 应用配置文件

```
kubectl apply -f recommended.yaml
```

#### 验证端口是否生效

```
kubectl get svc -n kubernetes-dashboard
```

## 获取Token

```
# 创建管理员并生成 Token
kubectl create serviceaccount admin-user -n kubernetes-dashboard 2>/dev/null || echo "User exists"
kubectl create clusterrolebinding admin-user-binding --clusterrole=cluster-admin --serviceaccount=kubernetes-dashboard:admin-user 2>/dev/null || echo "Binding exists"

# 打印出你的登录 Token
kubectl -n kubernetes-dashboard create token admin-user
```

将下面那一串字符复制下来

![](https://cdn.nlark.com/yuque/0/2026/png/62301513/1772529612476-80f2b065-23cf-4694-a081-1b747a9b6dcb.png)

## 登录问题

可能出现Client sent an HTTP request to an HTTPS server.

![](https://cdn.nlark.com/yuque/0/2026/png/62301513/1772529724736-43212f2c-e651-44e2-9ed9-01b270e0e605.png)

将地址的http需改为https即可

输入你之前复制的token即可

![](https://cdn.nlark.com/yuque/0/2026/png/62301513/1772529769409-ae33f103-89e3-418e-997e-f1000ad6b065.png)

## 最终效果

![](https://cdn.nlark.com/yuque/0/2026/png/62301513/1772529837413-2789fd6b-c9fb-48cc-bf52-24abba8f4b1d.png)