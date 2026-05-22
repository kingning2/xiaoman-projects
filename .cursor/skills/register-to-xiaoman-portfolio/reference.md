# register-to-portfolio 工作流示例

## 协作者仓库 Secrets

| Name | Value |
| --- | --- |
| `PORTFOLIO_PAT` | 向资产库主人索取，勿提交 git |
| `PORTFOLIO_REGISTER_KEY` | 向资产库主人索取，勿提交 git |

## workflow 示例

```yaml
name: Register to portfolio

on:
  workflow_run:
    workflows: ["Deploy to GitHub Pages"]
    types: [completed]
    branches: [main]

jobs:
  register:
    if: github.event.workflow_run.conclusion == 'success'
    runs-on: ubuntu-latest
    steps:
      - name: Send asset to xiaoman-projects
        uses: peter-evans/repository-dispatch@v3
        with:
          token: ${{ secrets.PORTFOLIO_PAT }}
          repository: kingning2/xiaoman-projects
          event-type: upsert-asset
          client-payload: |-
            {
              "registerKey": "${{ secrets.PORTFOLIO_REGISTER_KEY }}",
              "id": "${{ github.event.workflow_run.head_repository.name }}",
              "type": "project",
              "name": "展示名称",
              "description": "一句话描述",
              "githubUrl": "https://github.com/${{ github.event.workflow_run.head_repository.full_name }}",
              "tags": ["Next.js", "TypeScript"],
              "updatedAt": "${{ github.event.workflow_run.updated_at }}"
            }
```

## 主人：资产库仓库 Secrets

仅 **kingning2/xiaoman-projects** 需要：

- `PORTFOLIO_REGISTER_KEY` — 自行生成，与协作者共享同一字符串
