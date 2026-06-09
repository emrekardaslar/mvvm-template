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
│   ├── components/                  # Switchers, LanguageSelector.astro, CoordinatorInit
│   └── hooks/useViewModel.ts
│
└── pages/                           # Astro routes (SSR entry points)
```

Path aliases (`tsconfig.json` + `astro.config.mjs` + `vitest.config.ts`):
`@domain/*`, `@application/*`, `@infrastructure/*`, `@presentation/*`.

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

Cross-VM messaging goes through `application/events/eventBus.ts`. Event names are constants in `src/domain/events/<feature>.ts` (e.g. `FilterEvents.Changed`) — never inline strings. The coordinator (`application/routing/coordinator.ts`) syncs events with the URL.

## i18n Views

The language is part of the URL (`?lang=en|tr|ar`) and only changes with a full page load: `LanguageSelector.astro` renders plain links, and each Astro page reads `Astro.url.searchParams` to SSR in the requested language. There is no client-side language switching — no language events, no language ViewModel.

Views live under `presentation/views/<Feature>/{en,tr,ar}/`. The matching `<Feature>ViewSwitcher` selects the variant via `import.meta.glob` based on the `currentLang` passed in from SSR.

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
