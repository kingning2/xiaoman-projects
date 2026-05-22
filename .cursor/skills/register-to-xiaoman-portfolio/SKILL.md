---
name: register-to-xiaoman-portfolio
description: >-
  Registers a GitHub repository to the kingning2/xiaoman-projects portfolio
  (personal project asset library) after deploy via repository_dispatch and
  PORTFOLIO_PAT. Use when the user wants a project on the portfolio site, setup
  register-to-portfolio workflow, PORTFOLIO_PAT secret, sync to
  xiaoman-projects, upsert-asset, or asks how other repos join the asset library.
---

# 注册到 xiaoman-projects 资产库

帮助**当前仓库**（非 xiaoman-projects 本身）在部署成功后，自动把项目/工具信息写入资产库的 `data/projects.json`，并触发站点重新部署。

## 资产库信息

| 项 | 值 |
| --- | --- |
| 资产库仓库 | `kingning2/xiaoman-projects` |
| 线上地址 | `https://kingning2.github.io/xiaoman-projects/` |
| 上游模板 | `https://github.com/kingning2/xiaoman-projects/blob/main/templates/register-to-portfolio.yml` |
| 接收事件 | `repository_dispatch` → `upsert-asset` |
| 资产库侧 workflow | `Sync asset to projects.json` |

## 架构（必读）

```text
本仓库 deploy 成功
  → .github/workflows/register-to-portfolio.yml
  → repository_dispatch (event: upsert-asset)
  → xiaoman-projects: sync-asset.yml
  → 更新 data/projects.json 并 push main
  → xiaoman-projects: deploy.yml 重建 GitHub Pages
```

## Agent 执行清单

按顺序完成，不要跳过 Secret 说明：

### 1. 确认触发条件

- 查清本仓库**部署 workflow 的准确名称**（默认假设为 `Deploy to GitHub Pages`）。
- 若名称不同，修改 `workflow_run.workflows` 数组。
- 若尚未有 Pages 部署 workflow，先帮用户添加部署，再注册资产库；或改用 `push: branches: [main]` 触发（见模板注释）。

### 2. PAT（仅首次，用户手动）

指导用户在 GitHub 创建 **Fine-grained PAT**：

- Repository access：仅 `xiaoman-projects`
- Permissions：**Contents → Read and write**
- 在本仓库 Settings → Secrets → Actions 添加：`PORTFOLIO_PAT`

同一 PAT 可复用于多个项目仓库的 Secret。

### 3. 添加注册 workflow

在本仓库创建 `.github/workflows/register-to-portfolio.yml`：

- 从资产库复制 [templates/register-to-portfolio.yml](https://github.com/kingning2/xiaoman-projects/blob/main/templates/register-to-portfolio.yml)
- **必须修改**的字段：
  - `repository`: `kingning2/xiaoman-projects`（若用户 fork 了资产库则改为 fork 路径）
  - `client-payload.name`: 卡片展示名
  - `client-payload.description`: 一句话描述（会显示在资产库卡片上）
  - `client-payload.tags`: 技术栈数组，与项目真实栈一致
  - `client-payload.type`: `project` 或 `tool`
- **工具仓库**额外必填：`"problemSolved": "解决什么问题"`
- `id` 默认用仓库名（模板已用 `head_repository.name`），不要随意改除非用户要求

### 4. 推送并验证

1. 用户 push 到 `main`，等待本仓库部署 workflow **成功**
2. 打开 `kingning2/xiaoman-projects` → Actions → **Sync asset to projects.json** 应为成功
3. 资产库 `data/projects.json` 出现对应 `id` 条目
4. 等待 **Deploy to GitHub Pages** 完成后访问站点 Tab 中是否可见

## client-payload 字段

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `id` | 是 | 唯一 ID，建议等于仓库名 |
| `type` | 是 | `project` 或 `tool` |
| `name` | 是 | 卡片标题 |
| `description` | 是 | 卡片描述 |
| `githubUrl` | 是 | `https://github.com/<owner>/<repo>` |
| `tags` | 是 | 字符串数组，如 `["Next.js","TypeScript"]` |
| `updatedAt` | 否 | `YYYY-MM-DD`，省略则用当天 |
| `problemSolved` | type=tool 时必填 | 工具解决的问题 |

同一 `id` 再次 dispatch 会**更新**该条记录，不会重复插入。

## 无部署 workflow 时的备选

在 `register-to-portfolio.yml` 中注释 `workflow_run`，启用：

```yaml
on:
  push:
    branches: [main]
```

并将 payload 中的动态字段改为 `github.event.repository.name` / `github.repository` 等 push 事件上下文。

## 故障排查

| 现象 | 处理 |
| --- | --- |
| register workflow 不运行 | 检查 `workflow_run.workflows` 名称是否与部署 job 完全一致；或改用 `push` 触发 |
| 403 / Bad credentials | `PORTFOLIO_PAT` 无效、过期或未授权 `xiaoman-projects` Contents 写权限 |
| sync 成功但站点无卡片 | 等 deploy 完成；确认 `type` 与 Tab（项目/工具）一致 |
| description 不对 | 改本仓库 workflow 里 `client-payload`，重新部署触发 register |

## 禁止

- 不要在各项目仓库里维护资产库用的 mock JSON
- 不要让 agent 直接改 `xiaoman-projects` 的 `data/projects.json`（除非用户明确在资产库仓库里操作）
- 不要使用 `GITHUB_TOKEN` 跨仓写入资产库（权限不足），必须用 `PORTFOLIO_PAT`

## 参考

- 资产库 README「数据与自动同步」章节
- 手动注册：资产库 Actions → **Sync asset to projects.json** → Run workflow
