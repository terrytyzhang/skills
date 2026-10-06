---
name: to-obs
description: Save insights, lessons, and takeaways from the current conversation into Obsidian notes via the Obsidian MCP tools. Use when the user wants to save conversation insights to Obsidian (e.g. "存到 obsidian", "沉淀经验", "记到笔记").
---

# To-Obs (save conversation insights to Obsidian)

1. Check the Obsidian MCP is available. If not, tell the user "Obsidian MCP tools unavailable" and stop.
2. Check the MCP supports listing/switching vaults (i.e. it exposes a "list vaults" tool). The common Local REST API MCP does not — its `vault_list` only lists files inside one vault. If unsupported, tell the user "this MCP can't select a vault; use one that supports multiple vaults" and stop.
3. Only if step 2 passes: list the vaults and let the user pick via options (no typing).
4. Determine the target file: first ask "append to an existing note, or create a new one?".
   - Append → list the `.md` files in the vault as options.
   - New → ask for the filename (`.md`).
5. Distill the conversation's insights/conclusions into markdown.
6. Write: `vault_write` for new files, `vault_append` for append.

## Rules
- Offer every choice as options (ask_followup_question); never default on the user's behalf.
- Stay faithful to the conversation; don't invent content.
- Append only adds; keep the existing content intact.
