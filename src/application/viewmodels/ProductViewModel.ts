import type { ProductData } from "@domain/models/product";
import { FilterEvents } from "@domain/events/filter";
import { PagerEvents } from "@domain/events/pager";
import { GetProductsQuery, type GetProductsParams } from "@application/queries/GetProductsQuery";
import { runQuery } from "@infrastructure/runQuery";
import eventBus from "../events/eventBus";
import { BaseViewModel } from "./BaseViewModel";


export class ProductViewModel extends BaseViewModel<ProductData> {
  constructor(initialData?: Partial<ProductData>) {
    super({
      products: initialData?.products || [],
      isLoading: initialData?.isLoading || false,
      currentLang: initialData?.currentLang || "en",
      currentFilter: initialData?.currentFilter || "All",
      currentPage: initialData?.currentPage || 1,
      error: null,
    });
  }

  public override onMount() {
    eventBus.on(FilterEvents.Changed, this.onFilterChanged);
    eventBus.on(PagerEvents.Changed, this.onPageChanged);
  }

  public override onUnmount() {
    eventBus.off(FilterEvents.Changed, this.onFilterChanged);
    eventBus.off(PagerEvents.Changed, this.onPageChanged);
  }

  private onFilterChanged = (payload: { filter: string }) => {
    this.fetchProducts({ filter: payload.filter });
  };

  private onPageChanged = (payload: { page: number }) => {
    this.fetchProducts({ page: payload.page });
  };

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
