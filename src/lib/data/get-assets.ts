import { readFile } from "node:fs/promises";
import path from "node:path";

import type { Asset, Project, ProjectsFile, Tool } from "@/lib/types/asset";

const DATA_PATH = path.join(process.cwd(), "data", "projects.json");

function isProject(asset: Asset): asset is Project {
  return asset.type === "project";
}

function isTool(asset: Asset): asset is Tool {
  return asset.type === "tool";
}

function sortByUpdatedAt<T extends { updatedAt: string }>(items: T[]): T[] {
  return [...items].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
}

export async function getAllAssets(): Promise<Asset[]> {
  try {
    const raw = await readFile(DATA_PATH, "utf-8");
    const data = JSON.parse(raw) as ProjectsFile;

    if (!Array.isArray(data.items)) {
      console.error("[get-assets] projects.json: items must be an array");
      return [];
    }

    return sortByUpdatedAt(data.items);
  } catch (error) {
    console.error("[get-assets] Failed to load projects.json:", error);
    return [];
  }
}

export async function getProjects(): Promise<Project[]> {
  return sortByUpdatedAt((await getAllAssets()).filter(isProject));
}

export async function getTools(): Promise<Tool[]> {
  return sortByUpdatedAt((await getAllAssets()).filter(isTool));
}
