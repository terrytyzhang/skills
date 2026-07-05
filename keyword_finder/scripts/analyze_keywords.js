#!/usr/bin/env node
/**
 * Keyword Finder - 关键词分析工具
 * ================================
 * 两步流水线：CPC 过滤 → KRG 计算排序 → 输出 CSV
 *
 * Usage:
 *   node analyze_keywords.js <input.csv> --phase1 [-o <output.csv>]
 *   node analyze_keywords.js <phase1_output.csv> --phase2 [-o <output.csv>]
 */

const fs = require("fs");
const path = require("path");

const REQUIRED_HEADERS = ["Keyword", "Intent", "Volume", "Keyword Difficulty", "CPC (USD)"];

// ═══════════════════════════════════════════
// CSV 读写
// ═══════════════════════════════════════════

function parseCSVLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;

  for (const ch of line) {
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current.trim());
  return result;
}

function readCSV(filepath) {
  const raw = fs.readFileSync(filepath, "utf-8").replace(/^\uFEFF/, ""); // strip BOM
  const lines = raw.split(/\r?\n/).filter((l) => l.trim() !== "");
  if (lines.length === 0) throw new Error("CSV 为空");

  const headers = parseCSVLine(lines[0]);
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const row = {};
    headers.forEach((h, idx) => {
      row[h.trim()] = (values[idx] || "").trim();
    });
    rows.push(row);
  }

  if (rows.length === 0) throw new Error("CSV 无数据行");

  console.log(`\n  读取: ${filepath}  (${rows.length} 行)`);
  return rows;
}

function writeCSV(rows, filepath) {
  if (!rows || rows.length === 0) {
    console.log("  无数据可写");
    return;
  }
  const headers = Object.keys(rows[0]);
  const lines = [headers.join(",")];

  for (const row of rows) {
    const values = headers.map((h) => {
      const v = String(row[h] ?? "");
      // 如果值包含逗号或引号，用双引号包裹
      return v.includes(",") || v.includes('"') ? `"${v.replace(/"/g, '""')}"` : v;
    });
    lines.push(values.join(","));
  }

  fs.writeFileSync(filepath, "\uFEFF" + lines.join("\n"), "utf-8"); // BOM for Excel compat
  console.log(`  写入: ${filepath}  (${rows.length} 行)`);
}

// ═══════════════════════════════════════════
// Step 1: CPC 过滤
// ═══════════════════════════════════════════

function filterByCPC(rows, minCPC = 0.01) {
  const original = rows.length;
  const filtered = rows.filter((r) => parseFloat(r["CPC (USD)"] || 0) > minCPC);
  const removed = original - filtered.length;

  console.log(`\n${"=".repeat(60)}`);
  console.log(`  Step 1: CPC 过滤`);
  console.log(`${"=".repeat(60)}`);
  console.log(`  原始: ${original}  →  保留: ${filtered.length}  (移除 ${removed} 条 CPC<=0)`);

  return filtered;
}

// ═══════════════════════════════════════════
// Step 2: KRG 计算
// ═══════════════════════════════════════════

function calculateKRG(rows) {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`  Step 2: KRG 计算 (Keyword Revenue Grade)`);
  console.log(`${"=".repeat(60)}`);

  for (const row of rows) {
    const volume = parseFloat(row["Volume"] || 0);
    const cpc = parseFloat(row["CPC (USD)"] || 0);
    let kd = parseFloat(row["Keyword Difficulty"] || 0.01);
    if (kd <= 0) kd = 0.01;
    row["KRG"] = Math.round(((volume * cpc) / kd) * 100) / 100;
  }

  const sorted = [...rows].sort((a, b) => b["KRG"] - a["KRG"]);

  console.log(`  总计: ${sorted.length} 条关键词`);
  console.log(`\n  Top 10 按 KRG 降序:`);
  console.log(`  排名    ${"关键词".padEnd(45)}${"Vol".padStart(8)}${"CPC".padStart(8)}${"KD".padStart(6)}${"KRG".padStart(10)}`);
  console.log(`  ${"-".repeat(83)}`);

  for (let i = 0; i < Math.min(10, sorted.length); i++) {
    const r = sorted[i];
    const idx = String(i + 1).padEnd(6);
    const kw = r["Keyword"].padEnd(45);
    const vol = String(Math.round(parseFloat(r["Volume"]))).padStart(8);
    const cpc = parseFloat(r["CPC (USD)"]).toFixed(2).padStart(8);
    const kd = String(Math.round(parseFloat(r["Keyword Difficulty"]))).padStart(6);
    const krg = r["KRG"].toFixed(2).padStart(10);
    console.log(`  ${idx}${kw}${vol}${cpc}${kd}${krg}`);
  }

  return sorted;
}

// ═══════════════════════════════════════════
// Phase 1: CPC 过滤 → 输出过滤后 CSV
// ═══════════════════════════════════════════

function phase1(inputCSV, outputCSV, minCPC = 0.01) {
  let rows = readCSV(inputCSV);
  rows = filterByCPC(rows, minCPC);

  if (rows.length === 0) {
    console.log("  ⚠️  所有词被 CPC 过滤，停止");
    return;
  }

  writeCSV(rows, outputCSV);

  console.log(`\n${"=".repeat(60)}`);
  console.log(`  Step 1 完成！`);
  console.log(`${"=".repeat(60)}`);
  console.log(`  输出: ${outputCSV}`);
  console.log(`  词数: ${rows.length}`);
  console.log(``);
  console.log(`  下一步: node analyze_keywords.js ${outputCSV} --phase2`);
}

// ═══════════════════════════════════════════
// Phase 2: KRG 计算 → 排序 → 输出 CSV
// ═══════════════════════════════════════════

function phase2(inputCSV, outputCSV) {
  let rows = readCSV(inputCSV);
  rows = calculateKRG(rows);

  if (rows.length === 0) {
    console.log("  ⚠️  无数据，停止");
    return;
  }

  writeCSV(rows, outputCSV);

  console.log(`\n${"=".repeat(60)}`);
  console.log(`  Step 2 完成！`);
  console.log(`${"=".repeat(60)}`);
  console.log(`  输出: ${outputCSV}`);
}

// ═══════════════════════════════════════════
// CLI
// ═══════════════════════════════════════════

function main() {
  const args = process.argv.slice(2);
  const flags = args.filter((a) => a.startsWith("--"));
  const positional = args.filter((a) => !a.startsWith("-"));

  const input = positional[0];
  if (!input) {
    console.error("用法: node analyze_keywords.js <input.csv> --phase1 | --phase2 [-o <output>]");
    process.exit(1);
  }

  if (!fs.existsSync(input)) {
    console.error(`错误: 文件不存在: ${input}`);
    process.exit(1);
  }

  const outputIdx = args.indexOf("-o");
  const output = outputIdx !== -1 ? args[outputIdx + 1] : null;
  const minCPCIdx = args.indexOf("--min-cpc");
  const minCPC = minCPCIdx !== -1 ? parseFloat(args[minCPCIdx + 1]) : 0.01;

  try {
    if (flags.includes("--phase1")) {
      const base = path.basename(input, path.extname(input));
      if (!fs.existsSync("out")) fs.mkdirSync("out");
      const out = output || `out/${base}_phase1.csv`;
      phase1(input, out, minCPC);
    } else if (flags.includes("--phase2")) {
      const base = path.basename(input, path.extname(input)).replace("_phase1", "");
      if (!fs.existsSync("out")) fs.mkdirSync("out");
      const out = output || `out/${base}_result.csv`;
      phase2(input, out);
    } else {
      console.log("请指定 --phase1 / --phase2");
      console.log("示例: node analyze_keywords.js keywords.csv --phase1");
      process.exit(1);
    }
  } catch (e) {
    console.error(`\n  错误: ${e.message}`);
    process.exit(1);
  }
}

main();
