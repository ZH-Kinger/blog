---
title: iptables命令练习
icon: network-wired
date: 2026-03-02
category:
  - 计算机网络
---

环境centos stream 10

## 实验要求

![](https://cdn.nlark.com/yuque/0/2026/jpeg/62301513/1772454598653-3d5c3566-2cfe-4c3f-b82a-14de7ec5ae24.jpeg)

1. 在Linux服务器上开放以上业务端口，其他的端口都不允许访问，INPUT链的默认规则设置为DROP。

2. 允许ping。

3. 新建一个自定义链SCLOG，用来记录所有的tcp和udp，icmp协议的数据，level 4以上级别日志需要记录，设置一个日志前缀“sanchuang”。

4. 不允许123.12.1.0/24访问所有的业务和ping，不允许181.12.13.14主机访问web业务和ssh服务。

以上要求编写脚本  iptables_rules.sh ，同时编写一个清除所有规则的脚本  clear_rule.sh 。

## iptables_rules.sh脚本

```
#!/bin/bash

# 1. 清空旧规则(-X 清除自定义链)
iptables -F
iptables -X

# 2. 【最高优先级】黑名单 (必须放在最前面)、（-m multiport 允许指定多个不连续的端口）
iptables -A INPUT -s 123.12.1.0/24 -j DROP
iptables -A INPUT -s 181.12.13.14 -p tcp -m multiport --dports 80,22,443 -j DROP

# 3. 允许已建立的连接 (防止你自己发出的请求回不来)、（-i lo 匹配lo网卡的数据，本地回环接口）
#（-m status 匹配已建立的连接防止xshell连接中断）
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT
iptables -A INPUT -i lo -j ACCEPT

# 4. 【日志】设置自定义链并关联 (在放行前记录，才能抓到所有包)、（--log-prefix 设置前缀）
iptables -N SCLOG
iptables -A SCLOG -p tcp -j LOG --log-prefix "sanchuang-tcp " --log-level 4
iptables -A SCLOG -p udp -j LOG --log-prefix "sanchuang-udp " --log-level 4
iptables -A SCLOG -p icmp -j LOG --log-prefix "sanchuang-icmp " --log-level 4
#-j RETURN 的意义：执行完毕了，请把这个数据包送回到主链（INPUT）
iptables -A SCLOG -j RETURN
# 将所有进入的包先导流到 SCLOG 记录日志
iptables -A INPUT -j SCLOG

# 5. 【放行】业务端口
iptables -A INPUT -p tcp -m multiport --dports 80,22,3306,443,21,20 -j ACCEPT
iptables -A INPUT -p udp --dport 53 -j ACCEPT

# 6. 【放行】Ping
iptables -A INPUT -p icmp --icmp-type echo-request -j ACCEPT

# 7. 【最后一步】设置默认策略为 DROP
iptables -P INPUT DROP
```

## clear_rule.sh脚本

```
#!/bin/bash

/usr/sbin/iptables -t nat -F
/usr/sbin/iptables -t filter -F
/usr/sbin/iptables -P INPUT ACCEPT
```