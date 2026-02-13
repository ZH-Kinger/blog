import { defineUserConfig } from "vuepress";
import theme from "./theme.js";

export default defineUserConfig({
  base: "/blog/",

  lang: "zh-CN",
  title: "博客blog",
  description: "vuepress-theme-hope 的博客blog",

  theme,

  // 添加以下 head 配置来解决语雀图片不显示的问题
  head: [
    [
      "meta",
      { name: "referrer", content: "no-referrer" }
    ]
  ],

  // 和 PWA 一起启用
  // shouldPrefetch: false,
});