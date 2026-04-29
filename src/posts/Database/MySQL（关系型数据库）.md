---
title: MySQL（关系型数据库）
icon: database
date: 2025-12-09
category:
  - 数据库
---

MySQL 是一款**开源的关系型数据库管理系统（Relational Database Management System，RDBMS）**，核心是通过结构化查询语言（SQL）管理、存储和检索以 “关系模型” 组织的数据，是目前全球最流行的数据库之一。

开源：源代码开放（github），开发人员可以基于代码二次修改，自己使用

Mysql由瑞典Mysql AB开发	—》  被Oracle收购

关系型数据库

Oracle：功能强大，稳定可靠（银行，金融），跨平台（Linux，Window，IOS）

MariaDB和Mysql：中小型项目（阿里也会有二次开发）-跨平台（Linux，Window，IOS）

SQL server：windows平台下用得比较多

SQLlite：轻量级数据库（Django-开发阶段）

非关系型数据库

key-value型数据库：redis（缓存-提高并发能力）

文档型数据库：MongDB（储存灵活的json格式文件）

分布式储存：Hbase（大数据存储和分析）

分布式-> 数据会分布在很多机器上联合运行

## 安装Mysql数据库（数据库密码Asdf&24680）

#卸载已经安装的数据库

### 软件的安装

yum安装（一键安装）：方便，快捷，依赖软件可以直接都安装好

源码安装（自定义）：可定制，依赖及编译环境需要手动安装

推荐源码安装：需要定制，版本统一，（自动化脚本）

基础设施部：

### yum查找

过滤软件包名含mysql的软件包

yum list|grep mysql

查找那个软件包中包含mysql命令

yum provides “mysql”

### yum安装

yum install mysql8.4-server -y

#### 检查是否安装过

rpm -qa |grep mariadb

rpm -qa |grep mysql

#### 安装过mysql或mariadb需要卸载

yum uninstall mariadb -y

yum uninstall mysql -y

启动mysql服务

systemctl 命令管理Linux下的服务（软件）状态

systemctl <start|stop|restart|enable(开机自启动)|disable(开机不自启动)> 服务号

systemctl start mysqld
<hr id="yjemw" class="ne-hr">
#### 查看mysql进程

netstat -tlnp

lsof -i 3306

## 连接数据库

#账号+密码+ip+端口

#	mysql -uroot -h127.0.0.1 -p

#	mysql -uroot -p

文件scoket：实现一台电脑里不同进程之间的通信

#mysql -uroot -S /var/lib/mysql/mysql.sock -p

## 安装后的内容

二进制文件：mysql

ll  /usr/sbin/mysql*

/usr/sbin/mysqld		=>mysql服务端（主程序）

/usr/bin/mysql		=>mysql客户端

### 

![](https://cdn.nlark.com/yuque/0/2025/png/62301513/1765278128733-5fd285dc-85be-468d-b1bb-30d67d450bb5.png)

information_schema:信息数据库，存储了Mysql数据库各种数据对象的元数据信息

mysql：用户账户信息，权限，帮助，日志

performance_schema：性能相关数据，查询执行情款，锁使用情况，内存使用情况，文件I/O等....

#### Mysql管理

查看Mysql状态：查看进程，查看端口

连接Mysql时常见错误

密码错误（用户或密码错误）

套接字不存在 =>服务没有启动/套接字文件位置不对

#### 连接服务有两种方式

IP和端口：远程连接（注意防火墙和selinux问题）

Socket套接字：本地连接
<hr id="rCAh1" class="ne-hr">
### 1.日志文件

错误日志，常规日志（数据库启动，运行过程中出现错误常规信息，用来排错）						/var/log/mysqld.log

二进制日志（记录对数据库的更改操作，数据恢复和复制）

/var/lib/mysql/binlog.*

查询日志（记录所有的sql查询，审计）

### 2.配置文件

/etc/my.cnf

[mysqld]

datadir = /var/lib/mysql

socket = /var/lib/mysql/mysql.scok

3.相关支持文件

*.so

### 3.修改配置

配置文件

主文件

vim /etc/my.cnf

具体配置文件

vim /etc/my.cnf.d/mysql-server.cnf

#创建目录

#mkdir /data/mysql -p

#因为mysql进程是用mysql用户启动并管理，所以data/mysql目录需要写权限

#chown mysql:mysql /data/mysql/  -R

#修改配置后的操作步骤

#停服务

#启动服务

#验证...

#数据目录

datadir=/data/mysql

socket=/var/lib/mysql/mysql.sock

#端口号

port=3308

#错误日志

log-error=/data/mysql/mysqld.err

pid-file=/var/run/mysqld/mysqld.pid

#临时关闭

#setenforce 0

#配置永久关闭

vim  /etc/selinux/config

SELINUX=enforcing  # 原配置（强制启用）

改为

SELINUX=disabled

### mysql中的一些周边命令

查看数据库版本	select version();

![](https://cdn.nlark.com/yuque/0/2025/png/62301513/1765283889242-6e1fb21d-5fd3-4c4d-bb55-5bcd923a5b69.png)

查看编码集		show variables like "%char%";

GBK =》中文

UTF-8 =》全世界

![](https://cdn.nlark.com/yuque/0/2025/png/62301513/1765284021573-fcd88b9e-ec36-4508-9576-47c4efa47cb5.png)

查看有哪些连接		show processlist\G

![](https://cdn.nlark.com/yuque/0/2025/png/62301513/1765284242096-544cc3dd-f2f7-4be7-a67b-07d96b6f88e5.png)

### 创建一个用户

-- 语法：CREATE USER '用户名'@'允许登录的主机' IDENTIFIED BY '密码';

-- 示例1：创建test用户，仅允许本地登录（localhost）

CREATE USER 'test'@'localhost' IDENTIFIED BY 'TestPass123!';

-- 示例2：创建app用户，允许任意主机登录（% 表示所有主机）

CREATE USER 'app'@'%' IDENTIFIED BY 'AppPass456!';

#### 查看所有用户的用户名和允许登录的主机（核心信息）

SELECT user, host FROM mysql.user;

#### 删除一个用户

-- 标准语法：必须指定 用户名@主机名（两者是一个整体）

DROP  USER'用户名'@'主机名';

### 用户授权

GRANT 权限类型 ON 作用范围 TO '用户名'@'主机' [WITH GRANT OPTION];

授权后必须执行FLUSH PRIVILEGES;刷新权限，否则不生效

#### 授权与取消授权

grant privileges on database.table to 'user'@'host' with grant option;

privileges :权限列表 select，insert，update，delete，all

database.table ：* . * ,test1. * ,test1.tb1 'user'@''localhost;

-- 给op_user用户授予mydb库user表的增、删、改、查权限

GRANT SELECT, INSERT, UPDATE, DELETE ON mydb.user TO 'op_user'@'192.168.1.%'; FLUSH PRIVILEGES;

#### 撤销用户的权限

-- 撤销test用户mydb库的删除权限REVOKE DELETE ON mydb.* FROM 'test'@'localhost';FLUSH PRIVILEGES;

-- 撤销用户所有权限REVOKE ALL PRIVILEGES ON *.* FROM 'test'@'localhost';FLUSH PRIVILEGES;

### 查看用户已有的权限

-- 查看test用户的权限 SHOW GRANTS FOR 'test'@'localhost';

### 删除一个用户

drop user  '用户名'@'主机'

### 修改密码

set password for '用户名'@'主机' = password('新密码')

#### 排错常用命令：检查接口连通性

yum install telnet -y

root@wang:/home/wzh# telnet  192.168.31.1

Trying 192.168.31.1...

通过Windows连接Linux上的Mysql服务，连不上？

Client -> sever

1.Client 与 Server 端之间有网络有问题

ping 192.168.31.1

2.检查ip和端口是否正确

3.Server 查看

服务是否启动

ps/netstat/systemctl status mysql

防火墙

停

systemctl stop firewalld

查看状态

systemctl status firewalld

selinux

#getenforce

Disabled

应用内有限制

## 数据库，数据表的管理

1.Mysql命令是以分号结束

2.Mysql命令关键字不区分大小写，按Mysql规范建议大写

3.Mysql数据库名，表名区分大小写

4.查看帮助 命令前加help

help show；

### 查看所有用户的用户名和允许登录的主机（核心信息）

SELECT user, host FROM mysql.user;

### 数据库的含义

**数据库**是按照特定结构来组织、存储和管理数据的**电子集合**，简单来说就是一个 “数据仓库”，目的是让用户可以高效地查询、修改、添加和删除数据，同时保证数据的准确性、安全性和一致性。

一个数据库就是一个目录

数据库：存放数据的仓库

数据表：存放数据的货架（实际存放在数据的位置） =》 文件

### 查看数据库	show database；

### 创建数据库	create database <数据库名>

![](https://cdn.nlark.com/yuque/0/2025/png/62301513/1765289632103-bbee9e8c-5b29-4522-89a9-59580ea6ef5f.png)

### 选择数据库	use <数据库名>

![](https://cdn.nlark.com/yuque/0/2025/png/62301513/1765289659530-791ef721-3b0b-4b22-8e74-66d34a4b3a1c.png)

### 查看创建数据库命令		show create database test\G

![](https://cdn.nlark.com/yuque/0/2025/png/62301513/1765289748238-ffc4a40c-0235-4d5f-aaf8-8619045f2e58.png)

/G（垂直显示 --一个字段显示一列数据）

### 创建库时添加字符集

create database test2 default

character set GBK;

![](https://cdn.nlark.com/yuque/0/2025/png/62301513/1765289970941-406779f4-b25d-4e24-b207-8b0cc62cfdd4.png)

### 修改数据库		alter databse test default character set utf8；

### 删除数据库		drop databse test3；

## 表

一个表就是一个文件：表中存储具体的数据

数据表：文件

列（columns）：一个列代表了特定的数据类型和含义

行（rows）：一行代表一个具体的数据记录，表中数据要符合1列的约束

### 查看表		show tables；

### 查看创建表语句	show create table <表名>

![](https://cdn.nlark.com/yuque/0/2025/png/62301513/1765335070890-3bb8b425-555a-4304-99d2-5b58e3eccf2c.png)

### 查看表结构	desc <表名>

![](https://cdn.nlark.com/yuque/0/2025/png/62301513/1765335086726-9ed9f71c-0263-479c-84c2-1cd34262af11.png)

### 创建表

create  table <表名>(

column1 datatye	column_constrains,

column1 datatye	column_constrains,

column1 datatye	column_constrains,

column1 datatye	column_constrains,

)

列名：大小写下划线，小写+下划线

### 插入数据		insert into test_int (age,num1,num2)values(1,2,3),(4,5,6);

![](https://cdn.nlark.com/yuque/0/2025/png/62301513/1765335373692-4a110866-b8a8-4b54-9a3c-59642a748085.png)

### 查询表中的数据	select *from test_int；

![](https://cdn.nlark.com/yuque/0/2025/png/62301513/1765335457457-2666b890-fe8b-4cdc-a678-52785756f1e2.png)

## 数据类型

数据类型：要储存的数据是什么类型的

name => string

列约束：完整性（NOT NULL），默认值，主键

*正确的选择数据类型

*优化存储空间：节省磁盘空间，可扩展性

*提高查询性能

*保证数据完整性

*提高数据库可维护性

### 整数类型

TINYINT		1字节	-128-127		0-255

SMALLINT	2字节

MEDIUMINT	3字节

INT			4字节

BIGINT		8字节

TYPE(n) =>显示宽度	n=2

ZEROFILL =>零填充		00127

UNSIGNED =>无符号

注释：

单行注释：SELECT * FROM user;-- 查询数据 # 正确：--后有空格

多行注释：/*   */

### 浮点型（小数）

float			4字节		默认长度7	单精度浮点型

double		8字节		默认长度17	双精度浮点型

decimal		精确的浮点数

float/double  指定显示宽度和小数位数，如果没有指定按实际精度来处理

decimal	不指定显示宽度和小数位数，默认为（10，0）10位整数位，0位小数位

![](https://cdn.nlark.com/yuque/0/2025/png/62301513/1765336779278-e75b9a87-41dc-4640-8e8d-4b9844d5606f.png)

![](https://cdn.nlark.com/yuque/0/2025/png/62301513/1765336952008-68af74b2-d29b-43d2-9986-ec96b012a63c.png)

### 字符串类型

char(n)		固定长度字符串，手机号，身份证。。

varchar(n)	可变长字符串，标题，昵称（灵活，省空间，效率稍微差一点）

text			用于储存大块文本		0-65535

tinytext		小文本				0-255

mediumntext	中等文本

longtext		超大文本

blog			储存二进制数据（图片，音频，视频）

json			轻量级数据 ‘交换’文本

![](https://cdn.nlark.com/yuque/0/2025/png/62301513/1765338003290-be88f242-244c-462c-b19b-3e449b15b577.png)

## MySQL设置：宽松模式和严格模式

宽松模式：某些设置不符合本身要求，按默认方式处理

严格模式：如果不符合设置，直接报错处理

### 日期时间类型

date			3字节		yyyy-MM-dd		日期

time			3字节		HH:mm:ss		时间

year			1字节		yyyy				年份

datetime		8字节		yyyy-MM-dd	HH:mm:ss

timestamp	4字节		yyyy-MM-dd	HH:mm:ss（显示数据依赖当前时区）

![](https://cdn.nlark.com/yuque/0/2025/png/62301513/1765339026570-6e3d5436-5b6d-435d-879c-b6871d26e02e.png)

### 枚举和集合类型

enum	枚举		多选一	男/女/保密

set		集合		多选多	唱歌，跳舞。。。

![](https://cdn.nlark.com/yuque/0/2025/png/62301513/1765340217193-b1c46030-95b2-4266-b0c5-abadcf3a65a1.png)

![](https://cdn.nlark.com/yuque/0/2025/png/62301513/1765340248931-e1398680-f87a-4234-81e5-a25871e0415e.png)

创建数据表	->

创建数据库：hunan

创建数据表：sc_student

字段：学员编号，姓名，性别，年龄，专业，电话号码，住址，城市，岗位，出生日期，工资

学员编号：sc00001

## 常见的约束

### 非空约束（NOT NULL）：该列数据不能为空

![](https://cdn.nlark.com/yuque/0/2025/png/62301513/1765348900842-d78545c6-13ac-4fe6-aa5c-2780f475f2d7.png)

### 唯一约束（UNIQUE）：该列数据的值必须唯一

![](https://cdn.nlark.com/yuque/0/2025/png/62301513/1765349144979-2e019e1e-e160-492b-94d4-5320d28f6335.png)

### 默认值约束（DEFAULT）：该列元素如果没有给值，使用默认值

![](https://cdn.nlark.com/yuque/0/2025/png/62301513/1765348922614-cc7742f7-f542-4cb1-90bc-f9aea2eb2d6b.png)

### 主键约束（PRIMARY KEY）：不能为空加唯一约束，一个表只能有一个主键

主键：单个字段，多个字段

作用：标识唯一的一条记录，一般来说建议每个表都创建一个主键

创建了主键之后 =>自动创建索引 =>提升查询效率

![](https://cdn.nlark.com/yuque/0/2025/png/62301513/1765350572529-967e3f5f-b1cf-4be2-924f-238c09d85a5a.png)

### 外键约束（FOREIGN KEY）：用于建立表之间的关系

，，

分表的意义？

节省存储空间（减少数据冗余）

提升可维护性

#### 数据分表 ->外键

优点：数据之间有关联，数据一致性检查，数据完整性

缺点：

外键有一定的性能开销（产生临时表，消耗内存和cpu）

复杂性：进行2数据插入和删除时，由于有约束更麻烦

企业：会分表

外键 =》数据库层面解决一些约束问题

通常从代码层面解决约束问题

创建表classes

class_id	varchar

class_teacher	varchar

class_location	varchar

![](https://cdn.nlark.com/yuque/0/2025/png/62301513/1765351290956-11b47b4c-4ad4-40dc-a996-97c54cb56946.png)

创建表students

![](https://cdn.nlark.com/yuque/0/2025/png/62301513/1765351475703-5af3400b-b122-4e3f-aa2a-07e283722a06.png)

#### 外键动作

限制动作	restrict	：默认

当删除数据或更新数据时，由于数据被引用，所以会阻止该操作

#### 级联操作	cascade：级联删除

删除绑定的所有数据

设置位空	SET NULL

无动作	NO ACTION

## 其他创建表的方法

复制表结构（只会复制表的结构，并不会复制数据）

create table new_classes like classes;

![](https://cdn.nlark.com/yuque/0/2025/png/62301513/1765352310174-a40cceb2-52dd-4f98-b336-e944d6757582.png)

## 删除表

drop table <表名>;

## 修改表（alter table）

### 新增列：

#### 在末尾添加	alter table articles add phone char(11);

![](https://cdn.nlark.com/yuque/0/2025/png/62301513/1765353012069-115680ac-9741-4f56-9e1e-acd93f600455.png)

#### 在第一行添加	alter table articles add id int first;

#### 在什么之间添加	alter table articles add email varchar(10) after author;

![](https://cdn.nlark.com/yuque/0/2025/png/62301513/1765353221776-03980562-49e7-4127-9d76-3058f3ebdff5.png)

### 修改数据类型/长度	alter table articles modify title varchar(200);

![](https://cdn.nlark.com/yuque/0/2025/png/62301513/1765354150248-a5f36027-2b11-4e65-a001-bb189531c3ee.png)

### 修改字段名		alter table articles change phone mobile char(11);3

![](https://cdn.nlark.com/yuque/0/2025/png/62301513/1765354121672-17288117-94c2-424a-9260-a26a273c4661.png)

### 删除字段		alter table articles drop column email;

### 添加约束信息		alter table articles add constraint pk_id primary key(id);

### 修改表名	alter table person	rename to person2；

## 查询SQL

select [distinct] <列名|*> from <表名> [where <条件>] [order by <列名>] [group by <列名>]

select 	查询

distinct	去重(对结果去重)

from	从哪个表查询

where	条件

order by	排序

group by	分组

limit M,N		限制返回数据

例子

查看所有商品信息

select *from product；

查看所有商品的商品名和价格

select pname,price from product；

查看所有商品的商品名和价格，列名位中文（取别名）

select pname AS 商品名，price AS 商品价格 from product

查看所有价格*10

select pname  商品名，price*10 10倍价格 from product

### 条件查询

select *from product where pname="真维斯";

### 比较查询 <,>,<=,>=,!=或<>,=

名字不等于花花公子的数据

select *from product where pname <> "花花公子";

单价大于1000的商品

select *from product where price >1000;

### 逻辑查询	and,or,not

a and b =>a和b同时位真，结果为真

单价大于200，且小于等于1000

select *from product where price>200 and price <=1000

### 范围查询	in,between and

单价大于200，且小于等于1000

select *from product where price between 200 and 1000

select *from product where not (cid=c004)

### 模糊查询 like（字符串）

select *from product where pname like '%家'

#### 通配符
<table id="ddiOQ" class="ne-table" style="width: 750px"><tbody><tr style="height: 33px"><td width="250">
%
</td><td width="250">
匹配 **任意长度** 的字符（0 个 / 1 个 / 多个）
</td><td width="250">
模糊匹配开头 / 结尾 / 包含内容
</td></tr><tr style="height: 33px"><td width="250">
_
</td><td width="250">
匹配 **单个** 任意字符
</td><td width="250">
精准控制字符长度的模糊匹配
</td></tr><tr style="height: 33px"><td width="250">
[]
</td><td width="250">
匹配括号内 **单个** 字符（需搭配 REGEXP）
</td><td width="250">
匹配指定范围内的单个字符
</td></tr></tbody></table>
限制返回数据limit m,n

select *from product

### 正则匹配regexp 或 rlike

SELECT 字段 FROM 表名 WHERE 字段 REGEXP '正则模式';

SELECT 字段 FROM 表名 WHERE 字段 RLIKE '正则模式'; -- 与REGEXP等价

-- 示例1：匹配test_enum_set中name以“刘”开头的记录（^）

SELECT * FROM test_enum_set WHERE name REGEXP '^刘';

-- 输出：刘志强

-- 示例2：匹配articles中title以“log”结尾的记录（$）

SELECT * FROM articles WHERE title REGEXP 'log$';

-- 输出：test123.log

-- 示例3：匹配name包含“张”或“李”的记录（|）

SELECT * FROM test_enum_set WHERE name REGEXP '张|李';

-- 输出：张伟、张张强、李强

限制返回数量	limit

limit n =>返回n条数据

select *from product limit 1；

limit n,m =>跳过前面n条数据，输出m条数据

select *from product limit 3,3;

查询空值和非空值 NULL

select *from articles where id is not null;

正则匹配

如果基本的能满足需求，尽量用基本的查询方法

[0-9]：匹配在这个范围内任意一个数据

[a-z,A-Z]

重复前面指定的字符出现的次数

？：前面的字符重复0-1次

+：前面的字符出现1次及以上

*：匹配一个字符0次或者多次

^： 匹配字符串开头

$： 匹配字符串结尾

### 排序查询

默认升序

select *from product order by price;

select *from product order by price desc;（desc倒序排序）

默认ASC升序

#### 多字段排序

select *from product where pid between 1 and 10 order by cid desc,price  desc;

### 聚合查询：将多条记录聚合到一起计算出一条

计数，求和，求平均

#### count（字段名）：统计值不为NULL的数量

select count(*) from product;

select count(pid) from product;

#### sum字段：计算数字的和

select sum(price) from product;

#### max字段，max：求最大值，min：最小值

select max(price),min(price) from product;

avg字段：求平均值

select avg(price) from product;

### 分组查询

...where 条件 group by 列名 [having 条件表达式（having对分组的结果在操作)]

查看每个不同类别的平均值

select avg(price),cid from product group by cid;

查找商品类别数量大于等于3的分类

select cid,count(pid) cid_count from product group by cid having cid_count >=3;

## 更新SQL

update <表名> set 列名=值，列名=值...where 条件;

update product set price=price*10 where price<=100;

## 删除SQL

delete from <表名> where 条件;

delete from product where pid=13;

### 清空表

delete from product;

truncate table product;

用delete和truncate清空表有什么区别

delete :删除数据是一行一行的删除 ->删除会产生二进制日志 -》可以恢复

删除慢

truncate：删除表，重新创建表 ->数据无法恢复

速度快

## Mysql常用函数

### 聚类函数 =>将多条数据聚合到一起计算

count不计NULL，sum，max，min，avg

### 计算长度

length =>字符存储消耗的空间

char_length =>统计字符串长度，字符个数

### 字符串函数

CONCAT：字符串连接

select concat(username,email) info from person;

select concat(username,'-',email) info from person;

CONCAT_WS：使用指定的分隔符连接

第一个参数是连接字符串

select concat_ws('-',username,email,'A','B','C') info person;

### FORMAT：数字格式化

select format(3.1415,3);

+------------------+

| format(3.1415,3) |

+------------------+

| 3.142            |

+------------------+

1 row in set (0.00 sec)

### 大小写转换

LOWER：转小写

UPPER：转大写

select lower('Hello'),upper('Hello');

### 取字符串

LEFT：从左取字符串

RIGHT：从右取字符串

场景2026-01-07取其中一个日期

select pname,left(pname,2),right(pname,2);

### 删除指定的前导符或后续符

LTRIM：删除前导空格（左侧）

RTRIM：删除后续空格（右侧）

TRIM：删除指定的前导符或后续符

TRIM(LEADING/TRAILING/BOTH "指定的符号" FROM "字符串")

trim英文翻译为修剪，削减

root@test 16: 22>select "##MYSQL##",TRIM(TRAILING "#" FROM "##MYSQL##");+-----------+-------------------------------------+| ##MYSQL## | TRIM(TRAILING "#" FROM "##MYSQL##") |+-----------+-------------------------------------+| ##MYSQL## | ##MYSQL                             |+-----------+-------------------------------------+1 row in set (0.01 sec)
<table id="gyYiQ" class="ne-table" style="width: 683px"><tbody><tr style="height: 33px"><td width="173">
仅删开头空格
</td><td width="227">
LTRIM(str)

或 TRIM(LEADING ' ' FROM str)
</td><td width="283">
LTRIM(' abc') → 'abc'
</td></tr><tr style="height: 33px"><td width="173">
仅删结尾空格
</td><td width="227">
RTRIM(str)

或 TRIM(TRAILING ' ' FROM str)
</td><td width="283">
RTRIM('abc ') → 'abc'
</td></tr><tr style="height: 33px"><td width="173">
删首尾空格（最常用）
</td><td width="227">
TRIM(str)

（默认）
</td><td width="283">
TRIM(' abc ') → 'abc'
</td></tr><tr style="height: 33px"><td width="173">
删首尾自定义字符（如逗号）
</td><td width="227">
TRIM(字符 FROM str)
</td><td width="283">
TRIM(',' FROM ',abc,') → 'abc'
</td></tr><tr style="height: 33px"><td width="173">
仅删开头自定义字符（如引号）
</td><td width="227">
TRIM(LEADING 字符 FROM str)
</td><td width="283">
TRIM(LEADING '''' FROM '''abc') → 'abc'
</td></tr><tr style="height: 33px"><td width="173">
仅删结尾自定义字符（如下划线）
</td><td width="227">
TRIM(TRAILING 字符 FROM str)
</td><td width="283">
TRIM(TRAILING '_' FROM 'abc_') → 'abc'
</td></tr></tbody></table>
### SUBSTRING：取子串

substring(string,起始位置,长度)

select substring(pname,1,2) from product;

SUBSTRING_INDEX

MySQL 中常用的字符串截取函数，核心作用是按指定分隔符，截取字符串的前 / 后部分，适用于拆分带分隔符的字符串（如域名、组合字段等）。

SUBSTRING_INDEX(字符串, 分隔符, count)

计数规则：


- 正数：从字符串左侧开始，截取到第count个分隔符左边的内容
- 负数：从字符串右侧开始，截取到第abs(count)个分隔符右边的内容

### REPLACE：字符串替换

replace(字符串，查找str，替换str)

select replace(pname,'花',hua) from product;

root@test 16: 22>select replace("##mysql##","#","");+-----------------------------+| replace("##mysql##","#","") |+-----------------------------+| mysql                       |+-----------------------------+1 row in set (0.00 sec)

### 数学运算函数

CEIL：向上取整

ceil(3.1414)=4

FLOOR：向下取整

floor(3.1415)=3

DIV：取整除

5/2 =>2

MOD：取余数

ROUND：四舍五入

POWER：幂运算

### 日期时间函数

NOW		获取当前日期时间

CURDATE		获取当前日期

CURTIME		获取当前时间

#### DATE_ADD	日期操作（计算，支持YEAR，MONTH，DAY，HOUR，MINUTE，SECOND）

也可以直接加，不过格式会被影响

root@test 16: 44>select curdate() + 7;+---------------+| curdate() + 7 |+---------------+|      20260114 |+---------------+1 row in set (0.00 sec)

翻译	interval:间隔

select date_add(curdate(),interval 2 year);

select date_add(curdate(),interval 2 week);

select date_add(curdate(),interval -2 day);

select date_add(curdate(),interval 2 month);

#### DATEDIFF	日期差值

select datediff('2025-1-1','2026-3-4');

#### DATE_FORMAT	日期格式化

select date_format(now(),'%Y/%m%d')

root@test 16: 53>select date_format(now(),'%m/%d/%Y');+-------------------------------+| date_format(now(),'%m/%d/%Y') |+-------------------------------+| 01/07/2026                    |+-------------------------------+1 row in set (0.00 sec)

root@test 16: 53>select date_format(now(),'%M/%d/%Y');+-------------------------------+| date_format(now(),'%M/%d/%Y') |+-------------------------------+| January/07/2026               |+-------------------------------+1 row in set (0.01 sec)

## 子查询（多条select语句）

什么是子查询：一条select查询语句的结果作为另一条select语句的一部分

select *from (select *from table)

select *from table where id in (select id from table)

子查询特点：

1.子查询必须放在小括号中

2.子查询可以独立存在的语句

3.子查询一般有两个位置，充当数据源（表）或充当条件

例题

1.通过子查询的方式，查询出价格最高的商品信息

a.找出最高单价

select max(price) from product

b.找到价格最高的商品信息

select *from product where price = (select max(price) from product)

查询小于平均价格的商品信息

a.找到平均价格

select avg(price) from product;

b.找到商品

select *from product where price <(select avg(price) from product)

## 联接查询（多个表）

多表查询：查询操作中涉及两个或多个表数据查询

多表查询需要表与表之间有紧密联系

表：学生姓名，id ，年龄，年纪，班级id，班主任，教室

分表 = >classes，student（classid）,menus

### 交叉联结

select 列名 from 表1，表2 where

select 列名 from 表1 cross join 表2

两个表相乘

### 内连接（inner join）

核心逻辑：只保留两个表中「关联字段完全匹配」的记录

返回两个表中满足条件的行的组合

select 列名 from 表1 inner join 表2 on 连接条件;

select *from student inner join class on students.class_id=classes.id;

select * from classes, students where students.class_id=classes.id;

+----+--------+------+----------+----+--------+-----------+| id | name   | age  | class_id | id | name   | teacher   |+----+--------+------+----------+----+--------+-----------+|  1 | 张三   |   18 |        1 |  1 | 一班   | 张老师    ||  2 | 李四   |   19 |        2 |  2 | 二班   | 李老师    ||  3 | 王五   |   20 |        1 |  1 | 一班   | 张老师    ||  4 | 赵六   |   18 |        2 |  2 | 二班   | 李老师    |+----+--------+------+----------+----+--------+-----------+4 rows in set (0.00 sec)

### 左连接（left join）

核心逻辑：保留「左表全部数据」，右表只保留匹配的记录；右表无匹配时，显示 NULL

select *from student left join class on students.class_id=classes.id;

### 右连接（right join）

核心逻辑：保留「右表全部数据」，左表只保留匹配的记录；左表无匹配时，显示 NULL

select *from student right join class on students.class_id=classes.id;

自连接

select *from menus as a,menus as b where a.id =b.parent;

![](https://cdn.nlark.com/yuque/0/2025/png/62301513/1765435165720-cbc69ffb-9d6c-418a-9221-46f8ea53f665.png)

全连接UNION

## 

## 高阶查询

case when ：加标签

是一个多分支的函数，可以根据条件列表返回多个值

0-100		低

101-1000		中

1000+		高

![](https://cdn.nlark.com/yuque/0/2025/png/62301513/1765437400435-25dea634-319d-42d1-99ac-1532fbdf0258.png)

case 表达式

when 表达1 then 结果表达式

when 表达2 then 结果表达式

when 表达3 then 结果表达式

[else 结果表达式]

end

从上到下测试比较

查询scores信息，将系号变成中文（学号，姓名，性别，系号）

1 =>计算机

2 =>软件工程

3 =>物联网

![](https://cdn.nlark.com/yuque/0/2025/png/62301513/1765438091617-34c0d829-a4d4-4e97-bb26-78a31d3dada7.png)

![](https://cdn.nlark.com/yuque/0/2025/png/62301513/1765438412917-1cd0c5b9-cbac-4bd3-8a80-38dabdff5946.png)

![](https://cdn.nlark.com/yuque/0/2025/png/62301513/1765439513017-eb888167-d23a-4cc7-a82a-08dbf2180d3f.png)

## 窗口函数

<窗口函数> over (partition by <分组列> order by <排序列>)

按照什么来分组  partition by <分组列>

排序方式  order by <排序列>

![](https://cdn.nlark.com/yuque/0/2025/png/62301513/1765443469600-756447e9-af3d-48c2-98f8-fe6962a62b97.png)

窗口函数是一种在查询结果集上进行计算的一个函数，可以不改变查询结果，为每行添加（排名或聚合信息）

排名（1，2，3/1，1，3）

rank() ：排名，如果值相同，就会出现排名空缺(1,1,3)

![](https://cdn.nlark.com/yuque/0/2025/png/62301513/1765443155996-a3cf4241-fee2-4805-b556-0edcebdfd688.png)

dense_rank()：排名，如果有值相同，不会出现排名空缺(1,1,2)

row_number()：排名，如果有值相同，数值连接(1,2,3)

![](https://cdn.nlark.com/yuque/0/2025/png/62301513/1765443346001-a6de099b-3617-4a95-83a9-7909ff1dfbb3.png)

聚合函数（sum，avg，max，min）

计算每个班的平均分

![](https://cdn.nlark.com/yuque/0/2025/png/62301513/1765444134006-d388acb3-b206-4a4b-8494-25061cde3fa9.png)

普通查询 -》子查询 -》联结查询 -》高阶查询

函数，视频，触发器，存储过程

有一些复杂的SQL可能会很长。。。

这些SQL有可能复用

*重复的查询

*对结果集进行二次查询

## 视图：select语句执行后的结果集

*特性：对多张表的引用，一张虚拟表，只存查询方法，不存具体数据

作用：

简化查询操作，增强可读性

用户权限可以设定到视图级别（表数据行，列级别权限控制）

### 创建视图（view）

create view view_student_course as(select id,name,sname,from student left join course on student.course_id = course.sid where name  ="小飞")；

### 使用视图

select *from view_student_course

## 查看有哪些视图

show table status where comment="view";

### 查看视图的创建

show  create view <视图名>;

### 修改视图

alter view '视图名' as (sql);

### 删除视图

drop view '视图名'

## 函数

max，count，upper.....

函数：可以接收参数并返回一个值的SQL代码

### 自定义函数

计算折扣价 => 单价，折扣

修改结束词

delimiter		//

create function fun_price(price decciaml(10,2),rate decimal(3,2)) returns decimal(10,2) DETERMINISTIC

begin

declare result decimal(10,2);

set result = rate*price;

return result;

end //

delimiter ;

DETERMINISTIC =》声明该函数是确定性函数

### 查看有哪些函数

show function status\G

### 查看函数的创建语句

show create function 函数名；

删除函数

drop function 函数名;

## 存储过程

一组可编程函数，为了完成特定功能的SQL语句集，

经过编译保存在数据中，用户可以通过存储过程的名字，参数来调用

封装：将重复性执行的内容写到存储过程，简化SQL调用

统一接口，确保数据安全

视图VS存储过程

### 创建存储过程

delimiter		//

create procedure my_procedure_name([arg_list])

begin

--SQLend //

delimiter ;

创建一个存储过程，product表中所有产品信息

delimiter //

create proccedure get_all_products()

begin

select *from product;

end //

delimiter ;

### 调用存储过程

call get_all_products()

创建一个存储过程，根据产品cid查询产品信息

注意：参数名不要跟字段同名

delimiter //

create procedure get_all_product01(in category char(4))

begin

select  *from product where cid = cid;

end //

delimiter ;

call get_all_product01('c002');

创建一个存储过程，获取最高价格，通过输出返回参数

delimiter //

create proccedure get_all_product02(out max_price double)

begin

select max(price) into max_price from product;

end //

delimiter ;

set  @max_price_value = 0;

call get_all_product02(@max_price_value);

## 触发器

在满足条件时触发对应的执行语句

触发条件：insert，update，delete

触发时间：在。。。前，后

触发频率：每一执行

触发对象：表

转账表  -》日志表

触发器：1.后台执行，有时候忘记了。。。

2.行执行，资源消耗大

### 创建触发器

create trigger trigger_name

trigger_time trigger_event

on table_name for each row

...

...

例子

create trigger trig1

after insert on product

for each row

insert into time(t) value(now());

查看触发器

show trigger 触发器名

show create 触发器名

## 索引

一种特殊的数据结构，像字典的目录，帮助Mysql高效的获取数据

如果没有索引 =》全表扫描 =》从第一条记录开始找，直到找到为止

https://www.cs.usfca.edu/~galles/visualization/Algorithms.html

优点

显著提升查询速度

降低磁盘i/o次数

优化排序与分组操作（索引有排序）

缺点

增加存储空间（索引数据占存储空间）

降低写入性能（写入数据之后，索引数据要更新）

什么情况下适合索引

主要用来写入数据，几乎很少查询 =》不建议索引

经常要查询

建议加索引（索引要加到查询的条件字段上，否则索引失效）

mysql索引底层结构

常用数据存储结构：哈希结构，B+树结构

二叉树查找

二叉树：每个节点最多有两个子节点

任何节点的左子节点值都小于当前节点

右子节点值都大于当前节点

每次insert数据时，在建立索引数据

测试。。。

1.建立一个二叉树 - 》索引苏剧

2.查找数据

3.查找可能存在的问题（树可能变成一个类似链表，层级很高）

平衡二叉树（AVL树）

每个节点最多有两个子节点

任何节点的左子节点值都小于当前节点

右子节点值都大于当前节点

每个节点的左右子树的高度差不能超过1

测试

1.建立一个二叉树 -》索引数据

2.查找数据

B树和B+树

B树和B+树在AVL树的基础上，数据量大时，更进一步

每个节点最多有N个子节点

任何节点的左子节点值都小于当前节点

右子节点值都大于当前节点

每个节点的左右子树的高度差不能超过1

B+树的数据存储在叶子节点上，数据形成链

B+一个节点存储1000个数

1000*1000*1000=10亿 三层

Mysql使用B+树

二叉树：某些情况下树不平衡（高）

|

平衡二叉树（VAL）：确保树的平衡，只有两个子节点

|

B树：N个子节点

|

B+树：N个子节点

子节点存储内容：

B树：内部节点和叶子节点都存数据

B+树：只有叶子节点存储数据，内部节点只存储键值

叶子节点结构：

B树：叶子节点没有直接连接

B+树：通过链表连接，支持快速遍历

插入/删除操作：

B树：影响多个层级节点

B+树：主要集中在叶子节点上（稳定性更好）

适用场景：

B树：适合精确查找，范围查询性能差

B+树：适合精确查找和范围查找

索引的分类

字段数量：单列索引和多列索引

单列索引的分类：

唯一索引：节点值不允许重复

主键索引：不允许重复，不允许有空值

普通索引：key，index

多列索引注意：

查询条件中包含了多列索引的第一个字段才能使用多列索引

user:id,name,age =>多列索引

select *from user where name = 'cali' and age =18;

select *from user where name = 'cali' and id =6; =>会使用索引

在建表时创建

create table test_index01(

name char(10),

age int,

index idx_name(name)

);

单独创建

create table test_index02(

name char(10),

age int

);

create index idx_name test_index02(name);

注意：创建索引越早越好（数据越少时创建）

数据量大时创建索引十分耗时

### 

#### 使用alter创建索引

alter table test_index03 add unique index idx_name(name);

添加唯一索引

创建唯一索引

CREATE UNIQUE INDEX 索引名 ON 表名 (字段)

create unique index idx_age on test_index03(age);

注意：如果表中已经有数据了，字段值有相同，创建唯一索引会失败

### 三种添加索引的方式：创建表时，alter，create

创建主键索引

#### 创建表时

create table test_index04(

name char(10),

age int,

index idx_name(name)

);

#### alter table

create table test_index05(

name char(10),

age int

);

alter table test_index05 add primary key idxx_name(name);

#### 创建联合索引

注意：最常用的字段放在第一位

create index idx_name on table_name(column1,column2,...)

alter table table_name add index idx_name(column1,column2,...)

## 全文索引

适合字段：text

存储引擎：MyISAM

### 创建全文索引

alter table test_index06 add fulltext index idx_content(content);

create fulltext index idx_name on test_index06(name);

测试添加了存储引擎速度的变化

python连接mysql

创建一个表：

create table test_index10(

name char(10),

age int,

content text

);

name

### Mysql事务

事务主要用于处理操作量大、复杂度高的数据

事务是什么？

是一种机制，一个事务中包含一组数据库操作命令，将所有命令看作一个整体，要么全部执行要么全部不执行

*事务是一个不可分割的工作单元

*要么同时全部执行，妖媚全部不执行

用于处理大任务的一批SQL语句，这些SQL要么同时执行，要么同时不执行

如：事务中有10个SQL语句，1234成功5失败	-》回滚

事务是一种机制，包含了一组SQL语句，要么同时执行，要么同时不执行。

事务是一个整体

什么情况下使用事务 -》银行转账

A  1000 ->B 1000

1, A-100

2, B+100

事务的特点：ACID

A - Atomicity 原子性

事务是一个不可再分割的工作单元，要么都发生，要么都不发生

C -一致性

事务开始之前和结束之后，数据库的完整性约束没有被破坏

转账

库存：购物（售出，出库）

I - 隔离性

多个事务并发执行时，一个事务的执行不能被其他事务干扰。

D - 持久性

事务执行完成后（commit），数据写入磁盘，不能被回滚

事务的格式：

begin

SQL	语句

SQL	语句

2SQL	语句

commit；

### 事务并发存在的问题

1.脏读：读到未提交的数据

2.不可重复读：前后多次读取同一个数据内容不一致

3.幻读：前后多次读取数据，数量的总量不一致（插入删除数据时）

4.丢失更新：多个事务同时更新一个数据时，后提交的事务覆盖先提交大的事务

### 隔离级别（4种）

读未提交（read uncommitted）：读取尚未提交的数据

不解决以上任何问题

读已提交（read commited）：读取已经提交的数据，可以解决脏读

只能读到已经提交的数据，未提交的不能读取

Oracle数据中默认的级别

安全性较差，性能较好

可重复读（Repeatable read）：可以解决脏读，不可重复读

一个事务执行大的过程中，多次读取同一个数据，会得到相同的结果

mysql默认的隔离级别

安全性号，性能中等

串行化（Serializable）:

事务被一个一个串行执行

安全性最好，性能差

脏读			不可重复读		幻读			丢失更新

read uncommitted			yes			yes			yes			yes

read commited			no			yes			yes			yes

Repeatable read			no			no			no			yes	mysql默认级别

Serializable				no			no			no			no

查看当前隔离级别

show global variables like "%isolation%";

![](https://cdn.nlark.com/yuque/0/2025/png/62301513/1766036893503-3e348a40-d4b4-4c81-9775-77c28b82b950.png)

### 隔离级别的查询和设置

select @@global.transaction_isolation;

![](https://cdn.nlark.com/yuque/0/2025/png/62301513/1766037132792-14bc75fd-e171-41cf-ab33-d5e9d6d08a6b.png)

#### 设置隔离级别

全局设置		set global transaction isolation level 隔离级别

会话设置		set session transaction isolation level 隔离级别

### autocommit	设置是否自动提交

ON：自动提交

OFF：禁止自动提交--》每一次操作都需要commit/

rollback操作数据才会写入数据root@(none) 10: 52> show variables like 'autocommit';+---------------+-------+| Variable_name | Value |+---------------+-------+| autocommit    | ON    |+---------------+-------+1 row in set (0.00 sec)

#### 关闭自动提交

root@(none) 10: 52>set autocommit=0;Query OK, 0 rows affected (0.00 sec)

root@(none) 10: 53> show variables like 'autocommit';+---------------+-------+| Variable_name | Value |+---------------+-------+| autocommit    | OFF   |+---------------+-------+1 row in set (0.00 sec)

show variables like "autocommit";

![](https://cdn.nlark.com/yuque/0/2025/png/62301513/1766037354800-653873ab-c733-4c16-b32b-981531e3e564.png)

commit	=》将数据写入磁盘（commit前，数据在内存）

执行sql语句时，默认会将SQL当作一个事务执行，所以autocommit=1时，会自动commit操作

如果事务中有多个SQL语句，手动开启事务

开启事务

begin/start transaction

提交事务

commit

测试是否自动提交

执行INSERT语句

查看数据 =》可以看到 =》没有落盘（写到磁盘上）

退出session，进行之后再查看 =》数据丢失

如果没有手动开启事务的话，一个SQL语句就是一个事务

这个事务是否自动提交取决于autocommit参数

### 设置回滚点

savepoint name

回滚

rollback [name]

![](https://cdn.nlark.com/yuque/0/2025/png/62301513/1766040003925-7a4c632a-a6b2-4a27-a8a9-10e23a767275.png)

回滚时会提交

添加设置回滚点

![](https://cdn.nlark.com/yuque/0/2025/png/62301513/1766040400325-3faa027a-92ec-4a9a-b2f0-3d88b2df10ae.png)

savepoint s2;

root@test 14: 45>rollback to s2;

Query OK, 0 rows affected (0.00 sec)

rollback 回滚+提交

rollback to point 	 只回滚

### 测试隔离级别

#### 隔离级别：读未提交

set global transaction isolation level read uncommitted;

![](https://cdn.nlark.com/yuque/0/2025/png/62301513/1766041287524-e739c158-7e49-47fc-b373-02123d601f1e.png)

1.打开两个session，将session的隔离级别设置为read uncommitted

#### 隔离级别：读已提交

set session transaction isolation level read commited;

session A

![](https://cdn.nlark.com/yuque/0/2025/png/62301513/1766043010583-623d54e8-0767-4bb0-ba5c-971d56329654.png)

![](https://cdn.nlark.com/yuque/0/2025/png/62301513/1766043026493-5d622822-857d-4f12-bdbf-56b3894ee8b4.png)

session B

![](https://cdn.nlark.com/yuque/0/2025/png/62301513/1766043041888-93ae39e2-f810-4c8b-82b8-ccdba8e269c3.png)

#### 隔离级别：可重复读

root@(none) 17: 31>set session transaction isolation level repeatable read;

Query OK, 0 rows affected (0.00 sec)

root@(none) 17: 36>show session variables like "%isolation%";'

+-----------------------+-----------------+

| Variable_name         | Value           |

+-----------------------+-----------------+

| transaction_isolation | REPEATABLE-READ |

+-----------------------+-----------------+

1 row in set (0.00 sec)

session B中没有读到session中提交的数据，不存在脏读

![](https://cdn.nlark.com/yuque/0/2025/png/62301513/1766051966782-1a863ab2-019a-4d99-ba1b-c2bdf0ab0ef1.png)

#### 隔离级别：丢失更新？

原始值	500

session A		-100

session B		-50

没有发生丢失更新	350

发生丢失更新		如果B后提交450，如果A后提交值400

用传统的update看不到丢失更新

(如果session A 没有提交，此处会阻塞）

begin;

select *from inffo where id=1;

update info set money =money -100 where id=1;

select *from inffo where id=1;

money=400

session B

begin;

select *from inffo where id=1;

update info set money =money -50 where id=1;

select *from inffo where id=1;

隔离级别：串行化

## 锁

在并发环境中，会存在资源争夺，如何解决资源争夺问题？谁可以使用数据？ =》锁

并发执行 -》资源争夺 -》锁 -》

Mysql使用隔离级别（不同的隔离级别会有不同的锁策略）

锁：可以理解为一个凭证

事务		-- 基于数据库连接（session） - 连接由工作线程来维护

多个事务并发	-- 多个工作线并发  --  存在资源分配

通过调整事务的隔离级别来避免以上问题

事务的隔离级别	- 锁机制 -》解决事务并发问题

### 锁的分类

#### 按颗粒度分

全局锁：锁定数据库中的所有表，加上全局锁后，数据库只读不能写（数据备份）

表锁：锁住整张表

表锁：共享读锁，独占写锁（read/write）

元数据锁：锁住表结构（不能修改表结构）

意向锁：为了提升锁的效率，配合行锁使用

行锁：锁定指定的行

记录锁：id=1，id=2	在rc和rr级别下支持（update/delete）

间隙锁：id=1，(2,9) id=10（不允许insert操作，避免幻读）

临键锁：间隙锁的升级 =》记录锁+间隙锁，rr级别下支持

#### 互斥性划分

共享锁/S锁/读锁：不同事务之间不会相互排斥

排他锁/X锁/写锁：同一时刻只能有一个事务获取锁，一般写操作

#### 以加锁方式分

显示锁（手动指定加锁）和隐式锁

以思想维度分

乐观锁：先操作，失败了在解决 -》代码实现

悲观锁：（Mysql中）先加锁在操作数据

### 共享锁

一个事务获取共享锁，当前事务可读可写

其他事务对数据进行读操作，不能写

#### 加共享锁

SELECT ... LOCK IN SHARE MODE;

SELECT ... FOR SHARE;

当一个事务获取共享锁，并修改数据，其他事务不能获取共享锁

1：对id=1添加一个共享锁，并修改数据

T2/T3：读取id=1的数据，不可以获取共享锁

session A

root@test 14: 53>show variables like "%isolation%";

+-----------------------+-----------------+

| Variable_name         | Value           |

+-----------------------+-----------------+

| transaction_isolation | REPEATABLE-READ |

+-----------------------+-----------------+

1 row in set (0.02 sec)

root@test 14: 53>begin;

Query OK, 0 rows affected (0.00 sec)

root@test 14: 54>select *from info where id=1 for share;

+----+------+-------+

| id | name | money |

+----+------+-------+

|  1 | A    |  1100 |

+----+------+-------+

1 row in set (0.00 sec)

root@test 14: 55>update info set money=money+100 where id=1;

Query OK, 1 row affected (0.00 sec)

Rows matched: 1  Changed: 1  Warnings: 0

session B

root@test 14: 57>begin;

Query OK, 0 rows affected (0.00 sec)

root@test 14: 57>select *from info where id=1;

+----+------+-------+

| id | name | money |

+----+------+-------+

|  1 | A    |  1100 |

+----+------+-------+

1 row in set (0.00 sec)

root@test 14: 57>select *from info where id=1 for share;

ERROR 1205 (HY000): Lock wait timeout exceeded; try restarting transaction

无法查询共享锁

当多个事务同时对数据获取共享锁，所有事务都只能读取数据

T1：对id=1添加一个共享锁，只读取数据

T2/T3：读取id=1的数据，可以获取共享锁

### 排他锁/X锁/

写锁：同一时刻只能有一个事务获取锁，一般写操作当一个事务获取排他锁后，当前事务可读可写，其他事务不能获取锁，会阻塞

#### 加排他锁

SELECT ... FOR UPDATE

T1:

给id=1的数据加了一个排他锁

T2:

读取id=1数据，获取排他锁	-》失败阻塞

修改id=1数据？

T1：root@test 15: 10>begin;

Query OK, 0 rows affected (0.00 sec)

root@test 15: 12>select *from info where id=1 for update;

+----+------+-------+

| id | name | money |

+----+------+-------+

|  1 | A    |  1200 |

+----+------+-------+

1 row in set (0.00 sec)

T2/T3：root@test 15: 11>begin;

Query OK, 0 rows affected (0.00 sec)

root@test 15: 12>select *from info where id=1 for update;

ERROR 1205 (HY000): Lock wait timeout exceeded; try restarting transaction

其他任何锁都无法添加

### 锁释放

Mysql释放锁操作都是隐式的，由Mysql自己完成

读未提交：当SQL执行完成，锁被释放

可重复读：当事务结束，锁被释放

unlock tables；

### 全局锁：整个数据实例加锁，整个实例处于只读状态

（不能增删改，不能修改表结构，创建表。。。）

使用场景：全库数据备份

mysqldump -uroot test4 > /data/mysql_backup.sql

vim /etc/my.cnf.d/client.cnf =>注释掉prompt行

#### 加全局锁

flush tables with read lock；

root@test 15: 24>flush tables with read lock;

Query OK, 0 rows affected (0.08 sec)

root@test 15: 24>insert into info values(7,'G',1000);

ERROR 1223 (HY000): Can't execute the query because you have a conflicting read lock

root@test 15: 29>unlock tables;		#释放锁

Query OK, 0 rows affected (0.00 sec)

数据库备份

mysqldump -uroot -p test > ./backup.sql

导出到 ./backup.sql吗文件

### 表锁：锁住整张表

表锁：共享读锁，独占写锁

元数据锁：锁住表结构（不能修改表结构）

意向锁：为了提升锁的效率，配合行锁使用

#### 特点：

加锁快，开销小，不会产生死锁

颗粒度大，并发性低，锁冲突概率高

MyISAM，InnoDB

表共享读锁：read lock

表独占写锁：write lock

#### 添加锁

Lock table 表名 read;

Lock table 表名 write;

#### 删除锁

Unlock tables;

#### 查看锁

show open tables where in_use >0;

root@test 16: 07>show open tables where in_use >0;

+----------+-------+--------+-------------+

| Database | Table | In_use | Name_locked |

+----------+-------+--------+-------------+

| test     | info  |      1 |           0 |

+----------+-------+--------+-------------+

1 row in set (0.00 sec)

表的读锁测试

root@test 16: 09>update info set money=money+1  where id=1;

ERROR 1099 (HY000): Table 'info' was locked with a READ lock and can't be updated

### 事务，锁笔试面试高频面试题

事务

什么是事务？

事务的特点？

ACID分别表示什么？

Mysql默认的事务隔离级别是什么？

4种隔离级别从低到高排序? RU - RC - RR - SE

脏读发生在什么级别？如何避免？

不可重复读和幻读的区别？

隔离级别的设置，查询

每个隔离级别测试一下

锁

锁的用途？

每种锁的使用情况 ？

锁的两种主要类型？共享锁/排他锁

全局锁的设置

表锁的设置（read/write）和特点

### 元数据锁：锁住表结构（添加列，添加行，修改列名，列类型。。。）

MDL（Meta Data lock）

元数据：表结构

什么情况下要加元数据锁？

元数据锁是隐式锁，不需要手动添加

1.当对表进行增删改查时，加MDL读锁

2.当对表结构进行修改时，加MDL写锁

MDL作用：维护数据的一致性

root@performance_schema 19: 05>desc metadata_locks;

+-----------------------+-----------------+------+-----+---------+-------+

| Field                 | Type            | Null | Key | Default | Extra |

+-----------------------+-----------------+------+-----+---------+-------+

| OBJECT_TYPE           | varchar(64)     | NO   | MUL | NULL    |       |

| OBJECT_SCHEMA         | varchar(64)     | YES  |     | NULL    |       |

| OBJECT_NAME           | varchar(64)     | YES  |     | NULL    |       |

| COLUMN_NAME           | varchar(64)     | YES  |     | NULL    |       |

| OBJECT_INSTANCE_BEGIN | bigint unsigned | NO   | PRI | NULL    |       |

| LOCK_TYPE             | varchar(32)     | NO   |     | NULL    |       |

| LOCK_DURATION         | varchar(32)     | NO   |     | NULL    |       |

| LOCK_STATUS           | varchar(32)     | NO   |     | NULL    |       |

| SOURCE                | varchar(64)     | YES  |     | NULL    |       |

| OWNER_THREAD_ID       | bigint unsigned | YES  | MUL | NULL    |       |

| OWNER_EVENT_ID        | bigint unsigned | YES  |     | NULL    |       |

+-----------------------+-----------------+------+-----+---------+-------+

11 rows in set (0.00 sec)

session A：

root@test 17: 21>begin;

Query OK, 0 rows affected (0.00 sec)

root@test 17: 22>select *from product where pid=1;

+-----+--------+-------+------+

| pid | pname  | price | cid  |

+-----+--------+-------+------+

|   1 | 联想   |  5010 | c001 |

+-----+--------+-------+------+

1 row in set (0.00 sec)

root@test 17: 22>

session B：

root@test 17: 21>begin;

Query OK, 0 rows affected (0.00 sec)

root@test 17: 22>alter table product add column comment varchar(10);

^C^C -- query aborted

ERROR 1317 (70100): Query execution was interrupted

root@test 17: 24>

### 意向锁

#### 一般情况

意向锁：为了提升锁的效率，配合行锁使用

user表：1千万条数据

T1：id=8888888这条数据加一个行锁（update）

T2：想获取这个表的写锁 =》获取失败

检查user表是否有读锁或写锁	-》No

检查行锁，一行一行检查		-》Yes

user表：1千万条数据

T2：想获取这个表的写锁 =》获取成功（有问题）

检查user表是否有读锁或写锁	-》No

检查行锁，一行一行检查		-》Yes

T1：id=8888888这条数据加一个行锁（update）

1.效率低

2.容易出错

#### 添加意向锁

有意向锁之后：隐式锁（不需要手动添加）

当给表添加行锁的时候，会自动添加一个意向锁

意向锁理解成一个标记

效率高不需要一行行检查了

user表：1千万条数据

T1：id=8888888这条数据加一个行锁（update）

T2：想获取这个表的写锁 =》获取失败

检查user表是否有读锁或写锁	-》有意向锁

user表：1千万条数据

T2：想获取这个表的写锁 =》获取成功（有问题）

检查user表是否有读锁或写锁	-》No

T1：id=8888888这条数据加一个行锁（update）

表锁和行锁同时存在情况

#### 意向共享锁与表锁

session A

begin;

给pid=1加了行共享锁，给product表添加共享意向锁

select *from product where pid=1 lock in share lock;

session B

begin;

获取表的贡献锁

lock table product read;

获取表的排他锁

lock table product write;

阻塞状态

#### 意向排他锁与表锁

session A

begin;

update product set price=price+1;

session B

begin;

获取表的共享锁

lock table product read;

阻塞状态

获取表的排他锁

lock table product write;

阻塞状态

### 行锁

全局锁

表锁：lock read/write，元数据锁，意向锁

行锁：行锁（指定的行-数据-RC-RR级别支持），间隙锁（空隙-防止幻读-RR级别支持），

临键锁=行锁+间隙锁（RR级别支持）

特点：	 开销大，	加锁慢，

颗粒度小，并发度高，锁冲突的概率低

行锁也分为共享锁和排他锁

root@test 20: 45>create table test_lock1( id int auto_increment primary key, product_name varchar(50), price decimal(10,2), index idx_price(price));

Query OK, 0 rows affected (0.02 sec)

root@test 20: 45>insert into test_lock1 values(1,'product1',5),(2,'product2',10),(4,'product3',15),(5,'product4',20),(6,'product5',25),(9,'product6',30);

Query OK, 6 rows affected (0.00 sec)

Records: 6  Duplicates: 0  Warnings: 0

root@test 20: 48>select *from test_lock1;

+----+--------------+-------+

| id | product_name | price |

+----+--------------+-------+

|  1 | product1     |  5.00 |

|  2 | product2     | 10.00 |

|  4 | product3     | 15.00 |

|  5 | product4     | 20.00 |

|  6 | product5     | 25.00 |

|  9 | product6     | 30.00 |

+----+--------------+-------+

6 rows in set (0.00 sec)

id：主键（索引）

price：普通索引

product_name：无索引

#### 添加行锁

排他锁

select *from table for update

共享锁

select *from table lock in share mode

给非索引字段添加行锁

预期：给product_name="product1"添加行锁

session A

begin;

select *from test_lock1 where product_name="product1" for update;

session B

begin；

update test_lock1 set price=price+1 where product_name="product1";

阻塞状态

update test_lock1 set price=price+1 where product_name="product2";

阻塞状态

#### 在索引上（包括主键）加行锁

预期：行锁

结果：行锁

session A

begin;

root@test 21: 08>select *from test_lock1 where price=5 for update;

+----+--------------+-------+

| id | product_name | price |

+----+--------------+-------+

|  1 | product1     |  5.00 |

+----+--------------+-------+

1 row in set (0.00 sec)

session B

begin;

root@test 21: 09>update test_lock1 set price=price+1 where price=5;

^C^C -- query aborted

ERROR 1317 (70100): Query execution was interrupted

root@test 21: 09>update test_lock1 set price=price+1 where price=3;

Query OK, 0 rows affected (0.00 sec)

Rows matched: 0  Changed: 0  Warnings: 0

#### 在索引上（包括主键）用in加行锁

预期：指定多行加行锁

结果：

session A

begin；

root@test 21: 13>select *from test_lock1 where price in (10,25) for update;

+----+--------------+-------+

| id | product_name | price |

+----+--------------+-------+

|  2 | product2     | 10.00 |

|  6 | product5     | 25.00 |

+----+--------------+-------+

2 rows in set (0.00 sec)

root@test 21: 15>update test_lock1 set product_name="abc" where price=10;

^C^C -- query aborted

ERROR 1317 (70100): Query execution was interrupted

阻塞状态

session B

root@test 21: 14>begin;

Query OK, 0 rows affected (0.00 sec)

root@test 21: 14>update test_lock1 set product_name="abc" where price=20;

Query OK, 1 row affected (0.00 sec)

Rows matched: 1  Changed: 1  Warnings: 0

在唯一索引上进行等值查询，给不存在的记录加锁

结果：将当前间隙锁住

session A

root@test 21: 21>begin;

Query OK, 0 rows affected (0.00 sec)

root@test 21: 21>select *from test_lock1 where id=7 for update;

Empty set (0.00 sec)

在session A可以进行插入

root@test 21: 21>insert into test_lock1 values(7,'test',7);

session B

begin;

root@test 21: 21>insert into test_lock1 values(7,'test',7);

^C^C -- query aborted

ERROR 1317 (70100): Query execution was interrupted

在普通索引上进行等值查询

颗粒度：全局，表，行

互斥性：共享，排他

乐观锁和悲观锁

对数据中的数据读写持悲观态度

假定在读写数据的同一时刻会有其他事务来修改数据

所以在操做前先对数据进行加锁

防止其他事务对数据进行修改

先加锁再操作数据

悲观锁：数据库中默认都是悲观锁

乐观锁：无锁思想

对数据中数据的读写持乐观态度

假定在读写数据的同一时刻不会有其他事务来修改数据

所以在操作钱不会对数据进行加锁

他在更新数据时，会检查数据是否被其他事务修改

如果没有被修改则更新成功，如果被修改则更新失败

乐观锁是靠用户代码逻辑实现

通过版本号或者时间戳机制来实现

如果：基于版本号的乐观锁

1.设计表结构，多加一个字段pid，product_name，price，version

2.每次更新数据时，将版本号和要更新的数据取出来

3.更新操作时，检查当前版本号与之前取出来的版本号一致

开始更新，数据更新，version+1

并发可能存在的问题：死锁

什么情况下发生死锁

进行某个操作需要1资源和2资源

多个进程同时访问，A进程获取了1资源，等待2资源

B进程获取了2资源，等待1资源

如何避免死锁？

1.设计资源获取流程：先拿到1，在拿到2

2.设计一个单独的进程，去检查是否发生死锁，如果发生了，

设计一个算法，权限利弊，杀死一个进程，释放资源

## 日志

日志用来作什么？

记录了很多关于程序运行状态的信息（正常，出错。。。）

用于排错

了解Mysql性能（速度）运行状况

数据的备份和恢复

Mysql日志

### 1.错误日志（error log）

记录Mysql启动，关闭，运行过程中的错误信息

配置方式

my.cnf

[mysqld]

log-error=/var/log/mysql.log

### 2.慢查询日志（slow qurey log）

记录Mysql中响应时间超过阈值的SQL语句信息

作用：记录时间较长的SQL语句，为数据库性能提升提供了线索

（DBA/开发人员）

配置方式

my.cnf

[mysqld]

long_query_time=10

默认10s，如果sql语句执行超过10s，将会记录下来

分析慢日志：mysqldumpslow

#慢日志

slow_query_log=1

slow_query_log_file=/data/mysql/mysql_query.log

long_query_time=10

root@test 11: 29>show variables like "%long_query%";

+-----------------+-----------+

| Variable_name   | Value     |

+-----------------+-----------+

| long_query_time | 10.000000 |

+-----------------+-----------+

1 row in set (0.00 sec)

### 3.一般查询日志（general log）

记录客户端连接服务端的信息以及执行SQL语句的信息

执行SQL命令，执行结果（成功，失败原因）

从性能考虑，默认没有开启

general-log

root@test 17: 28>show variables like "%general_log%"

-> ;

+------------------+----------------------+

| Variable_name    | Value                |

+------------------+----------------------+

| general_log      | OFF                  |

| general_log_file | /data/mysql/wang.log |

+------------------+--------

![](https://cdn.nlark.com/yuque/0/2025/png/62301513/1766568906534-4af523a2-5d86-45e7-904e-b1934bb323d8.png)

systemctl restart mysqld			重启数据库

### 4.事务日志（redo log）/重做日志

是Mysql存储引擎InnoDB的事务日志

可以让Mysql拥有崩溃回复的能力

比如Mysql实例挂了，宕机了，重启InnoDB使用redo

log恢复数据保持数据的一致性

### 5.回滚日志（undo log）

起到回滚的作用，保证事物的原子性

6.二进制日志（bin log）/归档日志	= >数据同步和数据恢复

数据以二进制方式存储在磁盘上逻辑日志，记录了用户对数据库的操作

## Mysql存储引擎

Mysql "存储引擎" 与操作系统的 "文件系统"

文件系统：数据在磁盘上如何存储和管理

存储引擎：数据在数据库层面应该如何存储和管理、

基本数据存，取：数据库事务，锁数据备份，恢复，优化

InnoDB：app1.idb

MyISAM：

CSV：以逗号为分隔符的村文本文件

查看存储引擎 SELECT @@DEFAULT_STORAGE_ENGINE;

root@(none) 10: 00> SELECT @@DEFAULT_STORAGE_ENGINE;+--------------------------+| @@DEFAULT_STORAGE_ENGINE |+--------------------------+| InnoDB                   |+--------------------------+1 row in set (0.00 s

**数据库没有存储引擎**

### INNODB 存储引擎（默认）

支持事务：最重要的特性

银行转账：A -》B（A-100，A流水，B+100，B流水）

行级锁：

并发操作

支持外键约束

### MyISAM存储引擎

高性能读操作

在执行简单查询时速度通常比INNODB快（因为他没有事务和行级锁带来的额外开销）

表级锁

不支持外键约束和事务处理

适合场景：以查询为主的系统（仓库系统）

## 日志备份和恢复