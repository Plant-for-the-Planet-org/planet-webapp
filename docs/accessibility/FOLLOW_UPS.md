# Accessibility Follow-Ups

Potential future tasks identified during accessibility remediation. These are intentionally **out of scope** for the finding that surfaced them and are tracked here so they are not lost. This file is separate from `ACCESSIBILITY_FINDINGS.md`, which is kept unchanged until each finding is verified.

---

## FU-001 — Introduce a reusable `IconButton` component

**Status:** Implemented — `IconButton` added and A11Y-002 sites migrated (see [Implementation notes](#implementation-notes-fu-001)).
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

- [x] `IconButton` (and link variant) added with a required `label` prop.
- [x] Icon auto-hidden and layout-neutral; existing styling preserved.
- [x] Lint/type checks fail when `label` is missing.
- [x] A11Y-002 sites migrated incrementally (no behaviour/visual change).
- [x] Storybook entry + usage docs.

### Implementation notes (FU-001)

- **Component:** `src/features/common/IconButton/index.tsx` (+ `IconButton.module.scss`). Discriminated union on `elementType` (`'button'` default | `'link'`), mirroring `WebappButton`. Required `label` → `aria-label`; `type="button"` default (overridable); `children` auto-wrapped in `<span aria-hidden="true" style={{ display: 'contents' }}>`; extends `ButtonHTMLAttributes`/`AnchorHTMLAttributes` and forwards the rest; `forwardRef` to the underlying `<button>`/`<a>`. Link variant localizes internal `href` and renders a plain `<a target rel>` for external URLs.
- **Base class is intentionally minimal** (`color`/`text-decoration`/`cursor` only): it imposes no `display` (a flex context can resize an unsized SVG) and no `border`/`padding`/`margin`/`background` (those come from the global `button` reset at a specificity that correctly loses to per-site classes). Per-site `className` owns all layout.
- **Storybook:** `src/features/common/stories/IconButton.stories.tsx` (autodocs usage docs + button/link stories).
- **Migrated sites:** ErrorPopup, CookiePolicy, SignInButton (mobile), CarouselSlider, RedeemCode (Enter/Successfully/Failed), DirectGift, ProjectSearchAndFilter (search + filter), ActiveSearchField, ProjectSnippet ImageSection (back), ImageSlider, ImageSliderModal, Account modals (Cancel/Edit/Pause/Reactivate — also dropped redundant `role`/`tabIndex`/`onKeyPress`), DonationInfoPopover, DonorAddressList (edit), TargetsModal, ShareModal (5 social buttons), Footer logo links (pfp, unDecade).
- **Deliberately not migrated (documented):**
  - `UserProfileButton` — image-primary button (profile avatar `<img>`), not icon-only; `.profileImageButton > img` direct-child CSS would break under the wrapper. Already correctly labelled.
  - Footer's 6 social links — hand-authored inline `<svg aria-hidden="true">` that already satisfy A11Y-002 the sanctioned inline-svg way; routing through `IconButton` would add a redundant `aria-hidden` layer. Migrate later by first extracting each SVG into an icon component, if consistency is desired.

### References

- Finding: `ACCESSIBILITY_FINDINGS.md` → A11Y-002.

---

## FU-002 — Fix conditional Hook call in `WebappButton`

**Status:** Open.
**Origin:** Surfaced while extracting the shared `isExternalUrl` helper into `src/utils/url.ts` (deduplicating URL detection shared with `IconButton`).
**Priority:** Medium — code-health / correctness (Rules of Hooks violation), not user-facing today.

### Background

In `src/features/common/WebappButton/index.tsx`, the `link` branch calls `useCallback` inside an `if (isExternal)` block. React Hooks must be called unconditionally at the top level of a component; a conditional call breaks the Rules of Hooks and can cause subtle bugs if the branch a control takes changes between renders (e.g. a URL that flips between internal and external).

```tsx
if (otherProps.elementType === 'link') {
  const isExternal = isExternalUrl(otherProps.href);
  if (isExternal) {
    const handleMouseEnter = useCallback(() => { ... }, [...]); // conditional Hook
    ...
  }
}
```

### Proposal

Hoist `handleMouseEnter` (and any other Hooks) above the conditional so they run on every render, or restructure the link branch so the Hook is not gated by `isExternal`. Keep the prefetch-on-hover behaviour unchanged.

### Suggested acceptance criteria

- [ ] No Hook is called conditionally; `react-hooks/rules-of-hooks` passes with no disable comment.
- [ ] External-link hover prefetch behaviour is unchanged.
- [ ] No behavioural/visual change for internal or button variants.

### References

- File: `src/features/common/WebappButton/index.tsx` (link branch).
- Related: shared `isExternalUrl` helper in `src/utils/url.ts`.
