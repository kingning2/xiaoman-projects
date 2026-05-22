# register-to-portfolio 工作流完整示例

将以下内容保存为**当前项目**的 `.github/workflows/register-to-portfolio.yml`，并按注释修改。

```yaml
name: Register to portfolio

on:
  workflow_run:
    workflows: ["Deploy to GitHub Pages"]  # 改成你实际的部署 workflow 名称
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
              "id": "${{ github.event.workflow_run.head_repository.name }}",
              "type": "project",
              "name": "在这里填写展示名称",
              "description": "在这里填写一句话描述",
              "githubUrl": "https://github.com/${{ github.event.workflow_run.head_repository.full_name }}",
              "tags": ["Next.js", "TypeScript"],
              "updatedAt": "${{ github.event.workflow_run.updated_at }}"
            }
```

## 工具仓库示例 payload

```json
{
  "id": "my-cli",
  "type": "tool",
  "name": "my-cli",
  "description": "简短说明",
  "problemSolved": "这个 CLI 解决的具体问题",
  "githubUrl": "https://github.com/owner/my-cli",
  "tags": ["Node.js", "CLI"]
}
```
