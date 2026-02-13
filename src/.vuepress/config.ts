import { defineUserConfig } from "vuepress";

import theme from "./theme.js";

export default defineUserConfig({
  base: "/blog/",

  lang: "zh-CN",
  title: "博客blog",
  description: "vuepress-theme-hope 的博客blog",

  theme,

  // 和 PWA 一起启用
  // shouldPrefetch: false,
});
