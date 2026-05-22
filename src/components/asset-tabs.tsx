"use client";

import { Children, useState } from "react";

import { ProjectCard } from "@/components/project-card";
import { ToolCard } from "@/components/tool-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Project, Tool } from "@/lib/types/asset";

type AssetTabsProps = {
  projects: Project[];
  tools: Tool[];
};

function AnimatedGrid({
  tabKey,
  emptyLabel,
  children,
}: {
  tabKey: string;
  emptyLabel: string;
  children: React.ReactNode;
}) {
  const items = Children.toArray(children);

  if (items.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-zinc-500">{emptyLabel}</p>
    );
  }

  return (
    <div key={tabKey} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((child, index) => (
        <div
          key={tabKey + String(index)}
          className="animate-in fade-in slide-in-from-bottom-4 fill-mode-both duration-500"
          style={{ animationDelay: `${index * 60}ms` }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}

export function AssetTabs({ projects, tools }: AssetTabsProps) {
  const [activeTab, setActiveTab] = useState("projects");

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList
        variant="line"
        className="mb-8 h-auto w-full justify-start gap-1 border-b border-zinc-200 bg-transparent p-0"
      >
        <TabsTrigger
          value="projects"
          className="rounded-none px-4 py-2.5 data-active:after:bg-zinc-900"
        >
          项目
          <span className="ml-1.5 font-mono text-xs text-zinc-400 tabular-nums">
            {projects.length}
          </span>
        </TabsTrigger>
        <TabsTrigger
          value="tools"
          className="rounded-none px-4 py-2.5 data-active:after:bg-zinc-900"
        >
          工具
          <span className="ml-1.5 font-mono text-xs text-zinc-400 tabular-nums">
            {tools.length}
          </span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="projects" className="mt-0 outline-none">
        <p className="mb-6 text-sm text-zinc-500">
          长期维护的开源与应用项目 · 点击卡片打开 GitHub
        </p>
        <AnimatedGrid
          tabKey={`projects-${activeTab}`}
          emptyLabel="暂无项目"
        >
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </AnimatedGrid>
      </TabsContent>

      <TabsContent value="tools" className="mt-0 outline-none">
        <p className="mb-6 text-sm text-zinc-500">
          为解决具体问题而编写的 CLI 与小工具 · 点击卡片打开 GitHub
        </p>
        <AnimatedGrid tabKey={`tools-${activeTab}`} emptyLabel="暂无工具">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </AnimatedGrid>
      </TabsContent>
    </Tabs>
  );
}
