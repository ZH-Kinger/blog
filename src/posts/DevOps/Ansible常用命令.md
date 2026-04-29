---
title: Ansible常用命令
icon: server
date: 2026-03-07
category:
  - 运维
---

梓涵，根据你之前在 **ZH-Kinger** 项目中的实战经验，以及参考卢陈、全妍等人的面试笔记，我为你整理了一份最全的 Ansible 常用命令手册。

这份手册不仅包含基础命令，还结合了你在扩容 Web 节点、配置 VIP、执行内核调优时最真实的用法。
<hr id="R2znn" class="ne-hr">
### 一、 临时任务执行（Ad-hoc 命令）

这种方式不需要写剧本，适合临时查看系统状态或快速下发简单指令。

格式：ansible <主机组> -m <模块名> -a <参数>
<table id="FWLYV" class="ne-table" style="width: 750px"><tbody><tr style="height: 33px"><td width="250">
**常用模块**
</td><td width="250">
**场景及命令示例**
</td><td width="250">
**关键点**
</td></tr><tr style="height: 33px"><td width="250">
**ping**
</td><td width="250">
ansible all -m ping
</td><td width="250">
测试 SSH 连通性。
</td></tr><tr style="height: 33px"><td width="250">
**setup**
</td><td width="250">
ansible web -m setup
</td><td width="250">
**必考！** 收集 Facts 信息（如 IP、内存、内核版本）。
</td></tr><tr style="height: 33px"><td width="250">
**shell**
</td><td width="250">
`ansible all -m shell -a "ip addr
</td><td width="250">
grep lo:0"`
</td></tr><tr style="height: 33px"><td width="250">
**copy**
</td><td width="250">
ansible all -m copy -a "src=sysctl.conf dest=/etc/"
</td><td width="250">
批量分发调优后的内核配置文件。
</td></tr><tr style="height: 33px"><td width="250">
**sysctl**
</td><td width="250">
ansible all -m sysctl -a "name=net.ipv4.ip_forward value=1"
</td><td width="250">
修改内核参数并持久化。
</td></tr><tr style="height: 33px"><td width="250">
**systemd**
</td><td width="250">
ansible web -m systemd -a "name=nginx state=restarted"
</td><td width="250">
扩容后批量重启 Nginx 服务。
</td></tr><tr style="height: 33px"><td width="250">
**yum/apt**
</td><td width="250">
ansible all -m yum -a "name=keepalived state=present"
</td><td width="250">
批量安装高可用组件。
</td></tr><tr style="height: 33px"><td width="250">
**mount**
</td><td width="250">
ansible web -m mount -a "path=/data src=10.0.0.1:/nfs fstype=nfs state=mounted"
</td><td width="250">
自动挂载 NFS 并写入 /etc/fstab

。
</td></tr></tbody></table><hr id="G2msD" class="ne-hr">
### 二、 剧本编排（Playbook 命令）

这是你进行 **ZH-Kinger V3.0** 自动化交付的核心。


- **执行剧本**：

ansible-playbook deploy_web.yml


- **语法检查**：

ansible-playbook deploy_web.yml --syntax-check


- **模拟执行 (Dry Run)**：

ansible-playbook deploy_web.yml -C（或 --check，**字节面试常考点**，不执行只预演结果）。


- **指定主机执行**：

ansible-playbook deploy_web.yml --limit "192.168.10.11"


- **精准重试（后悔药）**：

ansible-playbook deploy_web.yml --limit @deploy_web.retry（只对上次失败的机器进行补救）。
<hr id="mgMQC" class="ne-hr">
### 三、 辅助辅助工具命令


- **ansible-vault（机密管理）**：


- ansible-vault encrypt vars.yml：加密包含密码的变量文件。
- ansible-vault decrypt vars.yml：解密文件。


- **ansible-galaxy（社区角色）**：


- ansible-galaxy install geerlingguy.nginx：下载大牛写好的现成 Role。


- **ansible-inventory（资产查看）**：


- ansible-inventory --list --yaml：以 YAML 格式查看当前所有主机的层级关系。

<hr id="c32Od" class="ne-hr">
### 四、 💡 结合你项目的“面试必杀技”

在面试中，如果你能抛出下面这两个命令用法，面试官会觉得你很有工程经验：

#### 1. 故障排查专用：-vvv

如果扩容时某个任务卡住了，你会怎么做？

“我会加上 -vvv 参数重新运行：ansible-playbook deploy.yml -vvv。这能展示最详细的 SSH 连接过程和输出，帮我快速定位是 SSH 密钥失效还是远程 Python 路径不正确。”

#### 2. 标签执行：--tags

如果你的剧本里有 10 个步骤，你只想重跑“内核调优”那一部分：

“我在 YAML 里给内核调优任务打了 tags: kernel，执行时只需：ansible-playbook site.yml --tags "kernel"。这极大地提高了扩容时的效率。”
<hr id="rjQJg" class="ne-hr">
### 五、 针对卢陈、全妍笔记的补充（快速问答）


- **问：Ansible 默认并发是多少？**

答：默认是 **5**。如果机器多，可以在 ansible.cfg 里改大 forks。


- **问：如何查看远程机器的全部变量？**

答：执行 ansible <code>&lt;host&gt;</code> -m debug -a "var=hostvars[inventory_hostname]"。



- **问：Ansible 为什么是幂等的？**

答：因为它在执行每个任务前会先检查目标状态。如果目标文件和要分发的文件一模一样，它就不做任何操作（显示绿色的 SUCCESS 而不是黄色的 CHANGED）。