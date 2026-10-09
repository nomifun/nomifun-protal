"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Icon from "@/components/Icon";
import { useLocale } from "@/components/i18n/LocaleProvider";
import {
  createMobileWorkGeometry,
  getMobileWorkMotionState,
  getWorkMotionState,
  WORK_STEP_STOPS,
} from "@/lib/behaviors/work-choreography";

const steps = [
  {
    title: "把目标，放进队列。",
    titleEn: "Give your goal\na place to begin.",
    name: "登记需求",
    nameEn: "Define",
    label: "01 / REQUIREMENT",
    icon: "ChatsCircle",
    description:
      "目标、资料与验收条件，放在同一个需求里。你给方向，工作从这里开始。",
    descriptionEn:
      "Keep the goal, resources and acceptance criteria in one requirement. You set the direction. Work starts here.",
    status: "待执行",
    statusEn: "Queued",
    note: "用标签组织队列，让下一件事清晰可见。",
    noteEn: "Organize with tags. Keep the next task in sight.",
  },
  {
    title: "有人认领，\n事情就开始了。",
    titleEn: "A task is claimed.\nWork begins.",
    name: "自动认领",
    nameEn: "Claim",
    label: "02 / CLAIM",
    icon: "CheckCircle",
    description:
      "绑定的 Agent 会话按顺序认领下一项需求。持久化执行事实，让队列有序向前。",
    descriptionEn:
      "The assigned Agent session claims the next requirement in order. Persisted execution records keep the queue moving.",
    status: "已认领",
    statusEn: "Claimed",
    note: "队列暂时为空，就安静等待。",
    noteEn: "When the queue is empty, it waits quietly.",
  },
  {
    title: "持续行动，\n直到可以交付。",
    titleEn: "Keep moving.\nMake it deliverable.",
    name: "持续执行",
    nameEn: "Execute",
    label: "03 / EXECUTE",
    icon: "Lightning",
    description:
      "在原会话里理解任务、调用工具、完成检查。IDMM 在旁路值守，处理可恢复故障与安全的决策停顿。",
    descriptionEn:
      "Understand the task, use tools and run checks in the original session. IDMM handles recoverable failures and safe decision pauses alongside it.",
    status: "执行中",
    statusEn: "Running",
    note: "真实工作留在主 Agent 会话，结果有据可查。",
    noteEn: "Work stays in the main Agent session, with traceable results.",
  },
  {
    title: "每一步，\n都有结果和回执。",
    titleEn: "Every step.\nA result, a receipt.",
    name: "验收与回执",
    nameEn: "Verify",
    label: "04 / RECEIPT",
    icon: "ShieldCheck",
    description:
      "记录产出、检查结果与执行回执，再推进队列。你设定的验收标准，始终跟着任务一起走。",
    descriptionEn:
      "Record deliverables, check results and an execution receipt before advancing. Your acceptance criteria stay with the task.",
    status: "已完成",
    statusEn: "Completed",
    note: "交付可检查，工作才有可靠的下一步。",
    noteEn: "Verifiable delivery makes the next step reliable.",
  },
  {
    title: "下一次进步，\n回到新的起点。",
    titleEn: "Let each result\nstart something new.",
    name: "授权提需",
    nameEn: "Continue",
    label: "05 / CONTINUE",
    icon: "ArrowsClockwise",
    description:
      "授予需求写入能力后，Agent 可按你的指令提交后续需求。让结果带出新目标，形成可控的工作循环。",
    descriptionEn:
      "With permission to write requirements, the Agent can submit follow-up work as instructed. Turn results into new goals in a controlled loop.",
    status: "新需求",
    statusEn: "New requirement",
    note: "持续工作，也始终遵循你的授权。",
    noteEn: "Continuous work, always within your authorization.",
  },
];
const stopPoints = WORK_STEP_STOPS;

function RequirementScene() {
  const { t } = useLocale();
  return (
    <div className="wm-requirement-scene">
      <div className="wm-queue-shadow shadow-one" />
      <div className="wm-queue-shadow shadow-two" />
      <div className="wm-request-paper">
        <div className="wm-paper-top">
          <Icon name="ChatsCircle" size={24} />
          <span>REQUIREMENT #001</span>
          <i />
        </div>
        <h4>
          {t("让一个想法", "Turn an idea")}
          <br />
          {t("变成可用的工具。", "into a useful tool.")}
        </h4>
        <div className="wm-paper-checks">
          <span>
            <Icon name="Check" size={15} />
            {t("清楚的目标", "A clear goal")}
          </span>
          <span>
            <Icon name="Check" size={15} />
            {t("需要用到的资料", "The right resources")}
          </span>
          <span>
            <Icon name="Check" size={15} />
            {t("可以检验的结果", "A verifiable result")}
          </span>
        </div>
        <div className="wm-paper-tags">
          <span>{t("产品设计", "Product design")}</span>
          <span>{t("本地项目", "Local project")}</span>
          <span>{t("待执行", "Queued")}</span>
        </div>
      </div>
      <div className="wm-queue-chip">
        <span>{t("你的工作队列", "Your work queue")}</span>
        <Icon name="ArrowRight" size={17} />
        <b>01</b>
      </div>
    </div>
  );
}

function ClaimScene() {
  const { t } = useLocale();
  return (
    <div className="wm-claim-scene">
      <div className="wm-claim-orbit orbit-one" />
      <div className="wm-claim-orbit orbit-two" />
      <div className="wm-claim-center">
        <img src="/images/brand/nomifun.svg" alt="" width="60" height="60" />
        <span>YOUR AGENT</span>
      </div>
      <div className="wm-claim-task">
        <Icon name="CheckCircle" size={23} />
        <div>
          <small>CLAIMED</small>
          <strong>{t("交互原型设计", "Interactive prototype")}</strong>
          <span>
            {t("绑定会话 · 继续执行", "Assigned session · Work continues")}
          </span>
        </div>
      </div>
      <div className="wm-claim-queue">
        <i />
        <i />
        <i />
        <span>01 → 02 → 03</span>
      </div>
      <span className="wm-claim-persist">
        <Icon name="Database" size={14} />{" "}
        {t("认领事实，持久化保存", "Claim recorded and persisted")}
      </span>
    </div>
  );
}

function ExecuteScene() {
  const { t } = useLocale();
  return (
    <div className="wm-execute-scene">
      <div className="wm-execution-window">
        <div className="wm-window-head">
          <span>
            <i />
            <i />
            <i />
          </span>
          <small>NomiFun / Agent workspace</small>
        </div>
        <div className="wm-execution-steps">
          <span>
            <Icon name="Compass" size={19} />
            <div>
              <strong>{t("理解目标与上下文", "Understand the goal")}</strong>
              <small>
                {t(
                  "梳理需求、资料与实现边界",
                  "Review context, resources and scope",
                )}
              </small>
            </div>
            <Icon name="Check" size={16} />
          </span>
          <span>
            <Icon name="Code" size={19} />
            <div>
              <strong>{t("推进实现", "Build it")}</strong>
              <small>
                {t(
                  "工具、代码与本地工作空间",
                  "Tools, code and your local workspace",
                )}
              </small>
            </div>
            <Icon name="Check" size={16} />
          </span>
          <span className="wm-running-step">
            <Icon name="ShieldCheck" size={19} />
            <div>
              <strong>{t("检查并整理交付", "Check and deliver")}</strong>
              <small>
                {t("让结果可以被验证", "Make the result verifiable")}
              </small>
            </div>
            <i />
          </span>
        </div>
        <div className="wm-terminal-line">
          <b>→</b> moving the work forward
          <span />
        </div>
      </div>
      <div className="wm-idmm-orbit">
        <Icon name="Sparkle" size={21} />
        <strong>IDMM</strong>
        <span>{t("旁路决策", "Sidecar decisions")}</span>
        <i />
      </div>
    </div>
  );
}

function ReceiptScene({ expanded, onToggle }) {
  const { t } = useLocale();
  return (
    <div className={`wm-receipt-scene ${expanded ? "is-expanded" : ""}`}>
      <div className="wm-receipt-paper">
        <div className="wm-receipt-seal">
          <Icon name="Check" size={38} />
        </div>
        <small>WORK RECEIPT / #001</small>
        <h4>{t("完成，可以检验。", "Done. Ready to verify.")}</h4>
        <div className="wm-receipt-row">
          <span>{t("交互原型", "Prototype")}</span>
          <strong>{t("已交付", "Delivered")}</strong>
        </div>
        <div className="wm-receipt-row">
          <span>{t("本地检查", "Local checks")}</span>
          <strong>{t("已记录", "Recorded")}</strong>
        </div>
        <div className="wm-receipt-row">
          <span>{t("执行事实", "Execution record")}</span>
          <strong>{t("已归档", "Archived")}</strong>
        </div>
        <button type="button" onClick={onToggle} aria-expanded={expanded}>
          <span>
            {expanded
              ? t("收起回执详情", "Hide receipt details")
              : t("展开回执详情", "View receipt details")}
          </span>
          <Icon name={expanded ? "CaretDown" : "ArrowUpRight"} size={17} />
        </button>
        {expanded && (
          <p className="wm-receipt-detail">
            {t(
              "演示回执：产出、检查和执行记录一起保留。真实任务是否通过验收，取决于你设定的条件。",
              "Demo receipt: deliverables, checks and execution records stay together. Your criteria determine whether a real task passes acceptance.",
            )}
          </p>
        )}
      </div>
      <span className="wm-receipt-tab">CHECK. RECORD. CONTINUE.</span>
    </div>
  );
}

function ContinueScene({ authorized, onToggle }) {
  const { t } = useLocale();
  return (
    <div className={`wm-continue-scene ${authorized ? "is-authorized" : ""}`}>
      <svg viewBox="0 0 390 300" aria-hidden="true">
        <circle
          cx="195"
          cy="146"
          r="109"
          fill="none"
          stroke="#625b6d"
          strokeWidth="1"
        />
        <path
          className="wm-loop-path"
          d="M195 37A109 109 0 0 1 289 201M195 255A109 109 0 0 1 101 91"
          fill="none"
          stroke="#d2bddf"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M276 196L290 205L294 188M115 97L101 88L97 105"
          fill="none"
          stroke="#d2bddf"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
      <div className="wm-loop-center">
        <Icon name="ArrowsClockwise" size={48} />
        <span>THE NEXT POSSIBILITY</span>
      </div>
      <div className="wm-loop-note note-result">
        <Icon name="CheckCircle" size={20} />
        <span>{t("这次交付", "This delivery")}</span>
      </div>
      <div className="wm-loop-note note-next">
        <Icon name={authorized ? "Plus" : "LockKey"} size={20} />
        <span>
          {authorized
            ? t("新需求已写入示意队列", "Added to the demo queue")
            : t("等待你的授权", "Awaiting your permission")}
        </span>
      </div>
      <button
        className="wm-loop-permission"
        type="button"
        aria-pressed={authorized}
        onClick={onToggle}
      >
        <span className={`wm-permission-toggle ${authorized ? "is-on" : ""}`}>
          <i />
        </span>
        <span>
          {authorized
            ? t("需求写入已授权", "Requirement writing allowed")
            : t("试试授权需求写入", "Try allowing requirement writing")}
        </span>
      </button>
    </div>
  );
}

export default function WorkLoop() {
  const { locale, t } = useLocale();
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [decision, setDecision] = useState("rule");
  const [receiptExpanded, setReceiptExpanded] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [narrow, setNarrow] = useState(false);
  const [inView, setInView] = useState(false);
  const reading = reduced;
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const stickyRef = useRef(null);
  const navigationRef = useRef(null);
  const scrollRef = useRef(null);
  const mobileGeometryRef = useRef(null);
  const mobileClockRef = useRef(null);
  const stepRef = useRef(0);
  stepRef.current = step;

  useEffect(() => {
    if (narrow) return;
    const navigation = navigationRef.current;
    const active = navigation?.querySelector('[aria-pressed="true"]');
    if (
      !navigation ||
      !active ||
      navigation.scrollWidth <= navigation.clientWidth
    )
      return;
    const container = navigation.getBoundingClientRect();
    const button = active.getBoundingClientRect();
    const offset =
      button.left < container.left
        ? button.left - container.left
        : button.right > container.right
          ? button.right - container.right
          : 0;
    if (offset)
      navigation.scrollTo({
        left: navigation.scrollLeft + offset,
        behavior: reduced ? "auto" : "smooth",
      });
  }, [step, reduced, narrow, locale]);

  useEffect(() => {
    const panels = Array.from(
      sectionRef.current?.querySelectorAll(".wm-card-visual") || [],
    );
    const updateScrollRegions = () => {
      panels.forEach((panel) => {
        const scrollable = /^(auto|scroll)$/.test(
          window.getComputedStyle(panel).overflowY,
        );
        const overflowing =
          !reading && scrollable && panel.scrollHeight > panel.clientHeight + 2;
        panel.toggleAttribute("data-lenis-prevent", overflowing);
        if (overflowing) panel.setAttribute("tabindex", "0");
        else panel.removeAttribute("tabindex");
      });
    };
    const observer = new ResizeObserver(updateScrollRegions);
    panels.forEach((panel) => {
      observer.observe(panel);
      if (panel.firstElementChild) observer.observe(panel.firstElementChild);
    });
    updateScrollRegions();
    return () => {
      observer.disconnect();
      panels.forEach((panel) => {
        panel.removeAttribute("data-lenis-prevent");
        panel.removeAttribute("tabindex");
      });
    };
  }, [locale, reading]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const layout = window.matchMedia("(max-width: 1000px)");
    const update = () => setReduced(media.matches);
    const updateLayout = () => {
      setNarrow(layout.matches);
    };
    update();
    updateLayout();
    media.addEventListener("change", update);
    layout.addEventListener("change", updateLayout);
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.1 },
    );
    observer.observe(stickyRef.current);
    return () => {
      media.removeEventListener("change", update);
      layout.removeEventListener("change", updateLayout);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!reading) return;
    const cards = Array.from(
      trackRef.current?.querySelectorAll(".wm-step-card") || [],
    );
    let frame = null;
    const update = () => {
      frame = null;
      // Follow the card being read, even when a receipt expands or the viewport
      // changes. Natural-height cards do not share the desktop rail intervals.
      const anchor = Math.min(window.innerHeight * 0.3, 200);
      let current = 0;
      cards.forEach((card, index) => {
        if (card.getBoundingClientRect().top <= anchor) current = index;
      });
      setStep(current);
    };
    const schedule = () => {
      if (frame === null) frame = window.requestAnimationFrame(update);
    };
    let layoutFrame = null;
    const observer = new ResizeObserver(() => {
      schedule();
      if (layoutFrame === null)
        layoutFrame = requestAnimationFrame(() => {
          layoutFrame = null;
          window.dispatchEvent(new Event("portal:layout"));
        });
    });
    cards.forEach((card) => observer.observe(card));
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    schedule();
    return () => {
      if (frame !== null) window.cancelAnimationFrame(frame);
      if (layoutFrame !== null) window.cancelAnimationFrame(layoutFrame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [reading, locale]);

  useEffect(() => {
    if (
      !narrow ||
      reduced ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    gsap.registerPlugin(ScrollTrigger);
    let alive = true;
    let layoutFrame = null;
    const track = trackRef.current;
    const sticky = stickyRef.current;
    const stage = track.querySelector(".wm-card-stage");
    const rail = track.querySelector(".wm-cards-rail");
    const cards = [...track.querySelectorAll(".wm-step-card")];
    const underlay = track.querySelector(".wm-underlay");
    const previousHeight = track.style.height;
    let geometry;
    let trigger;
    const clock = { progress: 0 };
    const measure = () => {
      geometry = createMobileWorkGeometry({
        width: sticky.clientWidth,
        height: sticky.clientHeight,
        stageHeight: stage.clientHeight,
        cardWidth: cards[0].offsetWidth,
        cardHeights: cards.map((card) => card.offsetHeight),
      });
      mobileGeometryRef.current = geometry;
      track.style.height = `${geometry.totalDistance + sticky.clientHeight}px`;
    };
    measure();
    mobileClockRef.current = clock;
    const context = gsap.context(() => {
      // Explicitly capture every axis so breakpoint/reduced-motion cleanup
      // restores natural cards, including after a partially read tall ticket.
      gsap.set(rail, { x: 0, force3D: true });
      gsap.set(cards, {
        x: 0,
        y: 0,
        scaleX: 1,
        scaleY: 1,
        rotation: 0,
        transformOrigin: "100% 100%",
        force3D: true,
      });
      gsap.set(underlay, { opacity: 1, scaleX: 1, scaleY: 1 });
      const moveRail = gsap.quickSetter(rail, "x", "px");
      const moveX = cards.map((card) => gsap.quickSetter(card, "x", "px"));
      const moveY = cards.map((card) => gsap.quickSetter(card, "y", "px"));
      const scaleX = gsap.quickSetter(cards[0], "scaleX");
      const scaleY = gsap.quickSetter(cards[0], "scaleY");
      const rotate = gsap.quickSetter(cards[0], "rotation", "deg");
      const fadeUnderlay = gsap.quickSetter(underlay, "opacity");
      const scaleUnderlayX = gsap.quickSetter(underlay, "scaleX");
      const scaleUnderlayY = gsap.quickSetter(underlay, "scaleY");
      let renderedStep = stepRef.current;
      const render = () => {
        if (!alive) return;
        const state = getMobileWorkMotionState(clock.progress, geometry);
        moveRail(state.railX);
        cards.forEach((card, index) => {
          moveX[index](index === 0 ? state.firstX : state.followingX);
          moveY[index](index === 0 ? state.firstY : state.cardY[index]);
        });
        scaleX(state.firstScale);
        scaleY(state.firstScale);
        rotate(state.firstRotation);
        fadeUnderlay(state.underlayOpacity);
        scaleUnderlayX(state.underlayScale);
        scaleUnderlayY(state.underlayScale);
        if (state.step !== renderedStep) {
          renderedStep = state.step;
          setStep(state.step);
        }
      };
      render();
      const animation = gsap.fromTo(
        clock,
        { progress: 0 },
        {
          progress: 1,
          ease: "none",
          onUpdate: render,
          scrollTrigger: {
            trigger: track,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.2,
            invalidateOnRefresh: true,
            onRefreshInit: measure,
            onRefresh: (self) => {
              trigger = self;
              scrollRef.current = self;
              render();
            },
          },
        },
      );
      trigger = animation.scrollTrigger;
      scrollRef.current = trigger;
    }, sectionRef);
    const scheduleLayout = () => {
      if (!alive || layoutFrame !== null) return;
      layoutFrame = requestAnimationFrame(() => {
        layoutFrame = null;
        if (!alive) return;
        // ResizeObserver includes receipt expansion and late font metrics.
        // Update the page distance before all neighboring triggers refresh.
        measure();
        window.dispatchEvent(new Event("portal:layout"));
      });
    };
    const observer = new ResizeObserver(scheduleLayout);
    cards.forEach((card) => observer.observe(card));
    observer.observe(stage);
    window.addEventListener("resize", scheduleLayout);
    document.fonts?.ready.then(scheduleLayout);
    scheduleLayout();
    return () => {
      alive = false;
      if (layoutFrame !== null) cancelAnimationFrame(layoutFrame);
      observer.disconnect();
      window.removeEventListener("resize", scheduleLayout);
      scrollRef.current = null;
      mobileGeometryRef.current = null;
      mobileClockRef.current = null;
      context.revert();
      gsap.set([rail, ...cards, underlay], {
        clearProps: "transform,transformOrigin,opacity",
      });
      track.style.height = previousHeight;
    };
  }, [narrow, reduced, locale]);

  useEffect(() => {
    if (
      reading ||
      window.matchMedia("(max-width: 1000px)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    gsap.registerPlugin(ScrollTrigger);
    let alive = true;
    const surfaces = sectionRef.current.querySelectorAll(
      ".wm-cards-rail,.wm-step-card,.wm-underlay",
    );
    const context = gsap.context(() => {
      const track = trackRef.current;
      const rail = track.querySelector(".wm-cards-rail");
      const cards = [...track.querySelectorAll(".wm-step-card")];
      const underlay = track.querySelector(".wm-underlay");
      const measure = () => ({
        width: stickyRef.current.clientWidth,
        height: stickyRef.current.clientHeight,
        cardWidth: cards[0].offsetWidth,
      });
      let geometry = measure();
      let renderedStep = stepRef.current;
      const clock = { progress: 0 };
      // Capture the original inline styles inside the GSAP context so reduced
      // motion, route changes and Strict Mode restore all moving surfaces.
      gsap.set(rail, { x: 0, force3D: true });
      gsap.set(cards[0], {
        x: 0,
        y: 0,
        scaleX: 1,
        scaleY: 1,
        rotation: 0,
        transformOrigin: "100% 100%",
        force3D: true,
      });
      gsap.set(cards.slice(1), { x: 0, force3D: true });
      gsap.set(underlay, {
        opacity: 1,
        scaleX: 1,
        scaleY: 1,
        force3D: true,
      });
      const moveRail = gsap.quickSetter(rail, "x", "px");
      const moveFirstX = gsap.quickSetter(cards[0], "x", "px");
      const moveFirstY = gsap.quickSetter(cards[0], "y", "px");
      // quickSetter does not expand the CSSPlugin "scale" alias into both
      // cache axes. Set each axis explicitly so the rendered matrix matches
      // the same pose used by navigation and the pure geometry checks.
      const scaleFirstX = gsap.quickSetter(cards[0], "scaleX");
      const scaleFirstY = gsap.quickSetter(cards[0], "scaleY");
      const rotateFirst = gsap.quickSetter(cards[0], "rotation", "deg");
      const revealFollowing = gsap.quickSetter(cards.slice(1), "x", "px");
      const fadeUnderlay = gsap.quickSetter(underlay, "opacity");
      const scaleUnderlayX = gsap.quickSetter(underlay, "scaleX");
      const scaleUnderlayY = gsap.quickSetter(underlay, "scaleY");
      const render = () => {
        // Reverting the scrubbed clock can run onUpdate. It must not write a
        // desktop pose back onto a phone layout while the context is destroyed.
        if (!alive) return;
        const state = getWorkMotionState(clock.progress, geometry);
        moveFirstX(state.firstX);
        moveFirstY(state.firstY);
        scaleFirstX(state.firstScale);
        scaleFirstY(state.firstScale);
        rotateFirst(state.firstRotation);
        moveRail(state.railX);
        revealFollowing(state.followingX);
        fadeUnderlay(state.underlayOpacity);
        scaleUnderlayX(state.underlayScale);
        scaleUnderlayY(state.underlayScale);
        // The active control follows the rendered scrubbed clock, rather than
        // jumping ahead using the raw scroll position while the card catches up.
        if (state.step !== renderedStep) {
          renderedStep = state.step;
          setStep(state.step);
        }
      };
      render();
      const animation = gsap.fromTo(
        clock,
        { progress: 0 },
        {
          progress: 1,
          duration: 1,
          ease: "none",
          onUpdate: render,
          scrollTrigger: {
            trigger: track,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.35,
            invalidateOnRefresh: true,
            onRefreshInit: () => {
              geometry = measure();
            },
            onRefresh: (self) => {
              scrollRef.current = self;
              geometry = measure();
              render();
            },
          },
        },
      );
      scrollRef.current = animation.scrollTrigger;
    }, sectionRef);
    const resize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", resize);
    return () => {
      alive = false;
      window.removeEventListener("resize", resize);
      scrollRef.current = null;
      context.revert();
      gsap.set(surfaces, { clearProps: "transform,transformOrigin,opacity" });
    };
  }, [reading, narrow, locale]);

  const goTo = useCallback(
    (index) => {
      const bounded = Math.min(steps.length - 1, Math.max(0, index));
      const trigger = scrollRef.current;
      if (!trigger || reading) {
        setStep(bounded);
        const card =
          trackRef.current?.querySelectorAll(".wm-step-card")[bounded];
        if (!card) return;
        const margin =
          parseFloat(window.getComputedStyle(card).scrollMarginTop) || 0;
        const target =
          window.scrollY + card.getBoundingClientRect().top - margin;
        if (window.lenis?.scrollTo && !reduced)
          window.lenis.scrollTo(target, { duration: 0.8 });
        else
          window.scrollTo({
            top: target,
            behavior: reduced ? "auto" : "smooth",
          });
        return;
      }
      const stops = mobileGeometryRef.current?.stops || stopPoints;
      const target =
        trigger.start + stops[bounded] * (trigger.end - trigger.start);
      if (window.lenis?.scrollTo)
        window.lenis.scrollTo(target, { duration: 1.1 });
      else window.scrollTo({ top: target, behavior: "smooth" });
    },
    [reduced, reading],
  );

  useEffect(() => {
    if (!playing || !inView || reduced) return;
    const timer = window.setInterval(
      () => {
        if (document.hidden) return;
        const geometry = mobileGeometryRef.current;
        const clock = mobileClockRef.current;
        const trigger = scrollRef.current;
        if (geometry && clock && trigger) {
          const current = geometry.stages[stepRef.current];
          const distance = clock.progress * geometry.totalDistance;
          // A tall ticket is read fully before autoplay changes the rail. The
          // animation moves the page itself, so touching the art never traps it.
          if (distance < current.readEnd - 2) {
            const target =
              trigger.start +
              (current.readEnd / geometry.totalDistance) *
                (trigger.end - trigger.start);
            if (window.lenis?.scrollTo)
              window.lenis.scrollTo(target, { duration: 2.2 });
            else window.scrollTo({ top: target, behavior: "smooth" });
            return;
          }
        }
        if (stepRef.current >= steps.length - 1) {
          setPlaying(false);
          return;
        }
        goTo(stepRef.current + 1);
      },
      narrow ? 3400 : 2800,
    );
    return () => window.clearInterval(timer);
  }, [playing, inView, narrow, reduced, goTo]);

  const scenes = [
    <RequirementScene key="requirement" />,
    <ClaimScene key="claim" />,
    <ExecuteScene key="execute" />,
    <ReceiptScene
      key="receipt"
      expanded={receiptExpanded}
      onToggle={() => setReceiptExpanded((value) => !value)}
    />,
    <ContinueScene
      key="continue"
      authorized={authorized}
      onToggle={() => setAuthorized((value) => !value)}
    />,
  ];

  return (
    <section
      ref={sectionRef}
      className={`work-motion-section ${reduced ? "is-reduced" : ""} ${narrow ? "is-narrow" : ""}`}
      id="work"
      aria-labelledby="work-heading"
    >
      <div className="wm-track" ref={trackRef}>
        <div className="wm-sticky" ref={stickyRef}>
          <div className="wm-underlay">
            <span className="eyebrow">KEEP THE WORK MOVING</span>
            <h2 id="work-heading">
              {t("你给方向。", "You set the direction.")}
              <br />
              <span>{t("让工作持续向前。", "Keep the work moving.")}</span>
            </h2>
            <p>
              {t(
                "需求平台 + AutoWork + IDMM",
                "Requirements + AutoWork + IDMM",
              )}
              <br />
              {t(
                "从一个目标，到一条持续推进的工作循环。",
                "From one goal to a continuous work loop.",
              )}
            </p>
            <span className="wm-scroll-invitation">
              <Icon name="ArrowDown" size={16} />{" "}
              {t("向下，走进下一步", "Scroll to take the next step")}
            </span>
          </div>
          <div className="wm-sticky-top">
            <span>THE WORK CONTINUES.</span>
            <small>
              {t(
                "官网工作流演示 · 不执行真实任务",
                "Website workflow demo · No real tasks run",
              )}
            </small>
          </div>
          <div className="wm-card-stage">
            <div className="wm-cards-rail">
              {steps.map((item, index) => (
                <article
                  key={item.label}
                  className={`wm-step-card wm-card-${index + 1} ${step === index ? "is-current" : ""}`}
                  inert={!reading && step !== index}
                  aria-label={t(item.name, item.nameEn)}
                >
                  <div className="wm-card-top">
                    <span>{item.label}</span>
                    <Icon name={item.icon} size={26} />
                  </div>
                  <div className="wm-card-copy">
                    <h3>{t(item.title, item.titleEn)}</h3>
                    <p>{t(item.description, item.descriptionEn)}</p>
                  </div>
                  <div
                    className="wm-card-visual"
                    role="region"
                    aria-label={t(`${item.name}演示`, `${item.nameEn} demo`)}
                  >
                    {scenes[index]}
                  </div>
                  <div className="wm-card-bottom">
                    <span>
                      <i />
                      {t(item.status, item.statusEn)}
                    </span>
                    <p>{t(item.note, item.noteEn)}</p>
                    {index < 4 && (
                      <button
                        type="button"
                        onClick={() => {
                          setPlaying(false);
                          goTo(index + 1);
                        }}
                        aria-label={t(
                          `进入${steps[index + 1].name}`,
                          `Go to ${steps[index + 1].nameEn}`,
                        )}
                      >
                        <Icon name="ArrowRight" size={22} />
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
          <div className="wm-dock">
            <div
              className="wm-step-navigation"
              ref={navigationRef}
              role="group"
              aria-label={t("查看工作循环阶段", "Explore the work loop stages")}
            >
              {steps.map((item, index) => (
                <button
                  type="button"
                  key={item.label}
                  aria-pressed={step === index}
                  onClick={() => {
                    setPlaying(false);
                    goTo(index);
                  }}
                >
                  <span>0{index + 1}</span>
                  <strong>{t(item.name, item.nameEn)}</strong>
                </button>
              ))}
            </div>
            {!reduced && (
              <button
                type="button"
                className="wm-play-control"
                aria-pressed={playing}
                aria-label={
                  playing
                    ? t("暂停工作流演示", "Pause the workflow demo")
                    : t("播放工作流演示", "Play the workflow demo")
                }
                onClick={() => {
                  if (!playing && step === 4) goTo(0);
                  setPlaying((value) => !value);
                }}
              >
                <Icon name={playing ? "Pause" : "Play"} size={16} />
                <span>{playing ? t("暂停", "Pause") : t("演示", "Play")}</span>
              </button>
            )}
          </div>
          <div className="wm-scroll-progress" aria-hidden="true">
            <span style={{ width: `${((step + 1) / steps.length) * 100}%` }} />
          </div>
        </div>
      </div>

      <div className="wm-decision-section container">
        <div className="wm-decision-intro">
          <p className="eyebrow">INTELLIGENCE, IN THE RIGHT PLACE.</p>
          <h3>
            {t("工作在前进。", "Work moves forward.")}
            <br />
            <span>
              {t("决策不必每次都问模型。", "Not every decision needs a model.")}
            </span>
          </h3>
          <p>
            {t(
              "IDMM 在主任务旁路处理执行策略。",
              "IDMM handles execution strategy alongside the main task.",
            )}
            <br />
            {t(
              "让确定的事情直接发生，把判断用在需要的地方。",
              "Use rules for clear choices. Call for judgment when needed.",
            )}
          </p>
        </div>
        <div className="wm-decision-card">
          <div className="wm-decision-title">
            <span>
              <Icon name="Sparkle" size={25} />
            </span>
            <div>
              <small>INTELLIGENT DECISION</small>
              <h4>{t("IDMM 智能决策", "IDMM decisions")}</h4>
            </div>
          </div>
          <div
            className="wm-decision-switch"
            role="group"
            aria-label={t("IDMM 值守策略示意", "Explore demo IDMM strategies")}
          >
            <button
              type="button"
              aria-pressed={decision === "rule"}
              onClick={() => setDecision("rule")}
            >
              {t("规则值守", "Rules")}
            </button>
            <button
              type="button"
              aria-pressed={decision === "model"}
              onClick={() => setDecision("model")}
            >
              {t("规则 + 旁路模型", "Rules + sidecar model")}
            </button>
          </div>
          <div className="wm-decision-result" aria-live="polite">
            <span
              key={decision}
              className={
                decision === "model" ? "wm-decision-demand" : undefined
              }
            >
              {decision === "rule" ? "0" : t("按需", "As needed")}
              <small>
                {decision === "rule"
                  ? t("模型 token / 规则判断", "Model tokens / rule decision")
                  : t("调用旁路模型", "Sidecar model calls")}
              </small>
            </span>
            <p>
              {decision === "rule"
                ? t(
                    "可恢复故障与明确的安全选项，先由确定性规则处理。主任务调用模型仍按实际使用计费。",
                    "Deterministic rules handle recoverable failures and clear, safe options first. Model calls for the main task are still billed by usage.",
                  )
                : t(
                    "规则无法安全判断时，才把受限上下文交给旁路模型，使用必要的模型 token。",
                    "Only when rules cannot decide safely does a sidecar model receive limited context, using the tokens needed for that judgment.",
                  )}
            </p>
          </div>
          <div className="wm-decision-boundary">
            <Icon name="LockKey" size={16} />
            <span>
              {t(
                "权限、凭据、付款与破坏性决定，等待人工。",
                "Permissions, credentials, payments and destructive decisions wait for a person.",
              )}
            </span>
          </div>
        </div>
      </div>
      <div className="wm-continuity container">
        <span className="wm-time">
          7<span>×</span>24
        </span>
        <div>
          <strong>
            {t("为持续工作而设计。", "Designed for continuous work.")}
          </strong>
          <p>
            {t(
              "队列空闲等待，后端启动时恢复已启用的执行循环。",
              "Idle queues wait. Enabled work loops resume when the backend starts.",
            )}
          </p>
        </div>
        <p className="wm-continuity-note">
          {t(
            "需保持电脑和应用运行、模型服务可用。",
            "Keep the computer and app running, with model services available.",
          )}
          <br />
          {t(
            "任务可能因审批、故障或设定上限暂停。",
            "Approvals, errors or configured limits may pause tasks.",
          )}
        </p>
      </div>
    </section>
  );
}
