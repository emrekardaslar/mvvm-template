import { FilterEvents } from "@domain/events/filter";
import { GetMoreFiltersQuery } from "@application/queries/GetMoreFiltersQuery";
import { runQuery } from "@infrastructure/runQuery";
import eventBus from "../../../events/eventBus";
import type { ProductViewModelInternals } from "@domain/viewmodels/ProductViewModelInternals";
import type { FiltersMixin as FiltersMixinContract } from "@domain/viewmodels/mixins";

// Filter behavior: select a filter, and load more filters from a second source.
export const FiltersMixin: FiltersMixinContract & ThisType<ProductViewModelInternals & FiltersMixinContract> = {
  initFilters() {
    this.registerEvent(FilterEvents.Select, (p) => this.selectFilter(p));
    this.registerEvent(FilterEvents.LoadMore, () => this.loadMoreFilters());
    this._onFilterChanged = (payload) => this.fetchProducts({ filter: payload.filter, page: 1 });
    eventBus.on(FilterEvents.Changed, this._onFilterChanged);
  },

  disposeFilters() {
    if (this._onFilterChanged) eventBus.off(FilterEvents.Changed, this._onFilterChanged);
  },

  selectFilter(payload) {
    eventBus.dispatch(FilterEvents.Changed, { filter: payload.filter });
  },

  async loadMoreFilters() {
    if (this.data.moreFiltersLoading) return;
    const more = await runQuery(new GetMoreFiltersQuery(), { loadingKey: "moreFiltersLoading" });
    if (!more) return;
    // Append only new filters. Updates the filters slice (and the loaded flag)
    // but never products/isLoading/error, so a component selecting the product
    // slice does not re-render.
    const merged = [...this.data.filters, ...more.filter((f) => !this.data.filters.includes(f))];
    this.setData({ filters: merged, moreFiltersLoaded: true });
  },
};
