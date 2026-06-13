import type { ProductListSlice, FiltersSlice, PagerSlice, HplSlice, StatsSlice } from "@domain/models/product";

/** Methods the Pager mixin adds to ProductViewModel (behavior only). */
export interface PagerMixin {
  /** Register events + bus listener. Called once from the VM constructor. */
  initPager(): void;
  /** Remove the bus listener. Called from the VM's onUnmount. */
  disposePager(): void;
  changePage(payload: { page: number }): void;
  /** Bound bus handler, set up by initPager. */
  _onPageChanged?: (payload: { page: number }) => void;
}

/** Methods the Filters mixin adds to ProductViewModel (behavior only). */
export interface FiltersMixin {
  /** Register events + bus listener. Called once from the VM constructor. */
  initFilters(): void;
  /** Remove the bus listener. Called from the VM's onUnmount. */
  disposeFilters(): void;
  selectFilter(payload: { filter: string }): void;
  loadMoreFilters(): Promise<void>;
  /** Bound bus handler, set up by initFilters. */
  _onFilterChanged?: (payload: { filter: string }) => void;
}

/** Methods the Hpl (horizontal product list) mixin adds (behavior only). */
export interface HplMixin {
  /** Register the filter-change bus listener. Called from the VM constructor. */
  initHpl(): void;
  /** Remove the bus listener. Called from the VM's onUnmount. */
  disposeHpl(): void;
  fetchHpl(): Promise<void>;
  /** Bound bus handler, set up by initHpl. */
  _onHplFilterChanged?: (payload: { filter: string }) => void;
}

/** Methods the Stats mixin adds (category-stats fetch; no filter dependency). */
export interface StatsMixin {
  fetchStats(): Promise<void>;
}

/** All view-facing slice getters live in the Components mixin. */
export interface ComponentsMixin {
  getProductList(): ProductListSlice;
  getFilters(): FiltersSlice;
  getPager(): PagerSlice;
  getHpl(): HplSlice;
  getStats(): StatsSlice;
}
