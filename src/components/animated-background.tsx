"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import {
  prefersReducedMotion,
  registerGsapPlugins,
} from "@/lib/gsap/register";

export function AnimatedBackground() {
  const bgRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      registerGsapPlugins();
      if (prefersReducedMotion() || !bgRef.current) return;

      const orbs = gsap.utils.toArray<HTMLElement>("[data-bg-orb]", bgRef.current);
      const grid = bgRef.current.querySelector("[data-bg-grid]");

      orbs.forEach((orb, i) => {
        gsap.to(orb, {
          x: gsap.utils.random(-100, 100),
          y: gsap.utils.random(-80, 80),
          scale: gsap.utils.random(0.85, 1.2),
          duration: gsap.utils.random(3.5, 6),
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.4,
        });
      });

      if (grid) {
        gsap.to(grid, {
          backgroundPosition: "48px 96px",
          duration: 20,
          repeat: -1,
          ease: "none",
        });
      }

      gsap.to("[data-bg-orb='primary']", {
        y: 180,
        ease: "none",
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "max",
          scrub: 1.5,
        },
      });

      gsap.to("[data-bg-orb='secondary']", {
        y: -120,
        x: -60,
        ease: "none",
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "max",
          scrub: 2,
        },
      });
    },
    { scope: bgRef },
  );

  return (
    <div
      ref={bgRef}
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      aria-hidden
    >
      <div className="absolute inset-0 bg-background" />
      <div
        data-bg-orb="primary"
        className="absolute -top-[35%] left-1/2 h-[85vmin] w-[95vmin] -translate-x-1/2 rounded-full bg-accent-brand/25 blur-[120px] dark:bg-accent-brand/18"
      />
      <div
        data-bg-orb="secondary"
        className="absolute top-[15%] -right-[15%] h-[55vmin] w-[55vmin] rounded-full bg-accent-brand/15 blur-[90px] dark:bg-accent-brand/12"
      />
      <div
        data-bg-orb
        className="absolute bottom-[10%] -left-[10%] h-[40vmin] w-[40vmin] rounded-full bg-primary/10 blur-[70px]"
      />
      <div
        data-bg-grid
        className="absolute inset-0 opacity-40 dark:opacity-25"
        style={{
          backgroundImage: `
            linear-gradient(to right, var(--border) 1px, transparent 1px),
            linear-gradient(to bottom, var(--border) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
          maskImage:
            "radial-gradient(ellipse 90% 70% at 50% 0%, black 15%, transparent 75%)",
        }}
      />
    </div>
  );
}
