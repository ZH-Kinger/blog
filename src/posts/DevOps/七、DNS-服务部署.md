---
title: 七、DNS 服务部署
icon: server
date: 2026-01-26
category:
  - 运维
---

## 一、安装 BIND 服务

BIND 是 Linux 系统默认的 DNS 服务软件，执行以下命令安装：

```
# 安装 BIND 主程序和工具
dnf install -y bind bind-utils
#设置开机自启动
systemctl enable named
```


- bind：DNS 服务主程序
- bind-utils：提供 nslookup、dig 等 DNS 测试工具

## 二、配置 BIND 主配置文件

编辑主配置文件 /etc/named.conf，调整监听地址和查询权限：

```
vim /etc/named.conf
```

修改以下关键配置（其他默认配置保留）：

```
// 1. 允许所有IP监听DNS端口（53）
listen-on port 53 { any; };

// 2. 允许所有客户端查询（测试环境）
allow-query     { any; };

// 3. 关闭DNSSEC（测试环境简化配置）
dnssec-enable no;
dnssec-validation no;
```