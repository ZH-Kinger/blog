---
title: 三、NFS 服务器配置
icon: server
date: 2026-01-26
category:
  - 运维
---

### 核心逻辑

![](https://cdn.nlark.com/yuque/0/2026/png/62301513/1769442443779-b25dcc2f-b2ea-43de-8270-2ee7279156f6.png)

### 1. 安装 NFS 服务（每一台都需要安装，但是只在nfs-server上启动）

```
# 安装 NFS 服务器端
dnf install -y nfs-utils
# 启动服务并设置开机自启
systemctl start nfs-server
systemctl enable nfs-server
```

### 2. 配置共享目录（在nfs-server上操作）

```
# 创建共享目录
mkdir -p /web/wang.com			#在堡垒机中创建

# 复制 Web 资源（从 web1 复制，需先在 web1 准备好 html 目录）
scp -r root@192.168.245.143:/usr/local/nginx/html/wang.com /web/wang.com

# 保留正确的用户/组创建
groupadd -r nfsnobody
useradd -r -g nfsnobody -s /sbin/nologin nfsnobody

# 所有者配置正确，保留
chown -R nfsnobody:nfsnobody /web/wang.com

# 仅修改权限为 775（核心调整）
chmod -R 775 /web/wang.com
```

#### 为什么要用 nfsnobody？


- nfsnobody 是 Linux 系统为 NFS 服务预设的专用匿名用户，所有 NFS 客户端访问共享目录时，都会映射到这个用户；
- 避免用 root 作为所有者（权限过大，有安全风险），也避免客户端因用户 ID 不匹配导致无法读写。

### 3. 配置 exports 文件

```
vim /etc/exports
# 添加内容：
/web/wang.com 192.168.245.0/24(rw,sync,all_squash)
# 生效配置
exportfs -rv
```

### 4. Web 节点（web1&web2）挂载 NFS

```
# 安装 NFS 客户端（无需启动服务）
dnf install -y nfs-utils
# 挂载共享目录（临时挂载）
mount 192.168.245.145:/web/wang.com /usr/local/nginx/html/wang.com/
# 永久挂载（写入 /etc/fstab）
echo "192.168.245.145:/web/wang.com /usr/local/nginx/html/wang.com nfs defaults 0 0" >> /etc/fstab
# 验证挂载
mount -a
df -Th
```

df -Th输出下面内容表示挂载成功

![](https://cdn.nlark.com/yuque/0/2026/png/62301513/1769440185039-9da2c231-f8de-4459-8c08-e2b94db18e3f.png)

![](https://cdn.nlark.com/yuque/0/2026/png/62301513/1769485156486-9e99202c-0359-4c32-be61-4dde59a6746a.png)