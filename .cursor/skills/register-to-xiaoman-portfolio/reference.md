# register-to-portfolio 工作流示例

使用 **actions/github-script** 构建 JSON，避免手写 `client-payload` 导致 `Bad control character in string literal`（常见于 Secret 末尾换行、YAML 多行字符串、描述里的引号）。

## 协作者仓库 Secrets

| Name | Value |
| --- | --- |
| `PORTFOLIO_PAT` | 向资产库主人索取，勿提交 git |
| `PORTFOLIO_REGISTER_KEY` | 向资产库主人索取，勿提交 git；粘贴 Secret 时勿带换行 |

## workflow 示例

见资产库 `templates/register-to-portfolio.yml`，或 GitHub：

https://github.com/kingning2/xiaoman-projects/blob/main/templates/register-to-portfolio.yml

## 主人：资产库仓库 Secrets

仅 **kingning2/xiaoman-projects** 需要：

- `PORTFOLIO_REGISTER_KEY` — 自行生成，与协作者共享同一字符串
