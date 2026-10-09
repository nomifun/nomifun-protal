import Link from "@/components/i18n/LocaleLink";
import { notFound } from "next/navigation";
import Icon from "@/components/Icon";
import { products, getProducts, deviceDemo } from "@/lib/site";
import { createI18n, pageMetadata } from "@/lib/i18n";
import ProductVisual from "./ProductVisual";

const details = {
  desktop: {
    lead: "从一段对话，到一个可以长期工作的 AI 系统。组合 Agent 的能力，为伙伴留下记忆，把重复工作交给自动化，再把创造力铺开到画布上。",
    statement: ["一套能力。", "用在每一种工作里。"],
    intro:
      "模型、知识、工具和权限，贯穿对话、伙伴、创作与自动工作。你搭建的是自己的工作方式。",
    features: [
      [
        "组合你的 Agent",
        "用可视化设定选择模型、Skill、知识与能力边界，从轻量对话到复杂工作。在同一个会话中切换 Agent，让适合的人接着做。",
      ],
      [
        "让工作自己向前",
        "需求平台、AutoWork 和自动提需 Loop 连接成持续工作链。IDMM 提供独立的策略决策与恢复路径，规则路径无需模型 token。",
      ],
      [
        "把创作铺开",
        "对话承载文字、图像、视频和音频；Creative Studio 提供持久画布、图像与视频工作台，以及可复用的素材、提示词和模板。",
      ],
      [
        "给伙伴一个自己的世界",
        "伙伴有独立的 Agent、人格、记忆与知识，也能按你的设定共享资源。连接 IM、手机与机器人，让同一份陪伴在不同地方继续。",
      ],
      [
        "能力可以继续生长",
        "Unified Plugin 将交互界面、独立服务与系统动作接入同一平台。原生 Browser Use、Computer Use、多 Agent 协作与多协议模型体系，为定制留出空间。",
      ],
      [
        "你的电脑，你的掌控",
        "Rust + Tauri 的本地运行架构，数据存放在自己的设备。无遥测和自动数据收集；外部模型、渠道与联网工具按你的配置连接。",
      ],
    ],
    boundary:
      "这里展示的是当前开发分支的能力设计与实现。项目仍在持续迭代；安装包提供的具体能力、平台支持与实验状态，请按下载版本核对。使用云模型或外部渠道时，相应请求会发送给你选择的服务。",
    action: "下载安装包",
    actionHref: "/download",
  },
  mobile: {
    lead: "离开键盘，也能继续对话、查看进度、安排下一件事。手机是轻巧的交互入口，你的电脑继续负责模型、数据和工作。",
    statement: ["随身的是入口。", "留下的是完整工作台。"],
    intro:
      "不用在手机上重新搭建一套 AI 系统。连接自己的 Desktop，让同一份会话、伙伴和任务随时可见。",
    features: [
      [
        "扫描，连接自己的电脑",
        "Desktop 显式开启远程访问后，手机扫描短时效、一次性二维码完成认证。在可信局域网内，手机直接与电脑通信。",
      ],
      [
        "对话与工作，接着进行",
        "查看会话、发送新指令、追踪执行结果。需求、定时任务、伙伴与模型配置沿用 Desktop 的同一套数据与权限。",
      ],
      [
        "一份数据，不必重复配置",
        "模型密钥和持久工作区由电脑管理。手机负责操作与展示，长时间任务继续在 Desktop 执行。",
      ],
      [
        "从本地网络延伸出去",
        "需要跨网络访问时，可以选择自托管 NomiRelay。手机连接业务入口，Desktop 保持业务数据与执行中枢的角色。",
      ],
    ],
    boundary:
      "Mobile 面向 Android、iOS 与 H5 开发。平台安装与分发状态以仓库为准。局域网监听器没有内置 TLS，请在可信局域网或专用 VPN 使用；跨网络连接需要相应网络配置，不能把局域网直连理解为自动穿透所有网络。",
    action: "GitHub 源码",
  },
  "xiaozhi-yuntai": {
    lead: "你的桌面伙伴，也可以有真实世界的身体。绑定小智云台，让同一个伙伴听见你、和你说话，用表情与动作回应。NomiFun Desktop 延续它的身份、记忆与能力。",
    statement: ["熟悉的伙伴。", "真实的声音与动作。"],
    intro:
      "把设备绑定到已有伙伴，让熟悉的个性、知识与记忆一起来到桌边。小智云台负责声音、表情与动作，你的电脑负责思考和行动编排。",
    features: [
      [
        "电脑就是机器人的大脑",
        "兼容的 ESP32-S3 固件通过局域网连接自己的 Desktop。机器人负责音频与设备工具，Desktop 提供对话模型、ASR、TTS 和伙伴运行时。",
      ],
      [
        "让情绪有一种表达",
        "OLED 显示、语音反馈与云台动作，让互动从文字延伸到物理世界。支持能力随板型与固件配置而不同。",
      ],
      [
        "动作进入 Agent 的工具箱",
        "设备侧 MCP 工具把头部状态与运动能力提供给伙伴。动作与对话、知识、其他工具在同一工作流中协作。",
      ],
      [
        "开源硬件，自己动手",
        "仓库提供板卡适配、协议和烧录入口。按设备接线与校准要求构建，让你的伙伴拥有自己的身体。",
      ],
    ],
    boundary:
      "需要兼容的硬件、固件烧录、网络配置与伙伴绑定。语音识别、合成和对话使用你选定的模型；选择云端模型时，相应语音或文本会按配置发送给供应商。舵机需按板型要求校准后启用。",
    action: "GitHub 固件源码",
  },
  "net-infra": {
    lead: "当手机与电脑不在同一网络，用自己管理的连接把它们带到一起。NomiRelay 负责传输，Desktop 继续负责 AI 和数据。",
    statement: ["网络可以延伸。", "职责保持清晰。"],
    intro:
      "这是一个可选的网络基础设施项目。既能承载 NomiFun，也能为其他 HTTP、WebSocket、TCP 和 UDP 服务提供受策略管理的入口。",
    features: [
      [
        "你的中继，你来管理",
        "在自己选择的主机上部署 NomiRelay，把网络边界、入口与授权交给自己管理，无需依赖 NomiFun 托管云。",
      ],
      [
        "承载连接，保持应用完整",
        "nfagent 连接本地服务与中继。客户端通过业务入口访问应用，模型、Agent、任务与持久数据仍由 Desktop 提供。",
      ],
      [
        "为多种服务预留空间",
        "支持 HTTP/WebSocket/TCP/UDP 服务路径。隧道、访问策略和运维接口集中管理，适合需要跨网络连接的开发者。",
      ],
      [
        "管理面与业务面分开",
        "Mobile 使用业务入口。管理员凭据和入网凭据留在运维侧，不放进手机配对二维码。",
      ],
    ],
    boundary:
      "Net Infra 需要自托管部署 NomiRelay 与 nfagent，并配置网络入口、认证和 TLS。它是可选传输基础设施，不是无需部署的云服务。实际协议能力、限制与运维要求以仓库集成文档为准。",
    action: "GitHub 源码",
  },
};

const englishDetails = {
  desktop: {
    lead: "From a conversation to an AI system that can keep working. Compose an agent's capabilities, give companions lasting memories, hand repeated work to automation, and spread your ideas across a canvas.",
    statement: ["One set of capabilities.", "For every way you work."],
    intro:
      "Models, knowledge, tools, and permissions connect conversations, companions, creative work, and automation. Build a way of working that is your own.",
    features: [
      [
        "Compose your agent",
        "Visually choose models, skills, knowledge, and capability boundaries, from lightweight chat to complex work. Switch agents within the same conversation so the right one can take over.",
      ],
      [
        "Keep work moving",
        "The requirements platform, AutoWork, and a loop that proposes new requirements form a continuous work chain. IDMM provides independent policy decisions and recovery paths. Rule-based paths use no model tokens.",
      ],
      [
        "Make room for creation",
        "Conversations support text, images, video, and audio. Creative Studio adds a persistent canvas, image and video workbenches, and reusable assets, prompts, and templates.",
      ],
      [
        "Give companions a world of their own",
        "Companions have their own agent, personality, memory, and knowledge, with resources shared according to your settings. Connect IM channels, phones, and robots to continue the same companionship in different places.",
      ],
      [
        "Leave room to grow",
        "Unified Plugin brings interfaces, independent services, and system actions into one platform. Native Browser Use and Computer Use, multi-agent collaboration, and support for multiple model protocols create space for customization.",
      ],
      [
        "Your computer. Your control.",
        "A local runtime built with Rust and Tauri stores data on your own device. No telemetry or automatic data collection. External models, channels, and online tools connect according to your configuration.",
      ],
    ],
    boundary:
      "This page presents capabilities designed and implemented in the current development branch. The project continues to evolve. Check the release you download for available features, platform support, and experimental status. Cloud models and external channels receive the requests you configure them to handle.",
    action: "Download app",
    actionHref: "/download",
  },
  mobile: {
    lead: "Step away from the keyboard and keep talking, checking progress, and planning what comes next. Your phone is a lightweight interface; your computer continues to handle models, data, and execution.",
    statement: [
      "Take the interface with you.",
      "Keep the full workstation at home.",
    ],
    intro:
      "You do not need to set up a second AI system on your phone. Connect to your own Desktop and keep the same conversations, companions, and tasks within reach.",
    features: [
      [
        "Scan to connect to your computer",
        "After you explicitly enable remote access in Desktop, scan a short-lived, single-use QR code to authenticate your phone. On a trusted local network, the phone communicates directly with the computer.",
      ],
      [
        "Pick up the conversation—and the work",
        "View conversations, send instructions, and track results. Requirements, scheduled tasks, companions, and model configuration use the same data and permissions as Desktop.",
      ],
      [
        "One set of data. No repeated setup.",
        "Your computer manages model credentials and persistent workspaces. Your phone handles interaction and display, while long-running tasks keep executing in Desktop.",
      ],
      [
        "Reach beyond the local network",
        "For access across networks, you can choose a self-hosted NomiRelay. Your phone uses the application endpoint, while Desktop remains the center for application data and execution.",
      ],
    ],
    boundary:
      "Mobile is developed for Android, iOS, and H5. Check the repository for current installation and distribution status. The local-network listener does not include built-in TLS; use a trusted local network or a private VPN. Access across networks requires appropriate network configuration. Direct local access does not automatically traverse every network.",
    action: "GitHub source",
  },
  "xiaozhi-yuntai": {
    lead: "Give your desktop companion a physical presence. Connect Xiaozhi Yuntai so the same companion can hear you, speak with you, and respond through expressions and movement. NomiFun Desktop carries its identity, memory, and capabilities.",
    statement: ["A familiar companion.", "A real voice. Real movement."],
    intro:
      "Bind a device to an existing companion and bring its familiar personality, knowledge, and memory to your desk. Xiaozhi Yuntai provides voice, expressions, and movement; your computer handles reasoning and action orchestration.",
    features: [
      [
        "Your computer is the robot's brain",
        "Compatible ESP32-S3 firmware connects to your Desktop over a local network. The robot handles audio and device tools; Desktop provides conversation models, ASR, TTS, and the companion runtime.",
      ],
      [
        "Give emotion a way to show",
        "An OLED display, spoken feedback, and pan-tilt movement take interaction beyond text. Available capabilities depend on the board and firmware configuration.",
      ],
      [
        "Put movement in the agent's toolbox",
        "Device-side MCP tools expose head state and motion capabilities to your companion. Actions work alongside conversation, knowledge, and other tools in the same workflow.",
      ],
      [
        "Open hardware. Build it yourself.",
        "The repository provides board adaptations, protocols, and firmware-flashing entry points. Follow the wiring and calibration requirements to give your companion a body of its own.",
      ],
    ],
    boundary:
      "Compatible hardware, firmware flashing, network setup, and companion binding are required. Speech recognition, synthesis, and conversation use the models you choose. When cloud models are selected, the configured audio or text requests are sent to those providers. Calibrate the servos according to your board's requirements before enabling them.",
    action: "GitHub firmware source",
  },
  "net-infra": {
    lead: "When your phone and computer are on different networks, bring them together through a connection you manage. NomiRelay handles transport; Desktop continues to handle AI and data.",
    statement: ["Extend your network.", "Keep responsibilities clear."],
    intro:
      "An optional network infrastructure project. It can carry NomiFun traffic or provide policy-managed endpoints for other HTTP, WebSocket, TCP, and UDP services.",
    features: [
      [
        "Your relay. Your management.",
        "Deploy NomiRelay on a host of your choice and manage network boundaries, endpoints, and authorization yourself, without depending on a NomiFun-hosted cloud.",
      ],
      [
        "Carry connections. Keep the application whole.",
        "nfagent connects local services to the relay. Clients access the application through its endpoint; Desktop still supplies models, agents, tasks, and persistent data.",
      ],
      [
        "Make space for different services",
        "Support for HTTP, WebSocket, TCP, and UDP service paths, with centralized tunnel, access-policy, and operations interfaces. Designed for developers who need connections across networks.",
      ],
      [
        "Separate administration from application access",
        "Mobile uses the application endpoint. Administrator and network-enrollment credentials stay on the operations side, outside the phone-pairing QR code.",
      ],
    ],
    boundary:
      "Net Infra requires self-hosting NomiRelay and nfagent, with network endpoints, authentication, and TLS configured. It is optional transport infrastructure, not a cloud service that requires no deployment. See the repository's integration documentation for current protocol capabilities, limits, and operating requirements.",
    action: "GitHub source",
  },
};

export function generateStaticParams() {
  return products.map(({ slug }) => ({ slug }));
}

export async function getProductMetadata(params, locale = "zh") {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);
  const englishProduct = getProducts("en").find((item) => item.slug === slug);
  return pageMetadata(
    locale,
    `/products/${slug}`,
    product?.name || "产品",
    englishProduct?.name || "Product",
    product?.description || "认识 NomiFun 开源产品。",
    englishProduct?.description || "Explore NomiFun open-source products.",
  );
}

export async function generateMetadata({ params }) {
  return getProductMetadata(params, "zh");
}

export default async function ProductPage({ params, locale = "zh" }) {
  const { t, asset } = createI18n(locale);
  const localizedProducts = getProducts(locale);
  const { slug } = await params;
  const product = localizedProducts.find((item) => item.slug === slug);
  if (!product) notFound();
  const data = locale === "en" ? englishDetails[slug] : details[slug];
  const next =
    localizedProducts[
      (localizedProducts.indexOf(product) + 1) % localizedProducts.length
    ];
  return (
    <main
      id="main-content"
      className={`subpage product-detail accent-${product.accent}`}
    >
      <section className="page-hero container">
        <Link href="/products" className="page-back">
          <Icon name="ArrowRight" size={17} />{" "}
          {t("开源矩阵", "Open-source ecosystem")}
        </Link>
        <p className="eyebrow">
          /{product.number} {product.category}
        </p>
        <div className="page-hero-row">
          <h1 className="product-headline">{product.tagline}</h1>
          <div>
            <span className="pill">{product.name}</span>
            <p className="page-lead">{data.lead}</p>
          </div>
        </div>
        <div className="page-actions product-repository-actions">
          <Link
            className="button"
            href={data.actionHref || product.repo}
            target={data.actionHref ? undefined : "_blank"}
            rel={data.actionHref ? undefined : "noopener noreferrer"}
          >
            {data.action}{" "}
            <Icon name={data.actionHref ? "DownloadSimple" : "GithubLogo"} />
          </Link>
          {data.actionHref && (
            <a
              className="button ghost"
              href={product.repo}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("GitHub 源码", "GitHub source")} <Icon name="GithubLogo" />
            </a>
          )}
          <a
            className="button ghost"
            href={product.gitee}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("Gitee 源码", "Gitee source")} <Icon name="GitBranch" />
          </a>
        </div>
      </section>
      <ProductVisual slug={slug} />
      <section className="product-editorial container">
        <div className="product-editorial-title">
          <p className="eyebrow">BUILT AROUND YOU</p>
          <h2>
            {data.statement[0]}
            <br />
            <span className="page-italic">{data.statement[1]}</span>
          </h2>
          <p>{data.intro}</p>
        </div>
        <div className="product-features">
          {data.features.map(([title, body], i) => (
            <article key={title}>
              <span className="feature-index">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      {slug === "xiaozhi-yuntai" && (
        <section className="robot-film container">
          <div>
            <p className="eyebrow">IN THE REAL WORLD</p>
            <h2>{t("看看它如何回应。", "See how it responds.")}</h2>
            <p>
              {t(
                "来自项目已有的真实云台设备演示。不同硬件、固件与模型配置会带来不同体验。",
                "A real device demonstration from the project. Your experience may differ with hardware, firmware, and model configuration.",
              )}
            </p>
          </div>
          <video
            controls
            playsInline
            preload="none"
            poster={asset(deviceDemo.poster)}
            aria-label={t(
              "NomiFun 小智云台真实设备演示",
              "NomiFun Xiaozhi Yuntai real device demonstration",
            )}
          >
            <source src={deviceDemo.video} type="video/mp4" />
            <a href={deviceDemo.video}>
              {t("打开设备演示视频", "Open device demonstration video")}
            </a>
          </video>
        </section>
      )}
      <section className="product-boundary container">
        <details>
          <summary>
            {t("使用与版本说明", "Usage & release notes")} <span>+</span>
          </summary>
          <p>{data.boundary}</p>
          <a
            href={`${product.repo}#readme`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("查阅仓库说明", "Read the repository guide")}{" "}
            <Icon name="ArrowUpRight" size={17} />
          </a>
        </details>
      </section>
      <section className="product-next container">
        <span className="eyebrow">NEXT IN THE UNIVERSE</span>
        <Link href={`/products/${next.slug}`}>
          <h2>{next.name}</h2>
          <Icon name="ArrowUpRight" size={44} />
        </Link>
      </section>
    </main>
  );
}
