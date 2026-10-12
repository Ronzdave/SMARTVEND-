# SmartVend — Agent-Development Workshop Playbook

For the seminar task: **use an AI agent to make one bounded change on our
capstone, following the agent-development discipline.** Teams are picked at
random to present, so everyone runs this. This repo is already set up for it.

---

## 0. What to bring (already done in this repo)
- ✅ **Working repository** with known commands.
- ✅ **Run / test / build commands:** `npm start`, `npm test`, `npm run build`,
  `npm run validate` (no `npm install` needed — Node 18+ only).
- ✅ **Mock / test data:** open the UI at `#preview` for a sample RFID tap,
  wallet, and admin data.
- ✅ **A candidate feature already built on a branch** as our fallback demo:
  `feat/affordable-pages`.

## 1. Scope rules (do this first, every time)
1. **Branch off** — never work on `main`:
   ```bash
   git checkout main
   git checkout -b feat/<your-change>
   ```
2. **One bounded change.** Pick ONE small feature or refactor. Not two.
3. **Preserve the baseline.** `main` must always still run. If the branch
   breaks, we demo `main` + the prepared fallback branch.
4. **Version control.** Commit only after the checks pass.

## 2. The agent-development loop — Inspect → Plan → Implement → Verify → Review
Run these as five explicit steps and narrate them when presenting:

| Step | What you do | What to say in the demo |
|---|---|---|
| **Inspect** | Point the agent at the relevant files only (`index.html`, `src/pricing.mjs`). | "We scoped it to these files." |
| **Plan** | Ask the agent to propose a plan + list files it will change. **You approve** before it writes code. | "It proposed X; we approved." |
| **Implement** | Let the agent write the code — the boilerplate. You orchestrate. | "Agent wrote it, we reviewed each change." |
| **Verify** | Run the checks and show they pass (evidence below). | Show the terminal output. |
| **Review** | Read the diff (`git diff`), confirm no out-of-scope / backend / secret changes, confirm existing behavior still works. | "Diff is small, scoped, baseline intact." |

## 3. Permissions, secrets & risky actions (the rules from the talk)
- **Never feed secrets to the agent.** No `.env`, no API keys. This UI needs
  none; the admin password is verified server-side (hashed on the SD card).
  Keys live in `.env` (git-ignored) — see `.env.example`.
- **Approve risky actions yourself.** Refactors and data-model changes need a
  human OK. The agent proposes; you decide.
- **You own the result.** If you can't explain a change, don't ship it.

## 4. Verification evidence (run this, screenshot it)
```bash
npm run validate
```
That runs, in order:
1. `type-check` — static syntax check of the scripts.
2. `test` — unit + smoke tests (should read `# pass 13  # fail 0`).
3. `build` — validates the page, checks pricing has not drifted, writes
   `dist/index.html`.

Then **manual UI check** (the talk stressed this):
```bash
npm start        # http://localhost:8080/#preview
```
- Tap through: RFID → dashboard → upload a PDF → select pages → options → print.
- Resize the browser narrow/wide to confirm the layout is responsive.
- Toggle your OS light/dark mode.

## 5. Our prepared feature (the fallback demo)
Branch `feat/affordable-pages` (already committed):
- **Refactor:** pricing rules pulled into a tested module `src/pricing.mjs`
  (source of truth) with 10 unit tests.
- **Feature:** the dashboard now shows *"≈ N pages (Short Bond, B&W)"* computed
  from the wallet balance.
- **Safety:** `build.mjs` fails if `index.html` pricing drifts from the module —
  a real "confirm existing behavior" check.

Show it:
```bash
git checkout feat/affordable-pages
npm run validate      # evidence: 13 tests pass, build OK
git diff main --stat  # small, scoped diff
npm start             # open #preview, log in, see the hint on the dashboard
```

## 6. A live change to attempt (paste this to the agent)
> Work only in `index.html` and, if needed, `src/pricing.mjs` and `test/`.
> Do not touch the `/api/...` firmware contract or any secrets. First propose a
> short plan and list the files you'll change; wait for my approval. Then add a
> **search box on the student Transaction History screen** that filters the list
> as I type (match on the description text). Keep the existing accessibility
> (ARIA, 44px targets, light/dark). Add or update a unit test if you add logic.
> When done, run `npm run validate` and confirm it passes, then show me the diff.

Other bounded options if you prefer: a **date filter** on admin transactions; a
**"Select odd/even pages"** shortcut on page selection; a **receipt reference
number**; extracting **phone validation** fully into `src/pricing.mjs`.

## 7. If something breaks under pressure
```bash
git checkout .            # discard uncommitted changes
git checkout main         # back to the safe baseline
git checkout feat/affordable-pages   # or present the prepared feature
```
The baseline always runs, so you always have something to show.
