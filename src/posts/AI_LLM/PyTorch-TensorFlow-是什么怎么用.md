---
title: PyTorch/TensorFlow 是什么怎么用
icon: robot
date: 2026-03-17
category:
  - AI大模型
---

梓涵，既然你已经准备好从“使用者”转变为“开发者”，那么 **PyTorch** 和 **TensorFlow** 就是你必须掌握的两把“重剑”。

简单来说，它们是**深度学习框架**。如果把训练 AI 比作盖大楼，那么深度学习就是建筑理论，而 PyTorch 和 TensorFlow 就是**塔吊、搅拌机和预制件模板**。没有它们，你得从每一颗螺丝钉（底层数学公式）开始拧起。
<hr id="PJL12" class="ne-hr">
## 它们到底是什么？

在没有这些框架之前，写神经网络需要手动推导复杂的导数公式（反向传播）。有了它们，你只需要定义好“神经网络的层数”，剩下的数学计算全部由框架自动完成。


- **PyTorch (Meta/Facebook 出品)**：


- **特点**：极其灵活，代码写起来就像普通的 Python。它采用“动态图”机制，你可以像调试普通程序一样单步调试你的 AI 模型。
- **地位**：目前**学术界和 2026 年大模型（LLM）开发**的绝对主流。绝大多数你看到的开源 AI 项目（如 Llama 3、Stable Diffusion）都是用 PyTorch 写的。


- **TensorFlow (Google 出品)**：


- **特点**：工业化底蕴深厚，擅长大规模部署和移动端运行。虽然它的学习曲线曾因“静态图”比较陡峭，但现在的 Keras 接口已经好用很多。
- **地位**：在很多老牌互联网大厂的生产流水线上依然非常稳固。

<hr id="ht6Tm" class="ne-hr">
## 它们是怎么“工作”的？

这两个框架的核心都在处理一个东西：**Tensor（张量）**。

你可以把 Tensor 理解为**“可以在 GPU 上加速运行的多维数组”**。


- **计算图**：当你定义 a + b 时，框架不只是算出结果，还记录了“结果是由 a 和 b 相加得到的”这个逻辑。
- **自动求导 (Autograd)**：当你告诉框架“结果错了”时，它能根据记录好的逻辑，自动计算出 $a$ 和 $b$ 应该调整多少。这就是模型“学习”的过程。
<hr id="mF8ql" class="ne-hr">
## 怎么用？（以训练一个简单的“数字识别”模型为例）

无论用哪个框架，流程通常分为四步：

#### 第一步：准备数据 (Data)

把图片或文字转换成 Tensor。

```
# PyTorch 示例
import torch
from torchvision import datasets, transforms

transform = transforms.Compose([transforms.ToTensor()])
train_set = datasets.MNIST(root='./data', train=True, download=True, transform=transform)
```

#### 第二步：定义架构 (Model)

像搭乐高一样组合神经元。

```
import torch.nn as nn

class MyNet(nn.Module):
    def __init__(self):
        super().__init__()
        self.layer1 = nn.Linear(784, 128) # 输入层
        self.layer2 = nn.Linear(128, 10)  # 输出层 (0-9个数字)

    def forward(self, x):
        x = torch.relu(self.layer1(x))
        return self.layer2(x)
```

#### 第三步：选择优化器 (Optimizer)

决定用什么算法去更新参数（比如最常用的 Adam）。

#### 第四步：循环训练 (Training Loop)

把数据喂给模型，算误差，更新参数，循环往复。
<hr id="skn3F" class="ne-hr">
## AI Infra 视角：框架与硬件的纽带

作为运维和 Infra 背景的你，关注点应该在这里：


- **GPU 加速**：在 PyTorch 里，你只需要一行 .to('cuda')，模型就会从 CPU 飞跃到 GPU。
- **分布式扩展**：这就是你之前问的 **DeepSpeed** 派上用场的地方。DeepSpeed 本质上是 PyTorch 的一个“增强插件”，它接管了 PyTorch 的参数分配逻辑，实现了多机多卡的并行计算。
- **模型导出**：训练完后，你会把模型导出为 **ONNX** 或 **TensorRT** 格式，以便在生产环境（比如你的 Rocky Linux 虚拟机）中实现高吞吐推理。
<hr id="G9u4N" class="ne-hr">
## 我的建议：

如果你是初学者，**无脑选 PyTorch**。它的报错信息更友好，社区资源更丰富，最重要的是，目前几乎所有的 **AI Agent** 和 **LLM** 研究都是基于 PyTorch 的。

**你想不想在你的电脑上跑一个最简单的 PyTorch“Hello World”？** 我们可以写一个只有 10 行代码的脚本，让模型学习如何做加法。我可以把代码发给你，你直接在 Python 环境里运行就能看到“模型变聪明”的过程！

**要我为你准备这个入门 Demo 吗？**