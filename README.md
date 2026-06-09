# MVVM Template

Astro + React + TypeScript template built around an MVVM / Clean Architecture structure with a CQRS-style query dispatcher.

## Project Structure

```
src/
├── domain/                          # Pure types & constants. No outgoing deps.
│   ├── models/                      # Entity shapes (Product, FilterData, ...) and *ViewProps
│   ├── events/                      # Event name constants per feature
│   └── queries/keys.ts              # QueryKeys constants
│
├── application/                     # Use cases, view-models, app-level wiring.
│   ├── viewmodels/                  # *ViewModel.ts + BaseViewModel
│   ├── queries/                     # Query descriptor classes (BaseQuery, Get*Query)
│   ├── events/eventBus.ts           # Pub/sub bus singleton
│   └── routing/coordinator.ts       # URL ↔ event sync
│
├── infrastructure/                  # Adapters, IO, query dispatch.
│   ├── api/api.ts
│   ├── repositories/                # Per-feature repos exposing `run(key, params)`
│   └── runQuery.ts                  # Maps QueryKey → repository call
│
├── presentation/                    # React views & hooks. No business logic.
│   ├── views/<Feature>/{en,tr,ar}/  # Per-language view variants
│   ├── components/                  # MvvmView (view↔VM connector), LanguageSelector.astro, CoordinatorInit
│   └── hooks/useViewModel.ts
│
└── pages/                           # Astro routes (SSR entry points)
```

Path aliases (`tsconfig.json` + `astro.config.mjs` + `vitest.config.ts`):
`@domain/*`, `@application/*`, `@infrastructure/*`, `@presentation/*`.

## One ViewModel per page

Each page has exactly one ViewModel that owns all of the page's state: `ProductViewModel` for the product list page (products, filters, paging) and `ProductDetailViewModel` for the detail page. Sub-views (`FilterView`, `Pager`) are presentational components rendered inside the page view and receive the page's `data` + `viewModel` as props — they never create their own ViewModel.

Views trigger behavior by dispatching named events to the ViewModel:

```tsx
<button onClick={() => viewModel.dispatchEvent(FilterEvents.Select, { filter })}>
```

The ViewModel registers handlers for these in its constructor via `registerEvent(name, handler)`. Event names and payloads are compile-checked: each ViewModel declares its event map as the second generic of `BaseViewModel`:

```ts
export type ProductViewModelEvents = {
  [FilterEvents.Select]: { filter: string };
  [PagerEvents.Change]: { page: number };
};

export class ProductViewModel extends BaseViewModel<ProductData, ProductViewModelEvents> { ... }
```

A ViewModel that declares no event map (e.g. `ProductDetailViewModel`) statically rejects every `dispatchEvent` call.

Pages connect views to their ViewModel through `MvvmView` (`presentation/components/MvvmView.tsx`): each `<Feature>ViewSwitcher` island passes it the ViewModel class, the SSR initial data, and the view folder name; it constructs the VM, subscribes via `useViewModel`, and resolves the per-language view variant once.

## Query Pattern

Shared primitives live in domain: `LANGS` and the `Lang` type (`src/domain/models/language.ts`) are the single source of truth for supported languages — never write the union inline.

ViewModels don't touch repositories directly. They describe what they need with a query and `await runQuery(...)`:

```ts
const products = await runQuery(new GetProductsQuery({
  lang: this.data.currentLang,
  filter: this.data.currentFilter,
  page: this.data.currentPage,
}));
```

`runQuery` is a single dispatcher (`src/infrastructure/runQuery.ts`) that maps each `QueryKey` to the matching repository call.

### Overrides

Each `fetchX(override?: Partial<XParams>)` on a VM merges `this.data` with the override, so call sites only pass the changed field:

```ts
private onFilterChanged = (payload: { filter: string }) => {
  this.fetchProducts({ filter: payload.filter });  // lang/page taken from this.data
};
```

### Error handling & races

Every `fetchX` wraps `runQuery` in `try/catch`: failures land in an `error: string | null` field on the VM data (rendered by the views), and `isLoading` is always cleared. `BaseViewModel` provides `beginFetch()` / `isCurrentFetch(id)` so responses that arrive after a newer fetch started are dropped (latest wins):

```ts
const fetchId = this.beginFetch();
this.setData({ isLoading: true, error: null });
try {
  const products = await runQuery(new GetProductsQuery(params));
  if (!this.isCurrentFetch(fetchId)) return;   // stale response — drop
  this.setData({ products, isLoading: false });
} catch (e) {
  if (!this.isCurrentFetch(fetchId)) return;
  this.setData({ error: e instanceof Error ? e.message : String(e), isLoading: false });
}
```

### Adding a new query

1. **Add the key** in `src/domain/queries/keys.ts`:
   ```ts
   export const QueryKeys = {
     ...
     GetCategories: 'GetCategories',
   } as const;
   ```

2. **Define the query class** in `src/application/queries/GetCategoriesQuery.ts`:
   ```ts
   import type { Lang } from "@domain/models/language";
   import { QueryKeys } from "@domain/queries/keys";
   import { BaseQuery } from "./BaseQuery";

   export interface GetCategoriesParams { lang: Lang; }

   export class GetCategoriesQuery extends BaseQuery<GetCategoriesParams, string[]> {
     readonly key = QueryKeys.GetCategories;
   }
   ```

3. **Add a repository entry** (extend an existing repo or create a new one). Each repo holds a `handlers` map keyed by `QueryKeys.*` and exposes a single typed `run(key, params)`.

4. **Register the dispatch** in `src/infrastructure/runQuery.ts` — add one line to the `handlers` map:
   ```ts
   [QueryKeys.GetCategories]: (params) =>
     categoryRepository.run(QueryKeys.GetCategories, params),
   ```

5. **Use it from a VM**:
   ```ts
   const categories = await runQuery(new GetCategoriesQuery({ lang: this.data.currentLang }));
   ```

## Events

Two event layers, both using name constants from `src/domain/events/<feature>.ts` (never inline strings):

- **View → ViewModel**: `viewModel.dispatchEvent(FilterEvents.Select, ...)` runs handlers registered with `registerEvent`; names and payloads are typed by the VM's event map.
- **ViewModel ↔ URL**: the ViewModel publishes `*.Changed` events on `application/events/eventBus.ts`; the coordinator (`application/routing/coordinator.ts`) writes them to the URL and dispatches them back on browser back/forward, so the ViewModel reacts to history navigation the same way as to user actions.

## i18n Views

The language is part of the URL (`?lang=en|tr|ar`) and only changes with a full page load: `LanguageSelector.astro` renders plain links, and each Astro page reads `Astro.url.searchParams` to SSR in the requested language. There is no client-side language switching — no language events, no language ViewModel.

Views live under `presentation/views/<Feature>/{en,tr,ar}/`. `MvvmView` selects the variant via `import.meta.glob` (`viewMap.ts`) based on the `currentLang` passed in from SSR — resolved once per page load. Views without language variants (e.g. `ProductDetailView`) resolve through the same mechanism's fallback path (`views/<Feature>/<Feature>.tsx`).

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
