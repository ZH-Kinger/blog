---
title: rip实验
icon: network-wired
date: 2026-02-21
category:
  - 计算机网络
---

## 网络拓扑图

![](https://cdn.nlark.com/yuque/0/2026/png/62301513/1771645703512-322fd898-2919-408c-9ce8-c9d8f69ccae4.png)

## rip配置

### 1.配置好pc机的ip地址

### 2.配置好路由器的各个接口的ip地址

### 3.启用rip v2进程（每台路由器都需要操作）

![](https://cdn.nlark.com/yuque/0/2026/png/62301513/1771646069756-ec43d62f-1544-4b25-82a2-e55ac88d0eed.png)

#### 启用版本

```
Router(config)#router rip
Router(config-router)#version 2
```

#### 关闭rip v2路由自动汇总

```
Router(config-router)#no auto-summary 
```

#### 配置网段

```
Router(config-router)#network 192.168.3.0
Router(config-router)#network 192.168.40.0
```

### 4.宣告直连网络

### 5.查看动态路由的学习效果

![](https://cdn.nlark.com/yuque/0/2026/png/62301513/1771646721107-af36121f-8443-44a5-8f37-fc20d943f102.png)

### 6.各个pc机ping测试网络是否通畅