import { FilterEvents } from "@domain/events/filter";
import { GetFiltersQuery } from "@application/queries/GetFiltersQuery";
import { GetMoreFiltersQuery } from "@application/queries/GetMoreFiltersQuery";
import { runQuery } from "@infrastructure/runQuery";
import eventBus from "../../../events/eventBus";
import type { ProductViewModelInternals } from "@domain/viewmodels/ProductViewModelInternals";
import type { FiltersMixin as FiltersMixinContract } from "@domain/viewmodels/mixins";

// Filter behavior (select, load-more, initial fetch) + the filters slice getter.
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

  fetchFilters() {
    return runQuery(new GetFiltersQuery(), {
      onError: (error) => this.setData({ error }),
    }).then((filters) => {
      if (filters) this.setData({ filters, currentFilter: this.data.currentFilter ?? filters[0] });
    });
  },

  selectFilter(payload) {
    eventBus.dispatch(FilterEvents.Changed, { filter: payload.filter });
  },

  loadMoreFilters() {
    if (this.data.moreFiltersLoading) return Promise.resolve();
    return runQuery(new GetMoreFiltersQuery(), {
      onLoading: (moreFiltersLoading) => this.setData({ moreFiltersLoading }),
      onError: (error) => this.setData({ error }),
    }).then((more) => {
      if (!more) return;
      // Append only new filters. Updates the filters slice (and the loaded
      // flag) but never products/isLoading/error, so a component selecting the
      // product slice does not re-render.
      const merged = [...this.data.filters, ...more.filter((f) => !this.data.filters.includes(f))];
      this.setData({ filters: merged, moreFiltersLoaded: true });
    });
  },

  getFilters() {
    return {
      filters: this.data.filters,
      currentFilter: this.data.currentFilter,
      moreFiltersLoading: this.data.moreFiltersLoading,
      moreFiltersLoaded: this.data.moreFiltersLoaded,
    };
  },
};
