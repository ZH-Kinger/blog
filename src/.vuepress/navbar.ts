import { navbar } from "vuepress-theme-hope";

export default navbar([
  "/",
  {
    text: "博文",
    icon: "pen-to-square",
    prefix: "/posts/",
    children: [
      {
        text: "云原生",
        icon: "cloud",
        prefix: "Cloud_Native/",
        children: [
          { text: "Kubernetes", icon: "dharmachakra", link: "K8s" },
          { text: "Docker 部署", icon: "docker", link: "docker部署" },
          { text: "GitLab CI/CD", icon: "code-branch", link: "CI-CD" },
          { text: "K8s 架构", icon: "server", link: "k8s的架构" },
          { text: "监控 Prometheus", icon: "chart-line", link: "监控-prometheus" },
        ],
      },
      {
        text: "运维",
        icon: "server",
        prefix: "DevOps/",
        children: [
          { text: "服务器资源预警平台", icon: "bell", link: "服务器资源预警平台" },
          { text: "Web 集群项目", icon: "network-wired", link: "web集群项目" },
          { text: "Prometheus + Grafana", icon: "chart-bar", link: "六、Prometheus-+-Grafana-监控" },
          { text: "Ansible 自动化", icon: "robot", link: "五、Ansible-安装" },
          { text: "堡垒机 JumpServer", icon: "shield", link: "堡垒机配置（JumpServer）" },
          { text: "AIops 改造", icon: "brain", link: "九、AIops改造" },
        ],
      },
      {
        text: "AI 大模型",
        icon: "brain",
        prefix: "AI_LLM/",
        children: [
          { text: "Agent 应用开发", icon: "robot", link: "Agent应用开发" },
          { text: "飞书 Bot 智能运维助手", icon: "robot", link: "飞书Bot智能运维助手" },
          { text: "Function Calling", icon: "plug", link: "Function-Calling-(函数调用)" },
          { text: "LangChain", icon: "link", link: "LangChain" },
          { text: "Agentic RAG", icon: "search", link: "Agentic-RAG" },
          { text: "AI 基础设施", icon: "microchip", link: "AI-Infra（AI基础设施）" },
          { text: "多智能体协作", icon: "users", link: "多智能体协同" },
        ],
      },
      {
        text: "AI 基础设施",
        icon: "microchip",
        prefix: "AI_Infra/",
        children: [
          { text: "训练架构与故障排查", icon: "server", link: "训练架构/" },
          { text: "大模型技术", icon: "brain", link: "大模型技术/" },
          { text: "深度学习基础", icon: "network-wired", link: "深度学习基础/" },
          { text: "AI Infra 底层", icon: "microchip", link: "AI-infra/" },
          { text: "运动学与机械基础", icon: "robot", link: "运动学与机械基础/" },
        ],
      },
      {
        text: "开发",
        icon: "code",
        prefix: "Development/",
        children: [
          { text: "研发自动化协作平台", icon: "code-branch", link: "研发自动化协作平台" },
          { text: "Web 开发教程", icon: "globe", link: "web开发教程" },
          { text: "Python 基础", icon: "python", link: "python基础" },
          { text: "Kafka 项目", icon: "stream", link: "卡夫卡项目" },
          { text: "AIOps 平台", icon: "robot", link: "基于OpenClaw新一代AiOps平台" },
        ],
      },
      {
        text: "数据库",
        icon: "database",
        prefix: "Database/",
        children: [
          { text: "Redis", icon: "database", link: "Redis（非关系型数据库）" },
          { text: "MySQL", icon: "table", link: "MySQL（关系型数据库）" },
        ],
      },
      {
        text: "计算机网络",
        icon: "network-wired",
        prefix: "Networking/",
        children: [
          { text: "网络基础", icon: "globe", link: "网络的概念" },
          { text: "TCP 三次握手", icon: "exchange-alt", link: "TCP三次握手" },
          { text: "防火墙 iptables", icon: "shield", link: "iptables命令" },
          { text: "常见网络攻击", icon: "exclamation-triangle", link: "常见的网络攻击方式" },
          { text: "子网划分", icon: "project-diagram", link: "子网的划分" },
        ],
      },
    ],
  },
  {
    // AI 助手:跳转到部署在服务器上的 Agentic RAG 对话前端(新标签打开)。
    // 注:agent 是 http 纯 IP 服务,博客是 https;浏览器"混合内容"策略禁止 iframe 嵌入,
    // 故用外链新开标签(target=_blank 由 theme-hope 对外链自动处理),不能内嵌。
    text: "AI 助手",
    icon: "robot",
    link: "http://115.191.2.86:7860",
  },
  {
    text: "CSDN",
    icon: "book",
    link: "https://blog.csdn.net/2301_79801717?spm=1011.2415.3001.5343",
  },
]);
