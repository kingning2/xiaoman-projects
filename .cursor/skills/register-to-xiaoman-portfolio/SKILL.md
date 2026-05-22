---
name: register-to-xiaoman-portfolio
description: >-
  Registers a GitHub repository to kingning2/xiaoman-projects portfolio after
  deploy via repository_dispatch, PORTFOLIO_PAT, and PORTFOLIO_REGISTER_KEY
  secrets. Use for portfolio registration, shared contributor setup, or
  register-to-portfolio workflow. Never embed tokens or keys in committed files.
---

# 注册到 xiaoman-projects 资产库

## 安全红线（必须遵守）

- **禁止**把 `PORTFOLIO_PAT`、`PORTFOLIO_REGISTER_KEY` 或任何 GitHub Token 写进 Skill、README、workflow 模板、代码或 git 提交。
- 密钥只能放在 GitHub **Settings → Secrets → Actions**（仓库级或组织级）。
- 若用户在对话里粘贴了 Token，提醒其**立即在 GitHub 撤销并重新生成**，不要写入仓库。

## 资产库

| 项 | 值 |
| --- | --- |
| 仓库 | `kingning2/xiaoman-projects` |
| 站点 | `https://kingning2.github.io/xiaoman-projects/` |
| 模板 | `templates/register-to-portfolio.yml` |

## 双密钥机制（支持多人提交）

| Secret | 配置在哪个仓库 | 谁持有 |
| --- | --- | --- |
| `PORTFOLIO_REGISTER_KEY` | **资产库** + **每个提交者的项目仓库** | 主人生成随机串，私下发给协作者 |
| `PORTFOLIO_PAT` | **每个提交者的项目仓库** | 主人生成的 Fine-grained PAT，私下分发（可共用同一 PAT） |

资产库 `sync-asset.yml` 会校验 `client-payload.registerKey` 与资产库 Secrets 中的 `PORTFOLIO_REGISTER_KEY` 一致才写入 JSON。

### 主人（kingning2）一次性配置

1. GitHub → **xiaoman-projects** → Settings → Secrets → Actions：
   - `PORTFOLIO_REGISTER_KEY` = 随机长字符串（如 `openssl rand -hex 32`）
2. 创建 Fine-grained PAT（仅 `xiaoman-projects`，Contents: Read and write）
3. **私下**把「PAT + 注册码」发给要上架的开发者（Issue、私信等），**不要**提交到 git

### 协作者（其他 GitHub 账号 / 其他仓库）

在其项目仓库 Settings → Secrets → Actions 添加：

- `PORTFOLIO_PAT` = 主人发来的 PAT
- `PORTFOLIO_REGISTER_KEY` = 主人发来的注册码（与资产库一致）

然后按下方清单添加 workflow。

## Agent 执行清单

### 1. 确认部署 workflow 名称

默认 `Deploy to GitHub Pages`；否则改 `workflow_run.workflows`。

### 2. 确认 Secrets 已配置

若用户未配置，输出：

```text
请向 xiaoman-projects 仓库所有者索取 PORTFOLIO_PAT 与 PORTFOLIO_REGISTER_KEY，
在本仓库 Settings → Secrets → Actions 中添加，切勿写入代码或 Skill。
```

### 3. 创建 workflow

路径：`.github/workflows/register-to-portfolio.yml`

从 `templates/register-to-portfolio.yml` 复制，并修改 `name`、`description`、`tags`、`type`（及工具的 `problemSolved`）。

payload **必须**包含：

```json
"registerKey": "${{ secrets.PORTFOLIO_REGISTER_KEY }}"
```

### 4. 验证

部署成功 → 资产库 Actions **Sync asset to projects.json** 成功 → 站点出现卡片。

## client-payload 字段

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `registerKey` | 是（dispatch） | 与资产库 `PORTFOLIO_REGISTER_KEY` 相同 |
| `id` | 是 | 建议仓库名 |
| `type` | 是 | `project` / `tool` |
| `name` | 是 | 卡片标题 |
| `description` | 是 | 卡片描述 |
| `githubUrl` | 是 | HTTPS 仓库地址 |
| `tags` | 是 | 字符串数组 |
| `problemSolved` | tool 必填 | 工具解决的问题 |
| `updatedAt` | 否 | `YYYY-MM-DD` |

## 故障排查

| 现象 | 处理 |
| --- | --- |
| Invalid registerKey | 协作者 `PORTFOLIO_REGISTER_KEY` 与资产库不一致 |
| PORTFOLIO_REGISTER_KEY is not set | 主人未在 xiaoman-projects 配置该 Secret |
| 403 Bad credentials | `PORTFOLIO_PAT` 无效或未授权资产库 Contents 写权限 |
| register 不触发 | 检查 `workflow_run.workflows` 名称 |

## 禁止

- 在仓库/Skill 中硬编码 Token 或注册码
- 用 `GITHUB_TOKEN` 跨仓 dispatch
- 在各项目维护 mock `projects.json`
