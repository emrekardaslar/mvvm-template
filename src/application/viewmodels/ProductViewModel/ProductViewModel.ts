/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging,
   @typescript-eslint/no-empty-object-type --
   ProductViewModel composes behavior from object mixins merged onto the
   prototype via Object.assign; the same-named interface declares those merged
   methods (via ProductMixins) so callers see them. The empty interface body and
   the class/interface merge are both intentional here. */
import type { ProductData } from "@domain/models/product";
import { GetProductsQuery } from "@application/queries/GetProductsQuery";
import { runQuery } from "@infrastructure/runQuery";
import { BaseViewModel } from "../BaseViewModel";
import { productMixins, type ProductMixins } from "./mixins";
import type { ProductViewModelEvents } from "@domain/events/productViewModelEvents";

export type { ProductViewModelEvents } from "@domain/events/productViewModelEvents";

/**
 * Page ViewModel for the product list page. Behavior is split into mixins that
 * are merged onto the prototype (patterns.dev object-mixin style):
 * - PagerMixin       — page-change events/handlers
 * - FiltersMixin      — filter select, "load more", initial fetch
 * - HplMixin          — horizontal product list, refetched on filter change
 * - StatsMixin        — category stats (whole-catalog aggregates, no filter dep)
 * - ComponentsMixin  — all view getters (getProductList/getFilters/getPager/getHpl/getStats)
 *
 * This class owns the product-list fetch and the lifecycle: the constructor
 * calls each mixin's init() (events + bus listener), onUnmount calls dispose().
 */
export class ProductViewModel extends BaseViewModel<ProductData, ProductViewModelEvents> {
  constructor(initialData?: Partial<ProductData>) {
    super({
      products: initialData?.products || [],
      hplProducts: initialData?.hplProducts || [],
      hplLoading: false,
      categoryStats: initialData?.categoryStats || [],
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
    this.initHpl();
  }

  // Products, filters, HPL, and category stats all come from SSR initialData.

  public override onUnmount() {
    this.disposePager();
    this.disposeFilters();
    this.disposeHpl();
  }

  fetchProducts(override: { filter?: string | null; page?: number } = {}) {
    // Reflect the user's intent into state first; the query reads it back.
    this.setData({
      currentFilter: override.filter ?? this.data.currentFilter,
      currentPage: override.page ?? this.data.currentPage,
    });
    runQuery(new GetProductsQuery()).then((products) => {
      if (products) this.setData({ products, error: null });
    });
  }
}

// Declaration-merge the mixin method signatures onto the class type, then merge
// the implementations onto the prototype at runtime.
export interface ProductViewModel extends ProductMixins {}

Object.assign(ProductViewModel.prototype, ...productMixins);
