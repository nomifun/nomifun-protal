# 英文媒体资源与截图来源

这份清单区分真实历史英文产品截图、当前源码组件的英文预览，以及保留原语言的设备演示。英文页面中的图形和交互文案使用对应的英文词典，不把翻译后的示意图包装成原生应用截图。

## 创作工作台：复用真实英文图集

| 官网文件                                        | 真实来源                                                                        | 界面语言   | 尺寸       | 记录版本与日期     |
| ----------------------------------------------- | ------------------------------------------------------------------------------- | ---------- | ---------- | ------------------ |
| `public/images/creative/en/image-workbench.png` | `main/nomifun-desktop/docs/images/creative-studio/en-US/03-image-workbench.png` | English UI | 1440 × 900 | 0.7.2 / 2026-08-25 |
| `public/images/creative/en/video-workbench.png` | `main/nomifun-desktop/docs/images/creative-studio/en-US/04-video-workbench.png` | English UI | 1440 × 900 | 0.7.2 / 2026-08-25 |

绝对来源根目录：`C:/Users/MINISFORUM/code/nomifun/main/nomifun-desktop`。图集版本、拍摄日期、隔离数据目录与真实运行截图属性由该工程的 `docs/images/SCREENSHOTS.md` 记录。

两张文件直接复制，没有替换界面文字或修改业务内容。结果卡中的原始示例 prompt 仍为中文，这是历史示例的用户输入，不是英文 UI 漏翻。英文页面的说明应保留：`Historical product capture · English UI · Original sample prompts in Chinese · 0.7.2 / Aug 2026`。当前安装版本的界面和功能可能不同。

文件 SHA-256：

- 图像：`4cf810625f760ac4be403d0b605066316313b82de632e389ad9040f5a825b208`
- 视频：`7b4e6d0c6d2d0073a0270ef22994fb8a64b55857bc431f2d5b85f937c5c3ae3f`

## Agent 工作台：当前源码组件的英文截图

素材入口为 `public/images/product/en/agent-workbench.png`，已于 2026-10-02 通过可见浏览器采集，实际图片尺寸为 **1680 × 1050**、文件大小 **178,784 字节**。截图是当前源码的真实英文工作台组件与合成测试数据，和上面的 0.7.2 / 2026-08-25 创作图集是不同的素材批次。不能用旧 README 英文工作区截图替代；旧 `docs/images/readme/en/workspace.png` 包含后来已经调整的 Summon / Create mini-app 设计，不能证明当前可组合 Agent 工作台。

真实组件与英文词典来源：

- 源码快照：`cbbc647d13710f89d675ce540ff79eeb3316f66b`。
- 组件入口：`ui/src/renderer/pages/agentSettings/AgentSettingsPage.tsx`。
- 原组件预览 harness：`ui/test/agent-workbench-preview.tsx`。
- 全部英文词典：`ui/src/renderer/services/i18n/locales/en-US/index.ts`，包括真实 `agentSettings.json`。
- 模块测试目录：`ui/test/fixtures/agent-workbench-catalog.json`。
- 官方预设：`crates/backend/nomifun-agent-contracts/contracts/presets/official-agent-seed-manifest.payload.json`。

原视觉测试目录比当前官方预设旧，漏了 `agent.tool-discovery`。隔离副本按真实 `crates/backend/nomifun-app/src/router/nomi_core_tool_discovery.rs` 与 `crates/backend/nomifun-ai-agent/src/tool_discovery.rs` 补入该模块元数据：源包 `nomifun.tool-discovery`，操作 `tool.discovery.rank`，effect 为 `pure`，presentation 为 `hidden`。没有修改官方 Coding 预设；它的八个能力选择都能在副本目录解析，不显示缺失模块警告。该项只补齐测试目录，不连接或执行 ToolSearch。

英文预览副本位于官网 `.cache/english-agent-fixture/`，该目录被 Git 忽略。副本引用原源码组件、原样式、原 UnoCSS/Vite 配置和原英文词典，只将测试数据的模型、个人预设与说明改为英文，使用独立 localStorage key。所有 `fetch` 都在副本内返回合成测试数据；未知 API 返回错误，不访问后台、模型、文件工具、插件宿主、真实用户数据或机器人。

采集页面：`http://127.0.0.1:3121/#/agent?template=coding.codex`。使用 1680 × 1050 视口，隔离 harness 的 frame 最大宽度为 1560px，避免英文帮助文本挤压；没有修改真实组件自身的布局规则。打开 Coding 官方预设，保留英文能力组合和逐操作授权。预览顶端明确说明 `Source-component preview · Synthetic data only · No backend or Agent execution`；官网也应保留 source-component / synthetic-data 标记。截图不表示模型或原生设备操作已经验收。

在官网根目录恢复预览：

```powershell
node .cache/english-agent-fixture/prepare-fixture.mjs
node .cache/english-agent-fixture/start.mjs
```

该预览服务仅绑定 loopback `127.0.0.1:3121`；抓图结束后已停止服务。HTML 与 TSX 模块转换返回 HTTP 200；浏览器确认真实 Coding 工作台的八个官方能力选择均有效、缺失模块数为 0，顶部测试数据说明可见，最终截图已保存在上述素材入口。

## 设备演示：保留真实原始媒体

2026-10-03 替换为用户提供的录像。`public/media/xiaozhi-yuntai-demo-7b67f896.mp4` 为保留完整内容及原声的 H.264 网页版本；`public/images/product/xiaozhi-yuntai-poster-ebc825a5.jpg` 直接取自原片第 2 秒。中英文共用 `lib/site.js` 的 `deviceDemo`，英文页翻译视频标题、替代文本、界面说明和播放入口，保留原语言音频，不生成假的硬件图、不篡改屏幕或杜撰字幕。来源、格式转换和 SHA-256 见 `docs/assets-provenance.md`。

## 社群二维码

联系页的微信二维码于 2026-10-07 替换为用户提供的微信群原图，QQ 二维码沿用旧官网公开的原始图片，完整保留平台标志、群名称与可扫码图形。英文页使用英文标题、说明、替代文本和查看完整二维码入口；原图中的中文群名称与有效期提示属于原始社群资料，详见 `docs/assets-provenance.md`。

## 英文文章与原生图形

作者已有起源文章英文原文来自 `C:/Users/MINISFORUM/code/nomifun/main/nomifun-protal/src/content/blog/en/nomifun-origin-story.md`，日期 2026-08-15；英文页保留历史归档边界。新增技术文章根据当前门户的源码依据翻译，不把归档中的旧设计作为当前发行状态。

首页能力波、翻牌、工作流、创作节点、液态架构与开源轮盘使用官网原生 SVG/HTML/CSS 图形。英文版本应翻译图形中的文本节点、动态状态与无障碍名称，保留相同动效和交互入口；品牌标志、代码标识与纯装饰图形可以共用。
