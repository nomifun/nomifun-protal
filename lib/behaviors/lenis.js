// Smooth page scrolling stays synchronized with ScrollTrigger animations.
// React owns the lifecycle so route changes do not accumulate animation loops.
import Lenis from "lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";
export function initLenis() {
  const lenis = new Lenis({
    lerp: 0.1,
    smoothWheel: true,
    syncTouch: false,
    anchors: false,
    prevent: (el) => !!el.closest("[data-lenis-prevent]"),
  });
  window.lenis = lenis;
  lenis.on("scroll", ScrollTrigger.update);
  let frame;
  const raf = (time) => {
    lenis.raf(time);
    frame = requestAnimationFrame(raf);
  };
  frame = requestAnimationFrame(raf);
  return () => {
    cancelAnimationFrame(frame);
    lenis.destroy();
    if (window.lenis === lenis) delete window.lenis;
  };
}
