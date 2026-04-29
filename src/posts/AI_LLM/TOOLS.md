---
title: TOOLS
icon: robot
date: 2026-03-23
category:
  - AI大模型
---

**在代码里定义的那个 ****tools**** 列表，确实不是真正的工具，它只是一份“菜单”或“协议”。**

为了让你彻底转过这个弯来，我们可以把 Agent 的工作流程拆解为 **“大脑决策”** 和 **“身体执行”** 两个阶段。
<hr id="wP2li" class="ne-hr">
## 1. tools 参数：大脑的“虚构记忆”

当你把 tools 传给大模型（LLM）时，你只是在告诉它：

“嘿，如果你发现你需要查 CPU 占用率，你可以假装写下一行指令，名字叫 get_cpu_usage。我会看着办的。”

这时候，**大模型并没有真的去碰你的电脑**。它只是在它的回复里，按照你给的 **JSON Schema** 格式，写下了一串文本。
<hr id="gtdZP" class="ne-hr">
## 2. 真正的工具：你本地的 Python 函数

真正的“工具”是你自己在本地写的那个 def get_cpu_usage(): ... 函数。


- **模型的作用**：决定“要不要用”以及“怎么填参数”。
- **你的代码的作用**：看到模型想用工具，就**拦截**这个请求，手动运行本地函数，再把结果塞回给模型。
<hr id="dcxP6" class="ne-hr">
## 3. 为什么不直接让 LLM 运行代码？

这是一个非常关键的安全和架构设计：


- **安全隔离**：如果模型能直接运行代码，它可能会不小心执行 rm -rf /。通过这种“协议”方式，**执行权永远在你手里**。
- **跨平台**：模型在云端（阿里云服务器），你的工具在本地（你的电脑）。云端的大脑无法直接伸出手来摸你的硬盘，只能通过 JSON 这种“电报”来指挥你。
<hr id="lMTod" class="ne-hr">
## 4. 完整的“闭环”逻辑图

这就是你之前觉得“流程不一样”的根本原因。现在你需要处理的是一个 **“请求 - 拦截 - 执行 - 再请求”** 的循环：
<table id="Ge0mP" class="ne-table" style="width: 748px"><tbody><tr style="height: 33px"><td width="187">
**步骤**
</td><td width="187">
**角色**
</td><td width="187">
**动作**
</td><td width="187">
**本质**
</td></tr><tr style="height: 33px"><td width="187">
**1**
</td><td width="187">
**用户**
</td><td width="187">
问：“现在 CPU 高吗？”
</td><td width="187">
触发意图
</td></tr><tr style="height: 33px"><td width="187">
**2**
</td><td width="187">
**LLM**
</td><td width="187">
返回 tool_calls

（JSON 字符串）
</td><td width="187">
**大脑决策**（虚构调用）
</td></tr><tr style="height: 33px"><td width="187">
**3**
</td><td width="187">
**你的代码**
</td><td width="187">
**解析 JSON**，运行 psutil.cpu_percent()
</td><td width="187">
**身体执行**（真实动作）
</td></tr><tr style="height: 33px"><td width="187">
**4**
</td><td width="187">
**你的代码**
</td><td width="187">
把结果（如 95%

）发给 LLM
</td><td width="187">
反馈观察结果
</td></tr><tr style="height: 33px"><td width="187">
**5**
</td><td width="187">
**LLM**
</td><td width="187">
返回“是的，负载很高，建议检查进程。”
</td><td width="187">
总结陈述
</td></tr></tbody></table><hr id="gTcq5" class="ne-hr">
## 5. 总结：tool 到底是什么？


- **在 ****client.create**** 里**：它是一个 **协议 (Protocol)**。
- **在你的本地代码里**：它是一个 **功能 (Function)**。
- **两者结合起来**：才叫 **智能体 (Agent)**。
<hr id="UbXF6" class="ne-hr">
## 你的下一步：亲自拦截一次“虚假调用”

我们要不要做一个实验？


- 你定义一个 get_cpu_usage 的 tool 参数发给百炼。
- **先不要写任何本地函数。**
- 你问它：“帮我查下 CPU。”
- 然后你 print(response.choices[0].message)。

你会亲眼看到，AI 并没有报错，而是乖乖地返回了一串 **JSON**。看到那串 JSON 的那一刻，你就会瞬间明白：**原来 AI 只是在给我下达“工单”！**

**你想看一眼如何捕捉并打印这个“工单”的代码吗？**