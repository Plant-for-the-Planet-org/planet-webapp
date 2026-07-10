# Accessibility Findings Report

Repository-wide accessibility (a11y) inventory for **planet-webapp** (Next.js 14 pages router, React 18, MUI 5, Emotion).

- Scope audited: `src/features/common` (Layout, inputs, loaders, shared), `src/features/donations`, `src/features/projectsV2`, `src/features/user` (Account, Profile, Settings, CompleteSignup, DonationReceipt, BulkCodes, GiftFunds, PlanetCash, ManagePayouts, ManageProjects, Widget, TreemapperMigration), and `pages/`.
- Only confirmed, evidence-based accessibility issues are listed. Native MUI components are treated as accessible unless props clearly break them.
- Recurring issues are merged into pattern-level findings that list every affected file. See [Repeated Accessibility Patterns](#repeated-accessibility-patterns).

> Not covered here: automated color-contrast ratios were only assessed where hardcoded low-contrast values were visible. A dedicated axe / Lighthouse contrast pass is still recommended. Map raster layers (mapbox/maplibre) have an inherent lack of text alternatives; a text summary near each map is recommended rather than per-layer ARIA.

**Remediation status legend:** 🔴 Open · 🟡 Remediated in code, pending verification · 🟢 Verified. Findings without a **Status** row are still 🔴 Open. Line references in each finding reflect the code at audit time.

---

## Table of Contents

- [Critical Findings](#critical-findings)
- [High Findings](#high-findings)
- [Medium Findings](#medium-findings)
- [Low Findings](#low-findings)
- [Repeated Accessibility Patterns](#repeated-accessibility-patterns)
- [Repository Summary](#repository-summary)

---

## Critical Findings

### A11Y-001 — Clickable `div`/`span`/`li`/`time` used as interactive controls

| | |
|---|---|
| **Severity** | Critical |
| **Category** | Keyboard Navigation |
| **Component / Feature** | App-wide (nav, cards, dropdowns, wizard, account, signup) |
| **Effort** | Large (many sites) |
| **Priority Score** | 100 / 100 |
| **Status** | 🟡 Remediated in code (2026-07-10) — pending verification |

**Remediation:** All listed files converted from clickable `div`/`span`/`li`/`time` to native semantic controls: `<button>` for actions/toggles, `next/link` for the TPO-name navigation, and `role="checkbox"` + `aria-checked` for the ManageProjects wizard multi-selects. Selected/toggle state is exposed via `aria-pressed`/`aria-checked`; the invalid `aria-selected` on `role="button"` in TimeTravelDropdown was removed. Styling preserved via the global `button` reset plus per-case `font`/width/`text-align` resets; no behaviour or analytics changes. Line numbers below reflect the pre-fix code and are kept for historical reference.

_Still pending:_ automated (axe/Lighthouse) and manual AT verification. Deferred sub-items tracked under their own findings: accessible names for icon-only controls (A11Y-002), `aria-expanded` on disclosure toggles (A11Y-021), and full `listbox`/`option` semantics for TimeTravelDropdown (A11Y-020).

**File(s) & Line(s):**
- `src/features/common/CopyToClipboard/index.tsx:43`
- `src/features/common/Layout/UserLayout/UserLayout.tsx:276`
- `src/features/common/Layout/UserLayout/NavLink.tsx:162`
- `src/features/projectsV2/TimeTravelDropdown/index.tsx:110`, `:131`
- `src/features/projectsV2/ProjectSnippet/microComponents/TpoName.tsx:53`
- `src/features/projectsV2/ProjectsMap/SiteMapLayerControls/SiteLayerDropdown.tsx:49`
- `src/features/projectsV2/ProjectsMap/SiteMapLayerControls/SiteLayerOptions.tsx:73`
- `src/features/projectsV2/ProjectsMap/SiteMapLayerControls/LayerInfoTooltip.tsx:10`
- `src/features/user/ManageProjects/components/DetailedAnalysis.tsx:774`, `:820`, `:1165`
- `src/features/user/ManageProjects/components/ProjectSpending.tsx:317`
- `src/features/user/ManageProjects/components/ProjectCertificates.tsx:324`
- `src/features/user/Settings/ApiKey/ApiKeyForm.tsx:26`
- `src/features/user/CompleteSignup/components/SignupHeader.tsx:12`
- `src/features/user/Settings/ImpersonateUser/ImpersonationActivated.tsx:26`
- `src/features/user/Account/components/AccountRecord.tsx:85`
- `src/features/user/Account/components/RecurrencyRecord.tsx:157`
- `src/features/user/Account/History.tsx:73`, `:142`

**Issue Description:** These controls use `<div onClick>` (sometimes `<time>`/`<li>`) with no `role`, no `tabIndex`, and no keyboard handler. They cannot be focused or activated by keyboard, and expose no role or state to assistive technology.

**Root Cause:** Elements were styled to look like buttons/links and given `onClick` handlers instead of using native `<button>`/`<Link>`. No shared clickable primitive enforces semantics.

**User Impact:**
- *Keyboard users:* Cannot reach or activate the control at all (copy, open mobile menu, filter, expand records, select required project data, exit impersonation, go back in signup).
- *Screen reader users:* Element is not announced as an actionable control; state (selected/expanded) is not conveyed.
- *Low vision users:* Focus indicator never appears because the element is not focusable.
- *Cognitive:* Inconsistent interaction model (some things look clickable but behave differently).
- *Mobile AT users:* Swipe navigation skips the control; not exposed in the rotor/controls list.

Note: `DetailedAnalysis.tsx` multi-select "checkboxes" gate wizard submission, so this fully blocks keyboard completion of project creation.

**WCAG Mapping:** 2.1.1 Keyboard (A); 4.1.2 Name, Role, Value (A)

**Current Code (representative):**
```tsx
<div className={styles.copyButton} onClick={handleClick}>
  <CopyIcon />
</div>
```

**Recommended Fix:** Replace with a native `<button type="button">` (or `next/link` for navigation). Where a `<div>` is truly unavoidable, add `role="button"`, `tabIndex={0}`, and an Enter/Space `onKeyDown`. For selectable options, use `aria-pressed` (toggle) or the `listbox`/`option` pattern; for real checkboxes use `<Checkbox>` + `<FormControlLabel>`.

**Example Fix:**
```tsx
<button type="button" onClick={handleClick} aria-label={t('copy')} className={styles.copyButton}>
  <CopyIcon aria-hidden="true" />
</button>

// selectable option
<button type="button" aria-pressed={isSelected} onClick={onSelect}>{label}</button>
```

**Testing Steps:**
- *Keyboard:* Tab to the control, confirm a visible focus ring, activate with Enter and Space.
- *Screen reader:* NVDA/VoiceOver announces role "button" plus name; toggles announce pressed/not pressed.
- *Browser:* Chrome + Firefox; verify no double activation.
- *Automated:* axe-core rule `button-name`, eslint-plugin-jsx-a11y `no-static-element-interactions` / `click-events-have-key-events`.

---

### A11Y-002 — Icon-only buttons and links without accessible names

| | |
|---|---|
| **Severity** | Critical |
| **Category** | Links & Buttons |
| **Component / Feature** | App-wide (close, edit, search, filter, social, media, map) |
| **Effort** | Medium (best solved with a shared component) |
| **Priority Score** | 96 / 100 |

**File(s) & Line(s):**
- `src/features/common/Layout/Footer/index.tsx:117`–`342` (social), `:373`–`409` (logos)
- `src/features/common/Layout/Navbar/microComponents/SignInButton.tsx:44`
- `src/features/common/Layout/Navbar/microComponents/UserProfileButton.tsx:38`
- `src/features/common/Layout/ErrorPopup/index.tsx:56`
- `src/features/common/Layout/CookiePolicy/index.tsx:47`
- `src/features/common/CarouselSlider/index.tsx:33`
- `src/features/common/RedeemCode/EnterRedeemCode.tsx:36`, `SuccessfullyRedeemed.tsx:26`, `RedeemFailed.tsx:27`
- `src/features/donations/components/DirectGift.tsx:36`
- `src/features/projectsV2/ProjectListControls/microComponents/ProjectSearchAndFilter.tsx:35`, `:40`
- `src/features/projectsV2/ProjectListControls/microComponents/ActiveSearchField.tsx:68`
- `src/features/projectsV2/ProjectSnippet/microComponents/ImageSection.tsx:124` (back)
- `src/features/projectsV2/ProjectDetails/components/ImageSlider.tsx:49`
- `src/features/projectsV2/ProjectDetails/components/microComponents/ImageSliderModal.tsx:61`
- `src/features/user/DonationReceipt/microComponents/DonationInfoPopover.tsx:47`
- `src/features/user/DonationReceipt/microComponents/DonorAddressList.tsx:103`
- `src/features/user/Profile/ForestProgress/TargetsModal.tsx:124`
- `src/features/user/Profile/ProfileCard/ShareModal/index.tsx:81`–`126` (5 social buttons)
- `src/features/user/Account/CancelModal.tsx:110`, `EditModal.tsx:153`, `PauseModal.tsx:118`, `ReactivateModal.tsx:84`

**Issue Description:** Buttons/links whose only child is an SVG icon, with no `aria-label`, `title`, or visible text. Screen readers announce only "button" or "link" with no purpose.

**Root Cause:** Icons rendered directly inside controls without a text alternative; no shared icon-button component that requires a label.

**User Impact:**
- *Keyboard users:* Can focus but cannot tell what the control does.
- *Screen reader users:* Hear "button"/"link" with no name; cannot decide whether to activate.
- *Low vision users:* Icon meaning may be ambiguous when magnified.
- *Cognitive:* No text reinforcement of the icon meaning.
- *Mobile AT users:* Rotor lists an unnamed control.

**WCAG Mapping:** 4.1.2 Name, Role, Value (A); 2.4.4 Link Purpose (A); 1.1.1 Non-text Content (A)

**Current Code (representative):**
```tsx
<button onClick={onClose}>
  <CloseIcon />
</button>
```

**Recommended Fix:** Add a translated `aria-label`, mark the icon `aria-hidden="true"`, and set `type="button"`. Create a reusable `IconButton` wrapper that requires an `aria-label` prop.

**Example Fix:**
```tsx
<button type="button" onClick={onClose} aria-label={t('close')}>
  <CloseIcon aria-hidden="true" />
</button>

// social link
<a href={facebookUrl} aria-label="Facebook" target="_blank" rel="noreferrer">
  <FacebookIcon aria-hidden="true" />
</a>
```

**Testing Steps:**
- *Keyboard:* Tab to control; confirm focus ring.
- *Screen reader:* Announces meaningful name (e.g. "Close, button").
- *Browser:* Verify label is localized in a non-English locale.
- *Automated:* axe `button-name`, `link-name`; jsx-a11y `anchor-has-content`.

---

## High Findings

### A11Y-003 — Nested interactive elements (`<a>` wrapping `<button>` and vice versa)

| | |
|---|---|
| **Severity** | High |
| **Category** | Semantic HTML |
| **Component / Feature** | Footer, WebappButton, DarkModeSwitch, ManageProjects, ManagePayouts, ProfileCard |
| **Effort** | Medium |
| **Priority Score** | 82 / 100 |

**File(s) & Line(s):**
- `src/features/common/Layout/Footer/index.tsx:117` (`<button><a>…`)
- `src/features/common/WebappButton/index.tsx:72`, `:92` (`<a>`/`<Link>` wrapping `<button>`)
- `src/features/common/Layout/DarkModeSwitch.tsx/index.tsx:11` (`<button>` wrapping checkbox + label)
- `src/features/user/ManageProjects/ProjectsContainer.tsx:103`, `:166`
- `src/features/user/ManagePayouts/components/BankAccountDetails.tsx:144`
- `src/features/user/ManagePayouts/components/NoBankAccount.tsx:16`
- `src/features/user/Profile/ProfileCard/index.tsx:34` (also unlabeled)

**Issue Description:** Two focusable interactive elements are nested for a single action, producing duplicate tab stops and ambiguous semantics. This is invalid HTML.

**Root Cause:** A link was used for styling/navigation and a button re-added inside it (or a wrapping button added around a native input).

**User Impact:**
- *Keyboard users:* Two tab stops for one action; unpredictable activation.
- *Screen reader users:* Conflicting role announcements ("link" then "button").
- *Cognitive:* Confusing focus behavior.
- *Mobile AT users:* Duplicate/ambiguous controls in the rotor.

**WCAG Mapping:** 4.1.1 Parsing; 4.1.2 Name, Role, Value (A)

**Current Code (representative):**
```tsx
<Link href={editUrl}>
  <button><SettingsIcon /></button>
</Link>
```

**Recommended Fix:** Use a single element. Style the `<a>`/`<Link>` directly, or use `<Button component={Link} href=…>` from MUI.

**Example Fix:**
```tsx
<Link href={editUrl} aria-label={t('editProfile')} className={styles.editProfileIcon}>
  <SettingsIcon aria-hidden="true" />
</Link>
```

**Testing Steps:**
- *Keyboard:* Confirm exactly one tab stop per action.
- *Screen reader:* One coherent role + name.
- *Automated:* axe `nested-interactive`.

---

### A11Y-004 — Images with missing or non-descriptive `alt`

| | |
|---|---|
| **Severity** | High |
| **Category** | Images |
| **Component / Feature** | Project cards, profile avatar, tenant logo, media/QR, contributions map, carousel |
| **Effort** | Small–Medium |
| **Priority Score** | 80 / 100 |

**File(s) & Line(s):**
- `src/features/projectsV2/ProjectSnippet/microComponents/ImageSection.tsx:139` (`alt="loading"`), `:148` (`alt="projectImage"`), `:164` (`alt="fallback"`)
- `src/features/user/Settings/EditProfile/EditProfileForm.tsx:265` (avatar, no `alt`)
- `src/features/common/Layout/Navbar/microComponents/SecondaryLogo.tsx:20` (tenant logo, no `alt`)
- `src/features/user/ManageProjects/components/ProjectMedia.tsx:302` (uploaded image, no `alt`)
- `src/features/user/Widget/DonationLink/DonationLinkForm.tsx:276` (QR image, no `alt`)
- `src/features/user/Profile/ContributionsMap/Popup/PopupImageSection.tsx:25` (`alt="projectImage"`)
- `src/features/projectsV2/ProjectDetails/components/microComponents/SingleCarouselImage.tsx:23` (photo rendered as CSS background, no text alternative)

**Issue Description:** Meaningful images announce literal strings ("projectImage", "loading", "fallback") or a filename; decorative placeholders should be silent; a carousel renders photos as CSS backgrounds with no `role="img"`/`aria-label`.

**Root Cause:** Placeholder alt strings left in; project name not passed as `alt`; background-image pattern used for photos.

**User Impact:**
- *Screen reader users:* A wall of "projectImage" announcements; cannot identify content by image; background images are invisible.
- *Low vision users:* No text fallback if images fail to load.
- *Cognitive:* Meaningless alt adds noise.

**WCAG Mapping:** 1.1.1 Non-text Content (A)

**Current Code (representative):**
```tsx
<img alt={'projectImage'} src={imageSource} />
```

**Recommended Fix:** Meaningful images → `alt={projectName}` (or description). Decorative loading/fallback → `alt=""`. Background photos → `role="img" aria-label={description || projectName}`.

**Example Fix:**
```tsx
<img alt={projectName} src={imageSource} />                 {/* meaningful */}
<img alt="" src="/assets/.../default-landscape.png" />      {/* decorative */}
<div role="img" aria-label={imageDescription || projectName} style={{ backgroundImage }} />
```

**Testing Steps:**
- *Screen reader:* Meaningful images read the project name; decorative ones are skipped.
- *Browser:* Disable images; confirm alt text renders for meaningful images.
- *Automated:* axe `image-alt`.

---

### A11Y-005 — Form fields labelled only by placeholder (or empty label)

| | |
|---|---|
| **Severity** | High |
| **Category** | Forms |
| **Component / Feature** | BulkCodes recipients, RedeemCode, project search, project media, target input |
| **Effort** | Small–Medium |
| **Priority Score** | 80 / 100 |

**File(s) & Line(s):**
- `src/features/user/BulkCodes/components/RecipientFormFields.tsx:42`, `:66`, `:77`, `:97`, `:116`
- `src/features/common/RedeemCode/EnterRedeemCode.tsx:48` (`label=""`)
- `src/features/projectsV2/ProjectListControls/microComponents/ActiveSearchField.tsx:57`
- `src/features/user/ManageProjects/components/ProjectMedia.tsx:305`
- `src/features/user/Profile/ForestProgress/TargetFormInput.tsx:72` (label div not associated)

**Issue Description:** Inputs provide only a `placeholder` (or an empty `label=""`) as their name. Placeholders are not accessible names and disappear once the user types.

**Root Cause:** Visible labels were omitted for compact layouts; placeholder text substituted.

**User Impact:**
- *Screen reader users:* Field announced as an unlabeled edit; cannot tell name vs email vs units.
- *Cognitive:* Once typing begins, the field purpose is lost.
- *Low vision users:* Placeholder contrast is typically low.

**WCAG Mapping:** 3.3.2 Labels or Instructions (A); 4.1.2 Name, Role, Value (A); 1.4.3 Contrast (placeholder) (AA)

**Current Code (representative):**
```tsx
<TextField {...field} placeholder="XAD-1SA-5F1-A" label="" />
```

**Recommended Fix:** Provide a real `label`, or a visually-hidden `aria-label` where the visible label must be hidden. For table-cell inputs, associate the column `<th>` or add per-cell `aria-label`.

**Example Fix:**
```tsx
<TextField {...field} label={t('redeemCode')}
  inputProps={{ 'aria-label': t('redeemCode') }} />
```

**Testing Steps:**
- *Screen reader:* Each field announces a meaningful name.
- *Keyboard:* Tab through the form; names persist after typing.
- *Automated:* axe `label`, `select-name`.

---

### A11Y-006 — Address suggestion listbox is not keyboard operable

| | |
|---|---|
| **Severity** | High |
| **Category** | Keyboard Navigation |
| **Component / Feature** | CompleteSignup address field |
| **Effort** | Medium |
| **Priority Score** | 76 / 100 |

**File(s) & Line(s):** `src/features/user/CompleteSignup/components/SignupAddressField.tsx:129`–`151`

**Issue Description:** Custom `role="listbox"` with `role="option"` `<div>`s that only handle `onMouseDown`, have no `tabIndex` and no key handling; `aria-selected` is hardcoded `false`; the listbox is not associated with the input (`aria-controls`/`aria-activedescendant` missing).

**Root Cause:** A bespoke autocomplete was built instead of reusing the MUI `Autocomplete` already used in `AddressInput.tsx`.

**User Impact:**
- *Keyboard users:* Cannot select a suggested address.
- *Screen reader users:* No active-option feedback; selection state always "not selected".
- *Mobile AT users:* Options not exposed as a managed list.

**WCAG Mapping:** 2.1.1 Keyboard (A); 4.1.2 Name, Role, Value (A)

**Current Code (representative):**
```tsx
<div role="listbox">
  {suggestions.map((s) => (
    <div role="option" aria-selected={false} onMouseDown={() => select(s)}>{s.label}</div>
  ))}
</div>
```

**Recommended Fix:** Use MUI `Autocomplete` (as in `AddressInput.tsx`), or implement full combobox keyboard support: Arrow Up/Down, Enter, Escape, and a roving `aria-activedescendant` linked to the input.

**Example Fix:**
```tsx
<Autocomplete
  options={suggestions}
  getOptionLabel={(o) => o.label}
  onChange={(_, value) => value && select(value)}
  renderInput={(params) => <TextField {...params} label={t('address')} />}
/>
```

**Testing Steps:**
- *Keyboard:* Arrow through options, Enter selects, Escape closes.
- *Screen reader:* Active option announced as user arrows.
- *Automated:* axe `aria-required-children`, manual combobox test.

---

### A11Y-007 — Search/filter/view controls lose name and do not expose state

| | |
|---|---|
| **Severity** | High |
| **Category** | Links & Buttons |
| **Component / Feature** | ProjectListControls |
| **Effort** | Small–Medium |
| **Priority Score** | 74 / 100 |

**File(s) & Line(s):**
- `src/features/projectsV2/ProjectListControls/microComponents/ProjectSearchAndFilter.tsx:35`, `:40`
- `src/features/projectsV2/ProjectListControls/microComponents/ViewModeTabs.tsx:44`, `:70` (label becomes `undefined` while searching)
- `src/features/projectsV2/ProjectListControls/microComponents/ClassificationDropDown.tsx:66`, `:114` (selected state is CSS class only; `<hr>` inside a button)

**Issue Description:** Icon-only search/filter buttons have no `aria-label` or `type`; view-mode tabs become nameless while searching; classification toggles show selected state only via a CSS class with no `aria-pressed`.

**Root Cause:** Visual state relied on CSS; labels conditionally removed when the visible text is hidden.

**User Impact:**
- *Keyboard users:* Cannot tell which view is active.
- *Screen reader users:* Controls announced as unnamed "button"; selected filter not conveyed.
- *Low vision / color-blind users:* Selected state conveyed by color alone.

**WCAG Mapping:** 4.1.2 Name, Role, Value (A); 1.4.1 Use of Color (A)

**Current Code (representative):**
```tsx
<button className={clsx(styles.tab, { [styles.selected]: isMap })}
  onClick={() => setMode('map')}>{isSearching ? undefined : t('map')}</button>
```

**Recommended Fix:** Keep a persistent `aria-label`, add `type="button"`, expose active/selected via `aria-pressed` (or `role="tab"` + `aria-selected` in a `tablist`). Move `<hr>` outside the button.

**Example Fix:**
```tsx
<button type="button" aria-label={t('map')} aria-pressed={mode === 'map'}
  className={clsx(styles.tab, { [styles.selected]: mode === 'map' })}>…</button>
```

**Testing Steps:**
- *Screen reader:* Active tab announces "selected"; filter buttons announce pressed state.
- *Keyboard:* Toggle filters and confirm state change is announced.
- *Automated:* axe `button-name`, color-contrast checks on selected state.

---

### A11Y-008 — Root `<html lang>` hardcoded to English in a multi-locale app

| | |
|---|---|
| **Severity** | High |
| **Category** | Screen Reader Support |
| **Component / Feature** | Document (every page) |
| **Effort** | Small |
| **Priority Score** | 78 / 100 |

**File(s) & Line(s):** `pages/_document.tsx:20`

**Issue Description:** `<Html lang="en">` is hardcoded. The app is locale-routed (`pages/sites/[slug]/[locale]/…`), so German/Spanish/French pages still declare English.

**Root Cause:** `_document` runs once at SSR and does not read the runtime locale; no per-request `lang` update exists.

**User Impact:**
- *Screen reader users:* Speech engine uses English pronunciation, voice, and hyphenation for non-English content, which is hard to understand.
- *Cognitive:* Mispronounced content increases load.

**WCAG Mapping:** 3.1.1 Language of Page (A)

**Current Code:**
```tsx
<Html lang="en">
```

**Recommended Fix:** Keep a default in `_document`, but set the real language per request in `_app.tsx` (or per page) via `next/head`.

**Example Fix:**
```tsx
// _app.tsx render()
const locale = (router.query?.locale as string) ?? 'en';
<Head><html lang={locale} /></Head>
```

**Testing Steps:**
- *Screen reader:* Load a German page; confirm the German voice/pronunciation.
- *Browser:* Inspect `<html lang>` per locale.
- *Automated:* axe `html-has-lang`, `html-lang-valid`.

---

### A11Y-009 — No "skip to content" link anywhere in the app

| | |
|---|---|
| **Severity** | High |
| **Category** | Keyboard Navigation |
| **Component / Feature** | Global Layout (every page) |
| **Effort** | Small |
| **Priority Score** | 76 / 100 |

**File(s) & Line(s):** `src/features/common/Layout/index.tsx:27`–`49` (global tree); `pages/_app.tsx`

**Issue Description:** A repo-wide search for skip-link patterns returned nothing. Every page renders Header + Navbar before content, forcing keyboard and screen-reader users to tab through the entire navigation on every page.

**Root Cause:** No bypass mechanism was ever added.

**User Impact:**
- *Keyboard users:* Must tab through all nav links on every navigation.
- *Screen reader users:* No quick jump to main content.
- *Mobile AT users:* Longer swipe traversal.

**WCAG Mapping:** 2.4.1 Bypass Blocks (A)

**Recommended Fix:** Add a visually-hidden-until-focused skip link as the first focusable element in the global Layout, targeting the main landmark (see A11Y-017).

**Example Fix:**
```tsx
<a href="#main-content" className="skipToContent">{t('skipToContent')}</a>
/* skipToContent: position off-screen; becomes visible on :focus */
```

**Testing Steps:**
- *Keyboard:* Load a page, press Tab once; the skip link appears and focuses; Enter jumps to main.
- *Automated:* axe `skip-link` (partial), manual verification.

---

## Medium Findings

### A11Y-010 — Dynamic status, errors, and results not announced (missing live regions)

| | |
|---|---|
| **Severity** | Medium (High impact for payment/error) |
| **Category** | Dynamic Content |
| **Component / Feature** | Error popups, redeem, filter results, uploads, donations, loaders |
| **Effort** | Small–Medium |
| **Priority Score** | 72 / 100 |

**File(s) & Line(s):**
- `src/features/common/Layout/ErrorPopup/index.tsx:49`
- `src/features/common/RedeemCode/RedeemFailed.tsx:33`
- `src/features/projectsV2/ProjectListControls/index.tsx:80`
- `src/features/projectsV2/ProjectList/index.tsx:52`
- `src/features/user/BulkCodes/components/UploadWidget.tsx:139`
- `src/features/user/BulkCodes/forms/IssueCodesForm.tsx:392`
- `src/features/user/DonationReceipt/microComponents/DonorContactForm.tsx:161`
- `src/features/user/CompleteSignup/components/SignupToggles.tsx:117`
- `src/features/common/ContentLoaders/Projects/GlobeLoader.tsx:9`
- `src/features/user/PlanetCash/screens/Transactions.tsx:115`

**Issue Description:** Errors, upload/donation status, filter result counts, empty states, and loading states update in plain `<div>`/`<span>`/`<p>` with no `role="alert"`, `role="status"`, or `aria-live`.

**Root Cause:** Status text rendered as ordinary content; no live-region wrapper.

**User Impact:**
- *Screen reader users:* Never told an error occurred, that codes were issued, that an upload failed, or that results changed.
- *Cognitive:* Silent updates cause confusion.

**WCAG Mapping:** 4.1.3 Status Messages (AA); 3.3.1 Error Identification (A)

**Current Code (representative):**
```tsx
<div className={styles.formErrors}>{errorMessage}</div>
```

**Recommended Fix:** Wrap errors in `role="alert"` (assertive), non-urgent status/results in `role="status"` (polite); add `aria-busy` to loading containers.

**Example Fix:**
```tsx
<div role="alert">{errorMessage}</div>
<p role="status">{t('resultsCount', { count })}</p>
```

**Testing Steps:**
- *Screen reader:* Trigger an error/upload; confirm it is announced without moving focus.
- *Automated:* Manual live-region test; axe `aria-valid-attr`.

---

### A11Y-011 — Modals: missing names, dangling label IDs, no Escape / focus management

| | |
|---|---|
| **Severity** | Medium |
| **Category** | Dialogs & Modals |
| **Component / Feature** | Account modals, Share/Redeem/Target modals, image slider modal, map settings, embed, custom modal |
| **Effort** | Medium |
| **Priority Score** | 70 / 100 |

**File(s) & Line(s):**
- Dangling `aria-labelledby="simple-modal-title"` / `aria-describedby` (no matching element): `src/features/user/Account/CancelModal.tsx:92`, `EditModal.tsx:131`, `PauseModal.tsx:99`, `ReactivateModal.tsx:66`, `src/features/user/Profile/ProfileCard/ShareModal/index.tsx:72`, `RedeemModal/index.tsx:130`, `src/features/projectsV2/ProjectDetails/components/microComponents/ImageSliderModal.tsx:52`, `src/features/projectsV2/ProjectsMap/MapFeatureExplorer/index.tsx:47`
- No name / no Escape / no focus move: `src/features/common/Layout/CustomModal/index.tsx:29`, `src/features/user/Widget/EmbedModal.tsx:73` (also duplicate `id="editProfileSaveProfile"` at `:93`/`:104`), `src/features/user/Profile/ForestProgress/TargetsModal.tsx:121`, `src/features/projectsV2/ProjectsMap/SiteMapLayerControls/LayerInfoPopup.tsx:14`

**Issue Description:** Dialogs announce as unnamed; ARIA references point to IDs that do not exist; several cannot be closed with Escape and do not move focus into the dialog on open or restore it on close.

**Root Cause:** A copied modal template used placeholder IDs (`simple-modal-title`) that were never applied to the titles; `onClose` omitted.

**User Impact:**
- *Screen reader users:* Dialog announced as "dialog" with no name/description.
- *Keyboard users:* Cannot dismiss with Escape; focus may escape behind the dialog.
- *Cognitive:* Losing focus context is disorienting.

**WCAG Mapping:** 4.1.2 Name, Role, Value (A); 1.3.1 Info and Relationships (A); 2.1.2 No Keyboard Trap (A); 2.4.3 Focus Order (A)

**Current Code (representative):**
```tsx
<Modal aria-labelledby="simple-modal-title" aria-describedby="simple-modal-description">
  <h4>{t('cancelTitle')}</h4>  {/* no id="simple-modal-title" */}
</Modal>
```

**Recommended Fix:** Put the referenced `id` on the real title (or use `aria-label`), pass `onClose`, move focus to the dialog/heading on open and restore to the trigger on close, and ensure unique IDs.

**Example Fix:**
```tsx
<Modal open onClose={handleClose} aria-labelledby="cancel-modal-title">
  <Box>
    <h4 id="cancel-modal-title">{t('cancelTitle')}</h4>
    …
  </Box>
</Modal>
```

**Testing Steps:**
- *Keyboard:* Open modal; focus lands inside; Escape closes; focus returns to trigger.
- *Screen reader:* Dialog announces its name.
- *Automated:* axe `aria-valid-attr-value` (catches dangling IDREFs), `duplicate-id`.

---

### A11Y-012 — Toggle switches announce "secondary checkbox" instead of their real label

| | |
|---|---|
| **Severity** | Medium |
| **Category** | ARIA Usage |
| **Component / Feature** | NewToggleSwitch consumers (ManageProjects, EditProfile, Signup) |
| **Effort** | Small (fix once at source) |
| **Priority Score** | 68 / 100 |

**File(s) & Line(s):**
- Root cause: `src/features/common/InputTypes/NewToggleSwitch.tsx:65`
- Consumers: `src/features/user/ManageProjects/components/BasicDetails.tsx:643`, `:806`; `SubmitForReview.tsx:42`, `:99`; `ProjectCertificates.tsx:192`; `src/features/user/Settings/EditProfile/EditProfileForm.tsx:490`, `:513`, `:551`; `src/features/user/CompleteSignup/components/SignupToggles.tsx:62`, `:84`, `:113`

**Issue Description:** A hardcoded `inputProps={{ 'aria-label': 'secondary checkbox' }}` overrides the visible `FormControlLabel`, so multiple distinct toggles ("Receive donations", "Publish project", "Make profile public", "Subscribe", "Terms and conditions") all announce the same wrong name.

**Root Cause:** Placeholder `aria-label` left in the shared switch component and passed by consumers.

**User Impact:**
- *Screen reader users:* Hear "secondary checkbox" instead of the toggle purpose; cannot distinguish toggles.
- *Voice control users:* Accessible name does not match the visible label (Label in Name).

**WCAG Mapping:** 2.5.3 Label in Name (A); 4.1.2 Name, Role, Value (A)

**Current Code:**
```tsx
inputProps={{ 'aria-label': 'secondary checkbox' }}
```

**Recommended Fix:** Remove the hardcoded `aria-label` and let `FormControlLabel` (via `id`/`htmlFor`) name the control, or pass the real visible text when a label is needed.

**Example Fix:**
```tsx
<FormControlLabel control={<NewToggleSwitch checked={value} onChange={onChange} />}
  label={t('receiveDonations')} />
```

**Testing Steps:**
- *Screen reader:* Each toggle announces its visible label.
- *Automated:* Manual review; axe cannot detect wrong-but-present labels.

---

### A11Y-013 — Custom progress bars without `role`/value or with meaningless values

| | |
|---|---|
| **Severity** | Medium |
| **Category** | ARIA Usage |
| **Component / Feature** | Project card progress, TreeCounter, TopProgressBar |
| **Effort** | Small |
| **Priority Score** | 60 / 100 |

**File(s) & Line(s):**
- `src/features/projectsV2/ProjectSnippet/index.tsx:149` (two `<div>`s with `width: %`, no progressbar semantics)
- `src/features/common/TreeCounter/TreeCounter.tsx:141` (progressbar `aria-valuenow` reflects animation state, not real data)
- `src/features/common/ContentLoaders/TopProgressBar.tsx:20` (progressbar with no name)

**Issue Description:** Donation progress is conveyed only visually; the tree-counter ring exposes an arbitrary 0–100 animation value unrelated to the real planted/target numbers; the top progress bar has no accessible name.

**Root Cause:** Progress conveyed via CSS width; MUI progress used decoratively but still exposing `role="progressbar"`.

**User Impact:**
- *Screen reader users:* Miss donation progress entirely, or hear a confusing percentage unrelated to the data.

**WCAG Mapping:** 1.3.1 Info and Relationships (A); 4.1.2 Name, Role, Value (A)

**Current Code (representative):**
```tsx
<div className={styles.bar}><div style={{ width: `${pct}%` }} /></div>
```

**Recommended Fix:** For meaningful progress add `role="progressbar"` with `aria-valuenow/min/max` and an `aria-label`. For a decorative ring where data is already in adjacent text, mark it `aria-hidden="true"` (or give it a real `aria-valuetext`).

**Example Fix:**
```tsx
<div role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}
  aria-label={t('donationProgress')}>
  <div style={{ width: `${pct}%` }} />
</div>
```

**Testing Steps:**
- *Screen reader:* Progress announced with a meaningful value/name, or silent when decorative.
- *Automated:* axe `aria-progressbar-name`.

---

### A11Y-014 — Dangling `aria-controls` / `aria-labelledby` in navbar dropdowns

| | |
|---|---|
| **Severity** | Medium |
| **Category** | ARIA Usage |
| **Component / Feature** | Navbar dropdown / menu section |
| **Effort** | Small |
| **Priority Score** | 58 / 100 |

**File(s) & Line(s):**
- `src/features/common/Layout/Navbar/microComponents/NavbarItemGroup.tsx:98` (`aria-controls` to a non-existent id; menu div at `:114` lacks the id; redundant `role="button"` at `:95`)
- `src/features/common/Layout/Navbar/microComponents/NavbarMenuSection.tsx:32` (`aria-labelledby` to a non-existent id; `<h2>` at `:39` has no id; resolves to `…-undefined` when title missing)

**Issue Description:** Controls advertise programmatic relationships whose target IDs do not exist, so the relationship/name resolves to nothing.

**Root Cause:** IDs referenced but never applied to the target elements.

**User Impact:**
- *Screen reader users:* Broken control-to-menu relationship; section has no accessible name.

**WCAG Mapping:** 1.3.1 Info and Relationships (A); 4.1.2 Name, Role, Value (A)

**Recommended Fix:** Add the matching `id` to the menu div and the section `<h2>`; only set `aria-labelledby` when a title exists; remove the redundant `role="button"` on native `<button>`.

**Example Fix:**
```tsx
<button aria-controls={`nav-menu-${key}`} aria-expanded={open} aria-haspopup="menu">…</button>
<div id={`nav-menu-${key}`} className={styles.navbarMenu}>…</div>
```

**Testing Steps:**
- *Automated:* axe `aria-valid-attr-value` catches dangling IDREFs.
- *Screen reader:* Section announces its heading name.

---

### A11Y-015 — Hover-only tooltips and popovers (no keyboard/focus access)

| | |
|---|---|
| **Severity** | Medium |
| **Category** | Keyboard Navigation |
| **Component / Feature** | CustomTooltip, ProjectBadge, layer options, info popups |
| **Effort** | Medium |
| **Priority Score** | 62 / 100 |

**File(s) & Line(s):**
- `src/features/common/Layout/CustomTooltip/index.tsx:25`
- `src/features/projectsV2/ProjectSnippet/microComponents/ProjectBadge.tsx:36`
- `src/features/projectsV2/ProjectsMap/MapFeatureExplorer/microComponents/SingleLayerOption.tsx:72`
- `src/features/projectsV2/ProjectDetails/components/microComponents/InfoIconPopup.tsx:20`

**Issue Description:** Content shows only on mouse hover (`bindHover` / `onMouseEnter`) with no focusable trigger and no `onFocus`, so keyboard and touch users never see the explanatory content.

**Root Cause:** `material-ui-popup-state` `bindHover` applied to a non-focusable `<div>`/`<p>`.

**User Impact:**
- *Keyboard users:* Never receive the tooltip content (badge meaning, layer explanation).
- *Mobile AT users:* Hover is unavailable; content unreachable.

**WCAG Mapping:** 2.1.1 Keyboard (A); 1.4.13 Content on Hover or Focus (AA)

**Recommended Fix:** Attach the popover to a focusable `<button>` and open on click/focus as well as hover; combine `bindTrigger`/`bindFocus` with `bindHover`.

**Example Fix:**
```tsx
<button type="button" aria-label={t('moreInfo')} {...bindTrigger(popupState)} {...bindHover(popupState)}>
  <InfoIcon aria-hidden="true" />
</button>
```

**Testing Steps:**
- *Keyboard:* Tab to trigger; content opens on focus; Escape closes.
- *Screen reader:* Trigger is named; content is reachable.

---

### A11Y-016 — Missing `autocomplete` on identity/address fields

| | |
|---|---|
| **Severity** | Medium |
| **Category** | Forms |
| **Component / Feature** | EditProfile, CompleteSignup |
| **Effort** | Small |
| **Priority Score** | 56 / 100 |

**File(s) & Line(s):**
- `src/features/user/Settings/EditProfile/EditProfileForm.tsx:349`, `:376`, `:390`
- `src/features/user/CompleteSignup/components/FullNameInput.tsx:48`, `:70`
- `src/features/user/CompleteSignup/index.tsx:174`
- `src/features/user/CompleteSignup/components/SignupAddressField.tsx:113`, `:165`, `:195`

**Issue Description:** Name/email/address inputs lack `autocomplete` tokens (`given-name`, `family-name`, `email`, `street-address`, `address-level2`, `postal-code`).

**Root Cause:** Attribute omitted.

**User Impact:**
- *Cognitive / motor users:* Cannot rely on browser autofill; more typing and memory load.
- *Mobile users:* No keyboard/autofill hints.

**WCAG Mapping:** 1.3.5 Identify Input Purpose (AA)

**Current Code (representative):**
```tsx
<TextField label={t('email')} type="email" />
```

**Recommended Fix:** Add `autoComplete` via `inputProps`.

**Example Fix:**
```tsx
<TextField label={t('email')} type="email" inputProps={{ autoComplete: 'email' }} />
```

**Testing Steps:**
- *Browser:* Confirm autofill offers saved values.
- *Automated:* axe `autocomplete-valid`.

---

### A11Y-017 — Missing/inconsistent `<main>` landmark and no route-change focus handling

| | |
|---|---|
| **Severity** | Medium |
| **Category** | Focus Management |
| **Component / Feature** | Global Layout, `_app` |
| **Effort** | Medium |
| **Priority Score** | 66 / 100 |

**File(s) & Line(s):** `src/features/common/Layout/index.tsx:33`; `pages/_app.tsx` (no `router.events` focus reset)

**Issue Description:** The global layout wraps content in a plain `<div>`; `<main>` exists only in some sub-layouts, so pages like `home.tsx`, `login.tsx`, `404.tsx`, `_error.js` have no main landmark. After client-side navigation, focus stays on the old (often unmounted) element and the new page is not announced.

**Root Cause:** No single main landmark; SPA navigation does not manage focus or announce page changes.

**User Impact:**
- *Screen reader users:* No landmark to jump to; not told the page changed.
- *Keyboard users:* Focus lost to `<body>` after navigation.

**WCAG Mapping:** 1.3.1 (A); 2.4.1 (A); 2.4.3 Focus Order (A); 4.1.3 Status Messages (AA)

**Recommended Fix:** Wrap `{children}` in a single `<main id="main-content" tabIndex={-1}>`; make sub-layout `<main>` elements plain wrappers to avoid nested landmarks; on `routeChangeComplete`, move focus to `<main>` and announce the title via a visually-hidden `aria-live` region.

**Example Fix:**
```tsx
// Layout
<main id="main-content" tabIndex={-1}>{children}</main>

// _app.tsx
useEffect(() => {
  const onDone = () => mainRef.current?.focus();
  router.events.on('routeChangeComplete', onDone);
  return () => router.events.off('routeChangeComplete', onDone);
}, [router.events]);
```

**Testing Steps:**
- *Keyboard:* Navigate client-side; focus moves to main; skip link targets it.
- *Screen reader:* Landmark navigation reaches "main"; page change announced.
- *Automated:* axe `landmark-one-main`, `region`.

---

### A11Y-018 — Custom ARIA table has header outside the table role

| | |
|---|---|
| **Severity** | Medium |
| **Category** | Tables |
| **Component / Feature** | DonationReceipt donations table |
| **Effort** | Medium |
| **Priority Score** | 54 / 100 |

**File(s) & Line(s):** `src/features/user/DonationReceipt/microComponents/DonationsTable.tsx:16`–`56`

**Issue Description:** The header `role="row"` (with `role="columnheader"` spans) and the total (`:48`) are sibling `<div>`s outside the element with `role="table"` (a `<ul>`). Rows must be children of the table or a `rowgroup`, so column headers are not associated with cells.

**Root Cause:** ARIA roles layered onto non-table markup with incorrect nesting.

**User Impact:**
- *Screen reader users:* Table navigation cannot map headers to cells; header and total are orphaned.

**WCAG Mapping:** 1.3.1 Info and Relationships (A)

**Recommended Fix:** Use a native `<table>` with `<thead>`/`<th scope="col">` and `<tbody>` (as `DonationInfoPopover.tsx` already does), or nest header and rows inside one `role="table"` using `role="rowgroup"` wrappers.

**Example Fix:**
```tsx
<table>
  <thead><tr><th scope="col">{t('date')}</th><th scope="col">{t('amount')}</th></tr></thead>
  <tbody>{rows.map(r => <tr key={r.id}><td>{r.date}</td><td>{r.amount}</td></tr>)}</tbody>
</table>
```

**Testing Steps:**
- *Screen reader:* Table navigation reads correct column headers per cell.
- *Automated:* axe `table-fake-caption`, `td-headers-attr`.

---

### A11Y-019 — Single-select implemented as unlabeled checkboxes

| | |
|---|---|
| **Severity** | Medium |
| **Category** | Forms |
| **Component / Feature** | DonationReceipt donor address list |
| **Effort** | Small–Medium |
| **Priority Score** | 52 / 100 |

**File(s) & Line(s):** `src/features/user/DonationReceipt/microComponents/DonorAddressList.tsx:68`–`83`

**Issue Description:** A `StyledCheckbox` selects a single address (only one can be checked) with no associated label; the adjacent address text is not linked. Single-choice-from-a-set is a radio pattern.

**Root Cause:** Checkbox used for mutually exclusive selection; label not associated.

**User Impact:**
- *Screen reader users:* Unlabeled checkbox; checkbox semantics misrepresent single choice.

**WCAG Mapping:** 1.3.1 (A); 4.1.2 (A)

**Recommended Fix:** Use MUI `Radio`/`RadioGroup` and give each control an accessible name (`inputProps={{ 'aria-label': formattedAddress }}` or a linked `<label>`).

**Example Fix:**
```tsx
<RadioGroup value={selectedId} onChange={handleChange}>
  {addresses.map(a => (
    <FormControlLabel key={a.id} value={a.id} control={<Radio />} label={format(a)} />
  ))}
</RadioGroup>
```

**Testing Steps:**
- *Screen reader:* Announced as radio group with named options.
- *Keyboard:* Arrow keys move between options.

---

### A11Y-020 — Invalid `aria-selected` on `role="button"` and broken list semantics

| | |
|---|---|
| **Severity** | Medium |
| **Category** | ARIA Usage |
| **Component / Feature** | TimeTravelDropdown |
| **Effort** | Small–Medium |
| **Priority Score** | 55 / 100 |

**File(s) & Line(s):** `src/features/projectsV2/TimeTravelDropdown/index.tsx:106`–`125`

**Issue Description:** A `<ul>` contains `<time>` children directly (no `<li>`), and `aria-selected` is placed on `role="button"`, where it is invalid (`aria-selected` only applies to roles like `option`, `tab`, `row`). The dropdown also lacks `aria-haspopup`/`aria-controls` and Escape handling. (Keyboard operability of these items is tracked under A11Y-001.)

**Root Cause:** Mixed ARIA patterns; toggle state expressed with the wrong attribute.

**User Impact:**
- *Screen reader users:* Selection state is ignored/invalid; list structure is malformed.

**WCAG Mapping:** 1.3.1 (A); 4.1.2 (A)

**Recommended Fix:** Either implement a proper `listbox`/`option` pattern with `aria-selected`, or use `<button aria-pressed>` inside `<li>` items; add `aria-haspopup="listbox"` + `aria-controls` on the trigger and close on Escape.

**Example Fix:**
```tsx
<ul role="listbox" aria-label={t('year')}>
  {years.map(y => (
    <li key={y} role="option" aria-selected={y === selected}>
      <button type="button" onClick={() => setYear(y)}><time dateTime={y}>{y}</time></button>
    </li>
  ))}
</ul>
```

**Testing Steps:**
- *Screen reader:* Selected option announced; list structure valid.
- *Automated:* axe `aria-allowed-attr`.

---

### A11Y-021 — Disclosure toggles missing `aria-expanded`

| | |
|---|---|
| **Severity** | Medium |
| **Category** | ARIA Usage |
| **Component / Feature** | AboutProject, MapFeatureExplorer, UserLayout submenu |
| **Effort** | Small |
| **Priority Score** | 50 / 100 |

**File(s) & Line(s):**
- `src/features/projectsV2/ProjectDetails/components/AboutProject.tsx:40` (Read more/less)
- `src/features/projectsV2/ProjectsMap/MapFeatureExplorer/index.tsx:27` (desktop panel toggle; also wraps an `<h3>`)
- `src/features/common/Layout/UserLayout/NavLink.tsx:145` (submenu expander, also unlabeled)

**Issue Description:** Buttons that expand/collapse content do not expose `aria-expanded`, so the collapsed/expanded state is not announced; one wraps a heading inside the control.

**Root Cause:** State tracked in React only; not mirrored to ARIA.

**User Impact:**
- *Screen reader users:* Do not know whether the region is open or closed.

**WCAG Mapping:** 4.1.2 Name, Role, Value (A); 1.3.1 (A)

**Recommended Fix:** Add `aria-expanded={isOpen}` (and `aria-controls`) to the toggle; keep headings outside the control.

**Example Fix:**
```tsx
<button type="button" aria-expanded={isExpanded} onClick={toggle}>
  {isExpanded ? t('readLess') : t('readMore')}
</button>
```

**Testing Steps:**
- *Screen reader:* Announces "expanded"/"collapsed" and updates on toggle.

---

### A11Y-022 — Information conveyed by color or icon alone

| | |
|---|---|
| **Severity** | Medium |
| **Category** | Color Contrast |
| **Component / Feature** | DirectGift link, ProjectTypeIcon, filter/toggle states, empty states |
| **Effort** | Small–Medium |
| **Priority Score** | 54 / 100 |

**File(s) & Line(s):**
- `src/features/donations/styles/DirectGift.module.scss:38` (inline link underlined only on hover)
- `src/features/common/ProjectTypeIcon/index.tsx:12` (type conveyed by icon alone; no label/`aria-hidden`)
- `src/features/user/PlanetCash/components/NoTransactionsFound.tsx:8` (empty state is an SVG with no text)
- Selected states in A11Y-007 / A11Y-001 (CSS class/color only)

**Issue Description:** An inline link is set apart from body text by color only in its default state; project type is signalled by icon/color alone; an empty state is an icon with no text.

**Root Cause:** Visual-only cues without a text or non-color alternative.

**User Impact:**
- *Low vision / color-blind users:* Cannot perceive links, selected states, or type categories.
- *Screen reader users:* Icon-only meaning is lost.

**WCAG Mapping:** 1.4.1 Use of Color (A); 1.1.1 Non-text Content (A)

**Recommended Fix:** Persistent underline for inline links; give standalone icons a text label (or `aria-hidden` when paired with visible text); add visible text to icon-only empty states; expose selected state via `aria-pressed`.

**Example Fix:**
```scss
.giftTo a { color: $primaryDarkColor; text-decoration: underline; }
```
```tsx
<span role="img" aria-label={t(projectType)}><MangrovesIcon aria-hidden="true" /></span>
```

**Testing Steps:**
- *Visual:* Grayscale the page; confirm links/states/types remain distinguishable.
- *Automated:* axe `link-in-text-block`, color-contrast.

---

### A11Y-023 — Layer info popup is not a dialog and does not manage focus

| | |
|---|---|
| **Severity** | Medium |
| **Category** | Dialogs & Modals |
| **Component / Feature** | ProjectsMap SiteMapLayerControls |
| **Effort** | Medium |
| **Priority Score** | 48 / 100 |

**File(s) & Line(s):** `src/features/projectsV2/ProjectsMap/SiteMapLayerControls/LayerInfoPopup.tsx:14`–`49`; parent `SiteMapLayerControls/index.tsx:56`

**Issue Description:** The popup has no `role="dialog"`, `aria-modal`, or accessible name, and focus is neither moved into it on open nor restored to the trigger on close. (Escape is handled at the parent.)

**Root Cause:** Popup built as a plain container without dialog semantics/focus handling.

**User Impact:**
- *Screen reader users:* Popup is unnamed and not identified as a dialog.
- *Keyboard users:* Focus does not enter the popup; hard to reach its content/close.

**WCAG Mapping:** 4.1.2 (A); 2.4.3 Focus Order (A)

**Recommended Fix:** Add `role="dialog" aria-modal="true" aria-labelledby={headingId}`, move focus to the heading/close on open, restore focus on close.

**Testing Steps:**
- *Keyboard:* Open info; focus enters; Escape closes; focus restored.
- *Screen reader:* Announced as a named dialog.

---

### A11Y-024 — Map layer toggle switch has no accessible name

| | |
|---|---|
| **Severity** | Medium |
| **Category** | Forms |
| **Component / Feature** | MapFeatureExplorer single layer option |
| **Effort** | Small |
| **Priority Score** | 50 / 100 |

**File(s) & Line(s):** `src/features/projectsV2/ProjectsMap/MapFeatureExplorer/microComponents/SingleLayerOption.tsx:80`–`88`; also mobile Modal `aria-labelledby="map-settings-menu"` references a missing id at `index.tsx:47`

**Issue Description:** A `StyledSwitch` (MUI Switch) has no `inputProps={{ 'aria-label' }}` and its descriptive `<p>` label is not programmatically associated, so it announces "switch"/"checkbox" with no name.

**Root Cause:** Visible text not linked to the control.

**User Impact:**
- *Screen reader users:* Cannot tell which layer the switch controls.

**WCAG Mapping:** 4.1.2 (A); 3.3.2 (A)

**Recommended Fix:** Associate the label via `FormControlLabel`, or pass `inputProps={{ 'aria-label': layerName }}`.

**Example Fix:**
```tsx
<StyledSwitch inputProps={{ 'aria-label': tExplore(`settingsLabels.${layerConfig.key}`) }} />
```

**Testing Steps:**
- *Screen reader:* Switch announces the layer name and on/off state.

---

## Low Findings

### A11Y-025 — Buttons missing explicit `type` (default `submit`)

| | |
|---|---|
| **Severity** | Low |
| **Category** | Links & Buttons |
| **Effort** | Small |
| **Priority Score** | 30 / 100 |

**File(s) & Line(s):** `src/features/common/VerifyEmail/VerifyEmail.tsx:37`; `src/features/common/InputTypes/MaterialButton.tsx:17`; `src/features/donations/components/DirectGift.tsx:36`; `src/features/common/Layout/Footer/index.tsx:106`; `src/features/common/CarouselSlider/index.tsx:33`; `src/features/user/Settings/EditProfile/EditProfileForm.tsx:584`, `:593`; `src/features/user/CompleteSignup/index.tsx:203`

**Issue Description:** `<button>` without `type` defaults to `submit`, which can unexpectedly submit an enclosing form when the control is not a submitter.

**User Impact:** Keyboard users may trigger accidental form submission (Enter/Space).

**WCAG Mapping:** Best practice supporting 3.2.2 On Input (A)

**Recommended Fix / Example:**
```tsx
<button type="button" onClick={onClose}>…</button>
```

**Testing Steps:** In a form, activate the control with Enter; confirm no submit. Automated: eslint-plugin-react `button-has-type`.

---

### A11Y-026 — Buttons lose their accessible name while loading

| | |
|---|---|
| **Severity** | Low |
| **Category** | Screen Reader Support |
| **Effort** | Small |
| **Priority Score** | 34 / 100 |

**File(s) & Line(s):** `src/features/common/WebappButton/index.tsx:124`; `src/features/user/PlanetCash/components/CreateAccountForm.tsx:142`; `src/features/user/ManagePayouts/components/BankDetailsForm.tsx:342`

**Issue Description:** During submit the label is visually hidden or replaced by a spinner (which is `aria-hidden`), leaving the button with no accessible name and no busy state.

**User Impact:** Screen reader users hear nothing meaningful during processing.

**WCAG Mapping:** 4.1.2 (A); 4.1.3 (AA)

**Recommended Fix / Example:**
```tsx
<button type="submit" aria-busy={isLoading} disabled={isLoading}>
  <span className={isLoading ? visuallyHidden : undefined}>{t('save')}</span>
  {isLoading && <Spinner aria-hidden="true" />}
</button>
```

**Testing Steps:** Trigger submit; screen reader still announces the label and busy state.

---

### A11Y-027 — Decorative SVGs not hidden from assistive tech

| | |
|---|---|
| **Severity** | Low |
| **Category** | Images |
| **Effort** | Small |
| **Priority Score** | 28 / 100 |

**File(s) & Line(s):** `pages/404.tsx:34` (`Custom404Image`); `src/features/common/ContentLoaders/Projects/GlobeLoader.tsx:9`; `src/features/common/ContentLoaders/LeaderboardLoader.tsx:2`; `src/features/donations/components/DirectGift.tsx:45` (`CancelIcon`); project type icons

**Issue Description:** Inline decorative SVGs lack `aria-hidden="true"`/`focusable="false"`, so they may be announced inconsistently (some SR read child text/paths).

**User Impact:** Screen reader noise / unpredictable graphic announcements.

**WCAG Mapping:** 1.1.1 Non-text Content (A)

**Recommended Fix / Example:**
```tsx
<CancelIcon aria-hidden="true" focusable="false" />
```
Good existing patterns to mirror: `ContentLoaders/ButtonLoader.tsx` and `ContentLoaders/UserProfile/UserProfileLoader.tsx`.

**Testing Steps:** Screen reader skips decorative icons. Automated: axe `svg-img-alt`.

---

### A11Y-028 — Heading misuse and hierarchy problems

| | |
|---|---|
| **Severity** | Low |
| **Category** | Semantic HTML |
| **Effort** | Small–Medium |
| **Priority Score** | 32 / 100 |

**File(s) & Line(s):** `pages/404.tsx:32` (`<h2>` only, often empty, no `<h1>`/`<title>`); `src/features/projectsV2/ProjectDetails/components/AboutProject.tsx:25` (`<div>` as section title); `src/features/user/BulkCodes/components/RecipientHeader.tsx:16` (`<h3>` as column header); `src/features/user/Widget/DonationLink/DonationLinkForm.tsx:201`, `:213`, `:232` (`<h6>` for body text); `src/features/user/TreemapperMigration/index.tsx:42` (card title/subtitle are `<p>`, section has no heading)

**Issue Description:** Headings used decoratively or omitted where a real heading belongs; the 404 heading is often empty and out of order; section titles rendered as `<div>`.

**User Impact:** Screen reader users lose a coherent document outline and heading navigation.

**WCAG Mapping:** 1.3.1 (A); 2.4.6 Headings and Labels (AA); 2.4.2 Page Titled (A, for 404)

**Recommended Fix / Example:** Use a single `<h1>` per page and correct nesting; use `<th scope="col">` (styled) for table headers; convert misused `<h6>` to `<p>`; add `<Head><title>` to 404.
```tsx
<Head><title>{t('pageNotFoundTitle')}</title></Head>
<main><h1>{router.query.error || t('pageNotFound')}</h1></main>
```

**Testing Steps:** Screen reader heading list is logical and non-empty. Automated: axe `heading-order`, `empty-heading`, `document-title`.

---

### A11Y-029 — Country radio group mislabelled as "language" with duplicate `name`

| | |
|---|---|
| **Severity** | Low |
| **Category** | Forms |
| **Effort** | Small |
| **Priority Score** | 26 / 100 |

**File(s) & Line(s):** `src/features/common/Layout/Footer/SelectLanguageAndCountry.tsx:97`–`99` (country group `aria-label="language"` and `name="language"`, matching the language group)

**Issue Description:** The country selector's `RadioGroup` uses `aria-label="language"` and `name="language"`, so it is announced as "language" and shares a `name` with the language group.

**User Impact:** Screen reader users hear the wrong group name; identical `name` conflates two groups.

**WCAG Mapping:** 1.3.1 (A); 4.1.2 (A)

**Recommended Fix / Example:**
```tsx
<RadioGroup aria-label={tCommon('selectCountry')} name="country">…</RadioGroup>
```

**Testing Steps:** Screen reader announces "select country" for the country group.

---

### A11Y-030 — Hardcoded English accessible names in a localized app

| | |
|---|---|
| **Severity** | Low |
| **Category** | Screen Reader Support |
| **Effort** | Small |
| **Priority Score** | 24 / 100 |

**File(s) & Line(s):** `src/features/user/BulkCodes/components/RecipientsTable.tsx:91` (`aria-label="sticky table"`), `:126`, `:143` (`"edit recipient"`, `"delete recipient"`); `AddRecipient.tsx:71`; `UpdateRecipient.tsx:52`, `:66`; `src/features/user/ManageProjects/components/microComponent/SyncErrorPopover.tsx:26` (`"Show sync errors"`)

**Issue Description:** Accessible names are hardcoded English (and one describes styling, "sticky table", not content) in an otherwise localized app.

**User Impact:** Non-English screen reader users get English labels; the table label is not descriptive.

**WCAG Mapping:** Supports 4.1.2 (A); 1.3.1 (A) for the table label

**Recommended Fix / Example:**
```tsx
<Table aria-label={t('recipientsTableLabel')} />
<IconButton aria-label={t('editRecipient')} />
```

**Testing Steps:** Verify labels localize; table label describes content.

---

### A11Y-031 — Virtualized card grid lacks list semantics

| | |
|---|---|
| **Severity** | Low |
| **Category** | Semantic HTML |
| **Effort** | Small |
| **Priority Score** | 18 / 100 |

**File(s) & Line(s):** `src/features/projectsV2/ProjectList/index.tsx:66`–`79`

**Issue Description:** Cards render through `react-virtuoso` as plain divs, not `<ul>`/`<li>`, so screen reader users do not get item count/position. Virtualization makes native list markup awkward, so this is low priority.

**User Impact:** Screen reader users lack "X of Y" list context.

**WCAG Mapping:** 1.3.1 (A)

**Recommended Fix / Example:**
```tsx
<Virtuoso components={{ List: ListEl, Item: ItemEl }} /> // map to ul/li, or add role="list"/"listitem"
```

**Testing Steps:** Screen reader reports list and item positions.

---

### A11Y-032 — Dead `RedeemPopup` uses a non-focusable link and unlabeled close

| | |
|---|---|
| **Severity** | Low |
| **Category** | Links & Buttons |
| **Effort** | Small |
| **Priority Score** | 12 / 100 |

**File(s) & Line(s):** `src/features/common/Layout/RedeemPopup/index.tsx:69` (`<a onClick>` with no `href`, not focusable), `:61` (unlabeled close). File is annotated "unused" and commented out in `Layout/index.tsx:40`.

**Issue Description:** A login trigger is an `<a>` without `href` (not keyboard focusable, not a real link); the close button is unlabeled. Impact is latent because the component is currently unused.

**User Impact:** If re-enabled, keyboard users cannot trigger login; close is unnamed.

**WCAG Mapping:** 2.1.1 (A); 4.1.2 (A)

**Recommended Fix:** Convert the login trigger to `<button>`, label the close button, or delete the dead component.

**Testing Steps:** N/A until re-enabled; if used, Tab to controls and confirm operability.

---

### A11Y-033 — Map polygon drawing has no keyboard path

| | |
|---|---|
| **Severity** | Low |
| **Category** | Keyboard Navigation |
| **Effort** | Large |
| **Priority Score** | 22 / 100 |

**File(s) & Line(s):** `src/features/user/ManageProjects/components/SiteGeometryEditor.tsx:139`–`180`

**Issue Description:** Drawing a site relies on map click (add point) and double-click (close polygon); there is no keyboard-operable drawing. Partly mitigated by a GeoJSON/KML upload alternative at `:266`–`279`.

**User Impact:** Keyboard-only users cannot draw geometry (but can upload a file).

**WCAG Mapping:** 2.1.1 (A)

**Recommended Fix:** Clearly label and document the upload as the accessible alternative; ideally add a coordinate-entry fallback.

**Testing Steps:** Confirm the upload path is reachable and labelled by keyboard/screen reader.

---

### A11Y-034 — Full-page loaders and empty states not announced

| | |
|---|---|
| **Severity** | Low |
| **Category** | Dynamic Content |
| **Effort** | Small |
| **Priority Score** | 26 / 100 |

**File(s) & Line(s):** `src/features/common/ContentLoaders/Projects/GlobeLoader.tsx:9`–`29` (full-viewport loader, no `role="status"`, infinite motion with no reduced-motion guard); `src/features/common/ContentLoaders/LeaderboardLoader.tsx:2`; `src/features/common/ContentLoaders/Projects/AccessDeniedLoader.tsx:9` (`<h2>` as sole heading; decorative SVG unmarked); `src/features/user/PlanetCash/components/NoTransactionsFound.tsx:8`

**Issue Description:** Full-page loading indicators do not expose `role="status"`/`aria-live` or accessible text, and one runs infinite motion without a `prefers-reduced-motion` guard.

**User Impact:** Screen reader users are not told the app is loading; motion-sensitive users get unguarded animation.

**WCAG Mapping:** 4.1.3 Status Messages (AA); 1.1.1 (A); 2.3.3 Animation from Interactions (AAA)

**Recommended Fix / Example:**
```tsx
<div role="status" aria-live="polite">
  <span className={visuallyHidden}>{t('loading')}</span>
  <GlobeLoader aria-hidden="true" />
</div>
/* @media (prefers-reduced-motion: reduce) { animation: none } */
```

**Testing Steps:** Screen reader announces loading; reduced-motion setting stops animation.

---

### A11Y-035 — `<label>` element used as button text

| | |
|---|---|
| **Severity** | Low |
| **Category** | Semantic HTML |
| **Effort** | Small |
| **Priority Score** | 10 / 100 |

**File(s) & Line(s):** `src/features/user/Profile/ProfileCard/ShareModal/index.tsx:21`–`24` (`CustomCopyButton` renders a `<label>` as its text)

**Issue Description:** A `<label>` is used as decorative button text rather than being tied to a form control.

**User Impact:** Minor semantic confusion for assistive tech.

**WCAG Mapping:** 1.3.1 (A)

**Recommended Fix / Example:**
```tsx
<span>{t('copyLink')}</span>
```

**Testing Steps:** Confirm no orphan label announced.

---

## Repeated Accessibility Patterns

These patterns recur across the codebase and should be fixed once (component/source level) and reused.

### Pattern P1 — Clickable `div`/`span`/`li`/`time` (see A11Y-001)
- **Issue type:** Non-semantic interactive elements (no keyboard, role, or state).
- **Affected files:** CopyToClipboard, UserLayout, NavLink, TimeTravelDropdown, TpoName, SiteLayerDropdown, SiteLayerOptions, LayerInfoTooltip, DetailedAnalysis (3), ProjectSpending, ProjectCertificates, ApiKeyForm, SignupHeader, ImpersonationActivated, AccountRecord, RecurrencyRecord, History (2).
- **Shared root cause:** Styling-first controls with `onClick` on non-interactive elements; no shared clickable primitive.
- **Global fix:** Introduce/enforce a shared `<Clickable>`/button primitive; add ESLint `jsx-a11y/no-static-element-interactions` and `click-events-have-key-events` (error level) to prevent regressions; migrate existing sites to `<button>`/`<Link>`.

### Pattern P2 — Icon-only controls without accessible names (see A11Y-002)
- **Issue type:** Missing accessible name on icon buttons/links.
- **Affected files:** Footer (social + logos), SignInButton, UserProfileButton, ErrorPopup, CookiePolicy, CarouselSlider, RedeemCode (3), DirectGift, ProjectSearchAndFilter, ActiveSearchField, ImageSection back, ImageSlider, ImageSliderModal, DonationInfoPopover, DonorAddressList, TargetsModal, ShareModal (5), Account modals (4).
- **Shared root cause:** Icons rendered directly inside controls with no label.
- **Global fix:** Create a reusable `IconButton` wrapper that requires an `aria-label` prop and marks its icon `aria-hidden`. Replace ad-hoc icon buttons with it.

### Pattern P3 — Nested interactive elements (see A11Y-003)
- **Affected files:** Footer, WebappButton, DarkModeSwitch, ProjectsContainer, BankAccountDetails, NoBankAccount, ProfileCard.
- **Shared root cause:** Link + button (or button + input) combined for one action.
- **Global fix:** Standardize on `<Button component={Link}>` for link-styled buttons; fix `WebappButton` to render its styles on the anchor directly.

### Pattern P4 — Form fields labelled only by placeholder / empty label (see A11Y-005)
- **Affected files:** RecipientFormFields, EnterRedeemCode, ActiveSearchField, ProjectMedia, TargetFormInput.
- **Shared root cause:** Visible labels omitted for compact layouts.
- **Global fix:** Lint rule requiring `label`/`aria-label` on inputs; provide visually-hidden label helper.

### Pattern P5 — Modals with dangling label IDs / no focus management (see A11Y-011)
- **Affected files:** CancelModal, EditModal, PauseModal, ReactivateModal, ShareModal, RedeemModal, ImageSliderModal, MapFeatureExplorer, CustomModal, EmbedModal, TargetsModal, LayerInfoPopup.
- **Shared root cause:** Copied modal template with placeholder `simple-modal-title`/`simple-modal-description` IDs never applied; missing `onClose`.
- **Global fix:** A shared `<AppModal>` component that takes `title`/`description`, generates matching IDs, wires `aria-labelledby`/`aria-describedby`, handles Escape (`onClose`), and manages focus in/out.

### Pattern P6 — Toggle "secondary checkbox" label (see A11Y-012)
- **Affected files:** NewToggleSwitch (source) + BasicDetails, SubmitForReview, ProjectCertificates, EditProfileForm, SignupToggles.
- **Shared root cause:** Placeholder `aria-label` in the shared switch.
- **Global fix:** Remove the default `aria-label` from `NewToggleSwitch`; rely on `FormControlLabel`.

### Pattern P7 — Missing live regions for status/errors (see A11Y-010)
- **Affected files:** ErrorPopup, RedeemFailed, ProjectListControls, ProjectList, UploadWidget, IssueCodesForm, DonorContactForm, SignupToggles, GlobeLoader, Transactions.
- **Shared root cause:** Status text rendered as ordinary content.
- **Global fix:** Provide `<Alert role="alert">` and `<Status role="status">` helpers; route all form errors and status through them.

### Pattern P8 — Missing `type="button"` (see A11Y-025)
- **Affected files:** VerifyEmail, MaterialButton, DirectGift, Footer, CarouselSlider, EditProfileForm, CompleteSignup.
- **Global fix:** Enable ESLint `react/button-has-type`.

### Pattern P9 — Decorative SVGs not hidden (see A11Y-027)
- **Affected files:** 404, GlobeLoader, LeaderboardLoader, DirectGift icon, project type icons.
- **Global fix:** Add `aria-hidden="true" focusable="false"` at the shared icon-wrapper level for decorative usage.

### Pattern P10 — Hover-only tooltips/popovers (see A11Y-015)
- **Affected files:** CustomTooltip, ProjectBadge, SingleLayerOption, InfoIconPopup.
- **Global fix:** Fix `CustomTooltip` to bind focus/click as well as hover, and attach popovers to focusable triggers.

### Pattern P11 — Missing `autocomplete` on identity/address fields (see A11Y-016)
- **Affected files:** EditProfileForm, FullNameInput, CompleteSignup, SignupAddressField.
- **Global fix:** Add `autoComplete` tokens to shared name/email/address field components.

---

## Repository Summary

### Findings by Severity

| Severity | Count |
| -------- | ----- |
| Critical | 2 |
| High     | 7 |
| Medium   | 15 |
| Low      | 11 |
| **Total (findings, patterns consolidated)** | **35** |

> Note: findings A11Y-001, A11Y-002 and the pattern entries each cover many individual code locations (~90 total sites). Counts above are distinct findings, not per-file occurrences.

### Findings by Category

| Category | Count |
| -------- | ----- |
| Keyboard Navigation | 4 (A11Y-001, 006, 009, 015, 033 partial) |
| Links & Buttons | 4 (A11Y-002, 007, 025, 032) |
| Semantic HTML | 3 (A11Y-003, 028, 031, 035) |
| Images | 2 (A11Y-004, 027) |
| Forms | 5 (A11Y-005, 016, 019, 024, 029) |
| ARIA Usage | 4 (A11Y-012, 014, 020, 021) |
| Dialogs & Modals | 2 (A11Y-011, 023) |
| Dynamic Content | 2 (A11Y-010, 034) |
| Focus Management | 1 (A11Y-017) |
| Screen Reader Support | 3 (A11Y-008, 026, 030) |
| Tables | 1 (A11Y-018) |
| Color Contrast | 1 (A11Y-022) |
| Menus & Dropdowns | covered under Keyboard/ARIA |

> Some findings span more than one category; the primary category is used above.

### Top 10 Highest Priority Issues

1. **A11Y-001** — Clickable divs/spans as controls (blocks keyboard use app-wide, incl. project-creation wizard). *Critical.*
2. **A11Y-002** — Icon-only controls without accessible names. *Critical.*
3. **A11Y-008** — `<html lang>` hardcoded to English on every non-English page. *High.*
4. **A11Y-009** — No skip link. *High.*
5. **A11Y-005** — Placeholder-only form fields. *High.*
6. **A11Y-004** — Missing/incorrect image alt. *High.*
7. **A11Y-007** — Search/filter/view controls nameless, state hidden. *High.*
8. **A11Y-003** — Nested interactive elements. *High.*
9. **A11Y-006** — Address suggestion listbox not keyboard operable. *High.*
10. **A11Y-011** — Modal names / focus / Escape. *Medium (broad reach).*

### Quick Wins (high impact, low effort)

- **A11Y-012** — Remove `NewToggleSwitch` default `aria-label` (one file fixes ~11 toggles).
- **A11Y-008** — Set `<html lang>` per locale (small change, every page).
- **A11Y-009** — Add one skip link.
- **A11Y-002** — Add `aria-label` + `type="button"` to icon buttons (mechanical).
- **A11Y-004** — Swap literal alt strings for `projectName` / `alt=""`.
- **A11Y-016** — Add `autocomplete` tokens.
- **A11Y-025 / A11Y-027** — Enable `react/button-has-type` lint; mark decorative SVGs `aria-hidden`.
- **A11Y-029** — Fix country radio group label/name.

### Shared Component Opportunities (fix once, reuse everywhere)

- **`IconButton` wrapper** requiring `aria-label` → resolves P2 (A11Y-002) and much of P9.
- **`AppModal`** with title/description IDs, `onClose`/Escape, and focus management → resolves P5 (A11Y-011, A11Y-023).
- **`Clickable`/button primitive** + ESLint rules → resolves P1 (A11Y-001).
- **`NewToggleSwitch`** label fix → resolves P6 (A11Y-012).
- **`Alert`/`Status` live-region helpers** → resolves P7 (A11Y-010, A11Y-034).
- **`CustomTooltip`** focus/click binding → resolves P10 (A11Y-015).
- **Shared form field components** with `label` + `autocomplete` enforcement → resolves P4 (A11Y-005) and P11 (A11Y-016).

### Recommended Fix Order

1. **Critical blockers:** A11Y-001, A11Y-002 (build the `Clickable` and `IconButton` primitives first).
2. **Keyboard navigation:** A11Y-006, A11Y-007, A11Y-009, A11Y-015, A11Y-020, A11Y-021, A11Y-033.
3. **Screen reader support:** A11Y-004, A11Y-008, A11Y-010, A11Y-012, A11Y-013, A11Y-014, A11Y-024, A11Y-026, A11Y-030, A11Y-034.
4. **Forms:** A11Y-005, A11Y-016, A11Y-019, A11Y-029.
5. **Dialogs & focus management:** A11Y-011, A11Y-017, A11Y-023 (build `AppModal`).
6. **Semantic HTML improvements:** A11Y-003, A11Y-018, A11Y-028, A11Y-031, A11Y-035.
7. **Remaining low-priority items:** A11Y-022, A11Y-025, A11Y-027, A11Y-032.

---

*Generated from a repository-wide accessibility audit. Line numbers reflect the state of the code at audit time and may shift as the codebase changes; re-verify before fixing. Automated color-contrast testing (axe/Lighthouse) and manual screen-reader passes (NVDA, VoiceOver) are recommended to complement this static review.*
