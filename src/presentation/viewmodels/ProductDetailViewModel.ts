
import type { Product } from "../../domain/models/product";
import api from "../../services/api";
import eventBus from "../../services/eventBus";
import { BaseViewModel } from "./BaseViewModel";

export interface ProductDetailData {
  product: Product | undefined;
  isLoading: boolean;
  currentLang: "en" | "tr" | "ar";
}

export class ProductDetailViewModel extends BaseViewModel<ProductDetailData> {
  private productId: number;

  constructor(initialData?: Partial<ProductDetailData>, productId?: number) {
    super({
      product: undefined,
      isLoading: true,
      currentLang: initialData?.currentLang || "en",
    });
    this.productId = productId || 0; // Default or provided product ID
  }

  public override async onMount() {
    eventBus.on("languageChanged", this.onLanguageChanged);
    if (this.productId) {
      await this.fetchProduct(this.productId, this.data.currentLang);
    } else {
      this.setData({ isLoading: false });
    }
  }

  public override onUnmount() {
    eventBus.off("languageChanged", this.onLanguageChanged);
  }

  private onLanguageChanged = async (payload: { lang: "en" | "tr" | "ar" }) => {
    this.setData({ currentLang: payload.lang });
    if (this.productId) {
      await this.fetchProduct(this.productId, payload.lang);
    }
  };

  public async fetchProduct(id: number, lang: "en" | "tr" | "ar") {
    this.setData({ isLoading: true });
    const product = await api.fetchProductDetail(id, lang);
    this.setData({ product, isLoading: false });
  }
}
