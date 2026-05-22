import { ArrowUpRight } from "lucide-react";

import { siteConfig } from "@/lib/site";

const titleChars = [...siteConfig.name];

export function HeroSection() {
  return (
    <section
      data-hero
      className="relative mb-14 min-h-[min(52vh,420px)] space-y-6 pt-6 sm:mb-16 sm:pt-10"
    >
      <div
        data-hero-glow
        className="pointer-events-none absolute -top-8 left-0 h-32 w-32 rounded-full bg-accent-brand/30 blur-3xl"
        aria-hidden
      />

      <p
        data-hero-label
        className="inline-flex w-fit items-center gap-2 rounded-full border border-accent-brand/30 bg-accent-brand/10 px-3 py-1 font-mono text-sm text-accent-brand"
      >
        <span
          data-hero-label-dot
          className="size-2 rounded-full bg-accent-brand"
          aria-hidden
        />
        {siteConfig.tagline}
      </p>

      <h1 className="max-w-4xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl xl:text-6xl">
        <span data-hero-title className="inline-flex flex-wrap gap-y-1">
          {titleChars.map((char, index) => (
            <span
              key={`${char}-${index}`}
              data-hero-char
              className="inline-block origin-bottom will-change-transform"
              style={{ perspective: "600px" }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </span>
      </h1>

      <p
        data-hero-desc
        className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg"
      >
        {siteConfig.description}
      </p>

      <div data-hero-cta className="flex flex-wrap items-center gap-4 pt-2">
        <a
          href={siteConfig.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          data-hero-cta-btn
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-lg shadow-accent-brand/25"
        >
          GitHub
          <ArrowUpRight className="size-4" aria-hidden />
        </a>
        <a
          href="#assets"
          data-hero-cta-btn
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-6 py-3 text-sm font-medium text-foreground backdrop-blur-sm"
        >
          浏览全部资产
        </a>
      </div>
    </section>
  );
}
