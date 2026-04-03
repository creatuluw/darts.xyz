---
name: opencode-infinite-loop
description: >-
  Sets up and launches an autonomous infinite agent loop in OpenCode. Use when the user says "start the loop", "run the agent loop", "autonomous agent", "infinite loop", "run agent on this spec", "let the agent work unattended", "loop until done", or provides a spec/PRD and wants an agent to execute it autonomously. Handles the full journey from zero to running loop — checks OpenCode installation, validates project config, inspects and scaffolds agent definitions, evaluates the spec for completeness, fills any gaps with smart clarifying questions, then launches the loop. Works at any starting point — nothing installed, partial config, missing or vague spec.
license: MIT
metadata:
  author: opencode-infinite-loop
  version: '1.0'
---

# OpenCode Infinite Loop

## When to Use This Skill

Load this skill whenever the user wants to run an agent autonomously in a loop on a task or spec using OpenCode. This includes:

- "Start the infinite loop"
- "Run the agent on this spec"
- "Let the agent work unattended until done"
- "Set up autonomous coding"
- "Loop the agent until all tests pass"
- Providing a SPEC.md, PRD, or task description and asking an agent to execute it

---

## Phase Architecture

This skill operates as a sequential state machine. Each phase has a pass/fail check. Phases run in order. Skip a phase only if its check passes. Never jump ahead until all prior phases are green.

```
Phase 1 → OpenCode installed?
Phase 2 → Project has opencode.json (or global config)?
Phase 3 → Autonomous agents defined with correct permissions?
Phase 4 → AGENTS.md present and adequate?
Phase 5 → Spec exists, is provided, and is agent-proof?
Phase 6 → Loop runner script exists?
Phase 7 → LAUNCH
```

---

## Phase 1 — OpenCode Installation Check

**Check:**
Run `opencode --version` (via bash). If it exits non-zero or command not found → Phase 1 FAIL.

**On FAIL — respond with:**
```
OpenCode is not installed (or not in PATH).

Install it with:
  npm install -g opencode-ai

Then verify:
  opencode --version

Come back and I'll continue setup from here.
```

Stop here. Do not continue until user confirms it's installed.

**On PASS:** proceed to Phase 2.

---

## Phase 2 — Config File Check

**Check:**
Look for `.opencode.json` or `opencode.json` in the current working directory. Also check `~/.config/opencode/opencode.json` (global). If neither exists → Phase 2 FAIL.

**On FAIL:**
Ask:
```
No opencode.json found in this project. Do you want me to:

1. Create a project-level .opencode.json here (recommended — keeps config per-project)
2. Use your global config (~/.config/opencode/opencode.json)

Which would you prefer?
```

Wait for answer, then scaffold the appropriate file using the template from `references/opencode-config-template.json`.

Create `.opencode.json` at project root (or modify global) with the infinite loop agent definitions pre-filled. Inform the user what was created.

**On PASS:** proceed to Phase 3.

---

## Phase 3 — Agent Definitions Check

**Check:**
Read the config file found/created in Phase 2. Verify:
- A primary agent exists with `"question": "deny"` (prevents blocking)
- `"bash": "allow"` and `"edit": "allow"` are set
- `"doom_loop"` is either `"allow"` or handler is defined
- A planner subagent exists (read-only, `"bash": "deny"`, `"edit": "deny"`)
- A builder subagent exists (full access)

If any of these are missing → Phase 3 FAIL.

**On FAIL:**
Do NOT ask — act. Merge the missing agent definitions into the existing config.

Tell the user:
```
Your opencode.json was missing autonomous agent definitions. I've added:
- looper (primary orchestrator — all permissions allowed, question blocked)
- planner (read-only subagent — creates task breakdowns)
- builder (full-access subagent — executes and commits tasks)

Config updated at: [path]

Here's what was added: [show the diff or added JSON block]
```

Then proceed to Phase 4.

**On PASS:** proceed to Phase 4.

---

## Phase 4 — AGENTS.md Check

**Check:**
Look for `AGENTS.md` in the project root (and recursively upward to git root). Also check global `~/.config/opencode/AGENTS.md`.

Evaluate the found file (if any) for:
- Key commands section (install, dev, test, lint, typecheck, build)
- Project structure overview
- A `🚫 Never` section (fixture protection, secrets)
- A completion signal definition (`<promise>COMPLETE</promise>`)

Score: count how many of these 4 are present.

**Score 0 (no AGENTS.md):** Create it from scratch using the template in `references/agents-md-template.md`. Scan the project to fill in real commands from `package.json` scripts. Tell the user what was created.

**Score 1-2 (partial AGENTS.md):** Append the missing sections to the existing file. Tell the user what was appended and why each section matters for autonomous operation.

**Score 3-4 (adequate):** Note it's good. Proceed to Phase 5.

---

## Phase 5 — Spec Evaluation (Critical Phase)

This phase has the most branching. The spec is the contract that replaces the human in the loop.

### 5a. Locate the Spec

Look for, in this order:
1. A spec passed directly in the user's message (inline text, attached file)
2. `SPEC.md` in the project root
3. `spec.md`, `PRD.md`, `prd.md`, `.opencode/spec.md`
4. Any file the user named explicitly

If nothing found → go to **5b (No Spec)**.
If found → go to **5c (Evaluate Spec)**.

### 5b. No Spec — Elicit It

Ask the user the following questions (all at once, numbered):

```
No spec or PRD found. I need one before the loop can start safely — without it the agent will make up decisions.

Please answer these:

1. What is the goal? (one sentence: what "done" looks like)
2. What exists now in the codebase relevant to this task?
3. List the acceptance criteria. Each one must be verifiable by a command (e.g. "npm test passes", "endpoint returns X"). Vague criteria like "it should feel fast" can't be tested by an agent.
4. What files or directories should the agent NOT touch?
5. What test/lint/build commands does the project use?
6. Any known constraints or anti-patterns to avoid?

Once you answer, I'll write the SPEC.md and we can launch.
```

After user answers → write `SPEC.md` from `references/spec-template.md`, filling in their answers. Show them the result. Ask: "Does this look right before I launch the loop?"

Wait for confirmation → proceed to Phase 6.

### 5c. Evaluate the Spec

Read the spec and score it on these 7 dimensions. Each is binary (pass/fail):

| Dimension | Pass condition |
|-----------|----------------|
| **Goal** | One clear sentence describing what done looks like |
| **Acceptance criteria** | At least 2 criteria, each testable by a shell command |
| **Constraints** | At least one "never do" or "don't touch" rule |
| **Commands** | Test, lint, or typecheck commands are specified |
| **Scope boundary** | Which files/dirs are in vs out of scope |
| **Completion signal** | `<promise>COMPLETE</promise>` token defined and when to use it |
| **No subjective criteria** | No criteria like "fast", "clean", "nice" without a measurement |

**Score 7/7:** Proceed to Phase 6.

**Score 4-6:** Patch the spec. For each failing dimension, add the missing section. Ask the user to fill in the specific gaps:

```
Your spec is close but missing a few things that would cause the agent to stall or hallucinate:

[List each failing dimension with a one-sentence explanation of why it matters]

Quick questions to fill the gaps:

[Only ask about the failing dimensions — not all 7]
```

After answers, patch `SPEC.md`. Show changes. Proceed to Phase 6.

**Score 0-3:** The spec is too vague for autonomous operation. Do not launch. Tell the user:

```
This spec has too many gaps for an agent to operate without asking you questions mid-run (which would stall the loop).

Missing:
[List failing dimensions]

Let's fix this properly. I'll ask you the key questions:
[Ask only about failing dimensions]
```

After answers, rewrite the spec. Show it. Ask for confirmation. Then proceed to Phase 6.

---

## Phase 6 — Loop Runner Setup

**Check:**
Look for a loop runner script. Check for:
- `run-loop.sh` or `loop.sh` in project root
- `.opencode/run-loop.sh`

**If missing:**
Create `.opencode/run-loop.sh` from `references/run-loop-template.sh`. Make it executable.

Also check for `progress.txt` and `PROMPT.md` in the project root. Create them if missing:

**PROMPT.md** — the instruction the loop reads every iteration:
```markdown
Read AGENTS.md and SPEC.md carefully.

Check progress.txt to see what's already been completed.
Review git log: `git log --oneline -10`

Steps:
1. Read progress.txt — what acceptance criteria are already done?
2. Pick the next incomplete criterion from SPEC.md
3. Implement it (run tests/lint/typecheck as you go)
4. Run the full verification sequence from SPEC.md
5. Append a summary to progress.txt: what you did, what passed, what's next
6. Commit with a conventional message: feat:/fix:/test:/docs:

If ALL acceptance criteria pass (all commands exit 0):
Output exactly: <promise>COMPLETE</promise>

If stuck on one criterion for more than 3 tool calls, write a note in progress.txt and move to the next criterion.
```

**progress.txt** — starts empty with a header:
```
# Loop Progress

Started: [timestamp]
Spec: SPEC.md

## Completed Criteria
(agent appends here)

## Notes
(agent appends blockers/notes here)
```

Tell the user what was created.

---

## Phase 7 — Pre-Launch Summary and Launch

Show the user a pre-launch checklist:

```
✅ OpenCode installed
✅ Config: [path to opencode.json]
✅ Agents: looper (primary), planner (subagent), builder (subagent)
✅ AGENTS.md: [path]
✅ SPEC.md: [path] — [N]/7 spec dimensions passing
✅ Loop runner: .opencode/run-loop.sh
✅ PROMPT.md ready
✅ progress.txt initialized

Ready to launch.

Start command:
  bash .opencode/run-loop.sh

Or manually for a single iteration:
  opencode run --agent looper --continue "$(cat PROMPT.md)"

Max iterations default: 50 (edit MAX_ITERATIONS in run-loop.sh to change)
The loop stops when the agent outputs <promise>COMPLETE</promise> or max iterations is reached.

Launch now? (yes/no)
```

**If user says yes:** output:
```bash
bash .opencode/run-loop.sh
```
And instruct:
```
Run that command in your terminal from the project root.
Watch progress.txt to track what the agent has done.
The loop will exit automatically when all acceptance criteria pass.
```

**If user says no:** say:
```
All setup is complete. Run it whenever you're ready:
  bash .opencode/run-loop.sh
```

---

## Edge Cases and Recovery Responses

### "The agent keeps asking me questions mid-loop"
Check `.opencode.json` — the primary agent must have `"question": "deny"`. If it's `"ask"`, update it and restart.

### "The loop never exits / runs forever"
Check SPEC.md — all acceptance criteria must be shell-verifiable. Check PROMPT.md — it must include the `<promise>COMPLETE</promise>` instruction. Verify the completion signal is in AGENTS.md.

### "The agent is editing files it shouldn't"
Add the protected paths to the `🚫 Never` section of AGENTS.md and to SPEC.md constraints. Restart the loop.

### "The agent claims done but tests fail"
The PROMPT.md must require all verification commands exit 0 BEFORE outputting the completion token. Re-check PROMPT.md.

### "The loop hit max iterations"
Check `progress.txt` — what did the agent get stuck on? Either fix the blocker manually, then restart (`opencode run --agent looper --continue "$(cat PROMPT.md)"`), or increase `MAX_ITERATIONS` in `run-loop.sh`.

### "opencode run: command not found after install"
The npm global bin directory may not be in PATH. Run: `export PATH="$PATH:$(npm config get prefix)/bin"` and add it to `.bashrc`/`.zshrc`.

---

## File References

- `references/opencode-config-template.json` — full `.opencode.json` with looper/planner/builder
- `references/agents-md-template.md` — AGENTS.md scaffold with all required sections
- `references/spec-template.md` — SPEC.md scaffold with all 7 dimensions
- `references/run-loop-template.sh` — bash infinite loop script with completion detection
