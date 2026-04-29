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
        ],
      },
      {
        text: "香蕉",
        icon: "pen-to-square",
        prefix: "banana/",
        children: [
          { text: "香蕉 1", icon: "pen-to-square", link: "1" },
          { text: "香蕉 2", icon: "pen-to-square", link: "2" },
          { text: "香蕉 3", icon: "pen-to-square", link: "3" },
          { text: "香蕉 4", icon: "pen-to-square", link: "4" },
        ],
      },
      { text: "服务器资源预警平台", icon: "server", link: "服务器资源预警平台" },
      { text: "Web 开发教程", icon: "code", link: "web开发教程" },
    ],
  },
  {
    text: "CSDN",
    icon: "book",
    link: "https://blog.csdn.net/2301_79801717?spm=1011.2415.3001.5343",
  },
]);
