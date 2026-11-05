# Data fetching and render gates

Where a fetch lives decides when it runs. Put it in the wrong place and it stops
running in configurations nobody tested.

This is not a rule that all fetching belongs in one place. Most fetches in
`src/features` are in components and are correct there. The rule is about the
relationship between a fetch and whatever decides if a component renders.

## The two questions

Before writing a fetch inside a component, ask:

1. **Does anything outside this component use the data?**
2. **Can something outside this component stop it from rendering?** A URL
   parameter, a layout gate, a mobile map and list switch, a tab.

If either answer is yes, the fetch does not belong in the component. Move it above
the gate, into an initializer hook.

If both answers are no, keep it in the component. That stays lazy, keeps the data
next to its only reader, and does not run on pages that do not need it.

## Where app-wide fetches go

`StoreInitializer` is mounted once in `pages/_app.tsx`, above `Layout`, so it runs
for the whole page lifetime no matter what the layout renders. It calls one hook
per concern:

```
useInitializeTenant, useInitializeParams, useInitializeLanguage,
useInitializeAuth, useInitializeUser, useInitializeCurrency,
useInitializeView, useInitializeProject, useInitializeSingleProject,
useInitializeIntervention
```

A new one follows the same shape: read what it needs from the router and the
stores, guard, call a store action. The store action owns de-duplication, so the
hook can be called on every render without firing repeat requests. See
`src/utils/fetchKey.ts` and `fetchProject` in `src/stores/singleProjectStore.ts`.

## Worked example, what happens when this is mixed up

The project list and the project details page had the same needs and were built
differently.

The list fetch sat in `useInitializeProject`, above the layout. The details fetch
sat inside `ProjectDetails`, which is the component that `project_details=false`
is designed to hide, and it was the only API call site in that whole subtree.

Both answers above were yes for it. The map draws the project's interventions and
sites, so other things used the data. And `ProjectsLayout` decides whether the
pane renders at all, so something else controlled its mounting.

For a while this worked by luck. `page` was a synchronous prop, so on one render
the gate was open while the embed parameters were still unread. The component
mounted for that single render, its effect fired, and the data outlived the
unmount. When `page` moved into a store and started as `null`, that render
disappeared and the fetch went with it. Embeds with the pane hidden showed an
empty map, with no request made for the project, its interventions, or its
time travel config, and no error either.

Details in issue #3010.

## Watch the gate itself, not only the fetch

A gate is only as reliable as the values it reads. #3010 happened because the gate
started reading a value that is unset on the first render, which turned "hidden for
one render" into "never mounted".

If you are changing where a gating value comes from, rather than where a fetch
lives, see [Moving state from context to a store](./context-to-store.md).

## Related

- `src/features/common/StoreInitializer/StoreInitializer.tsx`
- `src/utils/fetchKey.ts`, request de-duplication and discarding stale responses
- [Moving state from context to a store](./context-to-store.md)
- Issue #3010, the regression this page describes
