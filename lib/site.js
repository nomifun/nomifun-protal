export const links = {
  website: "https://www.nomifun.com",
  github: "https://github.com/nomifun/nomifun-desktop",
  gitee: "https://gitee.com/nomifun/nomifun-desktop",
  releases: "https://github.com/nomifun/nomifun-desktop/releases",
  chinaMirror: "https://pan.baidu.com/s/5GPonoJNrwJ7GciBSDgXLaA",
  issues: "https://github.com/nomifun/nomifun-desktop/issues",
  email: "535526063@qq.com",
  wecomGroupQr: "/images/contact/nomifun-wecom-group.png",
  qqGroupQr: "/images/contact/nomifun-qq-group.png",
  qqGroupNumber: "865887762",
  introVideo: "https://www.bilibili.com/video/BV1kwKZ6UE5X/",
  introVideoIntl: "https://youtu.be/AsEToBDFR9s",
};

export const deviceDemo = {
  video: "/media/xiaozhi-yuntai-demo-7b67f896.mp4",
  poster: "/images/product/xiaozhi-yuntai-poster-ebc825a5.jpg",
};

export const products = [
  {
    slug: "desktop",
    number: "01",
    name: "NomiFun Desktop",
    shortName: "Desktop",
    icon: "Desktop",
    accent: "lilac",
    category: "LOCAL AI WORKSTATION",
    tagline: "让 AI 的全部能力，\n在你的电脑上相遇。",
    description:
      "可组合的 Agent、桌面伙伴、自动工作与多模态创作，共享一个本地运行中枢。",
    repo: "https://github.com/nomifun/nomifun-desktop",
    gitee: "https://gitee.com/nomifun/nomifun-desktop",
  },
  {
    slug: "mobile",
    number: "02",
    name: "NomiFun Mobile",
    shortName: "Mobile",
    icon: "DeviceMobile",
    accent: "coral",
    category: "YOUR DESKTOP, WITH YOU",
    tagline: "走开一点，\n工作继续。",
    description:
      "手机直连自己的 Desktop，继续会话、查看任务、推进需求，与伙伴随时交流。",
    repo: "https://github.com/nomifun/nomifun-mobile",
    gitee: "https://gitee.com/nomifun/nomifun-mobile",
  },
  {
    slug: "xiaozhi-yuntai",
    number: "03",
    name: "NomiFun 小智云台",
    shortName: "Xiaozhi Yuntai",
    icon: "Robot",
    accent: "lime",
    category: "A COMPANION IN THE REAL WORLD",
    tagline: "让桌面伙伴，\n走进真实世界。",
    description:
      "把兼容的 ESP32-S3 设备绑定到桌面伙伴，延续同一份身份与记忆，用声音、表情和云台动作回应。",
    repo: "https://github.com/nomifun/nomifun-xiaozhi-yuntai",
    gitee: "https://gitee.com/nomifun/nomifun-xiaozhi-yuntai",
  },
  {
    slug: "net-infra",
    number: "04",
    name: "NomiFun Net Infra",
    shortName: "Net Infra",
    icon: "Network",
    accent: "sky",
    category: "AN OPEN NETWORK LAYER",
    tagline: "跨过网络，\n保持自己的边界。",
    description:
      "可选的自托管 NomiRelay，连接跨网络的客户端和本地服务。数据与执行仍由 Desktop 管理。",
    repo: "https://github.com/nomifun/nomifun-net-infra",
    gitee: "https://gitee.com/nomifun/nomifun-net-infra",
  },
];

const englishProducts = {
  desktop: {
    tagline: "All your AI capabilities.\nAt home on your computer.",
    description:
      "Composable agents, desktop companions, autonomous work, and multimodal creation—powered by one local runtime.",
  },
  mobile: {
    tagline: "Step away.\nKeep things moving.",
    description:
      "Connect directly to your Desktop to continue conversations, check tasks, advance requirements, and stay in touch with your companions.",
  },
  "xiaozhi-yuntai": {
    name: "NomiFun Xiaozhi Yuntai",
    tagline: "Bring your companion\ninto the real world.",
    description:
      "Bind a compatible ESP32-S3 device to your desktop companion. Keep the same identity and memory, with voice, expressions, and pan-tilt movement.",
  },
  "net-infra": {
    tagline: "Reach across networks.\nKeep control of your boundaries.",
    description:
      "An optional, self-hosted NomiRelay connects clients across networks to your local services. Desktop still manages data and execution.",
  },
};

export function getProducts(locale = "zh") {
  return locale === "en"
    ? products.map((product) => ({
        ...product,
        ...englishProducts[product.slug],
      }))
    : products;
}

export const socialLinks = [
  { name: "哔哩哔哩", url: "https://b23.tv/0UhgKDh" },
  { name: "小红书", url: "https://xhslink.com/m/4x6ti8n6cA1" },
  { name: "YouTube", url: "https://www.youtube.com/@NomiFun-o2y" },
  { name: "X", url: "https://x.com/colir0" },
];

export function getSocialLinks(locale = "zh") {
  return locale === "en"
    ? socialLinks.map((social) => ({
        ...social,
        name:
          social.name === "哔哩哔哩"
            ? "Bilibili"
            : social.name === "小红书"
              ? "Xiaohongshu"
              : social.name,
      }))
    : socialLinks;
}
