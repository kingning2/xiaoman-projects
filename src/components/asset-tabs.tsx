"use client";

import { Children, useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { ProjectCard } from "@/components/project-card";
import { ToolCard } from "@/components/tool-card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  prefersReducedMotion,
  registerGsapPlugins,
} from "@/lib/gsap/register";
import { cn } from "@/lib/utils";
import type { Project, Tool } from "@/lib/types/asset";

type AssetTabsProps = {
  projects: Project[];
  tools: Tool[];
};

function AssetGrid({
  emptyLabel,
  children,
}: {
  emptyLabel: string;
  children: React.ReactNode;
}) {
  const items = Children.toArray(children);

  if (items.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-muted-foreground">
        {emptyLabel}
      </p>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items}
    </div>
  );
}

export function AssetTabs({ projects, tools }: AssetTabsProps) {
  const [activeTab, setActiveTab] = useState("projects");
  const rootRef = useRef<HTMLDivElement>(null);
  const projectsPanelRef = useRef<HTMLDivElement>(null);
  const toolsPanelRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const tabListRef = useRef<HTMLDivElement>(null);

  const moveIndicator = () => {
    const activeTrigger = tabListRef.current?.querySelector<HTMLElement>(
      "[data-active]",
    );
    const indicator = indicatorRef.current;
    if (!activeTrigger || !indicator || !tabListRef.current) return;

    const listRect = tabListRef.current.getBoundingClientRect();
    const tabRect = activeTrigger.getBoundingClientRect();
    gsap.to(indicator, {
      x: tabRect.left - listRect.left,
      width: tabRect.width,
      duration: 0.5,
      ease: "power3.inOut",
    });
  };

  useGSAP(
    () => {
      registerGsapPlugins();
      moveIndicator();

      if (prefersReducedMotion()) return;

      const panel =
        activeTab === "projects"
          ? projectsPanelRef.current
          : toolsPanelRef.current;
      if (!panel) return;

      gsap.fromTo(
        panel,
        { opacity: 0, y: 50, scale: 0.92, filter: "blur(8px)" },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.65,
          ease: "power3.out",
        },
      );
    },
    { dependencies: [activeTab], scope: rootRef },
  );

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      moveIndicator();
    });
    return () => cancelAnimationFrame(id);
  }, [activeTab]);

  return (
    <div ref={rootRef} className="w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div data-reveal className="mb-8">
          <h2 className="text-lg font-semibold tracking-tight">全部资产</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            按类型浏览项目与工具
          </p>
        </div>

        <div ref={tabListRef} className="relative mb-8 border-b border-border">
          <span
            ref={indicatorRef}
            className="pointer-events-none absolute bottom-0 left-0 z-10 h-0.5 rounded-full bg-accent-brand"
            style={{ width: 0 }}
            aria-hidden
          />
          <TabsList
            variant="line"
            className="relative h-auto w-full justify-start gap-1 bg-transparent p-0 [&_[data-active]]:after:!opacity-0"
          >
            <TabsTrigger
              value="projects"
              className="rounded-none px-4 py-2.5 data-active:text-foreground"
            >
              项目
              <span className="ml-1.5 font-mono text-xs text-muted-foreground tabular-nums">
                {projects.length}
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="tools"
              className="rounded-none px-4 py-2.5 data-active:text-foreground"
            >
              工具
              <span className="ml-1.5 font-mono text-xs text-muted-foreground tabular-nums">
                {tools.length}
              </span>
            </TabsTrigger>
          </TabsList>
        </div>
      </Tabs>

      <div
        ref={projectsPanelRef}
        className={cn(activeTab !== "projects" && "hidden")}
        role="tabpanel"
        hidden={activeTab !== "projects"}
      >
        <p className="mb-6 text-sm text-muted-foreground">
          长期维护的开源与应用项目 · 点击卡片打开 GitHub
        </p>
        <AssetGrid emptyLabel="暂无项目">
          {projects.map((project) => (
            <div key={project.id} data-reveal-item>
              <ProjectCard project={project} />
            </div>
          ))}
        </AssetGrid>
      </div>

      <div
        ref={toolsPanelRef}
        className={cn(activeTab !== "tools" && "hidden")}
        role="tabpanel"
        hidden={activeTab !== "tools"}
      >
        <p className="mb-6 text-sm text-muted-foreground">
          为解决具体问题而编写的 CLI 与小工具 · 点击卡片打开 GitHub
        </p>
        <AssetGrid emptyLabel="暂无工具">
          {tools.map((tool) => (
            <div key={tool.id} data-reveal-item>
              <ToolCard tool={tool} />
            </div>
          ))}
        </AssetGrid>
      </div>
    </div>
  );
}
