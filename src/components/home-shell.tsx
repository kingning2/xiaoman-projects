"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { AnimatedBackground } from "@/components/animated-background";
import { AssetTabs } from "@/components/asset-tabs";
import { FeaturedSection } from "@/components/featured-section";
import { HeroSection } from "@/components/hero-section";
import { SiteHeader } from "@/components/site-header";
import { StatsBar } from "@/components/stats-bar";
import {
  prefersReducedMotion,
  registerGsapPlugins,
} from "@/lib/gsap/register";
import type { Asset, Project, Tool } from "@/lib/types/asset";

type HomeShellProps = {
  projects: Project[];
  tools: Tool[];
  featured: Asset[];
  latestUpdatedAt: string | null;
};

function setVisible(scope: HTMLElement | null) {
  if (!scope) return;
  gsap.set(scope.querySelectorAll("[data-hero-char], [data-hero-label], [data-hero-desc], [data-hero-cta-btn], [data-reveal], [data-reveal-item], [data-stat-block]"), {
    clearProps: "all",
    opacity: 1,
    y: 0,
    scale: 1,
    rotate: 0,
    rotateX: 0,
    filter: "none",
    clipPath: "none",
  });
}

export function HomeShell({
  projects,
  tools,
  featured,
  latestUpdatedAt,
}: HomeShellProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    (_, contextSafe) => {
      registerGsapPlugins();
      const scope = rootRef.current;
      if (!scope) return;

      if (prefersReducedMotion()) {
        setVisible(scope);
        return;
      }

      const hero = scope.querySelector("[data-hero]");
      const chars = gsap.utils.toArray<HTMLElement>("[data-hero-char]", scope);
      const labelDot = scope.querySelector("[data-hero-label-dot]");

      gsap.set(chars, {
        opacity: 0,
        yPercent: 110,
        rotateX: -80,
        transformOrigin: "50% 100%",
      });
      gsap.set("[data-hero-label], [data-hero-desc], [data-hero-cta-btn]", {
        opacity: 0,
      });
      gsap.set("[data-hero-glow]", { scale: 0, opacity: 0 });

      const heroTl = gsap.timeline({
        defaults: { ease: "power4.out" },
        delay: 0.15,
      });

      heroTl
        .to("[data-hero-glow]", {
          scale: 1,
          opacity: 1,
          duration: 1.2,
          ease: "power2.out",
        })
        .from(
          "[data-hero-label]",
          {
            opacity: 0,
            y: -30,
            scale: 0.6,
            rotate: -8,
            filter: "blur(12px)",
            duration: 0.85,
            ease: "back.out(2)",
          },
          "-=0.7",
        )
        .to(
          labelDot,
          {
            scale: 1.4,
            repeat: 3,
            yoyo: true,
            duration: 0.35,
            ease: "power2.inOut",
          },
          "-=0.4",
        )
        .to(
          chars,
          {
            opacity: 1,
            yPercent: 0,
            rotateX: 0,
            duration: 1,
            stagger: { each: 0.045, from: "start" },
            ease: "power4.out",
          },
          "-=0.5",
        )
        .from(
          "[data-hero-desc]",
          {
            opacity: 0,
            y: 48,
            clipPath: "inset(0 100% 0 0)",
            duration: 0.9,
            ease: "power3.inOut",
          },
          "-=0.35",
        )
        .from(
          "[data-hero-cta-btn]",
          {
            opacity: 0,
            y: 40,
            scale: 0.3,
            stagger: 0.14,
            duration: 0.75,
            ease: "elastic.out(1, 0.55)",
          },
          "-=0.25",
        );

      if (hero) {
        gsap.to(hero, {
          y: -40,
          ease: "none",
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom top",
            scrub: 1.2,
          },
        });
      }

      scope.querySelectorAll<HTMLElement>("[data-stat]").forEach((el) => {
        const raw = el.dataset.statValue;
        const end = raw ? Number.parseInt(raw, 10) : 0;
        if (!Number.isFinite(end)) return;

        const counter = { value: 0 };
        gsap.to(counter, {
          value: end,
          duration: 1.6,
          ease: "expo.out",
          scrollTrigger: {
            trigger: el.closest("[data-reveal]"),
            start: "top 82%",
            once: true,
          },
          onUpdate: () => {
            el.textContent = String(Math.round(counter.value));
          },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-reveal]", scope).forEach((section) => {
        gsap.from(section, {
          opacity: 0,
          y: 120,
          scale: 0.78,
          rotateX: 18,
          transformOrigin: "50% 100%",
          duration: 1.15,
          ease: "power4.out",
          scrollTrigger: {
            trigger: section,
            start: "top 82%",
            once: true,
          },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-stat-block]", scope).forEach((block, i) => {
        gsap.from(block, {
          opacity: 0,
          y: 60,
          scale: 0.4,
          duration: 0.9,
          delay: i * 0.08,
          ease: "back.out(2)",
          scrollTrigger: {
            trigger: block.closest("[data-reveal]"),
            start: "top 82%",
            once: true,
          },
        });
      });

      ScrollTrigger.batch("[data-reveal-item]", {
        interval: 0.08,
        batchMax: 6,
        start: "top 88%",
        once: true,
        onEnter: (batch) => {
          gsap.from(batch, {
            opacity: 0,
            y: 100,
            scale: 0.55,
            rotation: (index) => (index % 2 === 0 ? -6 : 6),
            transformOrigin: "50% 100%",
            stagger: { each: 0.1, from: "start" },
            duration: 0.95,
            ease: "back.out(1.6)",
          });
        },
      });

      const cards = gsap.utils.toArray<HTMLElement>("[data-card-hover]", scope);
      if (!contextSafe) return;

      const onEnter = contextSafe((event: Event) => {
        const card = event.currentTarget as HTMLElement;
        gsap.to(card, {
          y: -16,
          scale: 1.04,
          rotation: 0.8,
          duration: 0.45,
          ease: "back.out(1.7)",
          overwrite: "auto",
        });
        const glow = card.querySelector("[data-card-glow]");
        const arrow = card.querySelector("[data-card-arrow]");
        if (glow) gsap.to(glow, { opacity: 1, scale: 1.05, duration: 0.35 });
        if (arrow) gsap.to(arrow, { x: 6, y: -6, scale: 1.2, duration: 0.35, ease: "back.out(2)" });
      });
      const onLeave = contextSafe((event: Event) => {
        const card = event.currentTarget as HTMLElement;
        gsap.to(card, {
          y: 0,
          scale: 1,
          rotation: 0,
          duration: 0.5,
          ease: "power3.out",
          overwrite: "auto",
        });
        const glow = card.querySelector("[data-card-glow]");
        const arrow = card.querySelector("[data-card-arrow]");
        if (glow) gsap.to(glow, { opacity: 0, scale: 1, duration: 0.4 });
        if (arrow) gsap.to(arrow, { x: 0, y: 0, scale: 1, duration: 0.4 });
      });

      cards.forEach((card) => {
        card.addEventListener("mouseenter", onEnter);
        card.addEventListener("mouseleave", onLeave);
      });

      return () => {
        cards.forEach((card) => {
          card.removeEventListener("mouseenter", onEnter);
          card.removeEventListener("mouseleave", onLeave);
        });
      };
    },
    { scope: rootRef },
  );

  return (
    <div
      ref={rootRef}
      data-motion-root
      className="relative min-h-full [perspective:1200px]"
    >
      <AnimatedBackground />
      <div className="mx-auto flex min-h-full w-full max-w-6xl flex-col px-4 py-8 sm:px-6 lg:px-8">
        <SiteHeader />
        <HeroSection />
        <StatsBar
          projectCount={projects.length}
          toolCount={tools.length}
          latestUpdatedAt={latestUpdatedAt}
        />
        <FeaturedSection items={featured} />
        <main id="assets" className="scroll-mt-8">
          <AssetTabs projects={projects} tools={tools} />
        </main>
        <footer
          data-reveal
          className="mt-16 border-t border-border pt-8 text-center text-sm text-muted-foreground"
        >
          <p>数据来自 data/projects.json · 静态构建，便于收录与部署</p>
        </footer>
      </div>
    </div>
  );
}
