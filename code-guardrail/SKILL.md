---
name: code-guardrail
description: Pre-write guardrail that prevents code from degrading — stop if-else stacking, dead code/dead fields, magic numbers, redundant null checks, reinventing the wheel, and downstream band-aids at the source, so code ships clean, extensible, single-responsibility, and readable. Use when the user asks to write new features/modules/code, or modify existing code, and wants it clean and extensible from the start.
---

# Code Guardrail (pre-write anti-degradation guardrail)

`code-refactor` is post-hoc audit & refactor; this skill is pre-write anti-degradation — it blocks problems as you write, avoiding refactor later. Run the checklist before writing any new code.

## Self-check before writing

### Structure design
- [ ] Will "add one more X" mean "add one more if/else"? Switch to strategy/registry/table-driven/polymorphism — adding = extension, not modification.
- [ ] Single responsibility? Function short enough? Naming self-explanatory?
- [ ] Module boundaries clear? Not pulling in another module's responsibility (which later becomes two redundant copies)?

### Values & configuration
- [ ] Bare magic numbers? Replace with enums or config.
- [ ] Hardcoded strings/rules? Express via config or a constants table?

### Null checks & defense
- [ ] Required param? Validate once at entrypoint/startup, then stop null-checking.
- [ ] "Truly can be null" or "defensive out of habit"? Delete the latter.

### Wheels & libraries
- [ ] A mature third-party / standard library / community standard exists? Use it, don't reinvent.

### Root cause vs band-aid
- [ ] Adding a downstream special-case just to tolerate dirty upstream data? Stop — should that state even exist? Fix at the source, or define an explicit contract.
- [ ] Will this if/else or conversion make readers wonder "why"? Likely a band-aid — reconsider.

### Cleanliness
- [ ] Leftover debug logs / commented-out code / temporary code? Delete when done.
- [ ] Declared-but-unused fields, variables, imports? Delete.

## Cheat sheet

1. Add capabilities via extension, not if-else.
2. Use libraries, don't reinvent.
3. Validate required params once at entry, then trust them.
4. Before a special-case, ask the root cause — don't band-aid downstream.
5. Delete debug info, dead code, and magic numbers when done.
6. Naming is documentation; a function does one thing.
