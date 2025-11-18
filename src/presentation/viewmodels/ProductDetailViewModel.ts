
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
  constructor(initialData?: Partial<ProductDetailData>) {
    super({
      product: initialData?.product || undefined,
      isLoading: initialData?.isLoading || false,
      currentLang: initialData?.currentLang || "en",
    });
  }

  public override async onMount() {
    eventBus.on("languageChanged", this.onLanguageChanged);
    const productId = this?.data?.product?.id;
    if (productId) {
      await this.fetchProduct(productId, this.data.currentLang);
    } else {
      this.setData({ isLoading: false });
    }
  }

  public override onUnmount() {
    eventBus.off("languageChanged", this.onLanguageChanged);
  }

  private onLanguageChanged = async (payload: { lang: "en" | "tr" | "ar" }) => {
    this.setData({ currentLang: payload.lang });
    const productId = this.data.product?.id;
    if (productId) {
      await this.fetchProduct(productId, payload.lang);
    }
  };

  public async fetchProduct(id: number, lang: "en" | "tr" | "ar") {
    this.setData({ isLoading: true });
    const product = await api.fetchProductDetail(id, lang);
    this.setData({ product, isLoading: false });
  }
}
