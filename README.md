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

## 数据与自动同步

站点数据在 [data/projects.json](data/projects.json)。**不要在各项目里维护 mock**，而是在「其他仓库部署成功」时自动写入本仓库的 JSON。

### 流程概览

```text
其他项目仓库 ──部署成功──► register-to-portfolio.yml
                              │
                              ▼ repository_dispatch (upsert-asset)
                        xiaoman-projects
                              │
                              ▼ sync-asset.yml 更新 projects.json
                              ▼ deploy.yml 重新构建 GitHub Pages
```

### Cursor Agent Skill（推荐）

在其他项目仓库中，可复制资产库的 Agent Skill，让 Cursor 自动完成接入：

```text
.cursor/skills/register-to-xiaoman-portfolio/
```

从本仓库复制整个目录到目标项目的 `.cursor/skills/`，或已安装到全局 `~/.cursor/skills/register-to-xiaoman-portfolio/`（所有项目可用）。在对话中说「注册到 xiaoman portfolio」即可触发。

### 安全说明（必读）

**切勿**把 PAT 或注册码写进 Skill、README、workflow 或任何 git 文件。只能放在 GitHub Actions Secrets。

### 主人配置（`xiaoman-projects` 仓库）

1. Settings → Secrets → Actions → 新建 **`PORTFOLIO_REGISTER_KEY`**（随机长字符串）
2. 创建 Fine-grained PAT（仅本仓库，Contents: Read and write）
3. 将 **PAT + 注册码** 私下发给要上架的开发者（不要公开到仓库）

### 协作者配置（每个要上架的项目仓库）

1. Settings → Secrets → Actions：
   - `PORTFOLIO_PAT` = 主人发来的 PAT
   - `PORTFOLIO_REGISTER_KEY` = 主人发来的注册码（与资产库一致）
2. **复制工作流模板**
   - 将本仓库 [templates/register-to-portfolio.yml](templates/register-to-portfolio.yml) 复制到：
     `其他项目/.github/workflows/register-to-portfolio.yml`
   - 修改 `name`、`description`、`tags` 等字段（仓库路径已为 `kingning2/xiaoman-projects`）
   - 若部署 workflow 名称不是 `Deploy to GitHub Pages`，改 `workflow_run.workflows` 列表
   - 使用模板中的 **github-script** 发送 dispatch（不要手写 JSON，避免 `Bad control character` 错误）

3. **推送后验证**
   - 其他项目部署成功后，在 `xiaoman-projects` → Actions 查看 **Sync asset to projects.json**
   - 成功后 `main` 会多一次 commit，并自动触发 Pages 部署

### 工具类仓库

`client-payload` 中设置 `"type": "tool"`，并增加必填字段：

```json
"problemSolved": "这个工具解决什么问题"
```

### 本地手动写入（可选）

```bash
bun run sync:asset '{"id":"my-app","type":"project","name":"My App","description":"...","githubUrl":"https://github.com/you/my-app","tags":["Next.js"]}'
```

或在 `xiaoman-projects` → Actions → **Sync asset to projects.json** → Run workflow 手动填写表单。

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
