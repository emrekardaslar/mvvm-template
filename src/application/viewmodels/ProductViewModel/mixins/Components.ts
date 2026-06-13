import type { ProductViewModelInternals } from "@domain/viewmodels/ProductViewModelInternals";
import type { ComponentsMixin as ComponentsMixinContract } from "@domain/viewmodels/mixins";

// View-facing getters that don't belong to a single behavior mixin. getFilters
// and getPager live with their behavior (Filters/Pager); getProductList lives
// here since the list's behavior (fetchProducts) is owned by ProductViewModel.
// Each getter builds a fresh slice object; the selector hook's shallow-equal
// default means a component re-renders only when one of its fields changes.
export const ComponentsMixin: ComponentsMixinContract & ThisType<ProductViewModelInternals> = {
  getProductList() {
    return {
      products: this.data.products,
      isLoading: this.data.isLoading,
      error: this.data.error,
      currentLang: this.data.currentLang,
    };
  },
};
