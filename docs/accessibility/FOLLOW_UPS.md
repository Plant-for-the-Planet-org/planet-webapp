# Accessibility Follow-Ups

Potential future tasks identified during accessibility remediation. These are intentionally **out of scope** for the finding that surfaced them and are tracked here so they are not lost. This file is separate from `ACCESSIBILITY_FINDINGS.md`, which is kept unchanged until each finding is verified.

---

## FU-001 — Introduce a reusable `IconButton` component

**Status:** Proposed (not started)
**Origin:** Surfaced during A11Y-002 (icon-only buttons and links without accessible names).
**Priority:** Medium — code-health / regression-prevention, not a user-facing defect.

### Background

A11Y-002 remediation applied the same three-part pattern to ~23 files and 30+ controls:

1. `type="button"` on every `<button>`.
2. A localized `aria-label` from the file's i18n namespace.
3. The decorative icon hidden from assistive tech — `aria-hidden="true"`, applied via a `<span aria-hidden="true" style={{ display: 'contents' }}>` wrapper for icon components (which do not forward props), or directly on inline `<svg>` elements.

This pattern is easy to forget on new icon controls, which is how the original gaps appeared.

### Proposal

A shared primitive that makes an accessible name mandatory and applies the pattern internally:

```tsx
// label is required by the type; type defaults to "button"; children are auto-hidden
<IconButton
  label={t('close')}
  onClick={handleClose}
  className={styles.closeButton}
>
  <CloseIcon />
</IconButton>
```

Responsibilities:

- Sets `type="button"` (overridable).
- Applies `aria-label={label}` (required prop — build fails if omitted).
- Wraps children so the decorative icon is `aria-hidden` and layout-neutral (`display: contents`).
- Forwards `className`, `onClick`, `ref`, and other button props.
- A link variant (or `as`/`component` prop) for icon-only links that need the same guarantees.

### Why deferred (not implemented in the A11Y-002 PR)

- **Scope discipline** — A11Y-002 is a bounded, review-driven fix; a new shared primitive plus migrating ~23 files is a much larger refactor than the finding warrants.
- **Reviewability** — the A11Y-002 PR is many small, uniform, low-risk diffs that verify one-by-one; adding an abstraction would couple the a11y fix to an API-design decision.
- **Risk isolation** — API iteration (prop shape, styling passthrough, `forwardRef`, MUI interop) should not block or destabilize the accessibility work.
- **Sequencing** — best landed as its own change _after_ A11Y-002 is verified, then migrate existing sites incrementally using the A11Y-002 fixes as the reference implementation.

### Suggested acceptance criteria

- [ ] `IconButton` (and link variant) added with a required `label` prop.
- [ ] Icon auto-hidden and layout-neutral; existing styling preserved.
- [ ] Lint/type checks fail when `label` is missing.
- [ ] A11Y-002 sites migrated incrementally (no behaviour/visual change).
- [ ] Storybook entry + usage docs.

### References

- Finding: `ACCESSIBILITY_FINDINGS.md` → A11Y-002.

---

## FU-002 — Give the BulkCodes "notify" select an accessible name via `ReactHookFormSelect`

**Status:** Proposed (not started)
**Origin:** Surfaced during A11Y-005 (form fields labelled only by placeholder / empty label).
**Priority:** Medium — one remaining unlabeled control; same WCAG defect as A11Y-005.

### Background

A11Y-005 gave accessible names to every placeholder-only / `label=""` input it listed, **except** the "notify" select in `RecipientFormFields.tsx:77`:

```tsx
<ReactHookFormSelect name="recipient_notify" label="" control={control} size="small">
```

This select renders through the shared wrapper `src/features/common/InputTypes/ReactHookFormSelect.tsx`, which does **not** forward `aria-label`, `inputProps`, or `SelectProps` to the underlying MUI `TextField`. So the select's input cannot receive an accessible name from `RecipientFormFields.tsx` alone — the wrapper must be extended. That is a second, shared file, so it was deliberately kept out of the one-file-at-a-time A11Y-005 fix.

### Proposal

Add a minimal, backward-compatible accessible-name passthrough to `ReactHookFormSelect`, then wire it up at the call site:

```tsx
// ReactHookFormSelect.tsx — new optional prop, forwarded to the input
'aria-label'?: string;
...
<TextField select label={label} inputProps={{ 'aria-label': ariaLabel }} ... />
```

```tsx
// RecipientFormFields.tsx — reuse the existing column-header key
<ReactHookFormSelect
  name="recipient_notify"
  label=""
  aria-label={t('tableHeaders.recipient_notify')}
  control={control}
  size="small"
>
```

### Why deferred (not implemented in the A11Y-005 fix)

- **One-file-at-a-time discipline** — A11Y-005 was reviewed one listed file at a time; touching the shared wrapper is a separate change with its own blast radius.
- **Shared blast radius** — `ReactHookFormSelect` is reused elsewhere; the passthrough must stay optional and backward-compatible, and those call sites should be spot-checked.

### Suggested acceptance criteria

- [ ] `ReactHookFormSelect` accepts an optional `aria-label` and forwards it to the select input (`inputProps`).
- [ ] Change is backward-compatible; existing usages unaffected (no visible-label or behaviour change).
- [ ] `RecipientFormFields.tsx` notify select announces `tableHeaders.recipient_notify` ("Send Email?").
- [ ] Verified with a screen reader and axe (`select-name`).

### References

- Finding: `ACCESSIBILITY_FINDINGS.md` → A11Y-005.
- Call site: `src/features/user/BulkCodes/components/RecipientFormFields.tsx:77`.
- Wrapper: `src/features/common/InputTypes/ReactHookFormSelect.tsx`.
