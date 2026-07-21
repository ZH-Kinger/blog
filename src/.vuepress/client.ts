import { defineClientConfig } from "vuepress/client";

/**
 * 全站右下角「AI 助手」悬浮球。
 *
 * 为什么写在 client.ts:VuePress 2 会自动把 .vuepress/client.ts 作为客户端增强入口
 * (无需在 config.ts 注册)。这里用 setup + onMounted 在浏览器端注入一个悬浮按钮,
 * 点击新标签打开部署在服务器上的 Agentic RAG 对话前端。
 *
 * 为什么不内嵌 iframe:agent 是 http 纯 IP 服务(115.191.2.86:7860),博客是 https,
 * 浏览器「混合内容」策略会拦截 https 页面里嵌 http 资源。故只能新开标签跳转;
 * 等域名 + HTTPS 备案下来后,可改成 iframe 内嵌对话框。
 *
 * SSR 安全:onMounted 只在客户端跑;且守卫 document 存在与防重复注入。
 */
const AGENT_URL = "http://115.191.2.86:7860";

export default defineClientConfig({
  setup() {
    // 动态 import 保证不在 SSR 阶段执行 DOM 操作
    if (typeof window === "undefined") return;

    // VuePress 客户端会在页面挂载后调用 setup;用微任务确保 body 就绪
    const inject = () => {
      if (typeof document === "undefined") return;
      if (document.getElementById("ai-fab")) return; // 防重复注入(路由切换时 setup 不重跑,但稳妥起见)

      const style = document.createElement("style");
      style.textContent = `
        #ai-fab{position:fixed;right:24px;bottom:24px;z-index:2147483000;
          display:flex;align-items:center;gap:8px;padding:12px 18px;
          background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;
          border-radius:999px;box-shadow:0 6px 20px rgba(99,102,241,.45);
          font-size:14px;font-weight:600;cursor:pointer;text-decoration:none;
          transition:transform .18s ease,box-shadow .18s ease;user-select:none}
        #ai-fab:hover{transform:translateY(-3px) scale(1.04);
          box-shadow:0 10px 28px rgba(99,102,241,.6)}
        #ai-fab .dot{width:8px;height:8px;border-radius:50%;background:#4ade80;
          box-shadow:0 0 0 0 rgba(74,222,128,.7);animation:aiPulse 1.8s infinite}
        @keyframes aiPulse{0%{box-shadow:0 0 0 0 rgba(74,222,128,.7)}
          70%{box-shadow:0 0 0 8px rgba(74,222,128,0)}
          100%{box-shadow:0 0 0 0 rgba(74,222,128,0)}}
        @media (max-width:480px){#ai-fab{right:16px;bottom:16px;padding:10px 14px;font-size:13px}}
      `;
      document.head.appendChild(style);

      const a = document.createElement("a");
      a.id = "ai-fab";
      a.href = AGENT_URL;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.title = "打开 AI 助手 · 基于本站内容的智能问答";
      a.innerHTML = `<span class="dot"></span><span>AI 助手</span>`;
      document.body.appendChild(a);
    };

    // setup 在客户端每次进入应用时执行一次;直接注入即可
    Promise.resolve().then(inject);
  },
});
