import type { Metadata } from "next";

import { HomeShell } from "@/components/home-shell";
import { HomeJsonLd } from "@/components/json-ld";
import {
  getAllAssets,
  getFeaturedAssets,
  getLatestUpdatedAt,
  getProjects,
  getTools,
} from "@/lib/data/get-assets";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  alternates: {
    canonical: "/",
  },
};

export default async function HomePage() {
  const [projects, tools, featured, allAssets] = await Promise.all([
    getProjects(),
    getTools(),
    getFeaturedAssets(),
    getAllAssets(),
  ]);

  const latestUpdatedAt = getLatestUpdatedAt(allAssets);

  return (
    <>
      <HomeJsonLd projects={projects} tools={tools} />
      <HomeShell
        projects={projects}
        tools={tools}
        featured={featured}
        latestUpdatedAt={latestUpdatedAt}
      />
    </>
  );
}
