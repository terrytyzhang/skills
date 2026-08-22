---
name: code-refactor
description: Systematically audit and refactor a codebase — find architectural smells, if-else band-aids, dead code/dead fields, magic numbers, and extensibility gaps, then plan and execute a thorough, behavior-preserving refactor. Use when the user asks to refactor/rewrite, tidy architecture, reduce if-else stacking, introduce DDD, eliminate dead code/magic numbers, run a code-quality audit, or mentions "extensibility / high cohesion low coupling / single responsibility / smells".
---

# Code Refactor (systematic code refactoring)

## Core principles (agree with these before changing anything)

1. **Root cause first, no band-aids**: When you feel the urge to "add an if-else / special-case / transform / compatibility shim", stop — should this error state even exist? Can it be eliminated closest to the root cause? Only fix at the data source, upstream, schema, or writer; never pollute the downstream. If you truly can only tolerate it downstream, you must document "why" (legacy burden / can't change upstream).
2. **Prefer third-party libraries and community standards**: Use an existing library instead of reinventing. E.g., use standard marshal/unmarshal for config parsing, not string matching.
3. **No redundant null checks**: Validate required params once at service startup; don't write useless null checks where the code already guarantees presence.
4. **Equivalence first**: Behavior before and after refactor must be equivalent. When unsure, the main branch (master/main) code is the source of truth.
5. **Be thorough, leave no half-states**: No half-baked solutions, no "temporary compatibility layer". Delete invalid code, fields, logs, and debug info outright — don't comment them out.
6. **Conclusions come from code, never imagine problems**: Read all code, then conclude item by item; don't fabricate problems that don't exist.

## First step when triggered: system audit checklist (read all code, then tick each item)

For each module/file, answer in order:

### A. Architecture & extensibility
- [ ] Is it extensible? Adding a "condition/page/strategy" is done via **extension** (strategy/registry/plugin/table-driven/polymorphism) or via **if-else stacking** in an existing function?
- [ ] Is it high cohesion / low coupling? Are module responsibilities clear, or do two modules drift apart and each produce redundant copies?
- [ ] Is the directory split reasonable? Are file/function sizes reasonable? Does it satisfy single responsibility principle (SRP)?

### B. Redundancy & dead code
- [ ] Any unused code blocks / functions / types?
- [ ] Any unused fields? Any invalid fields left from history?
- [ ] Is each piece of code necessary under the current module's responsibility? (Judge from the overall architecture, not a local view.)

### C. Logic quality
- [ ] Is the logic scattered and full of if-else stacking?
- [ ] Any code that "avoids the real problem and band-aids with if-else"?
- [ ] Any magic numbers? Which can be removed via config items or enums?
- [ ] How is readability? Any smells (long functions, mysterious naming, duplicated logic, god objects…)?
- [ ] Any invalid logs / monitoring / debug output to clean up?

## Refactor workflow

### Phase 1 — Audit (read-only)
- Read all code of the module, no file skipped; conclude each item using the checklist above.
- Every conclusion points to a concrete code location; items with no problem are explicitly marked "none", not padded.

### Phase 2 — Plan (plan before acting)
- Output a step-by-step, independently verifiable, rollback-able plan; break large refactors into pieces.
- Each step clearly states "what to change, why, how equivalence is guaranteed, how to verify".
- When architecture changes, also consider deployment impact (e.g., does Dockerfile / startup command need to change).

### Phase 3 — Execute
- Implement step by step per the plan, no waiting for confirmation mid-way; each step stays rollback-able and verifiable.
- Prefer equivalence-preserving refactors; introduce third-party libraries to replace hand-written parsing/logic.
- Eliminate root causes, delete dead code/dead fields/useless logs, remove magic numbers.
- Add capabilities via extension, not if-else stacking.

### Phase 4 — Verify
- [ ] Build passes (e.g., `make build`)
- [ ] Unit tests pass, and tests added for new/changed logic
- [ ] Behavior equivalent to pre-refactor (key-path diff/comparison)
- [ ] Deployment chain usable (image can start normally)
- [ ] Final code clean: no dead code, no debug info, no redundant null checks

## Anti-patterns (block on sight) vs correct solutions

| Anti-pattern | Correct solution |
| --- | --- |
| New requirement keeps stacking `if a ... else if b ...` | Strategy pattern / registry / table-driven / polymorphic extension |
| Config parsed via string matching | Standard library marshal/unmarshal (e.g., prototext) |
| Downstream adds a pile of tolerance/special-cases to swallow upstream dirty data | Fix upstream/data source, or define an explicit contract |
| Pervasive `!= nil` / `!= 0` useless null checks | Validate required at startup, then trust it |
| Keep commented-out old code, debug logs | Delete directly; version history has your back |
| Half-refactor + compatibility layer coexisting | Change thoroughly in one pass |

## Hard constraints (non-negotiable)

- Behavior must be equivalent to the current state; when unsure, check main-branch code.
- Add unit tests promptly; the build command must be able to verify.
- Conclusions must come from actual code; never fabricate problems.
- Architecture changes must be accompanied by a deployment assessment.
