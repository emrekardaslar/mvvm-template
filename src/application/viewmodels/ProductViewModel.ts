import type { ProductData } from "@domain/models/product";
import { FilterEvents } from "@domain/events/filter";
import { PagerEvents } from "@domain/events/pager";
import { GetProductsQuery, type GetProductsParams } from "@application/queries/GetProductsQuery";
import { GetFiltersQuery } from "@application/queries/GetFiltersQuery";
import { runQuery } from "@infrastructure/runQuery";
import eventBus from "../events/eventBus";
import { BaseViewModel } from "./BaseViewModel";


/**
 * Page ViewModel for the product list page: owns products, filters, and paging.
 */
export class ProductViewModel extends BaseViewModel<ProductData> {
  constructor(initialData?: Partial<ProductData>) {
    super({
      products: initialData?.products || [],
      filters: initialData?.filters || [],
      isLoading: initialData?.isLoading || false,
      currentLang: initialData?.currentLang || "en",
      currentFilter: initialData?.currentFilter ?? null,
      currentPage: initialData?.currentPage || 1,
      totalPages: initialData?.totalPages || 1,
      error: null,
    });
    // Events dispatched by the views
    this.registerEvent(FilterEvents.Select, this.selectFilter);
    this.registerEvent(PagerEvents.Change, this.changePage);
  }

  public override async onMount() {
    // Changed events also arrive from the coordinator on browser back/forward
    eventBus.on(FilterEvents.Changed, this.onFilterChanged);
    eventBus.on(PagerEvents.Changed, this.onPageChanged);
    if (this.data.filters.length === 0) {
      await this.fetchFilters();
    }
  }

  public override onUnmount() {
    eventBus.off(FilterEvents.Changed, this.onFilterChanged);
    eventBus.off(PagerEvents.Changed, this.onPageChanged);
  }

  private selectFilter = (payload: { filter: string }) => {
    eventBus.dispatch(FilterEvents.Changed, { filter: payload.filter });
  };

  private changePage = (payload: { page: number }) => {
    eventBus.dispatch(PagerEvents.Changed, { page: payload.page });
  };

  private onFilterChanged = (payload: { filter: string }) => {
    this.fetchProducts({ filter: payload.filter, page: 1 });
  };

  private onPageChanged = (payload: { page: number }) => {
    this.fetchProducts({ page: payload.page });
  };

  private async fetchFilters() {
    try {
      const filters = await runQuery(new GetFiltersQuery({ lang: this.data.currentLang }));
      this.setData({ filters, currentFilter: this.data.currentFilter ?? filters[0] });
    } catch (e) {
      this.setData({ error: e instanceof Error ? e.message : String(e) });
    }
  }

  private async fetchProducts(override: Partial<GetProductsParams> = {}) {
    const params: GetProductsParams = {
      lang: this.data.currentLang,
      filter: this.data.currentFilter,
      page: this.data.currentPage,
      ...override,
    };
    const fetchId = this.beginFetch();
    this.setData({
      isLoading: true,
      error: null,
      currentFilter: params.filter ?? this.data.currentFilter,
      currentPage: params.page,
      currentLang: params.lang,
    });
    try {
      const products = await runQuery(new GetProductsQuery(params));
      if (!this.isCurrentFetch(fetchId)) return;
      this.setData({ products, isLoading: false });
    } catch (e) {
      if (!this.isCurrentFetch(fetchId)) return;
      this.setData({ error: e instanceof Error ? e.message : String(e), isLoading: false });
    }
  }
}
