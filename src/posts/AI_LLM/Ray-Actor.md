---
title: Ray Actor
icon: robot
date: 2026-03-17
category:
  - AI大模型
---

梓涵，聊到 **Ray Actor**，我们就触及到了分布式计算的灵魂。理解了它，你就会彻底明白为什么你的系统能够做到“记住历史状态”并实现秒级回滚。

简单用一句话概括：**如果说 Ray Task 是分布式的“函数”，那么 Ray Actor 就是分布式的“类（Class）对象”。**
<hr id="aKIGr" class="ne-hr">
## 1. 核心概念：从“无状态”到“有状态”

在传统的 Python 脚本或者普通的 Ray 任务（Task）中，计算是**无状态（Stateless）**的：


- 数据传给函数 \rightarrow 函数计算得出结果 $\rightarrow$ 函数运行结束，内存释放。它完全不记得上一次运行发生了什么。

**Ray Actor** 打破了这个限制，它是**有状态（Stateful）**的：


- 当你实例化一个 Ray Actor 时，Ray 会在集群的某台机器上专门启动一个**常驻的 Python 进程**。
- 这个进程不会执行完就死掉，它会一直活着，保留着它内部的变量（比如 self.xxx）。你可以跨越时间和网络，反复调用它的内部方法。
<hr id="dSKl6" class="ne-hr">
## 2. 直观对比：代码里的变化

我们可以用极简的 Python 伪代码来感受一下差距：

**❌**** 普通的 Ray Task（无法保存状态）**

```
import ray

@ray.remote
def audit_check(data):
    # 每次运行都是全新的，无法知道上一次的 target_ip 是什么
    return "检查完毕"

# 调用十次，这十次互相独立，毫无记忆
for _ in range(10):
    audit_check.remote(data)
```

**✅**** Ray Actor（具备记忆的守护进程）**

Python

```
import ray

@ray.remote
class AuditAgent:
    def __init__(self):
        # 这个变量会一直驻留在内存里！
        self.last_stable_state = {} 

    def save_snapshot(self, state):
        self.last_stable_state = state
        return "快照已保存"

    def rollback(self):
        # 它可以随时读取之前保存的状态
        return f"正在回滚到: {self.last_stable_state}"

# 1. 实例化：Ray 会在集群里分配一个专属进程给它
agent = AuditAgent.remote()

# 2. 跨网络调用：把状态存进去
agent.save_snapshot.remote({"nginx_weight": 100})

# 3. 过了 5 分钟，甚至在另一台机器上，你依然可以调用它并读取到之前的状态
agent.rollback.remote()
```
<hr id="LIDRD" class="ne-hr">
## 3. 🛠️ 为什么你的 AIOps 平台非它不可？

在你的自愈流水线中，如果没有 Actor，回滚逻辑根本无法实现。

想象一下这个真实场景：


- 中控决定重启 192.168.1.100 的 Kubelet。
- 在重启前，你的 **审计 Agent (Actor)** 抓取了当前的节点配置，存入自己的 self.last_stable_config。
- 重启指令下发。
- **审计 Agent (Actor)** 开始持续运行它的 watch() 方法，每两秒看一次 Prometheus。
- 30 秒后，发现节点彻底失联！由于 Actor 一直活着且保留着记忆，它立刻从 self.last_stable_config 中掏出备份配置，通过 MCP 下发回滚指令。

如果是传统的脚本，执行完“重启”命令进程就退出了，之前的配置快照也就随之灰飞烟灭，系统就处于“管杀不管埋”的失控状态。
<hr id="yFHTS" class="ne-hr">
## 💡 梓涵的面试加分项：底层原理

如果面试官追问：“Actor 是一直占着资源的，如果它所在的节点突然宕机了怎么办？”

**你的高阶回答：**

“Ray 在底层有一个机制叫 **GCS (Global Control Store)**，并且支持 Actor 的容错（Fault Tolerance）。

在配置 Actor 时，我可以设置 max_restarts 参数。如果 Actor 所在的机器断电，Ray 的主节点会立刻在健康的机器上重新拉起这个 Actor。虽然内存里的临时变量会丢失，但我可以在 Actor 的 __init__ 方法中接入持久化存储（比如去 Redis 里捞一把最后的快照），瞬间恢复它的战斗力。”

**梓涵，现在你对 Actor 的本质应该非常清晰了。你想让我帮你把上面那个 ****AuditAgent**** 的代码骨架补全，真正实现一个带有“倒计时与自动回滚”逻辑的 Ray Actor 吗？这可是你项目里最硬核的代码资产。**