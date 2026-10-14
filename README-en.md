# AI Skills 仓库 / AI Skills Repository

个人 AI 技能集合。每个顶层子目录即一个 skill，通过 pnpm scripts 安装。

A personal collection of AI skills. Each top-level subdirectory is a skill, installed via pnpm scripts.

## 目录结构 / Directory structure

```
skills/
├── package.json        # pnpm scripts：install / clean / list
├── scripts/install.mjs # 自动发现并安装所有 skill / Auto-discovers & installs all skills
├── README.md
├── code-guardrail/     # skill 示例 / example skill
├── code-refactor/      # skill 示例 / example skill
└── grill-me/           # skill 示例 / example skill
```

每个 skill 目录内需包含 `SKILL.md`（或 `skill.md`）元数据文件。

Each skill directory must contain a `SKILL.md` (or `skill.md`) metadata file.

## 安装 / Install

```bash
# 安装所有 skill 到所有支持的 agent（CodeBuddy / WorkBuddy / Codex）
# Install all skills to all supported agents (CodeBuddy / WorkBuddy / Codex)
pnpm install:all

# 只安装到某个 agent / Install to a single agent
pnpm install:codebuddy
pnpm install:workbuddy
pnpm install:codex
```

支持的 agent 及安装目录 / Supported agents and their install directories:

| Agent | 目录 Directory |
|------|------|
| `codebuddy` | `~/.codebuddy/skills` |
| `workbuddy` | `~/.workbuddy/skills` |
| `codex` | `~/.codex/skills` |

## 其他命令 / Other commands

| 命令 Command | 说明 Description |
|------|------|
| `pnpm clean` | 清理已安装的 skill（需确认）/ Remove all installed skills (with confirmation) |
| `pnpm skills:list` | 列出当前仓库中的 skill 和支持的 agent / List skills in this repo and supported agents |

## 如何新增 skill / How to add a new skill

直接新建一个子目录并放入 `SKILL.md` 即可，无需修改任何配置：

Simply create a subdirectory with a `SKILL.md` inside — no need to edit any config:

```bash
mkdir my-skill
touch my-skill/SKILL.md
pnpm install:all
```

安装脚本会自动发现所有包含 `SKILL.md`（或 `skill.md`）的顶层子目录并安装。

The install script auto-discovers all top-level subdirectories containing a `SKILL.md` (or `skill.md`) and installs them.
