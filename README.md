# MVVM Template

Astro + React + TypeScript template built around an MVVM / Clean Architecture structure with a CQRS-style query dispatcher and selective, slice-based re-rendering.

## Project Structure

```
src/
├── domain/                          # Pure types & constants. No outgoing deps.
│   ├── models/                      # Entity shapes (Product, HplProduct, ...), view slices, *ViewProps
│   ├── events/                      # Event name constants + the VM event maps
│   ├── viewmodels/                  # Mixin method contracts + the VM-internals surface
│   └── queries/keys.ts              # QueryKeys constants
│
├── application/                     # View-models, queries, app-level wiring.
│   ├── viewmodels/
│   │   ├── BaseViewModel.ts         # reactive base: subscribe/setData/events/fetch guard
│   │   ├── viewModelRegistry.ts     # getViewModel(): the active page VM (non-React accessor)
│   │   ├── ProductViewModel/        # composed VM + mixins/ (Pager, Filters, Hpl, Stats, Components)
│   │   └── ProductDetailViewModel/
│   ├── queries/                     # Query classes (BaseQuery, Get*Query) — build params from the VM
│   ├── events/eventBus.ts           # Pub/sub bus singleton
│   └── routing/coordinator.ts       # URL ↔ event sync
│
├── infrastructure/                  # Adapters, IO, query dispatch.
│   ├── api/api.ts                   # mock data source
│   ├── repositories/                # one function per query (params → api call)
│   ├── queryRegistry.ts             # QueryKey → repository function (single dispatch table)
│   └── runQuery.ts                  # runs a query; owns loading + error
│
├── presentation/                    # React views & hooks. No business logic.
│   ├── views/<Feature>/{en,tr,ar}/  # per-language view variants (separate JS chunks)
│   ├── components/                  # MvvmView (view↔VM connector), LanguageSelector.astro, CoordinatorInit
│   └── hooks/                       # useViewModelSelector, shallowEqual
│
└── pages/                           # Astro routes (SSR entry points)
```

Path aliases (`tsconfig.json` + `astro.config.mjs` + `vitest.config.ts`):
`@domain/*`, `@application/*`, `@infrastructure/*`, `@presentation/*`.

## One ViewModel per page

Each page has exactly one ViewModel that owns all of the page's state: `ProductViewModel` for the product list page and `ProductDetailViewModel` for the detail page. `MvvmView` constructs it once (client-side) and renders the view; the VM is **not** subscribed to at the page level.

`BaseViewModel<TData, TEvents>` provides the reactive core: `getData()`, `subscribe()`, a protected `setData()`, the typed event map, and a fetch race-guard (`beginFetch` / `isCurrentFetch`). Its constructor registers the instance as the **active page ViewModel** (see `getViewModel()` below).

### Composing the VM from mixins

`ProductViewModel` is split into behavior slices merged onto its prototype (patterns.dev object-mixin style), so the class stays readable as it grows:

- **PagerMixin** — page-change events/handlers
- **FiltersMixin** — filter select + "load more filters"
- **HplMixin** — horizontal product list (refetched on filter change)
- **StatsMixin** — category aggregates (whole-catalog, filter-independent)
- **ComponentsMixin** — all view-facing slice getters

Each mixin is a plain object typed `ThisType<ProductViewModelInternals & ...>` so `this` is fully typed. They're registered in one place — `ProductViewModel/mixins/index.ts` — which exports both the runtime array (`Object.assign`'d onto the prototype) and the `ProductMixins` type intersection (declaration-merged onto the class). Adding a mixin = one entry in each.

## Selective re-rendering

`MvvmView` does not subscribe to the whole VM. Instead each leaf component subscribes to only the **slice** it reads, via `useViewModelSelector`, so a state change re-renders only the components that read the changed slice:

```tsx
// Pager re-renders only when currentPage/totalPages change
const { currentPage, totalPages } = useViewModelSelector(viewModel, (vm) => vm.getPager());
```

The slice getters live on the VM (in `ComponentsMixin`): `getProductList()`, `getFilters()`, `getPager()`, `getHpl()`, `getStats()`. Each builds a fresh object; the hook's default `shallowEqual` comparator means a component re-renders only when one of the slice's fields actually changes. (This is why "Load more filters" updates the filter panel without re-rendering the product list — they read different slices.)

Views trigger behavior by dispatching named, type-checked events:

```tsx
<button onClick={() => viewModel.dispatchEvent(FilterEvents.Select, { filter })}>
```

Each VM declares its event map as the second generic of `BaseViewModel`:

```ts
export type ProductViewModelEvents = {
  [FilterEvents.Select]: { filter: string };
  [FilterEvents.LoadMore]: void;
  [PagerEvents.Change]: { page: number };
};
```

A VM that declares no event map (e.g. `ProductDetailViewModel`) statically rejects every `dispatchEvent` call.

## Query Pattern

Shared primitives live in domain: `LANGS` and the `Lang` type (`src/domain/models/language.ts`) are the single source of truth for supported languages — never write the union inline.

ViewModels don't touch repositories or the api directly. They construct a query and `runQuery(...)` it. **The query builds its own params by reading the active ViewModel** via `getViewModel()`, so call sites don't hand-assemble params:

```ts
fetchProducts(override: { filter?: string | null; page?: number } = {}) {
  this.setData({                                    // reflect intent into state first
    currentFilter: override.filter ?? this.data.currentFilter,
    currentPage: override.page ?? this.data.currentPage,
  });
  const fetchId = this.beginFetch();
  runQuery(new GetProductsQuery()).then((products) => {  // query reads lang/filter/page from the VM
    if (products && this.isCurrentFetch(fetchId)) {       // latest-wins race guard
      this.setData({ products, error: null });
    }
  });
}
```

### `getViewModel()` — why it's a plain accessor, not a hook

Queries run in places React hooks **cannot**: event handlers, query objects, and during SSR. So the active VM is exposed through a plain module accessor (`application/viewmodels/viewModelRegistry.ts`), registered by `BaseViewModel`'s constructor and cleared by `MvvmView` on unmount. A query calls `getViewModel().getData()` to read current state. (Inside React, components receive the `viewModel` as a prop — the explicit, SSR-safe, testable wire.)

### `runQuery` owns loading + error

`runQuery` (`src/infrastructure/runQuery.ts`) is the single dispatcher. Against the active VM it toggles a loading flag around the fetch and writes any error — so call sites never repeat `try/catch` or `isLoading: true/false`:

```ts
export async function runQuery(query, { loadingKey } = {}) {
  const vm = getViewModel();
  vm.setLoading(true, loadingKey);            // defaults to "isLoading"
  try {
    return await queryHandlers[query.key](query.getParams());
  } catch (e) {
    vm.setError(message);                      // common error handler
    return undefined;                          // caller's .then guards undefined
  } finally {
    vm.setLoading(false, loadingKey);
  }
}
```

Pass `loadingKey` for a flag that shouldn't dim other consumers, e.g. `runQuery(new GetMoreFiltersQuery(), { loadingKey: "moreFiltersLoading" })`. The latest-wins guard (`beginFetch` / `isCurrentFetch`) stays in the VM's `.then`, since "which response wins" is a VM policy.

### Adding a new query

1. **Add the key** in `src/domain/queries/keys.ts`.
2. **Define the query class** in `src/application/queries/` — its `getParams()` reads what it needs from `getViewModel().getData()`:
   ```ts
   export class GetCategoriesQuery extends BaseQuery<GetCategoriesParams, string[]> {
     readonly key = QueryKeys.GetCategories;
     constructor() { super(undefined as unknown as GetCategoriesParams); }
     override getParams() {
       const d = getViewModel<BaseViewModel<ProductData, any>>().getData();
       return { lang: d.currentLang };
     }
   }
   ```
3. **Add a repository function** in `src/infrastructure/repositories/` — one function mapping params → api call:
   ```ts
   export const getCategories = (p: GetCategoriesParams) => api.fetchCategories(p.lang);
   ```
4. **Register it** in `src/infrastructure/queryRegistry.ts` — one entry:
   ```ts
   [QueryKeys.GetCategories]: getCategories,
   ```
5. **Use it from a VM**: `runQuery(new GetCategoriesQuery()).then((cats) => { if (cats) this.setData({ categories: cats }); });`

## Events

Two event layers, both using name constants from `src/domain/events/<feature>.ts` (never inline strings):

- **View → ViewModel**: `viewModel.dispatchEvent(FilterEvents.Select, ...)` runs handlers registered with `registerEvent`; names and payloads are typed by the VM's event map.
- **ViewModel ↔ URL**: the ViewModel publishes `*.Changed` events on `application/events/eventBus.ts`; the coordinator (`application/routing/coordinator.ts`) writes them to the URL and re-dispatches them on browser back/forward, so the ViewModel reacts to history navigation the same way as to user actions.

## i18n views & per-language chunks

The language is part of the URL (`?lang=en|tr|ar`) and only changes with a full page load: `LanguageSelector.astro` renders plain links, and each Astro page reads `Astro.url.searchParams` to SSR in the requested language. There is no client-side language switching.

Views live under `presentation/views/<Feature>/{en,tr,ar}/` as **separate, self-contained files**. A small server-only `ProductView.astro` selects the matching island with a `lang ===` ladder:

```astro
{lang === "en" && <ProductViewEn client:load initialData={initialData} />}
{lang === "tr" && <ProductViewTr client:load initialData={initialData} />}
{lang === "ar" && <ProductViewAr client:load initialData={initialData} />}
```

Because each language is a distinct static import rendered conditionally at the Astro layer, **Astro emits a separate JS chunk per language and ships only the matched one**. Selection must happen here (SSR, where the language is known) — **never** via client-side `React.lazy()`/dynamic import, which breaks island hydration and silently kills interactivity.

## SSR data

All initial data — products, filters, HPL, category stats — is fetched on the server (`api.fetchSSRData()`) and passed into the ViewModel as `initialData`. The VM seeds its state from it; there is no client-side mount fetch for the initial render. Runtime refetches (e.g. HPL on filter change) still go through `runQuery`.

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
