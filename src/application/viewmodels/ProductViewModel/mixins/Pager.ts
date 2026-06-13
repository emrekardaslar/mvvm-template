import { PagerEvents } from "@domain/events/pager";
import eventBus from "../../../events/eventBus";
import type { ProductViewModelInternals } from "@domain/viewmodels/ProductViewModelInternals";
import type { PagerMixin as PagerMixinContract } from "@domain/viewmodels/mixins";

// Paging behavior + the paging slice getter. `this` is the composed ViewModel.
export const PagerMixin: PagerMixinContract & ThisType<ProductViewModelInternals & PagerMixinContract> = {
  initPager() {
    this.registerEvent(PagerEvents.Change, (p) => this.changePage(p));
    // Bind once and keep the reference so it can be removed in disposePager.
    this._onPageChanged = (payload) => this.fetchProducts({ page: payload.page });
    eventBus.on(PagerEvents.Changed, this._onPageChanged);
  },

  disposePager() {
    if (this._onPageChanged) eventBus.off(PagerEvents.Changed, this._onPageChanged);
  },

  changePage(payload) {
    eventBus.dispatch(PagerEvents.Changed, { page: payload.page });
  },

  getPager() {
    return {
      currentPage: this.data.currentPage,
      totalPages: this.data.totalPages,
    };
  },
};
