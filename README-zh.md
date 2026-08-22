# AI Skills 仓库

个人 AI 技能集合。每个顶层子目录即一个 skill，统一用 `make install` 安装。

> English version: [README.md](./README.md)

## 目录结构

```
skills/
├── Makefile           # 自动发现并安装所有 skill
├── README.md          # 英文版（默认）
├── README-zh.md       # 中文版
├── code-guardrail/    # skill 示例
├── code-refactor/     # skill 示例
└── grill-me/          # skill 示例
```

每个 skill 目录内需包含 `SKILL.md`（或 `skill.md`）元数据文件。

## 安装

```bash
# 安装所有 skill 到 CodeBuddy 和 WorkBuddy
make install

# 只安装到 CodeBuddy
make install-codebuddy

# 只安装到 WorkBuddy
make install-workbuddy
```

## 其他命令

| 命令 | 说明 |
|------|------|
| `make install` | 安装所有 skill |
| `make clean` | 清理已安装的 skill |
| `make list` | 列出当前仓库中的 skill |

## 如何新增 skill

直接新建一个子目录并放入 `SKILL.md` 即可，无需修改 Makefile 或本文件：

```bash
mkdir my-skill
touch my-skill/SKILL.md
make install
```

Makefile 会自动发现顶层所有子目录并安装。
