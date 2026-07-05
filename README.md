# AI Skills 仓库

Terry的AI技能集合，包含SEO获客策略和关键词查找工具。

## 包含的Skill

### 1. SEO获客九步策略 (seo_customer_acquisition)
基于AI SaaS工具出海课程的完整获客框架，帮助创业者、营销人员和开发者系统化制定AI时代的SEO获客策略。

**功能**：
- 完整的九步策略框架
- 交互式命令行工具
- 5个策略模板文件
- AI提示生成工具
- Water AI案例实战参考

### 2. 关键词查找工具 (keyword_finder)
关键词搜索和分析工具，用于SEO关键词研究、竞争分析和搜索量估算。

**功能**：
- 关键词搜索
- 竞争分析
- 搜索量估算
- 相关关键词推荐

## 快速安装

### 方法一：使用Makefile（推荐）
```bash
# 进入skills目录
cd /Users/zhangtianyi/workspace/skills

# 查看帮助
make help

# 检查安装目录
make check-dirs

# 安装所有skill
make install

# 或安装特定skill
make install-seo_customer_acquisition
make install-keyword_finder
```

### 方法二：使用安装脚本
```bash
# 运行安装脚本
./install-skills.sh
```

### 方法三：手动安装
```bash
# 安装到CodeBuddy
cp -r seo_customer_acquisition ~/.codebuddy/skills/
cp -r keyword_finder ~/.codebuddy/skills/

# 安装到WorkBuddy
cp -r seo_customer_acquisition ~/.workbuddy/skills/
cp -r keyword_finder ~/.workbuddy/skills/
```

## Makefile命令参考

| 命令 | 说明 |
|------|------|
| `make install` | 安装所有skill到CodeBuddy和WorkBuddy |
| `make install-codebuddy` | 只安装到CodeBuddy |
| `make install-workbuddy` | 只安装到WorkBuddy |
| `make install-<skill>` | 安装特定skill |
| `make clean` | 清理已安装的skill |
| `make list` | 列出可用skill |
| `make check-dirs` | 检查安装目录 |
| `make help` | 显示帮助信息 |

## 安装验证

安装完成后，可以在以下位置验证：

1. **CodeBuddy**: `~/.codebuddy/skills/`
2. **WorkBuddy**: `~/.workbuddy/skills/`

使用以下命令验证：
```bash
make list
ls -la ~/.codebuddy/skills/
ls -la ~/.workbuddy/skills/
```

## 使用说明

### SEO获客九步策略
```bash
# 进入skill目录
cd ~/.codebuddy/skills/seo_customer_acquisition

# 运行交互式工具（需要Node.js）
node scripts/index.js

# 查看策略指南
open references/strategy-guide.md

# 使用模板文件
cat references/business-positioning.md
```

### 关键词查找工具
```bash
# 进入skill目录
cd ~/.codebuddy/skills/keyword_finder

# 查看使用说明
cat README.md
```

## 文件结构

```
skills/
├── Makefile                    # 自动化安装脚本
├── install-skills.sh           # 安装脚本
├── README.md                   # 本文件
├── README_INSTALL.md           # 详细安装指南
├── seo_customer_acquisition/   # SEO获客skill
│   ├── README.md              # 完整文档
│   ├── SKILL.md               # Skill元数据
│   ├── index.js               # 主工具
│   ├── strategy-guide.md      # 策略指南
│   ├── templates/             # 5个策略模板
│   └── tools/                 # AI提示生成工具
└── keyword_finder/            # 关键词查找skill
    ├── README.md              # 使用说明
    └── SKILL.md               # Skill元数据
```

## 注意事项

1. **Node.js依赖**：`seo_customer_acquisition`需要Node.js运行交互式工具
2. **重启应用**：安装后可能需要重启CodeBuddy/WorkBuddy才能看到新skill
3. **目录权限**：确保有权限写入`~/.codebuddy/`和`~/.workbuddy/`目录
4. **技能更新**：使用`make clean`清理旧版本，然后重新安装

## 故障排除

### 问题：目录不存在
```bash
# 检查目录
make check-dirs

# 手动创建目录（如果需要）
mkdir -p ~/.codebuddy/skills
mkdir -p ~/.workbuddy/skills
```

### 问题：权限拒绝
```bash
# 检查权限
ls -la ~/.codebuddy/
ls -la ~/.workbuddy/

# 修改权限（如果需要）
chmod 755 ~/.codebuddy/skills
chmod 755 ~/.workbuddy/skills
```

### 问题：skill不显示
1. 重启CodeBuddy/WorkBuddy应用
2. 检查`SKILL.md`文件格式是否正确
3. 确保skill目录结构完整

## 更新日志

### v1.0.0 (2025-07-05)
- 初始版本发布
- 包含两个完整的skill
- 提供Makefile自动化安装
- 完整的文档和安装指南
