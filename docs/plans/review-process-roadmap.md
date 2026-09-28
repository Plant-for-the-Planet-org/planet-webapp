# Review process roadmap

A playbook you can use now on any PR, plus a roadmap of tooling and author-side changes to
build later. Tests are large enough to sit in their own doc: see
[testing-roadmap.md](./testing-roadmap.md).

> Status: roadmap. The playbook below is usable now; the tooling and PR-splitting items are not
> built yet.

## Where this came from

Written after reviewing a large Context to Zustand migration (108 files, PR 2837). The review
was solid but slow. This doc keeps what worked (a deep read of the risky files) and fixes what
was slow: manual origin checks, hand renumbering, style rules that surfaced late, a large tail
that went unreviewed, and no tests. It is written to fit any PR, not just that migration. The
running second example is a feature PR, the shadcn Payments hub (#2989, 82 files, targets
`feature/shadcn-base`).

## The playbook (use now, any PR)

### 1. Pick the diff base

Measure everything against the PR's target branch, not always `develop`. The migration in #2837
targeted `develop`; #2989 targets `feature/shadcn-base`. "What changed" and origin are all
relative to that base.

### 2. Tier by risk, spend time top-heavy

Rank changed files by how much damage a bug would do, then read in that order:

- Tier 1: shared state and data flow (stores, hooks, context, fetching, caching).
- Tier 2: security and money (auth, permissions, payments, PII, headers).
- Tier 3: fresh decisions (genuinely new logic, merge-conflict resolutions, removed or replaced
  code paths).
- Tier 4: gated consumers (screens that read the above but sit behind a gate).
- Tier 5: rote changes (renames, mechanical swaps). Skim as a group.

Deep-walk Tiers 1 to 3. Set the tier contents per PR. For #2989: Tier 1 is the payments data
hooks and the filter/deep-link state; Tier 2 is payment-method remove and the auth gate;
Tier 3 is the removed `/profile/history` and `/recurrency` pages and the PlanetCash redirect.

### 3. Classify origin (mainly for refactors and ports)

For each finding ask: Regression (this PR broke it), Pre-existing (inherited), or New (this
PR's own new code). This matters most for refactors, ports, and migrations. For a greenfield
feature PR, the useful version is: "what existing behavior does this change or remove, and is
that intended?"

Evidence commands (base = the target branch):

- exists on base? `git show <base>:<file>`
- what changed: `git diff <base>...HEAD -- <file>`
- who introduced a line: `git log -S "<snippet>"`

Moved code (important): when a PR moves code between files (the migration moved context into
the store), diffing the same path shows nothing useful, because the new path has no history on
the base. Handle it one of two ways:

- compare the new file against the OLD file by its old path: `git show <base>:<oldpath>`
  against the new file;
- or use `git log -S "<snippet>"`, which finds where a line came from regardless of file.

### 4. Split coverage: deep read plus parallel tail

Deep-walk Tiers 1 to 3 by hand. In parallel, send review agents across the Tier 4 to 5 tail so
it does not go unreviewed (the migration review never reached that tail). Verify each agent
finding against the diff (exact file and line, observed behavior) and drop the ones you cannot
confirm; agent findings include false positives, so this check comes before they reach the
author. Then merge and dedupe the rest into the same list. This adds coverage; it does not
replace the deep read.

### 5. Findings doc: one number each, assigned once

Each finding: number, one-line title, `file:line`, severity, origin tag, action tag, why it
matters. Assign numbers once, in reading order, after the first full draft. Do not renumber by
hand while drafting. If you must reorder later, use the renumber helper (see Tooling below).

### 6. Style contract

- simple, short English;
- avoid words with more than one reading (for example "invariant"); say the plain meaning;
- no shorthand labels in the doc (for example "E3/E4");
- drop extra qualifiers ("honest", "basically", "just", "actually");
- avoid em dash;
- only edit `en` locale files.

## What the review produces (output docs)

One doc is always produced; the rest are situational, scaled to the PR.

- Findings doc (always): the numbered findings from step 5, grouped P1 then P2. This is what
  goes to the author. Example name: `<pr>-review-points.md`.
- Self-review guide (large PRs): a tiered, file-by-file map so the author/reviewer can manually
  review the PR, with where to spend time and what to check per file. Example:
  `<pr>-self-review-guide.md`.
- Architecture notes and diagrams (shape-level PRs): when the PR has design problems that span
  files, a short notes section plus Mermaid diagrams of the current and target shape. Example:
  `<pr>-architecture-diagram.md`.
- Migration reference (ports and migrations only): a table of what moved where, to check the
  port is faithful. Example: `<pr>-values-moved.md`.

Where these live is the team's call. Keep them in `docs/reviews/` while reviewing, but do not
commit the findings. Before the PR merges, convert what remains into issues or plan documents
and close out the rest, so the findings do not ship in the repo.

## Tooling to build later

Small helpers that remove the repeated manual steps. None exist in the repo today (confirmed:
no `.claude/` commands or skills, one repo script, `npm run lint` plus eslint/Cypress CI).

### origin helper

Prints the origin evidence for a file in one call: merge-base, exists-on-base, diff against
base, and an optional `git log -S` snippet search. Two modes:

- same-file: `origin <file>`
- moved code: `origin <newfile> --old <oldpath>`, since moved code has no history at the new
  path.

Build it in Node to match the repo stack (the throwaway version used during the migration
review was Python). Default the base to the branch's PR target.

### renumber helper

Reads the findings doc, numbers findings by reading order, and updates every `#N` and
`point N` reference across the review docs. Protects non-finding hashes: hex colors, PR
numbers, and phrases like "merge conflict #N". Node, same reason. (The migration-review version
was a throwaway Python script.)

### review slash command

A `.claude/commands/review-pr.md` that runs the playbook end to end: pick base, tier the
files, fan out the tail agents, deep-walk Tiers 1 to 3, call the origin helper per finding, and
run the renumber helper before finishing.

## Author-side: split large PRs

The root cause of slow reviews is PR size. For large refactors and migrations, ship a stack of
review-sized PRs instead of one blob. Pattern for a Context to store move: stand the new store
up next to the old context, migrate consumers in groups, delete the old context last. Add one
line to `.github/pull_request_template.md` pointing large or migration PRs here.

## Refining this over time

Treat this as a living doc. After each review, note what worked and what slowed you down, and
propose changes here, so the process improves review to review rather than staying fixed.

Before adopting a change that affects how the whole team reviews (the tiers, the style
contract, the output-doc policy, what gets committed, or tooling behavior), check whether the
team has been consulted, or needs to be. A personal workflow tweak can just be adopted; a
shared-process change needs team sign-off first. State which kind each proposed change is.

## Tasks (build backlog)

The playbook above is usable now with no build. These make it faster. The slash command depends
on the two helpers. See the sections above for detail.

- [ ] PR template: add a line to `.github/pull_request_template.md` pointing large or migration
      PRs to the splitting pattern above.
- [ ] origin helper (Node): `origin <file>` and `origin <newfile> --old <oldpath>`; prints
      merge-base, exists-on-base, diff against base, and an optional `git log -S`; default the
      base to the PR target.
- [ ] renumber helper (Node): number findings by reading order; update `#N` and `point N`
      references across the review docs; protect hex colors, PR numbers, and "merge conflict #N".
- [ ] review slash command `.claude/commands/review-pr.md`: run the playbook end to end (uses
      the two helpers).
