import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// A tall mobile perspective gets a measured reading distance before the next
// perspective enters. The page moves the stage; the panel never scrolls.
function initNaturalLiquidStage(track, { count, initialIndex, onSelect }) {
  const stage = track.querySelector("[data-liquid-stage]");
  const viewport = track.querySelector("[data-liquid-viewport]");
  const mesh = track.querySelector("[data-liquid-mesh]");
  const indicator = track.querySelector("[data-liquid-indicator]");
  const tabs = [...track.querySelectorAll("[data-liquid-tab]")];
  const panels = [...track.querySelectorAll("[data-liquid-panel]")];
  const top = stage?.querySelector(".developer-liquid-stage-top");
  const bottom = stage?.querySelector(".developer-liquid-stage-bottom");
  if (!stage || !viewport) return { goTo() {}, destroy() {} };

  let alive = true;
  let active = -1;
  let trigger;
  let refreshFrame;
  let navigationTimer;
  let pendingIndex = null;
  let navigationTop = null;
  let segments = [];
  let growDistance = 0;
  let distance = 0;
  let viewportHeight = 0;
  let measurement = "";
  const originalViewportHeight = viewport.style.height;
  const originalTrackHeight = track.style.getPropertyValue(
    "--liquid-track-height",
  );
  const clamp = (value) => Math.max(0, Math.min(1, value));
  track.setAttribute("data-liquid-mobile-motion", "");
  panels.forEach((panel) => panel.removeAttribute("data-lenis-prevent"));

  const positionIndicator = (index, animate = true) => {
    const button = tabs[index];
    if (!button || !indicator) return;
    const values = {
      x: button.offsetLeft,
      y: button.offsetTop,
      width: button.offsetWidth,
      height: button.offsetHeight,
    };
    if (animate)
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
    if (active === index) return;
    active = index;
    // Apply the class before measuring the stage. React mirrors it for ARIA
    // and inert, while the hidden perspectives remain available for sizing.
    panels.forEach((panel, panelIndex) =>
      panel.classList.toggle("is-active", panelIndex === index),
    );
    track.dataset.activePerspective = String(index);
    onSelect?.(index);
    positionIndicator(index, animate);
    if (!mesh) return;
    const target = { x: -(5200 / count) * index };
    if (animate)
      gsap.to(mesh, {
        ...target,
        duration: 0.85,
        ease: "power2.out",
        overwrite: true,
      });
    else gsap.set(mesh, target);
  };

  const measure = () => {
    // Leave the reading dock clear at the bottom, including its safe area.
    // Short viewports receive a longer page journey, never smaller diagrams.
    const nextViewportHeight = Math.max(1, window.innerHeight - 128);
    const activePanel = panels.find((panel) =>
      panel.classList.contains("is-active"),
    );
    const overhead = stage.offsetHeight - (activePanel?.offsetHeight ?? 0);
    const heights = panels.map((panel) => panel.offsetHeight + overhead);
    const signature = JSON.stringify([
      window.innerWidth,
      nextViewportHeight,
      ...heights,
    ]);
    if (signature === measurement) return false;
    measurement = signature;
    viewportHeight = nextViewportHeight;
    viewport.style.height = `${viewportHeight}px`;
    growDistance = viewportHeight * 0.4;
    let cursor = growDistance;
    segments = heights.map((height, index) => {
      const readDistance = Math.max(0, height - viewportHeight);
      const topHold = viewportHeight * 0.28;
      const bottomHold = viewportHeight * 0.24;
      const segment = {
        index,
        height,
        readDistance,
        topHold,
        start: cursor,
        end: cursor + topHold + readDistance + bottomHold,
      };
      cursor = segment.end;
      return segment;
    });
    distance = cursor;
    track.style.setProperty(
      "--liquid-track-height",
      `${viewportHeight + distance}px`,
    );
    track.dataset.liquidSegments = JSON.stringify(segments);
    track.dataset.liquidViewportHeight = String(viewportHeight);
    return true;
  };

  const indexAt = (offset) =>
    segments.find((segment) => offset < segment.end)?.index ?? count - 1;

  const paint = (progress) => {
    const offset = progress * distance;
    const index = pendingIndex ?? indexAt(offset);
    select(index);
    const segment = segments[index];
    const reading =
      pendingIndex !== null || !segment
        ? 0
        : Math.max(
            0,
            Math.min(
              segment.readDistance,
              offset - segment.start - segment.topHold,
            ),
          );
    const growth = clamp(offset / Math.max(1, growDistance));
    // Reveal more of the colored frame without reflowing or shrinking text.
    // Its content keeps its final reading width throughout the expansion.
    const inset = 8 * (1 - growth);
    gsap.set(stage, {
      y: -reading,
      clipPath: `inset(0 ${inset}px round ${32 - 8 * growth}px)`,
      "--liquid-growth": growth,
    });
    track.dataset.liquidReadOffset = String(reading);
  };

  gsap.registerPlugin(ScrollTrigger);
  const context = gsap.context(() => {
    select(initialIndex, false);
    measure();
    trigger = ScrollTrigger.create({
      trigger: track,
      start: "top 24px",
      end: () => `+=${distance}`,
      invalidateOnRefresh: true,
      onUpdate(self) {
        paint(self.progress);
      },
      onRefresh(self) {
        paint(self.progress);
        positionIndicator(Math.max(active, 0), false);
      },
    });
    paint(trigger.progress);
  }, track);

  const refresh = () => {
    if (!alive) return;
    cancelAnimationFrame(refreshFrame);
    refreshFrame = requestAnimationFrame(() => {
      if (!alive) return;
      const changed = measure();
      if (changed) {
        trigger.refresh();
        if (pendingIndex !== null) navigateTo(pendingIndex, 0.45);
        window.dispatchEvent(new Event("portal:layout"));
      }
      positionIndicator(Math.max(active, 0), false);
      paint(trigger.progress);
    });
  };
  const observer = new ResizeObserver(refresh);
  panels.forEach((panel) => observer.observe(panel));
  if (top) observer.observe(top);
  if (bottom) observer.observe(bottom);
  window.addEventListener("resize", refresh, { passive: true });
  document.fonts?.ready.then(refresh);
  // Notify other page stages once, after this track has acquired its budget.
  window.dispatchEvent(new Event("portal:layout"));

  const releaseNavigation = () => {
    clearTimeout(navigationTimer);
    pendingIndex = null;
    navigationTop = null;
    if (alive) paint(trigger.progress);
  };
  const finishNavigation = () => {
    if (navigationTop !== null && Math.abs(window.scrollY - navigationTop) > 4)
      return;
    releaseNavigation();
  };
  const interruptNavigation = () => {
    if (pendingIndex !== null) releaseNavigation();
  };
  const keyNavigation = (event) => {
    if (event.defaultPrevented) return;
    if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", " "].includes(event.key))
      interruptNavigation();
  };
  window.addEventListener("wheel", interruptNavigation, { passive: true });
  window.addEventListener("touchstart", interruptNavigation, { passive: true });
  window.addEventListener("keydown", keyNavigation);
  window.addEventListener("scrollend", finishNavigation);

  function navigateTo(index, duration = 1.05) {
    clearTimeout(navigationTimer);
    const segment = segments[index];
    // Select the opening pause, never the middle of a tall perspective.
    const destination = trigger.start + segment.start + segment.topHold * 0.1;
    navigationTop = destination;
    if (window.lenis)
      window.lenis.scrollTo(destination, {
        duration,
        onComplete: finishNavigation,
      });
    else window.scrollTo({ top: destination, behavior: "smooth" });
    navigationTimer = window.setTimeout(
      releaseNavigation,
      duration * 1000 + 450,
    );
  }

  return {
    goTo(index) {
      if (!alive) return;
      index = Math.max(0, Math.min(count - 1, index));
      pendingIndex = index;
      select(index);
      paint(trigger.progress);
      navigateTo(index);
    },
    destroy() {
      if (!alive) return;
      alive = false;
      if (pendingIndex !== null) {
        if (window.lenis)
          window.lenis.scrollTo(window.scrollY, { immediate: true });
        else window.scrollTo({ top: window.scrollY, behavior: "instant" });
      }
      cancelAnimationFrame(refreshFrame);
      clearTimeout(navigationTimer);
      observer.disconnect();
      window.removeEventListener("resize", refresh);
      window.removeEventListener("wheel", interruptNavigation);
      window.removeEventListener("touchstart", interruptNavigation);
      window.removeEventListener("keydown", keyNavigation);
      window.removeEventListener("scrollend", finishNavigation);
      trigger.kill();
      gsap.killTweensOf([mesh, indicator].filter(Boolean));
      context.revert();
      viewport.style.height = originalViewportHeight;
      if (originalTrackHeight)
        track.style.setProperty("--liquid-track-height", originalTrackHeight);
      else track.style.removeProperty("--liquid-track-height");
      track.removeAttribute("data-liquid-mobile-motion");
      delete track.dataset.activePerspective;
      delete track.dataset.liquidSegments;
      delete track.dataset.liquidViewportHeight;
      delete track.dataset.liquidReadOffset;
    },
  };
}

// NomiFun's expanding capability stage with scoped lifecycle and live sizing.
// The first 22% grows the room; the remaining 78% belongs to four perspectives.
export function initLiquidStage(
  track,
  { count = 4, reduced = false, natural = false, initialIndex = 0, onSelect },
) {
  if (!track) return { goTo() {}, destroy() {} };
  if (natural && !reduced)
    return initNaturalLiquidStage(track, { count, initialIndex, onSelect });
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
      // Natural-height mobile panels belong to the page. Only a genuinely
      // scrollable desktop fallback may own native wheel gestures.
      const scrollable =
        !reduced &&
        !natural &&
        /^(auto|scroll)$/.test(window.getComputedStyle(panel).overflowY) &&
        panel.scrollHeight > panel.clientHeight + 2;
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
    if (!stage || reduced || natural) return;
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
    select(initialIndex, false);
    if (reduced || natural) return;
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
      if (natural || reduced) window.dispatchEvent(new Event("portal:layout"));
    });
  };
  const layoutObserver = new ResizeObserver(refresh);
  if (natural || reduced) layoutObserver.observe(track);
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
    if (event.defaultPrevented) return;
    if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", " "].includes(event.key))
      interruptNavigation();
  };
  if (!reduced && !natural) {
    window.addEventListener("wheel", interruptNavigation, { passive: true });
    window.addEventListener("touchstart", interruptNavigation, {
      passive: true,
    });
    window.addEventListener("keydown", keyNavigation);
    window.addEventListener("scrollend", finishNavigation);
  }

  return {
    goTo(index) {
      if (!alive) return;
      index = Math.max(0, Math.min(count - 1, index));
      clearTimeout(navigationTimer);
      pendingIndex = reduced || natural ? null : index;
      select(index);
      if (reduced) {
        panels[index]?.scrollIntoView({ block: "start", behavior: "instant" });
        return;
      }
      if (natural) return;
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
      if (!alive) return;
      alive = false;
      cancelAnimationFrame(resizeFrame);
      layoutObserver.disconnect();
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
