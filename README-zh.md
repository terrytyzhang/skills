# AI Skills 仓库

个人 AI 技能集合。每个顶层子目录即一个 skill，通过 pnpm scripts 安装。

> English version: [README.md](./README.md)

## 目录结构

```
skills/
├── package.json        # pnpm scripts：install / clean / list
├── scripts/install.mjs # 自动发现并安装所有 skill
├── README.md           # 英文版（默认）
├── README-zh.md        # 中文版
├── code-guardrail/     # skill 示例
├── code-refactor/      # skill 示例
└── grill-me/           # skill 示例
```

每个 skill 目录内需包含 `SKILL.md`（或 `skill.md`）元数据文件。

## 安装

```bash
# 安装所有 skill 到所有支持的 agent（CodeBuddy / WorkBuddy / Codex）
pnpm install:all

# 只安装到某个 agent
pnpm install:codebuddy
pnpm install:workbuddy
pnpm install:codex
```

支持的 agent 及安装目录：

| Agent | 目录 |
|------|------|
| `codebuddy` | `~/.codebuddy/skills` |
| `workbuddy` | `~/.workbuddy/skills` |
| `codex` | `~/.codex/skills` |

## 其他命令

| 命令 | 说明 |
|------|------|
| `pnpm clean` | 清理已安装的 skill（需确认） |
| `pnpm skills:list` | 列出当前仓库中的 skill 和支持的 agent |

## 如何新增 skill

直接新建一个子目录并放入 `SKILL.md` 即可，无需修改任何配置：

```bash
mkdir my-skill
touch my-skill/SKILL.md
pnpm install:all
```

安装脚本会自动发现所有包含 `SKILL.md`（或 `skill.md`）的顶层子目录并安装。
