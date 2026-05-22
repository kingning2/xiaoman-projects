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

### 一次性配置（每个「其他项目」仓库）

1. **创建 PAT（推荐 Fine-grained）**
   - GitHub → Settings → Developer settings → Personal access tokens
   - 仅授权仓库 `xiaoman-projects`，权限 **Contents: Read and write**
   - 复制 token

2. **在其他项目仓库添加 Secret**
   - Settings → Secrets → Actions → `PORTFOLIO_PAT` = 上面的 token

3. **复制工作流模板**
   - 将本仓库 [templates/register-to-portfolio.yml](templates/register-to-portfolio.yml) 复制到：
     `其他项目/.github/workflows/register-to-portfolio.yml`
   - 修改其中的 `YOUR_GITHUB_USER/xiaoman-projects`、`name`、`description`、`tags` 等字段
   - 若部署 workflow 名称不是 `Deploy to GitHub Pages`，改 `workflow_run.workflows` 列表

4. **推送后验证**
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
