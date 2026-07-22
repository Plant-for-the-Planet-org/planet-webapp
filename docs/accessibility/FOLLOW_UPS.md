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

## FU-002 — Unify the address autocomplete implementation

**Status:** Proposed (not started)
**Origin:** Surfaced during A11Y-006 (address suggestion listbox not keyboard operable).
**Priority:** Medium — code-health / regression-prevention, not a user-facing defect.

### Background

A11Y-006 replaced the bespoke `role="listbox"` autocomplete in `SignupAddressField.tsx` with a MUI `Autocomplete`. That is the same accessible pattern already implemented in `AddressInput.tsx` and consumed by `AddressForm.tsx`. As a result two near-identical address autocompletes now exist, each carrying its own copy of the geocoder wiring:

- `src/features/user/CompleteSignup/components/SignupAddressField.tsx`
- `src/features/user/Settings/EditProfile/AddressManagement/microComponents/AddressInput.tsx` (+ `AddressForm.tsx`)

Both duplicate the same logic: debounced `getAddressSuggestions`, a `latestRequestIdRef` race guard, and `getAddressDetailsFromText` selection parsing that fans the result into `address` / `city` / `zipCode`.

### Proposal

Extract a single shared address-autocomplete component (or hook) that both call sites use:

- Component owns the MUI `Autocomplete` markup, `freeSolo`, `filterOptions` passthrough, and `getOptionLabel`.
- A companion hook (e.g. `useAddressSuggestions`) owns the debounced fetch, request-ID race guard, and address-detail parsing.
- Support a `fullWidth` / styling prop so the signup form (whose container uses `align-items: center`, so children do **not** stretch) and the settings form (flex-stretch layout) can share one component without a width regression.

### Why deferred (not implemented in the A11Y-006 PR)

- **Scope discipline** — A11Y-006 is a bounded, single-finding fix; extracting a shared component and migrating both call sites is a larger refactor than the finding warrants.
- **Risk isolation** — `AddressForm.tsx` is out of scope for A11Y-006; the shared-component API (props, styling passthrough) should not destabilize a verified a11y fix.
- **Sequencing** — best landed after A11Y-006 is verified, using both current implementations as the reference.

### Suggested acceptance criteria

- [ ] Shared address-autocomplete component + suggestions hook added.
- [ ] `SignupAddressField.tsx` and `AddressForm.tsx` both migrated to it.
- [ ] No behaviour or visual change at either call site (signup field stays full-width).
- [ ] Keyboard/screen-reader combobox behaviour preserved (Arrow/Enter/Escape, `aria-activedescendant`).

### References

- Finding: `ACCESSIBILITY_FINDINGS.md` → A11Y-006.
