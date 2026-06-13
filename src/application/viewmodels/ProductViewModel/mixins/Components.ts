import type { ProductViewModelInternals } from "@domain/viewmodels/ProductViewModelInternals";
import type { ComponentsMixin as ComponentsMixinContract } from "@domain/viewmodels/mixins";

// All view-facing getters live here: each returns the slice one view component
// reads. The Pager/Filters mixins hold only behavior (events + actions). Each
// getter builds a fresh slice object; the selector hook's shallow-equal default
// means a component re-renders only when one of its fields changes.
export const ComponentsMixin: ComponentsMixinContract & ThisType<ProductViewModelInternals> = {
  getProductList() {
    return {
      products: this.data.products,
      isLoading: this.data.isLoading,
      error: this.data.error,
      currentLang: this.data.currentLang,
    };
  },

  getFilters() {
    return {
      filters: this.data.filters,
      currentFilter: this.data.currentFilter,
      moreFiltersLoading: this.data.moreFiltersLoading,
      moreFiltersLoaded: this.data.moreFiltersLoaded,
    };
  },

  getPager() {
    return {
      currentPage: this.data.currentPage,
      totalPages: this.data.totalPages,
    };
  },
};
