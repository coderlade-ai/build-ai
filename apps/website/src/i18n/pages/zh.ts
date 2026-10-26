import type { PagesDictionary } from "./en";

export const zh: PagesDictionary = {
  common: {
    legal: "法律信息",
    draft: "草稿:本文尚未经过律师审核,正式发布前可能会有变动。",
    updated: "最后更新",
    backHome: "返回首页",
  },
  links: {
    privacy: "隐私",
    terms: "条款",
    disclaimer: "免责声明",
    openSource: "开源",
    about: "关于",
    contact: "联系",
  },
  privacy: {
    title: "隐私",
    description: "LadeStack Build 如何处理你的数据:本地存储、AI 密钥和第三方服务。",
    sections: [
      {
        h: "无需账号,不建档案",
        p: "使用 LadeStack Build 无需注册。我们不运营用户账号,本网站也不设置广告或分析类 Cookie。",
      },
      {
        h: "项目保存在你的浏览器中",
        p: "构建器将项目、文件和检查点保存在你设备上的浏览器本地存储中。我们的服务器不保留副本。清除浏览器数据可能会删除它们,请下载 ZIP 备份。",
      },
      {
        h: "你的 AI 密钥和提示词",
        p: "AI 服务商由你自行连接。默认情况下,密钥只保存在当前浏览器会话中,绝不会写入你的项目或导出文件。你的提示词以及智能体所需的文件会发送给你选择的服务商,并受该服务商的隐私条款约束。",
      },
      {
        h: "其他服务",
        p: "安装依赖包时会访问 npm 仓库。我们的托管服务商可能会处理 IP 地址等技术性请求数据,用于提供和保护本网站。",
      },
      {
        h: "你的选择",
        p: "你可以随时在浏览器或构建器设置中删除项目和已保存的设置,删除前请先下载你的作品。",
      },
    ],
  },
  terms: {
    title: "使用条款",
    description: "使用 LadeStack Build 的基本条款。",
    sections: [
      {
        h: "使用本服务",
        p: "LadeStack Build 目前处于开发阶段,按现状免费提供。功能可能随时变更或暂停。",
      },
      {
        h: "你的内容",
        p: "你创建的一切,包括智能体为你编写的代码,都归你所有。你需要自行审查并对其使用方式负责。",
      },
      {
        h: "第三方服务",
        p: "AI 服务商、npm 以及你连接的其他服务各有其条款,并可能向你收费。相关费用由你与对方结算。",
      },
      {
        h: "合理使用",
        p: "请勿利用本服务违反法律、伤害他人或攻击其他系统。",
      },
      {
        h: "不提供担保",
        p: "如 MIT 许可证所述,在法律允许的范围内,本软件不提供任何形式的担保。",
      },
    ],
  },
  disclaimer: {
    title: "免责声明",
    description: "AI 生成代码和浏览器运行时的局限。",
    sections: [
      {
        h: "AI 可能出错",
        p: "AI 模型编写的代码和文字可能包含错误、安全问题或过时的做法。在依赖之前,请审查并测试所有内容。",
      },
      {
        h: "浏览器运行时的局限",
        p: "在浏览器中运行项目存在局限。部分依赖包、原生模块和后端功能可能无法运行,各浏览器的支持情况也不同。",
      },
      {
        h: "不构成专业建议",
        p: "构建器生成的任何内容都不构成法律、财务、医疗或安全方面的建议。",
      },
    ],
  },
  openSource: {
    title: "开源",
    description: "LadeStack Build 的许可证以及它所依赖的开源项目。",
    intro:
      "LadeStack Build 基于 MIT 许可证开源。它使用了以下项目构建,各项目的许可证和声明随源代码一并保留。",
    planned: "计划中",
  },
  about: {
    title: "关于",
    description: "LadeStack Build 是什么、如何运作,以及项目目前的进展。",
    sections: [
      {
        h: "这是什么",
        p: "LadeStack Build 是一款在浏览器中运行的免费开源 AI 网站和应用构建器。你描述想要的内容,AI 智能体编写代码,你可以编辑、预览并导出。",
      },
      {
        h: "如何运作",
        p: "无需注册账号。你使用自己的 AI 服务商密钥,项目保存在你设备上的浏览器中,并可随时以 ZIP 格式下载你的作品。",
      },
      {
        h: "当前进展",
        p: "LadeStack Build 处于早期开发阶段。本网站已上线,但构建器仍在开发中,因此相关功能在正式推出前均标注为计划中。",
      },
      {
        h: "开源",
        p: "源代码以 MIT 许可证在 GitHub 上公开。你可以在那里阅读代码、报告问题并提出修改建议。",
      },
    ],
    source: "在 GitHub 上查看源代码",
  },
  contact: {
    title: "联系",
    description: "如何联系 LadeStack Build 项目。",
    sections: [
      {
        h: "问题、缺陷与想法",
        p: "联系项目的最佳方式是在 GitHub 上提交 issue。issue 是公开的,请勿在其中包含 API 密钥、密码或私有项目文件。",
      },
      {
        h: "安全问题",
        p: "如果你发现安全问题,请不要在公开 issue 中发布细节。请提交一个仅请求私密联系渠道的 issue,待渠道建立后再分享细节。",
      },
    ],
    issues: "在 GitHub 上提交 issue",
  },
  blog: {
    title: "博客",
    description: "关于 LadeStack Build、本地优先的 AI 构建和 Web 平台的文章。",
    empty: "暂无已发布的文章。每篇文章在八种语言版本全部就绪后才会在此发布。",
    published: "发布于",
    updated: "更新于",
    allArticles: "全部文章",
  },
  notFound: {
    title: "页面未找到",
    description: "你要找的页面不存在。",
    body: "该页面不存在或已被移动。",
  },
};
