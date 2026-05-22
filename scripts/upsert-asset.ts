/**
 * Upsert one project/tool entry into data/projects.json.
 * Usage: bun scripts/upsert-asset.ts '<json>'
 *    or: echo '<json>' | bun scripts/upsert-asset.ts
 */

import { readFileSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import type { Asset, ProjectsFile, Tool } from "../src/lib/types/asset";

const DATA_PATH = path.join(process.cwd(), "data", "projects.json");

type UpsertPayload = {
  id: string;
  type: "project" | "tool";
  name: string;
  description: string;
  githubUrl: string;
  tags: string[];
  updatedAt?: string;
  problemSolved?: string;
};

function fail(message: string): never {
  console.error(`[upsert-asset] ${message}`);
  process.exit(1);
}

function parsePayload(raw: string): UpsertPayload {
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    fail("Invalid JSON input");
  }

  if (!data || typeof data !== "object") {
    fail("Payload must be a JSON object");
  }

  const p = data as Record<string, unknown>;

  // Auth field for repository_dispatch; never stored in projects.json
  delete p.registerKey;

  if (typeof p.id !== "string" || !p.id.trim()) fail("id is required");
  if (p.type !== "project" && p.type !== "tool") {
    fail('type must be "project" or "tool"');
  }
  if (typeof p.name !== "string" || !p.name.trim()) fail("name is required");
  if (typeof p.description !== "string" || !p.description.trim()) {
    fail("description is required");
  }
  if (typeof p.githubUrl !== "string" || !p.githubUrl.startsWith("https://")) {
    fail("githubUrl must be a valid https URL");
  }
  if (!Array.isArray(p.tags) || p.tags.some((t) => typeof t !== "string")) {
    fail("tags must be an array of strings");
  }
  if (
    p.type === "tool" &&
    (typeof p.problemSolved !== "string" || !p.problemSolved.trim())
  ) {
    fail("problemSolved is required when type is tool");
  }

  const updatedAt =
    typeof p.updatedAt === "string" && p.updatedAt
      ? p.updatedAt.slice(0, 10)
      : new Date().toISOString().slice(0, 10);

  return {
    id: p.id.trim(),
    type: p.type,
    name: p.name.trim(),
    description: p.description.trim(),
    githubUrl: p.githubUrl.trim(),
    tags: p.tags.map((t) => String(t).trim()).filter(Boolean),
    updatedAt,
    problemSolved:
      p.type === "tool" ? String(p.problemSolved).trim() : undefined,
  };
}

function toAsset(payload: UpsertPayload): Asset {
  const base = {
    id: payload.id,
    name: payload.name,
    description: payload.description,
    githubUrl: payload.githubUrl,
    tags: payload.tags,
    updatedAt: payload.updatedAt!,
  };

  if (payload.type === "tool") {
    return {
      ...base,
      type: "tool",
      problemSolved: payload.problemSolved!,
    } satisfies Tool;
  }

  return { ...base, type: "project" };
}

async function main() {
  const raw =
    process.argv[2] ?? (process.stdin.isTTY ? "" : readFileSync(0, "utf-8")).trim();

  if (!raw) {
    fail('Missing JSON payload. Example: bun scripts/upsert-asset.ts \'{"id":"my-app",...}\'');
  }

  const payload = parsePayload(raw);
  const asset = toAsset(payload);

  const fileRaw = await readFile(DATA_PATH, "utf-8");
  const file = JSON.parse(fileRaw) as ProjectsFile;

  if (!Array.isArray(file.items)) {
    fail("projects.json: items must be an array");
  }

  const index = file.items.findIndex((item) => item.id === asset.id);
  if (index >= 0) {
    file.items[index] = asset;
    console.log(`Updated asset: ${asset.id}`);
  } else {
    file.items.push(asset);
    console.log(`Added asset: ${asset.id}`);
  }

  file.items.sort(
    (a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );

  await writeFile(DATA_PATH, `${JSON.stringify(file, null, 2)}\n`, "utf-8");
}

main();
