---
name: to-obs
description: 把当前对话中的经验、结论、要点沉淀为 Obsidian 笔记（通过 Obsidian MCP 工具）。This skill should be used when the user wants to save conversation insights, lessons, or takeaways into Obsidian，例如「存到 obsidian」「沉淀这次的经验」「记到笔记」。
---

# To-Obs（对话经验沉淀到 Obsidian）

1. 检查 Obsidian MCP 是否可用。不可用 → 直接告知「Obsidian MCP 工具不可用」，停止。
2. 检查 MCP 是否支持列出/切换 vault（即是否存在「列出 vault 列表」的工具）。当前常见的 Local REST API MCP 不支持——其 `vault_list` 只列单个 vault 内的文件。不支持 → 告知「当前 MCP 不支持选择 vault，请更换支持多 vault 的 MCP 工具」，停止。
3. 仅当第 2 步通过：列出 vault，用选项让用户选（不让其输入）。
4. 确定目标文件：先问「追加到已有笔记，还是新建笔记？」。
   - 追加 → 列出 vault 内的 `.md` 文件作为选项。
   - 新建 → 让用户输入文件名（`.md`）。
5. 从当前对话提炼经验/结论，写成 markdown。
6. 写入：新建用 `vault_write`，追加用 `vault_append`。

## 规则
- 所有选择都用选项（ask_followup_question），不替用户默认。
- 忠于对话内容，不编造。
- 追加时只增不改，保留原文。
