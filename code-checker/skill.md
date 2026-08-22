---
name: code-checker
description: Pre-write guardrail that prevents code from degrading — stop if-else stacking, dead code/dead fields, magic numbers, redundant null checks, reinventing the wheel, and downstream band-aids at the source, so code ships clean, extensible, single-responsibility, and readable. Use when the user asks to write new features/modules/code, or modify existing code, and wants it clean and extensible from the start.
---

# Code Checker (pre-write anti-degradation guardrail)

## Positioning

`code-refactor` is "post-hoc audit & refactor"; this skill is "pre-write anti-degradation": it blocks problems at the moment you write code, avoiding the need to refactor later. Run the checklist below before writing any new code.

## Self-check before writing (go through each item)

### Structure design
- [ ] Will this logic end up "add one more X → add one more if/else"? If so, switch to strategy/registry/table-driven/polymorphism, so adding = extension, not modification.
- [ ] Does this class/function follow single responsibility? Is the function short enough? Is the naming self-explanatory?
- [ ] Are module boundaries clear? Did you pull in responsibilities that belong to another module (which would later become two redundant copies)?

### Values & configuration
- [ ] Any bare magic numbers? Replace with enums or config items.
- [ ] Any hardcoded strings/rules? Can they be expressed via config or a constants table?

### Null checks & defense
- [ ] Is this parameter required? If yes → validate once at the entrypoint/startup, then stop null-checking afterward.
- [ ] Is this null check "truly can be null", or "defensive out of habit"? Delete the latter.

### Wheels & libraries
- [ ] Is there a mature third-party library / standard library / community standard for this? If yes → use it directly, don't reinvent.

### Root cause vs band-aid
- [ ] Are you adding a special-case/transform downstream just to "tolerate dirty/odd upstream data"? If yes → stop: should that dirty state even exist? Fix at the source, or define an explicit contract — don't pollute the downstream.
- [ ] Will this if/else or type conversion make readers wonder "why is this written this way"? If yes → it's likely a band-aid, reconsider.

### Cleanliness
- [ ] Any leftover debug logs / commented-out old code / temporary code? Delete when done.
- [ ] Any declared-but-unused fields, variables, imports? Delete them.

## Cheat sheet

1. Add capabilities via extension, not if-else.
2. Use libraries, don't reinvent wheels.
3. Validate required params once at entry, then trust them.
4. Before adding a special-case, ask the root cause — don't band-aid downstream.
5. Delete debug info, dead code, and magic numbers when done.
6. Naming is documentation; a function does one thing only.
