---
title: Undistortion（去畸变）
icon: server
date: 2026-07-13
order: 64
category:
  - AI基础设施
tag:
  - AI Infra
---

**去畸变（Undistortion / 畸变矫正）** 是计算机视觉和图像处理中的一项经典前置技术。

它的核心目的，是**通过数学映射和像素重排，把物理镜头（尤其是广角、鱼眼镜头）拍出来的“弯曲、扭曲”的画面，还原成完全符合理想针孔相机模型（Pinhole Model）的、横平竖直、符合人类真实透视视觉的图像。**

下面为你拆解去畸变的物理本质、数学模型以及在工业界（如 OpenCV 或 GPU 算子中）的具体做法：

---

### 一、 为什么要去做畸变？

理想的相机模型（针孔模型）假设光线是沿直线传播并投影到传感器上的。但在现实中，为了获得更大的视野，镜头的镜片往往具有弧度。光线穿过镜头边缘时会发生偏折，导致成像出现几何扭曲：

1. **桶形畸变（Barrel Distortion）**：画面中心向外凸起，边缘线条向内弯曲（常见于广角镜头或全景相机）。
2. **枕形畸变（Pincushion Distortion）**：画面向内塌陷，边缘线条向外弯曲（常见于长焦镜头）。

如果不做去畸变，图像中的像素点位置就是“歪”的。这会导致后续的 AI 目标检测、车道线识别、SLAM 空间建图、或者多模态雷达点云融合等算法出现极其严重的物理位置偏差。

---

### 二、 去畸变的数学模型

工业界最通用的是 **Brown-Conrady 模型**。它把镜头畸变拆解为两大物理分量：

#### 1. 径向畸变（Radial Distortion）

由镜头的物理形状导致，越靠近图像边缘，扭曲越严重。数学上用围绕图像中心的泰勒级数来逼近，畸变系数通常记为 ![](https://cdn.nlark.com/yuque/__latex/c2b0ebbe2d4d913a22e7bfb4a9bf06ca.svg)：

![](https://cdn.nlark.com/yuque/__latex/e6e53ff1ebe6c9fe783f176e64e1e22a.svg)

![](https://cdn.nlark.com/yuque/__latex/3b5321926b0eb690bcc8c9523a3187b1.svg)

*(其中* ![](https://cdn.nlark.com/yuque/__latex/783af003417bd05ec9863e64b4c21738.svg)*，代表像素点到图像中心的物理距离)*

#### 2. 切向畸变（Tangential Distortion）

由于镜头组在装配、制造时，镜片与图像传感器（CMOS）表面没有做到**绝对平行**而导致的透视偏折。畸变系数记为 ![](https://cdn.nlark.com/yuque/__latex/62aea4958469096c35663cf67be12cc0.svg)：

![](https://cdn.nlark.com/yuque/__latex/a079a17f159d3b15d51ffa73d522258b.svg)

![](https://cdn.nlark.com/yuque/__latex/cece02311f14807942980a2684ea52ec.svg)

通过这组公式，只要知道了相机的畸变系数（![](https://cdn.nlark.com/yuque/__latex/5e9fd329bbb136c53b4e882619ae8b26.svg)），就能精准算出一个平直空间里的坐标在扭曲图像上的具体落点。

---

### 三、 工业界具体怎么做？（标准工程管线）

在实际工程中（例如使用 OpenCV 库或在 GPU 上手写高性能推理算子），去畸变通常遵循以下闭环流水线：

#### 第一步：相机标定（Calibration）—— 测出数学参数

去畸变的前提是必须知道相机的“基因密码”（参数）。

- **做法**：使用打印好的黑白棋盘格或圆点标定板（张正友标定法），让相机从不同角度拍几十张照片。
- **输出**：算法通过识别棋盘格的角点，计算出相机的**内参矩阵** ![](https://cdn.nlark.com/yuque/__latex/38a3f4d664b7a723d138f9d57be0c783.svg)（包含焦距 ![](https://cdn.nlark.com/yuque/__latex/565379109b5890d2908921f4fd27d18d.svg) 和光心位置 ![](https://cdn.nlark.com/yuque/__latex/ce929b33b2591d70f71c04a947a57b5c.svg)）以及上述的**畸变系数（**![](https://cdn.nlark.com/yuque/__latex/95e2469ff18568a62f9f2a1a33ffe3d8.svg)**）**。

#### 第二步：坐标重映射（Remap）—— 核心算子逻辑

得到了参数后，开始处理图像。去畸变的算法执行逻辑在物理上是“反向推导”的：

1. **建格子**：算法首先创建一幅空的、目标“去畸变后”的理想长方形新图。
2. **反向投射**：遍历新图中的每一个像素坐标 ![](https://cdn.nlark.com/yuque/__latex/bf3cd45768ddce4adfce85d78b6d8614.svg)。利用相机内参和上面的畸变公式，反向计算出这个点在**原始畸变老图**上的物理真实坐标 ![](https://cdn.nlark.com/yuque/__latex/72ce558f8345b5837555d1045c14f7c7.svg)。
3. **注意**：算出来的老图坐标通常是带小数点的浮点数。

#### 第三步：像素插值（Interpolation）—— 染色填空

- 因为老图上的坐标是浮点数（比如 ![](https://cdn.nlark.com/yuque/__latex/00875cd4464c74dba2b1b86dc252d06c.svg)），无法直接对应物理像素点。
- 算法会使用**双线性插值（Bilinear Interpolation）**，抓取该浮点数四周最近的 4 个真实像素颜色，加权计算出最终颜色，精准地赋给新图对应的位置。

---

### 四、 去畸变带来的物理代价：FOV 损失

把一个碗状弯曲的画面强行扯平，图像的四个角会被极度拉伸。此时会出现一个两难的抉择：

- **保留完整视野（最大 FOV）**：画面拉直后，四周会留下大面积没有像素的**黑色盲区**（图像变成风筝状或漏斗状）。
- **裁剪黑边（标准长方形）**：为了让图像好看，强行切掉黑边，只保留中间完好的长方形矩形。这会导致图像边缘有一部分视野被白白裁剪掉，使得相机的 **FOV（视场角）变小**。

在工业应用（如自动驾驶感知的多相机拼接）中，通常会使用诸如 OpenCV 的 `cv2.getOptimalNewCameraMatrix` 函数，通过调整缩放参数（`alpha`）来定量调节去畸变后的裁剪比例，从而在“画面完整度”与“FOV 视场角大小”之间取得最佳的平衡。
