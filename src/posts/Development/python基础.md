---
title: python基础
icon: python
date: 2025-11-02
category:
  - 开发
---

Python 是一种简洁、易读、功能强大的编程语言，广泛应用于 Web 开发、数据分析、人工智能等领域（1.web开发，2.数据分析，数据分析库，3.ai 人工智能，4.运维工具（运维是运行和维护保障服务7*24小时不间断运行）

### 1.python

1.解释型语言

2.动态类型语言

3.强类型语言

### 2.虚拟环境

Python 虚拟环境就是给每个项目单独创建的 “隔离小环境”，里面装着项目专属的 Python 解释器和依赖包，互不干扰

为什么要创建虚拟环境

答：为了保持项目环境纯净，防止影响其他环境

1.模块库

2.标准库

3.自定义库

4.第三方库		--下载 pip

# 3.python基础操作

## 1.注释

单行注释

多行注释

## 2.赋值

引用赋值

a=100

b="string"

多项赋值

a,b = “abc”，200

连续赋值

x = y = 500

数据交换

a,b =b,a

## 3.缩进--区分代码块

if x>y:

print("x>y")

else

print("x&lt;=y")

## 4.一行可以有多个语句但是不建议

print("abc");print("xyz")

print("abc"\

"xyz")语句体后面使用反斜杠续行

## 5.pip8风格指南

#缩进使用4个空格

#逗号要空格

#运算符周围要空格

#注释尽量单独放在一行

#函数、类空行

#一般一行不超过79个字符

## 6.基本输入输出 input print type --内建函数

str1 = input ("请输入：")

print("str1")

print( type(str1) )

print输出

print()

print("abc",str1,100)

sep="###"指定分割符

print("xyz","qqq",sep="###")

xyz###qqq

# python基本数据类型

整型

浮点型

复数

字符串

布尔类型

NoneType

## 1.判断变量类型

print( isinstance(a,int) )//返回布尔类型

str =“100”

num =( str1 )

## 2.进制表示

num2 = 0b11		#二进制	0b开头

print( type(num2))

num3 = 0o11		#八进制	0o开头

num4 = 0x11		#十六进制	0x开头

## 3.复数	#x=4+5i

c1 = 4+5j

print( c1,type(c1) )

print( c1.real,c1.imag)

## 4.浮点型

f1 = 5.2

print( f1,type(f1) )

f2 = 1-0.1-0.1-0.1#浮点型是不精确的	二进制存储

print（f2）

要储存精确数据类型用deicimal（储存金钱）

## 5.字符串的运算

print("abc"+"xyz")		#字符串的拼接

print("abc"*3)			#字符串的重复

print("abc">"xyz")		#根据ascii码比较

#ascii码

#unicode 万国码

#utf-8	gbk是unicode的具体实现

print( ord ("中"))

print(bin(20013))

## 6.转义字符

#\n		换行符

#\t		tab键

#\a		响铃

#“

#\\		代表\

#\"		代表”

print("a\tb")

print(""a\\b)

print(r"a\tb")		#raw	r标记位字符串原样输出

## 7.字符串的格式化

name=input("请输入用户名：")

age=input("请输入年龄：")

#%s		字符串

#%d		十进制整数

#%x		十六进制整数

#%.2f	保留两位小数

print("name is %s,age is %d"%(name,age))

f1=0.37296

print("%.2f%%(f1*100)")

print("name is {},age is {}".format(name,age))

print("name is {0},age is {1}".format(name,age))

print("name is {username},age is {userage}".format(username=name,userage=age))

#python f标志位格式化

print(f"name is {name},age is {age}")

## 8.字符串的截取

str1 = "abcdefgx"

#索引

#str[start:end:step]

#先确定step为正还是负

#正向后截取，负向前截取

#确定start和end的位置

#确定步长step的值

#start，end，step三个值都可以省略

## 

## 

#遍历

#挨个获取字符

for i in "python":

print(i)

#判断字符在不在某个字符中

print('ab'in "python")

```python
# 从键盘接收任意字符串输入，按顺序拿取出里面的大写字母、小写字母、数字
# 判断是否为回文
u = l = d = ''
s = input("请输入字符串")
for i in s:
    if 'A' <= i <= 'Z':
        u += i
    elif 'a' <= i <= 'z':
        l += i
    else:
        d += i
print(u, l, d, sep='\n')
print("\n回文判断结果：")
print(f"大写字母序列是否回文：{u == u[::-1]}")
print(f"小写字母序列是否回文：{l == l[::-1]}")
print(f"数字序列是否回文：{d == d[::-1]}")
print(f"原始字符串是否回文：{s == s[::-1]}")
```

## 9.算术运算符

#+	-	*	/	//	%	**

print(5 // 2 , 6 // 2 , -5 // 2)

print(5 % 2 , 2 **3)

#赋值运算符

#	+=  -=  *=  /=  //=  %=

#比较运算符

#>  &lt;  >=  &lt;=  !=  ==

#	10<x15

#逻辑运算符号

#	and		or		not

## 10.对象实例测试运算符（重点）

#is 	is not

#判断在内存空间里面是否为同一个对象

#==和is的区别是？

#==是判断值是否相等

#is 判断是否为同一个对象，如果是同一个对象值决定相对，但值相等不一定是同一个对象

## 11.字符串的常用属性

#python	一切皆对象

```
str1 = "abcddefg"
print(dir(str1))

#判断类
print(f"判断是否全为字母: {str1.isalpha()}")
print(f"判断是否全是数字: {str1.isdigit()}")
print(f"判断是否全是数字字母: {str1.isalnum()}")
```

# 列表

a = 100

str1 = 'abcdef'

from sqlalchemy.sql.base import elements

## #容器类型：string、list、tuple、dict、set

#列表 list    --》底层存储 数组

#[1,2,3]

#1.存放任何数据类型#2.有序项目集合#3.可变数据类型

lst = []lst2 = ['abc']

print(lst,lst2)print(type(lst),type(lst2))print(isinstance(lst,list),isinstance(lst2,list))

lst3=[1,2.2,2+3j,"abc",None,False,print]print(lst3)

#有序项目集合print(lst3[3],lst3[-3])#字符串的截取print(lst3[2:])print(lst3[2:6])

## #可变数据类型 vs 不可变数据类型

#能不能再原地址空间修改值，如果可以在原地址空间修改值就为可变数据类型，否则为不可变数据类型

str1 = "abc"print(str1[1])

str1[1]="x"

print(str1)

lst = [1,4,5,6]lst[0]=100print(lst)

## #列表底层机制 扩容机制

#### #常用属性lst = [100,200,300,400,500]print(dir(lst))

#### #统计类print(lst.count(100))print(lst.index(100))print(len(lst))#查找 index#list.index("a")#查找列表中第一个匹配指定值的元素索引

#### #新增#末尾添加   -- appendlst.append(600)print(lst)

#指定位置添加 --insertlst.insert(2,"abc")print(lst)

#### #扩展 --extend

lst.extend("xyz")   #把另外一个可迭代对象的元素添加进来  可迭代对象--能被for循环挨个便利print(lst)

#修改lst[3]="ppp"print(lst)lst[3:6]="qwr"print(lst)

#### #删除

#根据元素的「值」删除removelst.remove("q")print(lst)

#根据元素的「索引」删除popresult = lst.pop(2)print(result)print(lst)

#有一条船 船上有30个人#给每一个人一个编号1，2，3...30#船超载    只能容纳20个人 有10个人要下船，数到8，就下船，最后打印输入哪些人下船

ship = list(range(1,31))out = []current = 0while len(out) &lt; 10:    current = (current+7)%len(ship)    man = ship.pop(current)    out.append(man)

print(out)

#### #计算

lst1 = [1,2,3]lst2 = [4,5,6]print(lst1*3)print(lst1+lst2)

#1.找出两个列表中的公共元素#2.找出两个列表中的最长公共前缀

lst1 = [1,2,3,6,9,11]lst2 = [1,2,3,4,5,6,7,8,9,11,12]elements = []common = list(set(lst1) & set(lst2))min_len = min(len(lst1),len(lst2))for i in range(min_len):    if lst1[i] == lst2[i]:        elements.append(lst1[i])print(f"公共元素:{common}")print(f"最长公共前缀:{elements}\n最长公共前缀长度{len(elements)}")

#for k,v in enumerate(lst)

print(k,v)

#3.lst = [1,5,6,4,8,3],从键盘接收一个整数的输入 10，6，4--》2，3lst = [1,5,6,4,8,3,2,9]result = []num = input("请输入一个数字：")for i in range(len(lst)):    #for j in range(i+1,len(lst)):    for j in range(len(lst) - 1, -1, -1):        # if lst[i]+lst[j]==int(num):        if i !=j and abs(lst[i]-lst[j]==int(num)) :            print(f"{lst[i]},{lst[j]}-->{i},{j}")

lst = [10,20,30,40,50]#print(id(lst))

lst.clear()

lst = []

print(lst)

### #复制 -- copy     地址赋值

lst2 = lstprint(lst2,lst)lst2.append(50)print(lst)print(id(lst),id(lst2))

str1 = "abc"

str2 = str1

print(id(str1),id(str2))

lst3 = lst.copy()lst3.append(100)print(lst,lst3,id(lst3))

### #排序

lst = [10,30,60,40,20]lst.sort()  #默认正序lst.sort(reverse=True) #倒序print(lst)

### #内键函数

print(sum(lst))print(max(lst))print(min(lst))

#作业#动态规划解决#1.n个台阶，每个人要走到这n阶台阶，每次可以选择走一步还是走两步，走上n阶台阶有多少种方式     n=10#2.有两个字符串找出最长公共子串#3.找零钱

## 元组

1.可以存放任何数据类型

2.有序项目集合

3.不可变数据类型

t1=()t2=(1,)     #元组中只有一个元素，后面大逗号t3=tuple()t4=(1,2.2,None,print,"abcdef")

print(type(t1))print(t4[2:4])

print(t4[2])print(t4[2:4])

t5=(1,2,["abc","def"])t5[2].append("123")

print(t5)

lst=[1,2,3]t6=('a','b','c')

print(tuple(lst))       #接收可迭代对象    --for循环挨个遍历print(list(t6))         #接收可迭代对象

## 字典

### 字典的特点

# k-v     key-values 键值存储的数据结构

# 可变数据类型

# 存储有序，但是无下标索引不能切片获取

# key   必须是可hash对象（不可变数据类型），天生去重

# value 可以是任何值

import hashlib

d1={"zhoujielun":"qilixiang","zhangshaohan":"yuyan"}

d2={"name":"wangzihan","age":18}

### 哈希算法的定义

# 哈希算法        将任意长度的输入转化为固定长度的输

#               是单向加密算法

# 任意长度的输入   明文--》密文     密文 -x》明文

# 经过哈希算法得到的值  --哈希值   散列值 密文

# 相同的明文，得到的密文也是一样的，密文相同，明文不一定一样，但几率很小很小

### # 哈希算法用在哪里？

# 1.密码加密

# 2.完整性加密		摘要值

# 3.哈希表存储

# md5 sha1 sha2 sha128 sha256 sha512

开放地址存储法

数据序列化

将数据进行转化，以便能在网络上进行传输，储存等

```
# 用户管理
# 欢迎进入用户管理系统
# 1.添加用户
    # 姓名，年龄，地址，班级
# 2.查询用户，查看所有用户信息
# 3.修改用户，输入用户名，修改指定用户信息
# 4.删除用户，输出用户名删除指定用户
# 5.退出
# 不限次数输入，选择5退出
# 初始化用户字典：key=姓名（唯一标识），value=字典（存储各字段信息）
```

```
users = {}

def main():
    while True:
        # 简洁菜单
        print("\n===== 用户管理系统 =====")
        print("1.添加用户  2.查询用户  3.修改用户  4.删除用户  5.退出")
        choice = input("请选择功能(1-5)：").strip()

        # 1. 添加用户
        if choice == "1":
            name = input("请输入用户名：").strip()
            if name in users:
                print("用户名已存在！")
                continue
            # 年龄数字校验
            while True:
                age = input("请输入年龄：").strip()
                if age.isdigit():
                    age = int(age)
                    break
                print("年龄需为数字，请重新输入！")
            # 存储为字典格式
            users[name] = {
                "年龄": age,
                "地址": input("请输入地址：").strip(),
                "班级": input("请输入班级：").strip()
            }
            print("添加成功！")

        # 2. 查询用户
        elif choice == "2":
            name = input("请输入用户名：").strip()
            if name in users:
                info = users[name]
                print(f"\n用户「{name}」信息：")
                print(f"年龄：{info['年龄']}，地址：{info['地址']}，班级：{info['班级']}")
            else:
                print("暂无用户信息！")


        # 3. 修改用户
        elif choice == "3":
            name = input("请输入要修改的用户名：").strip()
            if name not in users:
                print("用户不存在！")
                continue
            # 重新输入并更新字典
            while True:
                age = input("请输入新年龄：").strip()
                if age.isdigit():
                    age = int(age)
                    break
                print("年龄需为数字，请重新输入！")
            users[name] = {
                "年龄": age,
                "地址": input("请输入新地址：").strip(),
                "班级": input("请输入新班级：").strip()
            }
            print("修改成功！")

        # 4. 删除用户
        elif choice == "4":
            name = input("请输入要删除的用户名：").strip()
            if name in users:
                del users[name]
                print("删除成功！")
            else:
                print("用户不存在！")

        # 5. 退出系统
        elif choice == "5":
            print("退出")
            break

        # 无效选择
        else:
            print("输入错误，请选择1-5！")

if __name__ == "__main__":
    main()
```

### #json	--轻量化的数据交换格式	--字符串

如果要储存到文件中

json库

pickle库

![](https://cdn.nlark.com/yuque/0/2025/png/62301513/1766307181489-1331f82e-2f56-495e-a89a-53cfbd57ef74.png)

import json

d1 = {

"a":1,

"b":2,

"c":3,

}

#### # dict --> json

json_str = json.dumps(d1)

print(json_str, type(json_str))

#### # json --> dict

d2 = json.loads(json_str)

print(d2, type(d2))

## 文件操作

fp= open("a.txt","w")

# print(help(open))

# 第一个参数   表示文件路径

# 第二个参数   表示打开的方式

# r 只读                  t --普通文本(默认)        w --wt  r--rt   r+  --读写

# w 只写  --覆盖写         b --二进制文本             rb      wb      w+  --读写

# a 追加写

# x 新建

### # 写

fp.write("hello")

fp.close()

### # 读

fp = open("a.txt")

print(fp.read())

print("*"*20)

fp.seek(0)      #重置指针

print(fp.read())

fp.close()

### # with语句去管理，自动释放打开文件资源

with open("a.txt") as f:

print(f.read())