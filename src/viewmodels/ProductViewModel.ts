import { BaseViewModel } from "./BaseViewModel";
import api, { type Product } from "../services/api";
import eventBus from "../services/eventBus";

interface ProductData {
  products: Product[];
  isLoading: boolean;
}

export class ProductViewModel extends BaseViewModel<ProductData> {
  private currentLang: "en" | "tr" | "ar" = "en";
  private currentFilter: string | null = "All";

  constructor(initialData?: ProductData) {
    super(initialData || { products: [], isLoading: false });
  }

  public override onMount() {
    eventBus.on("filterChanged", this.onFilterChanged);
    eventBus.on("languageChanged", this.onLanguageChanged);
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
    this.currentLang = payload.lang;
    this.fetchProducts();
    // When language changes, we might need to refetch products with the current filter
    // The filter component will also refetch and send a new 'filterChanged' event,
    // so we can just rely on that to trigger the product fetch.
  };

  private async fetchProducts() {
    this.setData({ isLoading: true });
    const products = await api.fetchProducts(
      this.currentLang,
      this.currentFilter
    );
    this.setData({ products, isLoading: false });
  }
}
