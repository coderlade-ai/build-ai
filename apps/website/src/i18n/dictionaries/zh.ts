import type { Dictionary } from "./en";

export const zh: Dictionary = {
  meta: {
    title: "LadeStack Build:在浏览器中使用的 AI 网站和应用构建器",
    description:
      "描述你的想法,看 AI 智能体编写真实代码,预览并下载文件。免费、无需账号、使用你自己的 AI 密钥。开发中。",
  },
  skipToContent: "跳到正文",
  nav: {
    features: "功能",
    useCases: "使用场景",
    howItWorks: "工作方式",
    technology: "技术",
    menu: "菜单",
    language: "语言",
    start: "开始构建",
  },
  status: "开发中。本页介绍我们正在打造的产品,目前尚未上线任何功能。",
  hero: {
    eyebrow: "按你的方式进行 AI 开发",
    title: "从想法到可运行的代码",
    subtitle:
      "描述一个网站或应用。AI 智能体会制定计划,在真正的代码编辑器中编写文件,并在浏览器里运行实时预览。每一行代码都归你所有。",
    primary: "开始构建",
    secondary: "了解工作方式",
  },
  features: {
    title: "你将获得",
    intro: "一个真正的开发工作区,而不是黑盒。",
    items: [
      {
        title: "智能体模式",
        body: "Code、Plan、Ask 和 Debug 模式各有明确权限,智能体只做当前模式允许的事。",
      },
      {
        title: "实时代码编辑器",
        body: "文件会出现在带文件树的 Monaco 编辑器中,你随时可以自己修改。",
      },
      {
        title: "浏览器内预览",
        body: "根据 package.json 安装依赖,并在支持的环境中通过浏览器运行时启动开发服务器。",
      },
      {
        title: "使用自己的密钥",
        body: "连接你自己的 AI 服务商。费用直接付给服务商,LadeStack 不收取任何费用。",
      },
      {
        title: "检查点",
        body: "更改会保存为检查点,可在 AI 编辑前后进行对比和恢复。",
      },
      {
        title: "下载 ZIP",
        body: "随时导出包含完整目录结构的全部源代码,无需账号。",
      },
    ],
  },
  useCases: {
    title: "可以构建什么",
    intro: "首先支持基于 React、TypeScript 和 Vite 的前端项目,之后会加入更多技术栈。",
    items: [
      { title: "落地页", body: "产品发布、活动和营销推广。" },
      { title: "SaaS 仪表盘", body: "管理后台、图表和数据表格。" },
      { title: "作品集", body: "设计师、开发者和创作者的个人网站。" },
      { title: "企业网站", body: "为小公司和代理机构打造的多页面网站。" },
      { title: "商城前端", body: "商品列表和购物车,连接你自己的后端。" },
      { title: "文档网站", body: "项目的指南和参考资料。" },
    ],
  },
  howItWorks: {
    title: "工作方式",
    steps: [
      { title: "描述需求", body: "写下你想要的内容,也可以附上参考资料。" },
      { title: "智能体规划并编写", body: "它会在编辑器中逐步创建文件。" },
      { title: "文件出现", body: "每个文件保存后都会被标记。" },
      { title: "预览与完善", body: "运行项目,提出修改,或自己编辑代码。" },
      { title: "导出", body: "将项目下载为 ZIP。" },
    ],
  },
  technology: {
    title: "技术",
    intro: "仍在评估中的技术选型已特别标注。",
    items: [
      {
        title: "受 Kilo Code 启发的智能体",
        body: "基于开源智能体理念的模式、工具、权限和检查点。",
      },
      { title: "Monaco 编辑器", body: "VS Code 背后的编辑器引擎,在你的浏览器中运行。" },
      {
        title: "浏览器运行时(评估中)",
        body: "候选运行时需先通过兼容性、许可证和安全性测试才会被选用。",
      },
      {
        title: "本地优先存储",
        body: "项目保存在浏览器存储中。没有云端副本,请定期导出。",
      },
    ],
  },
  byok: {
    title: "你的密钥,你的代码",
    items: [
      {
        title: "没有平台费用",
        body: "你按用量向 AI 服务商付费。这里没有套餐,也没有点数。",
      },
      {
        title: "密钥只保留在会话中",
        body: "默认情况下,密钥只在当前会话中保存,绝不会写入你的项目。",
      },
      {
        title: "如实说明数据去向",
        body: "提示词会发送给你选择的 AI 服务商,安装依赖包会访问 npm。在你导出之前,项目文件始终保存在浏览器中。",
      },
    ],
  },
  faq: {
    title: "常见问题",
    items: [
      {
        q: "免费吗?",
        a: "是的。LadeStack Build 没有付费套餐。你的 AI 服务商可能会收取模型使用费。",
      },
      { q: "需要注册账号吗?", a: "不需要。无需注册即可开始构建。" },
      {
        q: "项目保存在哪里?",
        a: "保存在这台设备的浏览器中。清除浏览器数据可能会删除项目,请下载 ZIP 备份。",
      },
      {
        q: "支持哪些框架?",
        a: "首先支持桌面版 Chrome 和 Edge 上的 React + TypeScript + Vite。其他技术栈通过测试后会陆续加入。",
      },
    ],
  },
  cta: {
    title: "准备好了就开始吧",
    body: "打开构建器,描述你的第一个项目。",
    button: "开始构建",
  },
  footer: {
    tagline: "LadeStack 出品的免费、本地优先 AI 构建器。",
    product: "产品",
    licence: "基于 MIT 许可证开源。",
  },
};
