# AI Skills Repository

A personal collection of AI skills. Each top-level subdirectory is a skill, installed via pnpm scripts.

> 中文版请查看 [README-zh.md](./README-zh.md)

## Directory structure

```
skills/
├── package.json       # pnpm scripts for install/clean/list
├── scripts/install.mjs # Auto-discovers & installs all skills
├── README.md          # English (default)
├── README-zh.md       # Chinese
├── code-guardrail/    # example skill
├── code-refactor/     # example skill
└── grill-me/          # example skill
```

Each skill directory must contain a `SKILL.md` (or `skill.md`) metadata file.

## Install

```bash
# Install all skills to all supported agents (CodeBuddy / WorkBuddy / Codex)
pnpm install:all

# Install to a single agent
pnpm install:codebuddy
pnpm install:workbuddy
pnpm install:codex
```

Supported agents and their install directories:

| Agent | Directory |
|------|------|
| `codebuddy` | `~/.codebuddy/skills` |
| `workbuddy` | `~/.workbuddy/skills` |
| `codex` | `~/.codex/skills` |

## Other commands

| Command | Description |
|------|------|
| `pnpm clean` | Remove all installed skills (with confirmation) |
| `pnpm skills:list` | List skills in this repo and supported agents |

## How to add a new skill

Simply create a subdirectory with a `SKILL.md` inside — no need to edit any config:

```bash
mkdir my-skill
touch my-skill/SKILL.md
pnpm install:all
```

The install script auto-discovers all top-level subdirectories containing a `SKILL.md` (or `skill.md`) and installs them.
