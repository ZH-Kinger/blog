import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  "/": [
    "",
    {
      text: "云原生",
      icon: "cloud",
      prefix: "posts/Cloud_Native/",
      collapsible: true,
      children: "structure",
    },
    {
      text: "运维",
      icon: "server",
      prefix: "posts/DevOps/",
      collapsible: true,
      children: "structure",
    },
    {
      text: "AI 大模型",
      icon: "brain",
      prefix: "posts/AI_LLM/",
      collapsible: true,
      children: "structure",
    },
    {
      text: "AI 基础设施",
      icon: "microchip",
      prefix: "posts/AI_Infra/",
      collapsible: true,
      children: "structure",
    },
    {
      text: "开发",
      icon: "code",
      prefix: "posts/Development/",
      collapsible: true,
      children: "structure",
    },
    {
      text: "数据库",
      icon: "database",
      prefix: "posts/Database/",
      collapsible: true,
      children: "structure",
    },
    {
      text: "计算机网络",
      icon: "network-wired",
      prefix: "posts/Networking/",
      collapsible: true,
      children: "structure",
    },
    "intro",
  ],
});
