import type { Metadata } from "next";

import { HomeJsonLd } from "@/components/json-ld";
import { ProjectCard } from "@/components/project-card";
import { ToolCard } from "@/components/tool-card";
import { Separator } from "@/components/ui/separator";
import { getProjects, getTools } from "@/lib/data/get-assets";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  alternates: {
    canonical: "/",
  },
};

export default async function HomePage() {
  const [projects, tools] = await Promise.all([getProjects(), getTools()]);

  return (
    <>
      <HomeJsonLd projects={projects} tools={tools} />
      <div className="mx-auto flex min-h-full w-full max-w-6xl flex-col px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-12 space-y-3">
          <p className="font-mono text-sm text-zinc-500">Open Source · Tools</p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {siteConfig.name}
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-zinc-600">
            {siteConfig.description}
          </p>
        </header>

        <main className="flex flex-col gap-14">
          <section aria-labelledby="projects-heading">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <h2
                  id="projects-heading"
                  className="text-2xl font-semibold tracking-tight"
                >
                  项目
                </h2>
                <p className="mt-1 text-sm text-zinc-500">
                  长期维护的开源与应用项目
                </p>
              </div>
              <span className="font-mono text-sm text-zinc-400">
                {projects.length}
              </span>
            </div>
            <Separator className="mb-8" />
            {projects.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-zinc-500">暂无项目</p>
            )}
          </section>

          <section aria-labelledby="tools-heading">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <h2
                  id="tools-heading"
                  className="text-2xl font-semibold tracking-tight"
                >
                  工具
                </h2>
                <p className="mt-1 text-sm text-zinc-500">
                  为解决具体问题而编写的 CLI 与小工具
                </p>
              </div>
              <span className="font-mono text-sm text-zinc-400">
                {tools.length}
              </span>
            </div>
            <Separator className="mb-8" />
            {tools.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {tools.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-zinc-500">暂无工具</p>
            )}
          </section>
        </main>

        <footer className="mt-16 border-t border-zinc-200 pt-8 text-center text-sm text-zinc-500">
          <p>数据来自 data/projects.json · 静态构建，便于收录与部署</p>
        </footer>
      </div>
    </>
  );
}
