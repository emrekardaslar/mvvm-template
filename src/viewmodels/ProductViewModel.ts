import { BaseViewModel } from "./BaseViewModel";
import api from "../services/api";
import eventBus from "../services/eventBus";
import type { ProductData } from "../model/product";

export class ProductViewModel extends BaseViewModel<ProductData> {
  private currentFilter: string | null = "All";
  private currentPage: number = 1;

  constructor(initialData?: Partial<ProductData>) {
    super({
      products: initialData?.products || [],
      isLoading: initialData?.isLoading || false,
      currentLang: initialData?.currentLang || "en",
    });
  }

  public override onMount() {
    eventBus.on("filterChanged", this.onFilterChanged);
    eventBus.on("languageChanged", this.onLanguageChanged);
    eventBus.on("pageChanged", this.onPageChanged);
  }

  public override onUnmount() {
    eventBus.off("filterChanged", this.onFilterChanged);
    eventBus.off("languageChanged", this.onLanguageChanged);
  }

  private onFilterChanged = (payload: { filter: string }) => {
    this.currentFilter = payload.filter;
    this.fetchProducts();
  };

  private onLanguageChanged = (payload: { lang: "en" | "tr" | "ar" }) => {
    this.setData({ currentLang: payload.lang });
    this.fetchProducts();
    // When language changes, we might need to refetch products with the current filter
    // The filter component will also refetch and send a new 'filterChanged' event,
    // so we can just rely on that to trigger the product fetch.
  };

  private onPageChanged = (payload: { page: number }) => {    
    this.fetchProducts()
  }

  private async fetchProducts() {
    this.setData({ isLoading: true });
    const products = await api.fetchProducts(
      this.data.currentLang,
      this.currentFilter,
      this.currentPage
    );
    this.setData({ products, isLoading: false });
  }
}
