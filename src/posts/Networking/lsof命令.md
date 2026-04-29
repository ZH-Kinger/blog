---
title: lsof命令
icon: network-wired
date: 2026-02-24
category:
  - 计算机网络
---

在 Linux 的世界里，有一个核心哲学：“**一切皆文件**”（Everything is a file）。无论是普通的文本文件、硬件设备（如硬盘、网卡），还是网络连接（TCP/UDP 套接字），在系统底层都是以文件的形式存在的。

lsof 的全称就是 **List Open Files**，它的作用就是列出系统中当前所有被打开的文件信息。
<hr id="W4EEw" class="ne-hr">
### 1. lsof 输出内容的含义

当你直接输入 lsof 时，会看到密密麻麻的表格，每一列都有特定含义：


- **COMMAND**: 进程的名称。
- **PID**: 进程标识符。
- **USER**: 运行该进程的用户。
- **FD (File Descriptor)**: 文件描述符（如 cwd 是当前目录，txt 是程序代码，0u 是标准输入等）。
- **TYPE**: 文件类型（如 REG 是普通文件，DIR 是目录，IPv4 是网络连接）。
- **NAME**: 文件的确切路径或网络地址。
<hr id="LvMT2" class="ne-hr">
### 2. 常用实战场景 (必会命令)

#### A. 端口排查（最常用）

查看哪个进程占用了某个端口（比如 80 端口）：

```
lsof -i :80
```

如果你想查看所有的网络连接：

```
lsof -i
```

#### B. 查找某个用户打开的文件

当你怀疑某个用户的进程消耗了太多资源时：

```
lsof -u root
```

#### C. 查看某个进程打开了哪些文件

如果你知道进程的 PID（假设是 1234）：

```
lsof -p 1234
```

#### D. 查看某个目录下被打开的文件

常用于排查“为什么我无法卸载（umount）这个 U 盘/磁盘”：

```
lsof +D /var/log/
```
<hr id="xA4H4" class="ne-hr">
### 3. 高级进阶：组合拳技巧

#### 技巧 1：恢复已删除但仍被占用的文件

在 Linux 中，如果一个文件被进程占用，即使你执行了 rm 删除，磁盘空间也不会释放。


- 用 lsof | grep deleted 找到这些文件。
- 通过 /proc/[PID]/fd/[FD] 甚至可以把误删的数据拷贝回来！

#### 技巧 2：快速杀死占用端口的进程

想关掉占用 3000 端口的流氓进程？

```
kill -9 $(lsof -t -i:3000)
```

*注：**-t** 参数让 **lsof** 只输出 PID，非常适合脚本调用。*
<hr id="BzT8H" class="ne-hr">
### 4. lsof 与 netstat / ss 的区别
<table id="HFots" class="ne-table" style="width: 750px"><tbody><tr style="height: 33px"><td width="250">
**命令**
</td><td width="250">
**侧重点**
</td><td width="250">
**优势**
</td></tr><tr style="height: 33px"><td width="250">
**lsof**
</td><td width="250">
**文件视角**
</td><td width="250">
能关联进程与文件路径、硬件设备，非常全能。
</td></tr><tr style="height: 33px"><td width="250">
**netstat**

** / ****ss**
</td><td width="250">
**网络视角**
</td><td width="250">
专门处理 TCP/UDP 状态、队列等，网络信息更专业。
</td></tr></tbody></table><hr id="vvEgc" class="ne-hr">
### 避坑指南


- **权限问题**：普通用户只能看到自己打开的文件。要查看系统级信息（如其他用户的进程或系统套接字），必须加 sudo。
- **性能开销**：在文件极多的繁忙服务器上，直接运行 lsof 可能会有明显的延迟，建议配合具体的参数（如 -i 或 -p）缩小范围。