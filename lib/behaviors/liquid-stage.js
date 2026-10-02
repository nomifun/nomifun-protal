import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// NomiFun's expanding capability stage with scoped lifecycle and live sizing.
// The first 22% grows the room; the remaining 78% belongs to four perspectives.
export function initLiquidStage(
  track,
  { count = 4, reduced = false, onSelect },
) {
  if (!track) return { goTo() {}, destroy() {} };
  const stage = track.querySelector("[data-liquid-stage]");
  const mesh = track.querySelector("[data-liquid-mesh]");
  const indicator = track.querySelector("[data-liquid-indicator]");
  const tabs = [...track.querySelectorAll("[data-liquid-tab]")];
  const panels = [...track.querySelectorAll("[data-liquid-panel]")];
  let active = -1;
  let trigger;
  let alive = true;
  let resizeFrame;
  let navigationTimer;
  let pendingIndex = null;
  let lastSize = { width: -1, height: -1 };
  const growEnd = 0.22;
  const clamp = (value) => Math.max(0, Math.min(1, value));
  const indexAt = (progress) =>
    progress <= growEnd
      ? 0
      : Math.min(
          count - 1,
          Math.floor(((progress - growEnd) / (1 - growEnd)) * count),
        );

  const updateOverflow = () => {
    panels.forEach((panel) => {
      // Only long panels own native wheel gestures. Unscrollable desktop views
      // must pass wheel input to the page so the four-part story can advance.
      const scrollable =
        !reduced && panel.scrollHeight > panel.clientHeight + 2;
      panel.toggleAttribute("data-lenis-prevent", scrollable);
    });
  };

  const positionIndicator = (index, animate = true) => {
    const button = tabs[index];
    if (!button || !indicator) return;
    const values = {
      x: button.offsetLeft,
      y: button.offsetTop,
      width: button.offsetWidth,
      height: button.offsetHeight,
    };
    if (animate && !reduced)
      gsap.to(indicator, {
        ...values,
        duration: 0.45,
        ease: "power2.out",
        overwrite: true,
      });
    else gsap.set(indicator, values);
  };

  const select = (index, animate = true) => {
    index = Math.max(0, Math.min(count - 1, index));
    if (index === active) return;
    active = index;
    onSelect?.(index);
    track.dataset.activePerspective = String(index);
    positionIndicator(index, animate);
    updateOverflow();
    if (mesh) {
      const target = { x: -(5200 / count) * index };
      if (animate && !reduced)
        gsap.to(mesh, {
          ...target,
          duration: 0.85,
          ease: "power2.out",
          overwrite: true,
        });
      else gsap.set(mesh, target);
    }
  };

  const size = (progress) => {
    if (!stage || reduced) return;
    const desktop = window.innerWidth >= 1400;
    const mobile = window.innerWidth <= 600;
    const outerGap = mobile ? 24 : 48;
    const finalWidth = Math.max(1, window.innerWidth - outerGap);
    const finalHeight = Math.max(1, window.innerHeight - 48);
    const initialWidth = Math.min(desktop ? 1160 : 1040, finalWidth);
    const initialHeight = Math.min(desktop ? 670 : 600, finalHeight);
    const growth = clamp(progress / growEnd);
    const width = initialWidth + (finalWidth - initialWidth) * growth;
    const height = initialHeight + (finalHeight - initialHeight) * growth;
    if (
      Math.abs(lastSize.width - width) < 0.1 &&
      Math.abs(lastSize.height - height) < 0.1
    )
      return;
    lastSize = { width, height };
    gsap.set(stage, {
      width,
      height,
      "--liquid-growth": growth,
    });
    updateOverflow();
  };

  gsap.registerPlugin(ScrollTrigger);
  const context = gsap.context(() => {
    select(0, false);
    if (reduced) return;
    size(0);
    trigger = ScrollTrigger.create({
      trigger: track,
      start: "top top",
      end: "bottom bottom",
      invalidateOnRefresh: true,
      onUpdate(self) {
        size(self.progress);
        // A tab selects a destination immediately. Intermediate scroll frames
        // must not flash back through the perspective the visitor just left.
        select(pendingIndex ?? indexAt(self.progress));
      },
      onRefresh(self) {
        size(self.progress);
        positionIndicator(Math.max(active, 0), false);
      },
    });
  }, track);

  const refresh = () => {
    if (!alive) return;
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(() => {
      if (!alive) return;
      trigger?.refresh();
      size(trigger?.progress ?? 0);
      positionIndicator(Math.max(active, 0), false);
      updateOverflow();
    });
  };
  window.addEventListener("resize", refresh, { passive: true });
  document.fonts?.ready.then(refresh);

  let navigationTop = null;
  const releaseNavigation = () => {
    clearTimeout(navigationTimer);
    pendingIndex = null;
    navigationTop = null;
  };
  const finishNavigation = () => {
    // Lenis writes native scroll positions each frame. Browsers can emit
    // scrollend for one such write before the animated journey is complete.
    if (navigationTop !== null && Math.abs(window.scrollY - navigationTop) > 4)
      return;
    releaseNavigation();
  };
  const interruptNavigation = () => {
    if (pendingIndex === null) return;
    releaseNavigation();
    select(indexAt(trigger?.progress ?? 0));
  };
  const keyNavigation = (event) => {
    if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", " "].includes(event.key))
      interruptNavigation();
  };
  window.addEventListener("wheel", interruptNavigation, { passive: true });
  window.addEventListener("touchstart", interruptNavigation, { passive: true });
  window.addEventListener("keydown", keyNavigation);
  window.addEventListener("scrollend", finishNavigation);

  return {
    goTo(index) {
      clearTimeout(navigationTimer);
      pendingIndex = reduced ? null : index;
      select(index);
      if (reduced) {
        panels[index]?.scrollIntoView({ block: "start", behavior: "instant" });
        return;
      }
      if (!trigger) return;
      const progress = growEnd + ((index + 0.5) / count) * (1 - growEnd);
      const top = trigger.start + progress * (trigger.end - trigger.start);
      navigationTop = top;
      if (window.lenis)
        window.lenis.scrollTo(top, {
          duration: 1.05,
          onComplete: finishNavigation,
        });
      else window.scrollTo({ top, behavior: "smooth" });
      // Native smooth scrolling has no callback on older engines. This is a
      // bounded fallback, while wheel/touch/key input releases ownership early.
      navigationTimer = window.setTimeout(releaseNavigation, 1500);
    },
    destroy() {
      alive = false;
      cancelAnimationFrame(resizeFrame);
      clearTimeout(navigationTimer);
      window.removeEventListener("resize", refresh);
      window.removeEventListener("wheel", interruptNavigation);
      window.removeEventListener("touchstart", interruptNavigation);
      window.removeEventListener("keydown", keyNavigation);
      window.removeEventListener("scrollend", finishNavigation);
      trigger?.kill();
      gsap.killTweensOf([mesh, indicator].filter(Boolean));
      context.revert();
      delete track.dataset.activePerspective;
      panels.forEach((panel) => panel.removeAttribute("data-lenis-prevent"));
    },
  };
}
