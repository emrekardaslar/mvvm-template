# MVVM Template

Astro + React + TypeScript template built around an MVVM / Clean Architecture structure with a CQRS-style query dispatcher and selective, slice-based re-rendering.

## Project Structure

```
src/
├── domain/           # Pure types & constants. No outgoing deps.
│                     #   models, events, view slices, mixin contracts, query keys
├── application/      # View-models, queries, app-level wiring.
│                     #   BaseViewModel, the page VMs, query classes, eventBus, coordinator
├── infrastructure/   # Adapters & IO: api, repositories, query dispatch (runQuery, queryRegistry)
├── presentation/     # React views & hooks. No business logic.
│                     #   per-language views, the view↔VM connector, selector hook
└── pages/            # Astro routes (SSR entry points)
```

Dependencies point inward (`presentation → application → domain`; `infrastructure` provides IO).
Path aliases: `@domain/*`, `@application/*`, `@infrastructure/*`, `@presentation/*`.

## One ViewModel per page

Each page has exactly one ViewModel that owns all of its state. `MvvmView` constructs it once (client-side) and renders the view. `BaseViewModel<TData, TEvents>` provides the reactive core: `getData()`, `subscribe()`, a protected `setData()`, a typed event map, and a fetch race-guard (`beginFetch` / `isCurrentFetch`).

As a VM grows, its behavior is split into **mixins** merged onto the prototype (patterns.dev object-mixin style) so the class stays readable. Mixins are registered in one place, which keeps the VM class itself untouched when behavior is added.

## Selective re-rendering

`MvvmView` does not subscribe to the whole VM. Each leaf component subscribes to only the **slice** it reads via `useViewModelSelector`, so a state change re-renders only the components that read the changed slice. The hook's default shallow-equality comparator means a component re-renders only when one of its slice's fields actually changes.

Views trigger behavior by dispatching named, type-checked events to the VM (`dispatchEvent` / `registerEvent`). Each VM declares its event map as the second generic of `BaseViewModel`; a VM with no event map statically rejects every `dispatchEvent` call.

## Query Pattern (CQRS)

ViewModels don't touch repositories or the api directly. They construct a query and run it through a single dispatcher:

- A **query** describes what's needed and builds its own params by reading the active ViewModel — so call sites don't hand-assemble params.
- **`runQuery`** dispatches the query to its repository, and owns the cross-cutting concerns: it toggles the loading flag and writes any error against the active VM, so call sites never repeat `try/catch` or loading bookkeeping. The latest-wins race guard stays in the VM (it's a VM policy).
- **`queryRegistry`** is the single table mapping each query key to the repository function that fulfils it. Repositories are thin: one function mapping params → api call.

### `getViewModel()` — a plain accessor, not a hook

Queries run where React hooks can't (event handlers, query objects, SSR). The active VM is therefore exposed through a plain module accessor, registered by `BaseViewModel`'s constructor and cleared on unmount. Inside React, components instead receive the `viewModel` as a prop — the explicit, SSR-safe wire.

### Adding a query

Add the key (`domain/queries/keys.ts`) → define the query class (`application/queries/`) → add a repository function (`infrastructure/repositories/`) → register it in `queryRegistry.ts` → call `runQuery(new XQuery())` from a VM.

## Events

Two layers, both using name constants from `domain/events/` (never inline strings):

- **View → ViewModel** — typed `dispatchEvent`, handled by `registerEvent`.
- **ViewModel ↔ URL** — the VM publishes `*.Changed` events on the eventBus; the coordinator writes them to the URL and re-dispatches on browser back/forward, so history navigation drives the VM the same way user actions do.

## i18n views & per-language chunks

Language is part of the URL (`?lang=en|tr|ar`) and only changes with a full page load — there is no client-side language switching. Views live under `presentation/views/<Feature>/{en,tr,ar}/` as separate files; a server-only `.astro` selector renders the matching island with a `lang ===` ladder.

Because each language is a distinct static import rendered conditionally at the Astro layer, Astro emits a **separate JS chunk per language and ships only the matched one**. Selection must happen here (SSR, where the language is known) — **never** via client-side `React.lazy()`/dynamic import, which breaks island hydration and silently kills interactivity.

## SSR data

All initial data is fetched on the server and passed into the ViewModel as `initialData`; the VM seeds its state from it, with no client-side mount fetch for the initial render. Runtime refetches still go through `runQuery`.

## Commands

| Command              | Action                                       |
| :------------------- | :------------------------------------------- |
| `npm install`        | Install dependencies                         |
| `npm run dev`        | Start local dev server at `localhost:4321`   |
| `npm run build`      | Build for production into `./dist/`          |
| `npm run preview`    | Preview the production build locally         |
| `npm run typecheck`  | Type-check the project (`tsc --noEmit`)      |
| `npm run lint`       | Lint with ESLint                             |
| `npm test`           | Run unit tests (Vitest + jsdom)              |
| `npm run test:watch` | Run unit tests in watch mode                 |

CI (`.github/workflows/ci.yml`) runs typecheck, lint, tests, and build on every push/PR to `main`.
