---
title: web集群
icon: server
date: 2026-01-06
category:
  - 运维
---

项目名字:基于nginx+keepalivedBJweb高性能的集群项目项目描述:模拟企业里的web项目需求,最终日的是构建个高可用高性能的web集群系统。部罢|vs负载均衡系统+keepalived高可用软件,后端使用nginx做web服务器,同时搭建内部的-套基TPrometheus的监控系统。使用ansible实现整个集群系统的自动化运维工作。项目步骤:项目步骤:

1.使用processon国图软件规划好整个项目的拓扑结构图,并日将ip地址标识好。

2.安装部罢6台Linux虚拟机服务器,做好网络初始化工作(配置静态ip地址和dns服务器.主机名、禁用firewalldFuselinux功能)

3.安装nfs服务器,共享网页目录,实现web服务器的数据一致性

4.安装ansible服务器,设置好主机清单,配置免密通道,方便日后批量自动化运维

5.安装Prometheus服务,给每个集群里的节点服务器安装node exporter再安装grafana出图展示监控的效果

6.安装基于binddns服务器为整个web集群提供域名解析服务

7.安装mysql 5.7.37版本的数据库服务器,为后端的接口项目提供数据库服务,同时安装mysqld exporterxtmysql内部性能指标进行监控

8.部署堡垒机,设置tcp wrappers,只允许堡全机访问内部的其他服务器

9.部署防火墙服务器发布内网的web服务器和堡垒机

10.进行SNAT和DNAT、堡垒机发布测试,最后使用ab进行web服务的压力测试(了解过PTS测试)

11.在第1台web服务器上采用一键安装nginx的脚本部署nginx web服务,然后在web2直接执行脚本安装nginx.

12.使用基于域名的虚拟主机功能,配置2个虚拟主机分别对应2个网站(www.sc.com和software.sc.com),同时配置https功能

13.在2台web服务器上都安装nginx流量监控的一个模块VTS(虚拟主机的流量监控)了解nginx的访问情况及负载

14.部署nginx负载均衡器LB1,采用7层负载均衡,轮询调度算法实现webi访问负载均衡

15结合keepalived和nginx实现高可用的负载均衡功能(单vip和x双vip),采用7层nginx的负载均衡

16.使用压力测试软件进行综合的压力测试

17.扩展:本次项目实验可以使用自己编写的python 接口程序作为web应用,同时需要部署MySQL服务器。

![](https://cdn.nlark.com/yuque/0/2026/jpeg/62301513/1767706029477-abc61de4-1561-40f8-a366-48c38ee328c6.jpeg)