---
title: 五、Ansible 安装
icon: server
date: 2026-01-26
category:
  - 运维
---

## 1. 什么是 Ansible？

简单来说，Ansible 是一款**自动化运维工具**。


- **它的作用**：如果你想给 5 台服务器同时安装 Nginx 或修改防火墙规则，你不需要逐一登录，只需在主控端写一行命令，Ansible 就会自动批量完成。
- **它的特点**：**无 Agent（无需安装客户端）**。它通过 **SSH** 协议工作。既然你的 JumpServer 已经能通过 SSH 管理这些机器了，Ansible 也能直接用。

![](https://cdn.nlark.com/yuque/0/2026/png/62301513/1772623987663-ccf48c23-cd56-49e4-a1ba-b95533b48381.png)
<hr id="oanx7" class="ne-hr">
## 2. 在哪里部署？

由于你已经有了一台 **JumpServer (192.168.31.136)**，我强烈建议将 **Ansible 安装在 JumpServer 这台机器上**。


- **理由**：136 是你的“指挥部”，它已经拥有访问所有 DMZ 机器的权限。

## Ansible部署

```
# 安装 epel 源
dnf install epel-release -y
#启用 CRB 仓库 (重要)
/usr/bin/crb enable
# 安装 ansible
dnf install ansible-core -y
# 安装sshpass
dnf install sshpass -y
# 验证安装
ansible --version
```

### sshpass

Ansible 默认使用 SSH 进行通信，当你通过 ansible_ssh_pass 指定明文密码时，它在底层需要调用一个名为 sshpass 的小工具来自动输入密码。

安装成功的标志

![](https://cdn.nlark.com/yuque/0/2026/png/62301513/1772614214250-75dd5fb2-8f59-440c-bebd-d6e78d5b8502.png)

### 安装扩展模块

这是因为你安装的是 **ansible-core**（精简版），它只包含了最核心的功能，而 authorized_key 属于扩展模块（ansible.posix），目前还没安装到你的系统里。

如果你想让 Ansible 以后更强大，可以把缺失的模块补上：

**安装 posix 集合**：

```
ansible-galaxy collection install ansible.posix
```