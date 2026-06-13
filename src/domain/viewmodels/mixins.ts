import type { ProductListSlice, FiltersSlice, PagerSlice } from "@domain/models/product";

/** Methods the Pager mixin adds to ProductViewModel. */
export interface PagerMixin {
  /** Register events + bus listener. Called once from the VM constructor. */
  initPager(): void;
  /** Remove the bus listener. Called from the VM's onUnmount. */
  disposePager(): void;
  changePage(payload: { page: number }): void;
  getPager(): PagerSlice;
  /** Bound bus handler, set up by initPager. */
  _onPageChanged?: (payload: { page: number }) => void;
}

/** Methods the Filters mixin adds to ProductViewModel. */
export interface FiltersMixin {
  /** Register events + bus listener. Called once from the VM constructor. */
  initFilters(): void;
  /** Remove the bus listener. Called from the VM's onUnmount. */
  disposeFilters(): void;
  fetchFilters(): Promise<void>;
  selectFilter(payload: { filter: string }): void;
  loadMoreFilters(): Promise<void>;
  getFilters(): FiltersSlice;
  /** Bound bus handler, set up by initFilters. */
  _onFilterChanged?: (payload: { filter: string }) => void;
}

/** Methods the Components mixin adds to ProductViewModel. */
export interface ComponentsMixin {
  getProductList(): ProductListSlice;
}
