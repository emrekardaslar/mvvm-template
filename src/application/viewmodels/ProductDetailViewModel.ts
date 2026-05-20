
import type { Product } from "@domain/models/product";
import { LanguageEvents } from "@domain/events/language";
import productDetailRepository from "@infrastructure/repositories/productDetailRepository";
import eventBus from "../events/eventBus";
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
    eventBus.on(LanguageEvents.Changed, this.onLanguageChanged);
    const productId = this?.data?.product?.id;
    if (productId) {
      await this.fetchProduct(productId, this.data.currentLang);
    } else {
      this.setData({ isLoading: false });
    }
  }

  public override onUnmount() {
    eventBus.off(LanguageEvents.Changed, this.onLanguageChanged);
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
    const product = await productDetailRepository.getProductDetail(id, lang);
    this.setData({ product, isLoading: false });
  }
}
