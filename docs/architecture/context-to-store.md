# Moving state from context to a store

Guidance for the ongoing move from React context to Zustand stores. The mechanical
part of these changes is easy. The part that has caused production bugs is timing:
a context value is often available on the first render, and a store value written
from an effect is not.

## Which values are risky

Only values that are **synchronous today**.

- **Risky:** anything available on the very first render now. A prop, something
  from `getStaticProps`, or a value computed during render. Consumers have never
  had to handle it being unset, so they do not
- **Not risky:** anything the provider already fetches or reads asynchronously,
  such as the signed in user. It has always been `null` at first, so every
  consumer already handles that, and moving it changes nothing about timing

So the first step is to sort the values you are moving into those two groups. Only
the first group needs the rest of this page.

## Where it goes wrong

The window is at least one render long, between mount and the effect that writes
the value.

That window is harmless where the value only affects **what is drawn**, because
the next render corrects it. The worst case is a flash.

It is not harmless where the value decides **whether something renders at all**. A
component that never mounts never runs its effects, and nothing corrects that
later. Look for the value in conditions that return `null`, pick between
branches, or gate `children`.

## Two mistakes already made in this migration, in opposite directions

**Unset value reaches a render gate.** `viewStore.page` starts as `null`, which is
the honest choice and has a comment explaining that a concrete default would
wrongly trigger route-specific effects. But `null` reached the layout gate for the
project pages, that gate decided whether the details pane mounted, and the only
project fetch lived inside the pane. Embeds that hide the pane fetched nothing at
all. See issue #3010.

**Plausible default gets acted on.** `currencyStore.currencyCode` starts as
`'EUR'`, which is indistinguishable from a real choice. Nothing waited for the
stored value, so the first request went out with the placeholder and a second one
followed once `localStorage` was read. Fixed by adding an explicit
`isCurrencyResolved` flag that callers wait for.

The shared lesson: `null` was overloaded to mean both "not known yet" and "not
applicable", and `'EUR'` hid the fact that nothing was known yet. Neither made the
unset phase visible.

## Choosing the initial value

In order of preference:

1. **Derive the value during render, so there is no unset phase.** Best when the
   source is synchronous. A value derived from `router.pathname` is correct on the
   first render, on the server and the client, with no effect and no flag
2. **Keep a placeholder, and add an explicit resolved flag** that callers check,
   as `isCurrencyResolved` does. Use this when the real value genuinely arrives
   later. Do not let callers infer readiness from the value itself
3. **Start unset, usually `null`.** Acceptable, but then check every consumer that
   uses it in a render gate

Whichever you pick, say which one you picked and why in a comment on the state
field. Both stores above have such a comment, and it is the reason the reasoning
survived long enough to be reviewed.

## Before opening the PR

- List the values you moved, and which of them were synchronous before
- For each synchronous one, list every consumer that uses it in a render gate.
  Those are the consumers whose behavior changed, and they are what a reviewer
  needs to look at
- Say all of this in the PR description. It is much cheaper to review this way
  than to reconstruct it from the diff

## Remaining contexts

As of 2026-07-29:

```
src/features/common/Layout/UserPropsContext.tsx
src/features/common/Layout/PlanetCashContext.tsx
src/features/common/Layout/BulkCodeContext.tsx
src/features/common/Layout/DonationReceiptContext.tsx
src/features/common/Layout/PayoutsContext.tsx
src/theme/themeContext.tsx
```

## Related

- [Data fetching and render gates](./data-fetching.md), where a fetch belongs
  relative to the gate that decides if a component renders
- Issue #3010, the regression that prompted this page
