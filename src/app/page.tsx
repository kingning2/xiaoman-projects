import type { Metadata } from "next";

import { AssetTabs } from "@/components/asset-tabs";
import { HomeJsonLd } from "@/components/json-ld";
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
        <header className="mb-10 space-y-3">
          <p className="font-mono text-sm text-zinc-500">Open Source · Tools</p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {siteConfig.name}
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-zinc-600">
            {siteConfig.description}
          </p>
        </header>

        <main>
          <AssetTabs projects={projects} tools={tools} />
        </main>

        <footer className="mt-16 border-t border-zinc-200 pt-8 text-center text-sm text-zinc-500">
          <p>数据来自 data/projects.json · 静态构建，便于收录与部署</p>
        </footer>
      </div>
    </>
  );
}
