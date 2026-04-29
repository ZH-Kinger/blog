---
title: CI/CD常规方案
icon: docker
date: 2026-03-18
category:
  - 云原生
---

梓涵，在企业级工程中，CI/CD 从来不是指某一个具体的工具，而是一套**“把代码安全、快速地搬运到服务器上”的流水线架构**。

根据公司业务的体量和底层基础设施（比如是物理机还是容器化），目前业界有三套最主流的常规 CI/CD 方案。我为你梳理了这三种架构的流转逻辑，你可以直接对照着你的项目场景来看：
<hr id="SrLyi" class="ne-hr">
## 方案一：云原生标准方案（GitLab CI + Docker + K8s + Harbor）

这是目前绝大多数互联网公司和现代化项目的**绝对主流**。整个过程高度容器化，非常适合微服务架构。


- **适用场景：** 底层基础设施已经是 Kubernetes，且项目微服务较多。
- **流水线流程：**


- **提交触发 (CI)：** 开发者把 Python 后端或 Vue 前端代码 Push 到 GitLab。
- **编译打包 (CI)：** GitLab Runner 被自动唤醒，拉取代码，进行单元测试，并编译成可执行文件。
- **构建镜像 (CI)：** 自动执行 docker build，将代码和运行环境打包成不可变的 Docker 镜像。
- **推送仓库 (CI)：** 将镜像 Push 到企业私有镜像仓库（如 **Harbor** 或阿里云 ACR）。
- **部署上线 (CD)：** 流水线自动修改 K8s 的 YAML 配置文件（比如更新 Image Tag），调用 K8s API 执行滚动更新（Rolling Update）。


## 方案二：经典企业级方案（Jenkins + Ansible + ECS/物理机）

老牌、稳健，插件生态天下无敌。很多传统企业或者还没完全容器化的团队都在用这套方案。


- **适用场景：** 系统部署在传统的云服务器（ECS）或物理机上，强依赖配置管理工具。
- **流水线流程：**


- **获取代码 (CI)：** Jenkins 监听到 Git 仓库的代码合并事件，拉取最新代码。
- **构建测试 (CI)：** Jenkins 调用本地的 Maven/Node.js/Python 环境进行打包和测试。
- **制品归档 (CI)：** 将打好的包（如 .jar、.tar.gz）推送到制品库（如 Nexus 或 OSS）。
- **自动化部署 (CD)：** Jenkins 触发 **Ansible** 剧本。Ansible 通过 SSH 批量登录到目标服务器集群，执行下载包、替换文件、重启服务（如重启 Nginx 或 Systemd 服务）的动作。


## 方案三：前沿的 GitOps 方案（GitLab CI + ArgoCD + K8s）

这是在 K8s 时代衍生出的**持续部署最高境界**。它把“配置”也当成了代码来管理，实现了真正的“所见即所得”。


- **适用场景：** 深度依赖 K8s，追求极高的部署安全性和快速回滚能力。
- **流水线流程：**


- **CI 阶段（同方案一）：** 依旧是代码 Push --》 跑测试 --》 构建 Docker 镜像 --》 推送到 Harbor。
- **配置更新：** CI 的最后一步，不是直接去连 K8s，而是去修改一个专门存放 K8s YAML 配置的 Git 仓库（把里面的镜像版本号改掉）。
- **自动同步 (CD)：****ArgoCD** 这个组件会一直盯着那个 Git 仓库。一旦发现 YAML 文件有更新，它会自动把 K8s 集群的实际状态“拉”平到与 Git 仓库一致（拉取新镜像并重启 Pod）。
- **优势：** 如果新版本挂了，只需要在 Git 上执行一次 git revert 撤销提交，K8s 就会瞬间自动回滚，极其安全。

<hr id="zdncr" class="ne-hr">
## 方案对比速查表
<table id="rQKzV" class="ne-table" style="width: 748px"><tbody><tr style="height: 33px"><td width="187">
**特性**
</td><td width="187">
**方案一 (GitLab CI + K8s)**
</td><td width="187">
**方案二 (Jenkins + Ansible)**
</td><td width="187">
**方案三 (GitOps / ArgoCD)**
</td></tr><tr style="height: 33px"><td width="187">
**核心特点**
</td><td width="187">
容器化原生，全自动化
</td><td width="187">
万物皆可集成，适合非容器环境
</td><td width="187">
声明式发布，极致的安全回滚
</td></tr><tr style="height: 33px"><td width="187">
**架构重心**
</td><td width="187">
镜像构建与 K8s 调度
</td><td width="187">
任务编排与脚本分发
</td><td width="187">
配置即代码 (IaC)
</td></tr><tr style="height: 33px"><td width="187">
**部署模式**
</td><td width="187">
Push (流水线把代码推过去)
</td><td width="187">
Push (Ansible 登录机器操作)
</td><td width="187">
**Pull** (ArgoCD 主动把配置拉过去)
</td></tr></tbody></table><hr id="abdg7" class="ne-hr">
这三种方案其实没有绝对的好坏，只有适不适合当前的业务底座。

**你想让我以“方案一（GitLab CI + K8s）”为例，为你写一份极其标准的 ****.gitlab-ci.yml**** 配置文件模板吗？我们可以设定一个场景：自动将一个 Vue 3 的前端项目打包成 Docker 镜像并推送到 Harbor。**