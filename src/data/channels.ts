import type { Dict } from '@/i18n';

export interface Channel {
  id: string;
  /** display name */
  name: string;
  /** /channels/<icon>.svg in public/ */
  icon: string;
  /** false => not yet shipped (WeCom is UI-only / in progress) */
  shipped: boolean;
}

/**
 * IM channels. 11 are fully implemented and default-on in the backend
 * (crates/backend/nomifun-channel). WeCom (企业微信) is UI-listed / in progress
 * only — there is no backend PluginType::Wecom yet.
 */
export const channels: Channel[] = [
  { id: 'telegram', name: 'Telegram', icon: 'telegram', shipped: true },
  { id: 'lark', name: 'Lark / 飞书', icon: 'lark', shipped: true },
  { id: 'dingtalk', name: '钉钉', icon: 'dingtalk', shipped: true },
  { id: 'weixin', name: '微信', icon: 'weixin', shipped: true },
  { id: 'slack', name: 'Slack', icon: 'slack', shipped: true },
  { id: 'discord', name: 'Discord', icon: 'discord', shipped: true },
  { id: 'matrix', name: 'Matrix', icon: 'matrix', shipped: true },
  { id: 'mattermost', name: 'Mattermost', icon: 'mattermost', shipped: true },
  { id: 'twitch', name: 'Twitch', icon: 'twitch', shipped: true },
  { id: 'nostr', name: 'Nostr', icon: 'nostr', shipped: true },
  { id: 'qqbot', name: 'QQ Bot', icon: 'qqbot', shipped: true },
  { id: 'wecom', name: '企业微信', icon: 'wecom', shipped: false },
];

export const shippedChannelCount = channels.filter((c) => c.shipped).length; // 11

export const channelLabels: Dict<{ shipped: string; inProgress: string; title: string; subtitle: string }> = {
  'zh-CN': {
    shipped: '已接入',
    inProgress: '在途',
    title: '一个伙伴，连接 11+ 社交渠道',
    subtitle: '只要有网络与社交平台，就能指挥远在天边的伙伴帮你操作电脑。',
  },
  'en-US': {
    shipped: 'Live',
    inProgress: 'In progress',
    title: 'One companion, 11+ chat channels',
    subtitle: 'Anywhere you have a network and a chat app, command your companion to drive your computer.',
  },
};
