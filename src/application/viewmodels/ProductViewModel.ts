import type { ProductData } from "../../domain/models/product";
import productListRepository from "../../infrastructure/repositories/productListRepository";
import eventBus from "../../services/eventBus";
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
    eventBus.on("filterChanged", this.onFilterChanged);
    eventBus.on("languageChanged", this.onLanguageChanged);
    eventBus.on("pageChanged", this.onPageChanged);
  }

  public override onUnmount() {
    eventBus.off("filterChanged", this.onFilterChanged);
    eventBus.off("languageChanged", this.onLanguageChanged);
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
