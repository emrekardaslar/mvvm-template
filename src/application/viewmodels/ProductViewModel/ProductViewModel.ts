/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging --
   ProductViewModel composes behavior from object mixins merged onto the
   prototype via Object.assign; the same-named interface declares those merged
   methods so callers see them. The class/interface merge is intentional here. */
import type { ProductData } from "@domain/models/product";
import { GetProductsQuery } from "@application/queries/GetProductsQuery";
import { runQuery } from "@infrastructure/runQuery";
import { BaseViewModel } from "../BaseViewModel";
import { PagerMixin } from "./mixins/Pager";
import { FiltersMixin } from "./mixins/Filters";
import { ComponentsMixin } from "./mixins/Components";
import type {
  PagerMixin as PagerMixinContract,
  FiltersMixin as FiltersMixinContract,
  ComponentsMixin as ComponentsMixinContract,
} from "@domain/viewmodels/mixins";
import type { ProductViewModelEvents } from "@domain/events/productViewModelEvents";

export type { ProductViewModelEvents } from "@domain/events/productViewModelEvents";

/**
 * Page ViewModel for the product list page. Behavior is split into mixins that
 * are merged onto the prototype (patterns.dev object-mixin style):
 * - PagerMixin       — page-change events/handlers + getPager()
 * - FiltersMixin      — filter select, "load more", initial fetch + getFilters()
 * - ComponentsMixin  — remaining view getters (getProductList)
 *
 * This class owns the product-list fetch and the lifecycle: the constructor
 * calls each mixin's init() (events + bus listener), onUnmount calls dispose().
 */
export class ProductViewModel extends BaseViewModel<ProductData, ProductViewModelEvents> {
  constructor(initialData?: Partial<ProductData>) {
    super({
      products: initialData?.products || [],
      filters: initialData?.filters || [],
      moreFiltersLoading: false,
      moreFiltersLoaded: false,
      isLoading: initialData?.isLoading || false,
      currentLang: initialData?.currentLang || "en",
      currentFilter: initialData?.currentFilter ?? null,
      currentPage: initialData?.currentPage || 1,
      totalPages: initialData?.totalPages || 1,
      error: null,
    });
    // Each mixin wires its own events + bus listener.
    this.initPager();
    this.initFilters();
  }

  public override async onMount() {
    if (this.data.filters.length === 0) {
      await this.fetchFilters();
    }
  }

  public override onUnmount() {
    this.disposePager();
    this.disposeFilters();
  }

  fetchProducts(override: { filter?: string | null; page?: number } = {}) {
    // Reflect the user's intent into state first; the query reads it back.
    this.setData({
      currentFilter: override.filter ?? this.data.currentFilter,
      currentPage: override.page ?? this.data.currentPage,
    });
    const fetchId = this.beginFetch();
    runQuery(new GetProductsQuery(), {
      onLoading: (isLoading) => this.setData({ isLoading }),
      onError: (error) => this.setData({ error }),
    }).then((products) => {
      // Latest-wins: ignore a stale response superseded by a newer fetch.
      if (products && this.isCurrentFetch(fetchId)) {
        this.setData({ products, error: null });
      }
    });
  }
}

// Declaration-merge the mixin method signatures onto the class type, then merge
// the implementations onto the prototype at runtime.
export interface ProductViewModel
  extends PagerMixinContract,
    FiltersMixinContract,
    ComponentsMixinContract {}

Object.assign(ProductViewModel.prototype, PagerMixin, FiltersMixin, ComponentsMixin);
