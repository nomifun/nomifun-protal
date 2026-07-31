import { useEffect, useRef, useState } from 'react';
import { channels } from '@/data/channels';
import type { Locale } from '@/i18n';

interface Props {
  locale: Locale;
}

/** Self-contained bilingual strings (the island holds its own dict). */
const STR = {
  'zh-CN': {
    gridTitle: '一个伙伴，连接 11+ 社交渠道',
    shipped: '已接入',
    inProgress: '在途',
    chatName: '你的伙伴',
    chatStatus: '在线',
    steps: [
      { who: 'you', text: '（你）帮我把今天的截图整理成周报' },
      { who: 'bot', text: '收到，正在你的电脑上操作…' },
      { who: 'bot', text: '已完成 ✅ 周报已生成' },
    ],
    timeHint: '通过任意社交 App 下令，伙伴在你的电脑上完成工作',
  },
  'en-US': {
    gridTitle: 'One companion, 11+ chat channels',
    shipped: 'Live',
    inProgress: 'In progress',
    chatName: 'Your companion',
    chatStatus: 'online',
    steps: [
      { who: 'you', text: '(you) Turn today’s screenshots into a weekly report' },
      { who: 'bot', text: 'On it — working on your computer right now…' },
      { who: 'bot', text: 'Done ✅ Weekly report is ready' },
    ],
    timeHint: 'Command from any chat app; your companion does the work on your computer',
  },
} as const;

export default function ChannelGateway({ locale }: Props) {
  const t = STR[locale] ?? STR['zh-CN'];

  const shippedChannels = channels.filter((c) => c.shipped);
  const totalSteps = t.steps.length;

  // Honor reduced-motion: everything lit, timeline shown statically.
  const [reduced, setReduced] = useState(false);
  // How many shipped tiles have "lit up" so far (index into shippedChannels order).
  const [litCount, setLitCount] = useState(0);
  // How many chat steps are revealed.
  const [stepCount, setStepCount] = useState(0);
  // Whether the companion is "typing" the next step.
  const [typing, setTyping] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  // Sequential tile "light up" + chat timeline. Cleaned up on unmount / re-run.
  useEffect(() => {
    if (reduced) {
      setLitCount(shippedChannels.length);
      setStepCount(totalSteps);
      setTyping(false);
      return;
    }

    const timers: ReturnType<typeof setTimeout>[] = [];
    setLitCount(0);
    setStepCount(0);
    setTyping(false);

    // Stagger the shipped tiles lighting up.
    const tileStep = 140;
    for (let i = 1; i <= shippedChannels.length; i++) {
      timers.push(setTimeout(() => setLitCount(i), 300 + i * tileStep));
    }

    // After the tiles, play the chat timeline (with a typing beat before bot replies).
    let chatStart = 300 + shippedChannels.length * tileStep + 400;
    for (let i = 0; i < totalSteps; i++) {
      const isBot = t.steps[i].who === 'bot';
      if (isBot) {
        const startTyping = chatStart;
        timers.push(setTimeout(() => setTyping(true), startTyping));
        timers.push(
          setTimeout(() => {
            setTyping(false);
            setStepCount(i + 1);
          }, startTyping + 700)
        );
        chatStart = startTyping + 700 + 650;
      } else {
        timers.push(setTimeout(() => setStepCount(i + 1), chatStart));
        chatStart += 650;
      }
    }

    return () => timers.forEach(clearTimeout);
  }, [reduced, shippedChannels.length, totalSteps, locale]);

  return (
    <div ref={rootRef} className="grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:gap-8">
      {/* ---------- Channel grid ---------- */}
      <div className="rounded-3xl border border-ink-600/70 bg-ink-800/50 p-5 backdrop-blur-sm sm:p-6">
        <div className="mb-4 flex items-center gap-2">
          <span className="i-mdi-access-point-network text-lg text-pink-400" aria-hidden="true" />
          <span className="text-sm font-medium text-mid">{t.gridTitle}</span>
        </div>

        <ul className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
          {channels.map((c, idx) => {
            const orderIndex = shippedChannels.findIndex((s) => s.id === c.id);
            const lit = c.shipped ? orderIndex < litCount : false;
            return (
              <li
                key={c.id}
                className={[
                  'group relative flex flex-col items-center justify-center gap-2 rounded-2xl border px-2 py-3.5 text-center transition-all duration-500',
                  c.shipped
                    ? lit
                      ? 'border-pink-500/40 bg-ink-700/60 shadow-[0_0_24px_-6px_rgba(255,111,145,0.5)]'
                      : 'border-ink-700/70 bg-ink-850/60'
                    : 'border-dashed border-ink-600/70 bg-ink-850/40',
                ].join(' ')}
                style={{ transitionDelay: !reduced && lit ? `${orderIndex * 20}ms` : undefined }}
              >
                <img
                  src={`/channels/${c.icon}.svg`}
                  alt={c.name}
                  width={28}
                  height={28}
                  loading="lazy"
                  className={[
                    'h-7 w-7 object-contain transition-all duration-500',
                    c.shipped
                      ? lit
                        ? 'opacity-100 grayscale-0'
                        : 'opacity-50 grayscale'
                      : 'opacity-35 grayscale',
                  ].join(' ')}
                />
                <span
                  className={[
                    'line-clamp-1 text-[11px] font-medium leading-tight transition-colors duration-500',
                    c.shipped ? (lit ? 'text-hi' : 'text-low') : 'text-low',
                  ].join(' ')}
                >
                  {c.name}
                </span>

                {c.shipped ? (
                  <span
                    className={[
                      'absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full transition-all duration-500',
                      lit ? 'bg-success shadow-[0_0_8px_1px_rgba(52,211,153,0.7)]' : 'bg-ink-600',
                    ].join(' ')}
                    aria-hidden="true"
                  />
                ) : (
                  <span className="absolute -right-1 -top-2 rounded-full border border-warning/30 bg-warning/10 px-1.5 py-0.5 text-[9px] font-medium leading-none text-warning whitespace-nowrap">
                    {t.inProgress}
                  </span>
                )}
              </li>
            );
          })}
        </ul>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-low">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-success" aria-hidden="true" />
            {t.shipped}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-warning" aria-hidden="true" />
            {t.inProgress} · WeCom
          </span>
        </div>
      </div>

      {/* ---------- Chat mockup ---------- */}
      <div className="flex flex-col overflow-hidden rounded-3xl border border-ink-600/70 bg-ink-900/70 shadow-[0_0_50px_-18px_rgba(255,111,145,0.35)]">
        {/* header */}
        <div className="flex items-center gap-2.5 border-b border-ink-700/70 bg-ink-850/70 px-4 py-3">
          <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-pink-600 text-[var(--on-accent)]">
            <span className="i-mdi-robot-happy-outline text-lg" aria-hidden="true" />
          </span>
          <div className="leading-tight">
            <div className="text-sm font-semibold text-hi">{t.chatName}</div>
            <div className="flex items-center gap-1 text-[11px] text-success">
              <span className="h-1.5 w-1.5 rounded-full bg-success" aria-hidden="true" />
              {t.chatStatus}
            </div>
          </div>
          <span className="i-mdi-cellphone-link ml-auto text-base text-low" aria-hidden="true" />
        </div>

        {/* messages */}
        <div className="flex flex-1 flex-col gap-2.5 px-4 py-4">
          {t.steps.map((s, i) => {
            const shown = i < stepCount;
            const isYou = s.who === 'you';
            const done = s.text.includes('✅') || s.text.toLowerCase().includes('done');
            return (
              <div
                key={i}
                className={[
                  'flex transition-all duration-400',
                  isYou ? 'justify-end' : 'justify-start',
                  shown ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-1.5 opacity-0',
                ].join(' ')}
                aria-hidden={shown ? undefined : true}
              >
                <span
                  className={[
                    'max-w-[85%] rounded-2xl px-3.5 py-2 text-[13px] leading-snug',
                    isYou
                      ? 'rounded-br-md bg-gradient-to-br from-pink-400 to-pink-600 text-[var(--on-accent)]'
                      : done
                        ? 'rounded-bl-md border border-success/30 bg-success/10 text-hi'
                        : 'rounded-bl-md border border-ink-700/70 bg-ink-800/80 text-mid',
                  ].join(' ')}
                >
                  {s.text}
                </span>
              </div>
            );
          })}

          {/* typing indicator */}
          {typing && (
            <div className="flex justify-start" aria-hidden="true">
              <span className="inline-flex items-center gap-1 rounded-2xl rounded-bl-md border border-ink-700/70 bg-ink-800/80 px-3.5 py-2.5">
                <span className="cg-dot h-1.5 w-1.5 rounded-full bg-low" />
                <span className="cg-dot cg-dot-2 h-1.5 w-1.5 rounded-full bg-low" />
                <span className="cg-dot cg-dot-3 h-1.5 w-1.5 rounded-full bg-low" />
              </span>
            </div>
          )}
        </div>

        {/* footer hint */}
        <div className="border-t border-ink-700/70 bg-ink-850/50 px-4 py-2.5 text-[11px] leading-snug text-low">
          {t.timeHint}
        </div>
      </div>

      <style>{`
        @keyframes cg-blink {
          0%, 80%, 100% { opacity: 0.25; transform: translateY(0); }
          40% { opacity: 1; transform: translateY(-2px); }
        }
        .cg-dot { animation: cg-blink 1.2s ease-in-out infinite; }
        .cg-dot-2 { animation-delay: 0.18s; }
        .cg-dot-3 { animation-delay: 0.36s; }
        @media (prefers-reduced-motion: reduce) {
          .cg-dot { animation: none; opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
