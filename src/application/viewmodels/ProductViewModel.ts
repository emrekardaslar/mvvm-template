import type { ProductData } from "@domain/models/product";
import { FilterEvents } from "@domain/events/filter";
import { LanguageEvents } from "@domain/events/language";
import { PagerEvents } from "@domain/events/pager";
import productListRepository from "@infrastructure/repositories/productListRepository";
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
    });
  }

  public override onMount() {
    eventBus.on(FilterEvents.Changed, this.onFilterChanged);
    eventBus.on(LanguageEvents.Changed, this.onLanguageChanged);
    eventBus.on(PagerEvents.Changed, this.onPageChanged);
  }

  public override onUnmount() {
    eventBus.off(FilterEvents.Changed, this.onFilterChanged);
    eventBus.off(LanguageEvents.Changed, this.onLanguageChanged);
    eventBus.off(PagerEvents.Changed, this.onPageChanged);
  }

  private onFilterChanged = (payload: { filter: string }) => {
    this.setData({ currentFilter: payload.filter });
    this.fetchProducts();
  };

  private onLanguageChanged = (payload: { lang: "en" | "tr" | "ar" }) => {
    this.setData({ currentLang: payload.lang });
    this.setData({ currentPage: 1 });
  };

  private onPageChanged = (payload: { page: number }) => {
    this.setData({ currentPage: payload.page });
    this.fetchProducts();
  };

  private async fetchProducts() {
    this.setData({ isLoading: true });
    const products = await productListRepository.getProducts(
      this.data.currentLang,
      this.data.currentFilter,
      this.data.currentPage //TODO
    );
    this.setData({ products, isLoading: false });
  }
}
