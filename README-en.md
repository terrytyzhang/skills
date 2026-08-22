# AI Skills 仓库 / AI Skills Repository

个人 AI 技能集合。每个顶层子目录即一个 skill，统一用 `make install` 安装。

A personal collection of AI skills. Each top-level subdirectory is a skill, installed together via `make install`.

## 目录结构 / Directory structure

```
skills/
├── Makefile           # 自动发现并安装所有 skill / Auto-discovers & installs all skills
├── README.md
├── code-checker/      # skill 示例 / example skill
├── code-refactor/     # skill 示例 / example skill
└── grill-me/          # skill 示例 / example skill
```

每个 skill 目录内需包含 `SKILL.md`（或 `skill.md`）元数据文件。

Each skill directory must contain a `SKILL.md` (or `skill.md`) metadata file.

## 安装 / Install

```bash
# 安装所有 skill 到 CodeBuddy 和 WorkBuddy
# Install all skills to CodeBuddy and WorkBuddy
make install

# 只安装到 CodeBuddy
# Install to CodeBuddy only
make install-codebuddy

# 只安装到 WorkBuddy
# Install to WorkBuddy only
make install-workbuddy
```

## 其他命令 / Other commands

| 命令 Command | 说明 Description |
|------|------|
| `make install` | 安装所有 skill / Install all skills |
| `make clean` | 清理已安装的 skill / Remove all installed skills |
| `make list` | 列出当前仓库中的 skill / List skills in this repo |

## 如何新增 skill / How to add a new skill

直接新建一个子目录并放入 `SKILL.md` 即可，无需修改 Makefile 或本文件：

Simply create a subdirectory with a `SKILL.md` inside — no need to edit the Makefile or this file:

```bash
mkdir my-skill
touch my-skill/SKILL.md
make install
```

Makefile 会自动发现顶层所有子目录并安装。

The Makefile auto-discovers all top-level subdirectories and installs them.
