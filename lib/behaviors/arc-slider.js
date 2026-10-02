// NomiFun's curved ecosystem carousel and magnetic drag badge.
// Cards rotate around an actual shared circle (CSS origin: 50% 360%).
export function circularDistance(index, current, total) {
  if (!total) return 0;
  return index - (current - Math.round((current - index) / total) * total);
}

export function arcPlacement(index, current, total, angleStep = 21) {
  const distance = circularDistance(index, current, total);
  const absolute = Math.abs(distance);
  return {
    distance,
    rotation: distance * angleStep,
    scale: Math.max(0.75, 1 - absolute * 0.04),
    opacity:
      absolute > 2.6
        ? 0
        : absolute > 1.8
          ? Math.max(0, 1 - (absolute - 1.8) * 1.25)
          : 1,
  };
}

export function initArcSlider(stage, { onChange = () => {} } = {}) {
  if (!stage) return null;
  const cards = Array.from(stage.querySelectorAll("[data-arc-card]"));
  const badge = stage.querySelector("[data-arc-badge]");
  if (!cards.length) return null;
  const count = cards.length;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const normalize = (value) => ((value % count) + count) % count;
  let position = 0,
    target = 0,
    snap = null,
    gesture = null;
  let frame = 0,
    destroyed = false,
    inView = true,
    lastActive = -1;
  let suppressClickUntil = 0,
    previousFrame = 0;
  let cursor = {
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    shown: false,
    interactive: false,
  };
  let lastClient = null;

  function render() {
    const active = normalize(Math.round(position));
    const angleStep = window.innerWidth <= 768 ? 20 : 21;
    cards.forEach((card, index) => {
      const placement = arcPlacement(index, position, count, angleStep);
      const front = index === active;
      card.style.transform = `translateX(-50%) rotate(${placement.rotation.toFixed(3)}deg) scale(${placement.scale.toFixed(4)})`;
      card.style.opacity = placement.opacity.toFixed(3);
      card.style.zIndex = String(
        Math.round(50 - Math.abs(placement.distance) * 10),
      );
      card.style.visibility = placement.opacity > 0 ? "visible" : "hidden";
      card.classList.toggle("is-active", front);
      card.dataset.status = front
        ? "active"
        : Math.abs(placement.distance) < 2
          ? "inview"
          : "not-active";
      card.setAttribute("aria-hidden", String(!front));
      card.querySelectorAll("a, button").forEach((link) => {
        link.tabIndex = front ? 0 : -1;
      });
    });
    if (active !== lastActive) {
      lastActive = active;
      onChange(active);
    }
  }

  function isRunning() {
    return inView && !document.hidden && !destroyed;
  }
  function requestFrame() {
    if (!frame && isRunning()) frame = requestAnimationFrame(tick);
  }
  function hideBadge() {
    cursor.shown = false;
    if (badge) {
      badge.style.opacity = "0";
      badge.style.transform = "translate(-50%, -50%) scale(0.6)";
    }
  }
  function paintBadge() {
    if (!badge || !cursor.shown || !finePointer.matches || reduced.matches)
      return;
    badge.style.left = `${cursor.x.toFixed(1)}px`;
    badge.style.top = `${cursor.y.toFixed(1)}px`;
    badge.style.opacity = cursor.interactive ? "0.15" : "1";
    badge.style.transform = `translate(-50%, -50%) scale(${cursor.interactive ? 0.7 : gesture ? 0.88 : 1})`;
  }
  function tick(now) {
    frame = 0;
    if (!isRunning()) return;
    const dt = previousFrame ? Math.min(48, now - previousFrame) : 16.67;
    previousFrame = now;
    const lerp = 1 - Math.pow(1 - 0.16, dt / 16.67);
    cursor.x += (cursor.targetX - cursor.x) * lerp;
    cursor.y += (cursor.targetY - cursor.y) * lerp;
    paintBadge();
    if (snap && !gesture) {
      const progress = Math.min(1, (now - snap.time) / 950);
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      position = snap.start + (target - snap.start) * eased;
      if (progress === 1 || Math.abs(target - position) < 0.0008) {
        position = target;
        snap = null;
      }
      render();
    }
    if (
      snap ||
      (cursor.shown &&
        (Math.abs(cursor.x - cursor.targetX) > 0.2 ||
          Math.abs(cursor.y - cursor.targetY) > 0.2))
    )
      requestFrame();
  }

  function snapTo(destination) {
    target = destination;
    if (reduced.matches || !isRunning()) {
      position = target;
      snap = null;
      render();
      return;
    }
    snap = { start: position, time: performance.now() };
    requestFrame();
  }
  function goTo(index) {
    if (gesture) return;
    snapTo(position + circularDistance(normalize(index), position, count));
  }
  function step(direction) {
    if (!gesture) snapTo(Math.round(snap ? target : position) + direction);
  }

  function updateCursor(event) {
    if (event.pointerType && event.pointerType !== "mouse") {
      hideBadge();
      return;
    }
    if (!finePointer.matches || reduced.matches) {
      hideBadge();
      return;
    }
    const rect = stage.getBoundingClientRect();
    const wasShown = cursor.shown;
    lastClient = { x: event.clientX, y: event.clientY };
    cursor.targetX = event.clientX - rect.left;
    cursor.targetY = event.clientY - rect.top;
    cursor.shown =
      !!gesture ||
      (cursor.targetX >= 0 &&
        cursor.targetX <= rect.width &&
        cursor.targetY >= 0 &&
        cursor.targetY <= rect.height);
    cursor.interactive = Boolean(
      event.target?.closest?.("a,button,input,select"),
    );
    if (!cursor.shown) {
      hideBadge();
      return;
    }
    if (!wasShown) {
      cursor.x = cursor.targetX;
      cursor.y = cursor.targetY;
    }
    paintBadge();
    requestFrame();
  }
  function onDown(event) {
    if (
      !event.isPrimary ||
      event.button !== 0 ||
      gesture ||
      event.target.closest("a,button,input,select")
    )
      return;
    updateCursor(event);
    const now = performance.now();
    gesture = {
      id: event.pointerId,
      startX: event.clientX,
      startPosition: position,
      width: cards[0].offsetWidth || 620,
      lastX: event.clientX,
      lastTime: now,
      velocities: [],
      moved: false,
      pressedCard: event.target.closest("[data-arc-card]"),
    };
    snap = null;
    stage.dataset.dragStatus = "grabbing";
    stage.setPointerCapture(event.pointerId);
    paintBadge();
  }
  function onMove(event) {
    updateCursor(event);
    if (!gesture || gesture.id !== event.pointerId) return;
    const delta = event.clientX - gesture.startX;
    if (Math.abs(delta) > 5) gesture.moved = true;
    position = gesture.startPosition - delta / gesture.width;
    target = position;
    const now = performance.now(),
      elapsed = now - gesture.lastTime;
    if (elapsed > 8) {
      gesture.velocities.push((gesture.lastX - event.clientX) / elapsed);
      if (gesture.velocities.length > 5) gesture.velocities.shift();
      gesture.lastX = event.clientX;
      gesture.lastTime = now;
    }
    render();
  }
  function finish(event, cancelled = false) {
    if (!gesture || (event && gesture.id !== event.pointerId)) return;
    const released = gesture;
    gesture = null; // lostpointercapture may fire synchronously on release.
    stage.dataset.dragStatus = "grab";
    if (released.moved) suppressClickUntil = performance.now() + 350;
    const velocities =
      cancelled || performance.now() - released.lastTime > 120
        ? []
        : released.velocities;
    const average = velocities.length
      ? velocities.reduce((sum, velocity) => sum + velocity, 0) /
        velocities.length
      : 0;
    // Pointer capture retargets the eventual click to the stage in some browsers.
    // Preserve a stationary click on a side card before releasing the capture.
    if (!cancelled && !released.moved && released.pressedCard)
      goTo(Number(released.pressedCard.dataset.arcCard));
    else snapTo(Math.round(position + (average * 180) / released.width));
    if (stage.hasPointerCapture(released.id))
      stage.releasePointerCapture(released.id);
    paintBadge();
    if (!cursor.shown) hideBadge();
  }
  function onUp(event) {
    finish(event);
  }
  function onCancel(event) {
    finish(event, true);
  }
  function onClick(event) {
    if (performance.now() < suppressClickUntil) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    const card = event.target.closest("[data-arc-card]");
    if (!card || !stage.contains(card)) return;
    const index = Number(card.dataset.arcCard);
    if (index === lastActive && event.target.closest("a,button")) return;
    event.preventDefault();
    goTo(index);
  }
  function onKey(event) {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key))
      stage.focus?.({ preventScroll: true });
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      step(-1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      step(1);
    }
    if (event.key === "Home") {
      event.preventDefault();
      goTo(0);
    }
    if (event.key === "End") {
      event.preventDefault();
      goTo(count - 1);
    }
  }
  function onLeave() {
    if (!gesture) hideBadge();
  }
  function onScroll() {
    if (!lastClient || gesture) return;
    const under = document.elementFromPoint(lastClient.x, lastClient.y);
    if (!under || !stage.contains(under)) hideBadge();
    else
      updateCursor({
        clientX: lastClient.x,
        clientY: lastClient.y,
        target: under,
      });
  }
  function pause() {
    stage.dataset.motionPaused = String(!isRunning());
    if (!isRunning()) {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      previousFrame = 0;
      finish(null, true);
      if (snap) {
        position = target;
        snap = null;
        render();
      }
      hideBadge();
    } else requestFrame();
  }
  function onMotionPreference() {
    if (!finePointer.matches) hideBadge();
    if (reduced.matches) {
      hideBadge();
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      previousFrame = 0;
      if (snap) {
        position = target;
        snap = null;
        render();
      }
    }
  }
  const observer =
    "IntersectionObserver" in window
      ? new IntersectionObserver(
          ([entry]) => {
            inView = entry.isIntersecting;
            pause();
          },
          { rootMargin: "120px 0px" },
        )
      : null;
  observer?.observe(stage);
  const events = [
    ["pointerdown", onDown],
    ["pointermove", onMove],
    ["pointerup", onUp],
    ["pointercancel", onCancel],
    ["lostpointercapture", onCancel],
    ["pointerleave", onLeave],
    ["keydown", onKey],
    ["click", onClick, true],
  ];
  events.forEach(([name, handler, options]) =>
    stage.addEventListener(name, handler, options),
  );
  window.addEventListener("resize", render);
  window.addEventListener("scroll", onScroll, { passive: true });
  document.addEventListener("visibilitychange", pause);
  document.addEventListener("mouseleave", onLeave);
  reduced.addEventListener("change", onMotionPreference);
  finePointer.addEventListener("change", onMotionPreference);
  stage.dataset.motionPaused = "false";
  stage.dataset.dragStatus = "grab";
  render();

  return {
    goTo,
    previous: () => step(-1),
    next: () => step(1),
    destroy() {
      destroyed = true;
      if (frame) cancelAnimationFrame(frame);
      observer?.disconnect();
      const captured = gesture?.id;
      gesture = null;
      if (captured !== undefined && stage.hasPointerCapture(captured))
        stage.releasePointerCapture(captured);
      events.forEach(([name, handler, options]) =>
        stage.removeEventListener(name, handler, options),
      );
      window.removeEventListener("resize", render);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", pause);
      document.removeEventListener("mouseleave", onLeave);
      reduced.removeEventListener("change", onMotionPreference);
      finePointer.removeEventListener("change", onMotionPreference);
      hideBadge();
    },
  };
}
