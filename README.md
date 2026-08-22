# AI Skills Repository

A personal collection of AI skills. Each top-level subdirectory is a skill, installed together via `make install`.

> 中文版请查看 [README-zh.md](./README-zh.md)

## Directory structure

```
skills/
├── Makefile           # Auto-discovers & installs all skills
├── README.md          # English (default)
├── README-zh.md       # Chinese
├── code-guardrail/    # example skill
├── code-refactor/     # example skill
└── grill-me/          # example skill
```

Each skill directory must contain a `SKILL.md` (or `skill.md`) metadata file.

## Install

```bash
# Install all skills to CodeBuddy and WorkBuddy
make install

# Install to CodeBuddy only
make install-codebuddy

# Install to WorkBuddy only
make install-workbuddy
```

## Other commands

| Command | Description |
|------|------|
| `make install` | Install all skills |
| `make clean` | Remove all installed skills |
| `make list` | List skills in this repo |

## How to add a new skill

Simply create a subdirectory with a `SKILL.md` inside — no need to edit the Makefile or README:

```bash
mkdir my-skill
touch my-skill/SKILL.md
make install
```

The Makefile auto-discovers all top-level subdirectories and installs them.
