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
│   ├── components/                  # Switchers, CoordinatorInit
│   └── hooks/useViewModel.ts
│
└── pages/                           # Astro routes (SSR entry points)
```

Path aliases (`tsconfig.json` + `astro.config.mjs` + `vitest.config.ts`):
`@domain/*`, `@application/*`, `@infrastructure/*`, `@presentation/*`.

## Query Pattern

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
   import { QueryKeys } from "@domain/queries/keys";
   import { BaseQuery } from "./BaseQuery";

   export interface GetCategoriesParams { lang: "en" | "tr" | "ar"; }

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

Views live under `presentation/views/<Feature>/{en,tr,ar}/`. The matching `<Feature>ViewSwitcher` selects the variant via `import.meta.glob` based on the current language from `LanguageData`.

## Commands

| Command            | Action                                       |
| :----------------- | :------------------------------------------- |
| `npm install`      | Install dependencies                         |
| `npm run dev`      | Start local dev server at `localhost:4321`   |
| `npm run build`    | Build for production into `./dist/`          |
| `npm run preview`  | Preview the production build locally         |
| `npx tsc --noEmit` | Type-check the project                       |
| `npx vitest run`   | Run unit tests (Vitest + jsdom)              |
