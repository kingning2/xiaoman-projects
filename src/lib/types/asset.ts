/** 项目与工具共用字段 */
export type AssetBase = {
  id: string;
  name: string;
  description: string;
  githubUrl: string;
  tags: string[];
  /** ISO 8601，如 2025-03-15 */
  updatedAt: string;
};

export type Project = AssetBase & {
  type: "project";
};

export type Tool = AssetBase & {
  type: "tool";
  /** 为了解决什么问题 */
  problemSolved: string;
};

export type Asset = Project | Tool;

/** projects.json 根结构 */
export type ProjectsFile = {
  items: Asset[];
};
