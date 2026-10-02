import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// NomiFun's interactive graphic feedback uses disposable listeners and frames.
export function initMicroMotion() {
  const dispose = [];
  const fine = window.matchMedia(
    "(pointer: fine) and (min-width: 768px)",
  ).matches;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) return () => {};
  const listen = (target, type, fn, options) => {
    target.addEventListener(type, fn, options);
    dispose.push(() => target.removeEventListener(type, fn, options));
  };
  const ctx = gsap.context(() => {
    if (fine) {
      document
        .querySelectorAll(
          ".button,.header-download,.footer-source,[data-magnetic]",
        )
        .forEach((button) => {
          if (button.matches("[data-liquid-tab]")) return;
          const inner = button.querySelector(".button-motion-inner");
          const x = gsap.quickTo(button, "x", {
              duration: 0.55,
              ease: "power3.out",
            }),
            y = gsap.quickTo(button, "y", {
              duration: 0.55,
              ease: "power3.out",
            });
          const ix = inner
            ? gsap.quickTo(inner, "x", { duration: 0.45, ease: "power3.out" })
            : null;
          listen(button, "pointermove", (e) => {
            const r = button.getBoundingClientRect();
            const nx = (e.clientX - r.left) / r.width - 0.5,
              ny = (e.clientY - r.top) / r.height - 0.5;
            x(nx * 20);
            y(ny * 16);
            ix?.(nx * 24);
          });
          listen(button, "pointerleave", () => {
            x(0);
            y(0);
            ix?.(0);
          });
        });
      document
        .querySelectorAll(".ecosystem-row,.blog-card,.download-family-grid>a")
        .forEach((card) => {
          const visual =
            card.querySelector(".ecosystem-symbol,.blog-art") || card;
          listen(card, "pointermove", (e) => {
            const r = card.getBoundingClientRect();
            gsap.to(visual, {
              rotationY: ((e.clientX - r.left) / r.width - 0.5) * 8,
              rotationX: -((e.clientY - r.top) / r.height - 0.5) * 6,
              duration: 0.45,
              ease: "power2.out",
              overwrite: true,
              transformPerspective: 900,
            });
          });
          listen(card, "pointerleave", () =>
            gsap.to(visual, {
              rotationX: 0,
              rotationY: 0,
              duration: 0.5,
              ease: "power2.out",
            }),
          );
        });
    }
    // Half-round reveal masks, message staging, and picture-mask entrances.
    document.querySelectorAll("[data-motion-mask]").forEach((el) =>
      gsap.fromTo(
        el,
        { clipPath: "inset(0 0 100% 0 round 0 0 50% 50%)" },
        {
          clipPath: "inset(0 0 0% 0 round 0 0 0% 0%)",
          duration: 1.1,
          ease: "power3.inOut",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        },
      ),
    );
    document.querySelectorAll(".relay-card").forEach((card) => {
      const messages = card.querySelectorAll(".relay-user,.relay-response");
      const tl = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 2.4 });
      tl.fromTo(
        messages,
        { y: 20, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.3,
          stagger: 0.75,
          ease: "power2.out",
        },
        0,
      ).to(messages, { autoAlpha: 0, duration: 0.25 }, 4.4);
      ScrollTrigger.create({
        trigger: card,
        start: "top 80%",
        end: "bottom top",
        onEnter: () => tl.play(),
        onEnterBack: () => tl.play(),
        onLeave: () => tl.pause(),
        onLeaveBack: () => tl.pause(),
      });
    });
    document.querySelectorAll(".blog-card").forEach((card) => {
      const body = card.querySelector(".blog-card-body");
      if (!body) return;
      listen(card, "pointerenter", () =>
        gsap.to(body, { y: -18, duration: 0.4, ease: "power3.out" }),
      );
      listen(card, "pointerleave", () =>
        gsap.to(body, { y: 0, duration: 0.3, ease: "power2.out" }),
      );
    });
  });
  document.querySelectorAll(".download-card").forEach((card) => {
    const graphic = card.querySelector(".platform-mark");
    if (!graphic) return;
    listen(card, "pointerenter", () =>
      gsap.to(graphic, {
        y: 70,
        rotation: -7,
        duration: 0.3,
        ease: "power2.out",
      }),
    );
    listen(card, "pointerleave", () =>
      gsap.to(graphic, {
        y: 0,
        rotation: 0,
        duration: 0.3,
        ease: "power2.out",
      }),
    );
    dispose.push(() => gsap.killTweensOf(graphic));
  });
  return () => {
    dispose.reverse().forEach((fn) => fn());
    ctx.revert();
  };
}
