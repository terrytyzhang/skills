---
name: keyword-finder
description: "关键词分析工具，用于SEO关键词的商业价值评估和排序。执行两步流水线：CPC过滤 → KRG计算排序 → 输出CSV。当用户需要进行关键词分析、评估关键词商业价值或对关键词排序时使用。"
---

# 关键词分析工具

## 概述

两步流水线：CPC 过滤 → KRG 计算排序 → CSV 输出。

## 完整流程

### Step 1: CPC 过滤

```bash
node {baseDir}/scripts/analyze_keywords.js <input.csv> --phase1
```
输出 `out/<name>_phase1.csv`，过滤掉 CPC<=0 的无商业价值词汇。**所有输出文件默认在 `out/` 目录下**（已加入 .gitignore）。

### Step 2: KRG 计算 + 排序 + 输出 CSV

```bash
node {baseDir}/scripts/analyze_keywords.js out/<name>_phase1.csv --phase2
```
计算 KRG（Keyword Revenue Grade）= Volume × CPC / KD，按降序排序，输出 `out/<name>_result.csv`。

## 输入 CSV 格式

```csv
Keyword,Intent,Volume,Keyword Difficulty,CPC (USD)
"ai image generator",Commercial,50000,65,2.50
"diesel generator for home",Commercial,8000,40,3.00
```

## 环境要求

- Node.js（无第三方依赖，纯标准库实现）
