"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { initLenis } from "@/lib/behaviors/lenis";
import { initMicroMotion } from "@/lib/behaviors/micro-motion";
import useReducedMotion from "@/components/motion/useReducedMotion";
export default function Behaviors() {
  const pathname = usePathname();
  const reducedSetting = useReducedMotion();
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const destroyLenis = reduced ? () => {} : initLenis();
    const destroyMicro = initMicroMotion();
    const ctx = gsap.context(() => {
      if (reduced) return;
      gsap.utils.toArray("[data-reveal]").forEach((el) =>
        gsap.from(el, {
          y: el.querySelector("button, input, select, textarea") ? 0 : 28,
          opacity: 0,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 93%", once: true },
        }),
      );
      gsap.utils.toArray("[data-parallax]").forEach((el) =>
        gsap.to(el, {
          y: -45,
          ease: "none",
          scrollTrigger: {
            trigger: el.parentElement,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
          },
        }),
      );
    });
    const t = setTimeout(() => ScrollTrigger.refresh(), 500);
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    window.addEventListener("portal:layout", onLoad);
    return () => {
      clearTimeout(t);
      window.removeEventListener("load", onLoad);
      window.removeEventListener("portal:layout", onLoad);
      destroyMicro();
      ctx.revert();
      destroyLenis();
    };
  }, [pathname, reducedSetting]);
  return null;
}
