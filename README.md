# xiaoman-projects

收录所有编写过的项目与工具的个人资产库站点。

## 技术栈

- Next.js (App Router) + TypeScript
- Tailwind CSS + shadcn/ui
- 静态导出 (`output: 'export'`)

## 开发

```bash
bun install
bun dev
```

## 构建与预览

```bash
# 生产环境请设置站点 URL（用于 SEO 绝对链接）
export NEXT_PUBLIC_SITE_URL=https://your-domain.com

bun run build
bun run start   # 预览 out/ 目录
```

构建产物在 `out/`，可部署到 GitHub Pages、Cloudflare Pages 等静态托管。

### 本地模拟 GitHub Pages 子路径

```bash
# Windows PowerShell
$env:NEXT_PUBLIC_SITE_URL="https://your-username.github.io/xiaoman-projects"
$env:NEXT_PUBLIC_BASE_PATH="/xiaoman-projects"
bun run build
bun run start
```

## 部署到 GitHub Pages（自动）

仓库已包含 [.github/workflows/deploy.yml](.github/workflows/deploy.yml)，推送到 `main` 分支会自动构建并部署。

**首次启用（只需做一次）：**

1. 打开 GitHub 仓库 → **Settings** → **Pages**
2. **Build and deployment** → Source 选择 **GitHub Actions**
3. 推送代码到 `main`，在 **Actions** 页查看 `Deploy to GitHub Pages` 是否成功

部署地址：`https://<你的用户名>.github.io/xiaoman-projects/`

> CI 会自动设置 `NEXT_PUBLIC_SITE_URL` 与 `NEXT_PUBLIC_BASE_PATH`（仓库名）。若仓库名不是 `xiaoman-projects`，无需改代码，工作流会按实际仓库名生成路径。

## 数据维护（手动 PR）

站点数据在 [data/projects.json](data/projects.json)。本仓库改为**仅通过 Pull Request 手动维护**项目条目，不再接收其他仓库的自动收编事件。

### 收编流程

1. 在 `data/projects.json` 的 `items` 中新增或更新条目
2. 提交 PR 到 `main`
3. Review 并 Merge 后，`deploy.yml` 会自动重新部署 GitHub Pages

### 工具类仓库字段

当 `type` 为 `tool` 时，必须包含：

```json
"problemSolved": "这个工具解决什么问题"
```

### 字段说明

| 字段 | 必填 | 说明 |
|------|------|------|
| `id` | 是 | 唯一标识，建议与仓库名一致 |
| `type` | 是 | `project` 或 `tool` |
| `name` | 是 | 卡片标题 |
| `description` | 是 | 卡片描述 |
| `githubUrl` | 是 | 仓库 HTTPS 地址 |
| `tags` | 是 | 技术栈字符串数组 |
| `updatedAt` | 否 | `YYYY-MM-DD`，默认当天 |
| `problemSolved` | tool 必填 | 工具解决的问题 |

## SEO

上线后在 [Google Search Console](https://search.google.com/search-console) 提交 sitemap，例如：  
`https://<你的用户名>.github.io/xiaoman-projects/sitemap.xml`
