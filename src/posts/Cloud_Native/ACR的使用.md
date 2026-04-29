---
title: ACR的使用
icon: docker
date: 2026-02-01
category:
  - 云原生
---

## 1.进入阿里云官方网站https://www.aliyun.com搜索ARC

## 2.进入ARC的控制台，创建一个命名空间

![](https://cdn.nlark.com/yuque/0/2026/png/62301513/1769934254538-3dae3f60-892a-4ac9-a1a1-1355f8e41da7.png)

## 3.在创建一个仓库

![](https://cdn.nlark.com/yuque/0/2026/png/62301513/1769934300857-3783be3e-7317-474e-a737-58d8289a2cdc.png)

## 4.ACR的一些操作

### 1. 登录阿里云 Container Registry

```
$ docker login --username=nick7850248006 crpi-k88kd21bi3j8jnx4.cn-hangzhou.personal.cr.aliyuncs.com
```

用于登录的用户名为阿里云账号全名，密码为开通服务时设置的密码。

您可以在访问凭证页面修改凭证密码。

注意：使用 RAM 用户（子账号）登录镜像仓库时，不支持企业别名带有英文半角句号（.）。

### 2. 从Registry中拉取镜像

```
$ docker pull crpi-k88kd21bi3j8jnx4.cn-hangzhou.personal.cr.aliyuncs.com/wang888/king:[镜像版本号]
```

### 3. 将镜像推送到Registry

$ docker login --username=nick7850248006 crpi-k88kd21bi3j8jnx4.cn-hangzhou.personal.cr.aliyuncs.com$ docker tag [ImageId] crpi-k88kd21bi3j8jnx4.cn-hangzhou.personal.cr.aliyuncs.com/wang888/king:[镜像版本号]$ docker push crpi-k88kd21bi3j8jnx4.cn-hangzhou.personal.cr.aliyuncs.com/wang888/king:[镜像版本号]

请根据实际镜像信息替换示例中的[ImageId]和[镜像版本号]参数。

### 4. 选择合适的镜像仓库地址

从ECS推送镜像时，可以选择使用镜像仓库内网地址。推送速度将得到提升并且将不会损耗您的公网流量。

如果您使用的机器位于VPC网络，请使用 crpi-k88kd21bi3j8jnx4-vpc.cn-hangzhou.personal.cr.aliyuncs.com 作为Registry的域名登录。

### 5. 示例

使用"docker tag"命令重命名镜像，并将它通过专有网络地址推送至Registry。

$ docker imagesREPOSITORY                                                         TAG                 IMAGE ID            CREATED             VIRTUAL SIZEregistry.aliyuncs.com/acs/agent                                    0.7-dfb6816         37bb9c63c8b2        7 days ago          37.89 MB$ docker tag 37bb9c63c8b2 crpi-k88kd21bi3j8jnx4-vpc.cn-hangzhou.personal.cr.aliyuncs.com/acs/agent:0.7-dfb6816

使用 "docker push" 命令将该镜像推送至远程。

```
$ docker push crpi-k88kd21bi3j8jnx4-vpc.cn-hangzhou.personal.cr.aliyuncs.com/acs/agent:0.7-dfb6816
```