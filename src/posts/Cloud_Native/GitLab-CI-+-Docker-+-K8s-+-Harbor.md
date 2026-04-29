---
title: GitLab CI + Docker + K8s + Harbor
icon: docker
date: 2026-04-15
category:
  - 云原生
---

梓涵，你之前接触的这一套是目前企业里最标准、最工业化的 **“云原生全家桶”**。它比单纯的 Jenkins + Ansible 更强调 **“不可变基础设施”** 的概念。

为了让你写进 **OpenClaw AIOps** 的项目笔记，我把这套流程的“齿轮啮合”逻辑拆解给你：
<hr id="NhUJc" class="ne-hr">
## 🏗️ 企业级云原生 CI/CD 流程图 (The Golden Path)

### 1. 核心链路分解


- **GitLab (源码与触发器)**: 开发者提交代码，触发 .gitlab-ci.yml。
- **Docker (构建引擎)**: GitLab Runner 启动，根据 Dockerfile 打包成镜像。
- **Harbor (私有镜像仓库)**: 镜像被推送到 Harbor，进行安全扫描和版本管理。
- **Kubernetes (运行环境)**: GitLab Runner 调用 K8s API，执行 kubectl set image 或 helm upgrade。
- **Harbor -> K8s (拉取与启动)**: K8s 节点从 Harbor 拉取新镜像，完成滚动更新。
<hr id="OLNh2" class="ne-hr">
## 🛠️ 具体怎么用？（四步配置法）

### 第一步：在 Harbor 里准备仓库


- **操作**: 登录 Harbor 界面，创建一个项目（Project），比如 openclaw。
- **权限**: 在 K8s 的 devops 命名空间里创建一个 docker-registry 类型的 Secret，这样 K8s 才有权从私有 Harbor 拿镜像。

### 第二步：编写 Dockerfile

这是把你的 Python 代码变成“集装箱”的关键：

Dockerfile

```
FROM python:3.9-slim
WORKDIR /app
COPY . .
RUN pip install -r requirements.txt
CMD ["python", "main.py"]
```

### 第三步：编写 .gitlab-ci.yml (核心灵魂)

这是告诉 GitLab Runner 该干什么。通常分为三个阶段：

YAML

```
stages:
  - build
  - push
  - deploy

build_job:
  stage: build
  script:
    - docker build -t harbor.zh-kinger.com/openclaw/api:${CI_COMMIT_SHORT_SHA} .

push_job:
  stage: push
  script:
    - docker login harbor.zh-kinger.com -u ${HARBOR_USER} -p ${HARBOR_PWD}
    - docker push harbor.zh-kinger.com/openclaw/api:${CI_COMMIT_SHORT_SHA}

deploy_job:
  stage: deploy
  script:
    - kubectl set image deployment/openclaw-api api=harbor.zh-kinger.com/openclaw/api:${CI_COMMIT_SHORT_SHA} -n devops
```

### 第四步：K8s 声明式部署

你通常会预先有一个 deployment.yaml，GitLab CI 只是去触发它更新镜像版本。
<hr id="V1wJh" class="ne-hr">
## 💡 梓涵的“避坑”笔记与进阶思考

你在总结这一套流程时，可以从 **AIOps 的视角** 增加这三个深度点：


- **镜像版本回溯 (Traceability)**:


- **技巧**: 永远不要用 latest 标签。使用 ${CI_COMMIT_SHORT_SHA}。
- **AIOps 价值**: 当 AI 发现新版本上线后 CPU 飙升，它可以根据 Commit ID 自动定位是哪行代码改动导致的。


- **Harbor 的清理策略**:


- **痛点**: 频繁构建会把 Harbor 撑爆（就像你之前 GitLab 磁盘满了一样）。
- **解决**: 配置 Harbor 的 **Tag Retention Policy**，只保留最近 10 个版本的镜像。


- **内网提速**:


- **优化**: 在 K8s 节点上配置 **ImagePullPolicy: IfNotPresent**，并确保 Harbor 与 K8s 在同一个子网内，提升冷启动速度。

<hr id="yBRHu" class="ne-hr">
## 🚀 梓涵，你想怎么实践？

你现在已经有了 K8s 和 Jenkins，其实 **Jenkins 完全可以平替 GitLab CI**。如果你想复刻这套流程：


- **方案 A**: 继续折腾 GitLab CI（需要安装 GitLab Runner 到 K8s 里）。
- **方案 B**: 用 Jenkins 模拟这个过程（Jenkins + Docker + Harbor + K8s）。

**你手头有现成的 Harbor 仓库吗？如果没有，我可以教你用 K8s 快速拉起一个轻量级的 Registry 镜像站来做实验。**