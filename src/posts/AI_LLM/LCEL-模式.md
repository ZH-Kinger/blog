---
title: LCEL 模式
icon: robot
date: 2026-03-23
category:
  - AI大模型
---

太棒了，你能敏锐地察觉到这两者的区别，说明你已经开始触及 LangChain 的底层逻辑了。

简单来说：你之前用的是 **“黑盒模式” (Legacy Chains)**，而现在换成的是 **“乐高模式” (LCEL)**。
<hr id="c4zTh" class="ne-hr">
## 1. 你之前使用的是：Legacy Chains (传统链模式)

在 RetrievalQA 或 LLMChain 盛行的时代，LangChain 把所有的逻辑都封装在一个个巨大的 Python 类里。


- **特点**：像一个**成品玩具**。你只需要给它 llm 和 retriever，它内部帮你写好了 Prompt、帮你处理了文档拼接、帮你发送了请求。
- **为什么报错？**：因为这些“成品”内部依赖非常复杂，只要其中一个子包（比如 langchain.chains）安装不完整，整个玩具就散架了，报 ModuleNotFoundError。
- **缺点**：很难修改中间步骤。如果你想在 AI 回答前对文档做个特殊处理，就像要拆开一个焊接死的机器一样难。
<hr id="ryAbi" class="ne-hr">
## 2. 现在使用的是：LCEL (LangChain Expression Language)

这是 LangChain 官方在 0.2 版本后全面推行的 **“表达式语言”**。它通过 Python 的管道符 | 把各个组件串起来。


- **特点**：像**乐高积木**。
- **核心公式**：rag_chain = 检索组件 | 提示词组件 | 大模型组件 | 解析组件
- **为什么这次行了？**：


- **直接调用底层**：它直接调用 langchain_core 等基础零件，不依赖那个坏掉的 langchain.chains 大壳子。
- **透明可见**：你看代码就能发现，数据先经过 retriever 变成 context，然后喂给 prompt。
- **极致灵活**：如果你想在中间加一个“日志脱敏”步骤，直接在中间加一个 | my_filter_func 即可。

<hr id="rriW2" class="ne-hr">
## 3. 两种模式的对比
<table id="FI7Am" class="ne-table" style="width: 750px"><tbody><tr style="height: 33px"><td width="250">
**维度**
</td><td width="250">
**Legacy Chains (旧模式)**
</td><td width="250">
**LCEL (新模式/你现在用的)**
</td></tr><tr style="height: 33px"><td width="250">
**写法**
</td><td width="250">
RetrievalQA.from_chain_type(...)
</td><td width="250">
`(context
</td></tr><tr style="height: 33px"><td width="250">
**透明度**
</td><td width="250">
逻辑全在后台，像个黑盒
</td><td width="250">
逻辑写在代码里，一眼看清流向
</td></tr><tr style="height: 33px"><td width="250">
**稳定性**
</td><td width="250">
容易受包更新影响，报错难排查
</td><td width="250">
**极度稳健**，只要基础包在就能跑
</td></tr><tr style="height: 33px"><td width="250">
**性能**
</td><td width="250">
仅支持同步调用
</td><td width="250">
原生支持**并行执行**和**异步调用**
</td></tr></tbody></table><hr id="Kp8tQ" class="ne-hr">
## 4. 在你的 AIOps 项目中，LCEL 有什么奇效？

既然你在做**分布式日志分析**，LCEL 会让你非常爽：


- **多路并行**：你可以用 | 同时让 Agent 去查 K8s 日志和查数据库状态，它们会**同时出发**，而不是一个等一个。
- **中间调试**：你可以随时在管道中间插入一个 print，看看 AI 到底检索到了哪些日志，而不需要去翻源代码。
<hr id="FBcYa" class="ne-hr">
## 你的下一个进化

既然 LCEL 已经跑通了，我想带你体验一下它最迷人的地方：**流式输出 (Streaming)**。

在旧模式下，你要等 AI 憋 10 秒钟才出一大段话；在 LCEL 模式下，我们只需要改一个单词，AI 就能像真人打字一样，边想边说。

**你想在你的 ****app.py**** 里体验一下这种“丝滑”的打字机效果吗？只需要把 ****.invoke()**** 换成 ****.stream()****。**