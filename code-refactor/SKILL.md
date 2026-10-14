---
name: code-refactor
description: Systematically audit and refactor a codebase — find architectural smells, if-else band-aids, dead code/dead fields, magic numbers, and extensibility gaps, then plan and execute a thorough, behavior-preserving refactor. Use when the user asks to refactor/rewrite, tidy architecture, reduce if-else stacking, introduce DDD, eliminate dead code/magic numbers, run a code-quality audit, or mentions "extensibility / high cohesion low coupling / single responsibility / smells".
---

# Code Refactor (systematic code refactoring)

## Core principles (agree before changing anything)

1. **Root cause first, no band-aids**: Before adding an if-else / special-case / transform / shim, stop — should this state even exist? Eliminate it closest to the root (data source, upstream, schema, writer). Never pollute downstream. If you truly must tolerate it downstream, document why.
2. **Prefer libraries and standards**: Use an existing library over reinventing (e.g., standard marshal/unmarshal, not string matching).
3. **No redundant null checks**: Validate required params once at startup; never re-check what's already guaranteed.
4. **Equivalence first**: Behavior before and after must match. When unsure, main-branch code is the source of truth.
5. **No half-states**: Be thorough — delete invalid code, fields, logs, debug output outright; never comment them out.
6. **Conclude from code, never imagine**: Read all code, then conclude item by item; don't fabricate problems.

## Audit checklist (read all code, then tick each item)

### A. Architecture & extensibility
- [ ] Extensible? Adding a "condition/page/strategy" is done via **extension** (strategy/registry/plugin/table-driven/polymorphism) or **if-else stacking**?
- [ ] High cohesion / low coupling? Clear responsibilities, or modules drifting into redundant copies?
- [ ] Reasonable structure? Directory split, file/function size, single responsibility.

### B. Redundancy & dead code
- [ ] Unused code / functions / types?
- [ ] Unused or legacy fields?
- [ ] Necessary under this module's responsibility? (Judge from overall architecture, not locally.)

### C. Logic quality
- [ ] Scattered logic, if-else stacking?
- [ ] Code that avoids the real problem and band-aids with if-else?
- [ ] Magic numbers? Replace with config items or enums?
- [ ] Readable? Smells — long functions, mysterious naming, duplicated logic, god objects?
- [ ] Invalid logs / monitoring / debug output to clean up?

## Workflow

### Phase 1 — Audit (read-only)
Read all code, skip nothing; conclude each item against the checklist. Every conclusion points to concrete code; no-problem items are marked "none", not padded.

### Phase 2 — Plan
Output a step-by-step, independently verifiable, rollback-able plan; break large refactors into pieces. Each step states what to change, why, how equivalence is guaranteed, how to verify. For architecture changes, also assess deployment impact (Dockerfile / startup command).

### Phase 3 — Execute
Implement step by step per the plan; no mid-way confirmation. Prefer equivalence-preserving refactors and libraries over hand-written logic. Eliminate root causes, delete dead code/fields/logs, remove magic numbers. Add capabilities via extension, not if-else.

### Phase 4 — Verify
- [ ] Build passes (e.g., `make build`)
- [ ] Unit tests pass, added for new/changed logic
- [ ] Behavior equivalent (key-path diff/comparison)
- [ ] Deployment chain usable (image starts normally)
- [ ] Final code clean: no dead code, debug info, or redundant null checks

## Anti-patterns → correct solutions

| Anti-pattern | Correct solution |
| --- | --- |
| Stacking `if a ... else if b ...` for new requirements | Strategy / registry / table-driven / polymorphic extension |
| Config parsed via string matching | Standard marshal/unmarshal (e.g., prototext) |
| Downstream tolerance/special-cases swallowing upstream dirty data | Fix upstream/data source, or define an explicit contract |
| Pervasive useless `!= nil` / `!= 0` checks | Validate at startup, then trust it |
| Commented-out old code, debug logs | Delete; version history has your back |
| Half-refactor + compatibility layer coexisting | Change thoroughly in one pass |

## Hard constraints (non-negotiable)

- Behavior must be equivalent; when unsure, check main-branch code.
- Add unit tests promptly; the build must verify.
- Conclusions must come from actual code; never fabricate.
- Architecture changes must include a deployment assessment.
