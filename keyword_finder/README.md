# 关键词查找与分析工具

两步流水线式关键词分析方法，输入 CSV 文件，输出按商业价值排序的分析结果。

## 功能

| 步骤 | 功能 | 说明 |
|------|------|------|
| Step 1 | CPC 过滤 | 排除 CPC<=0 的无商业价值词汇 |
| Step 2 | KRG 计算 | `Volume × CPC / KD` 降序排序，评估商业回报潜力 |

## 快速开始

### 1. 环境要求

- Node.js（纯标准库实现，零第三方依赖）

### 2. 准备 CSV 文件

表头格式：
```csv
Keyword,Intent,Volume,Keyword Difficulty,CPC (USD)
"ai image generator",Commercial,50000,65,2.50
"online pdf merger",Commercial,12000,25,1.80
"diesel generator for home",Commercial,8000,40,3.00
```

### 3. 运行分析
```bash
# Step 1: CPC 过滤
node scripts/analyze_keywords.js keywords.csv --phase1

# Step 2: KRG 计算 + 排序
node scripts/analyze_keywords.js out/keywords_phase1.csv --phase2

# 调整 CPC 阈值
node scripts/analyze_keywords.js keywords.csv --phase1 --min-cpc 0.5

# 指定输出路径
node scripts/analyze_keywords.js keywords.csv --phase1 -o my_output.csv
```

输出文件默认在 `out/` 目录下（已加入 .gitignore）。

## 输出说明

最终输出 CSV 在原表头基础上增加：

| 列名 | 说明 |
|------|------|
| KRG | 关键词商业回报评分 (Volume × CPC / KD)，越高越值得投入 |

## 文件结构

```
keyword_finder/
├── SKILL.md
├── README.md
├── scripts/
│   └── analyze_keywords.js    # 主分析脚本
└── references/
    └── methodology.md         # 方法论说明
```
