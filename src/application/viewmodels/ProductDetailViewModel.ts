
import type { Product } from "@domain/models/product";
import { LanguageEvents } from "@domain/events/language";
import { GetProductDetailQuery, type GetProductDetailParams } from "@application/queries/GetProductDetailQuery";
import { runQuery } from "@infrastructure/runQuery";
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
      await this.fetchProduct({ id: productId });
    } else {
      this.setData({ isLoading: false });
    }
  }

  public override onUnmount() {
    eventBus.off(LanguageEvents.Changed, this.onLanguageChanged);
  }

  private onLanguageChanged = async (payload: { lang: "en" | "tr" | "ar" }) => {
    const productId = this.data.product?.id;
    if (productId) {
      await this.fetchProduct({ lang: payload.lang });
    } else {
      this.setData({ currentLang: payload.lang });
    }
  };

  public async fetchProduct(override: Partial<GetProductDetailParams> = {}) {
    const params: GetProductDetailParams = {
      id: this.data.product?.id as number,
      lang: this.data.currentLang,
      ...override,
    };
    this.setData({ isLoading: true, currentLang: params.lang });
    const product = await runQuery(new GetProductDetailQuery(params));
    this.setData({ product, isLoading: false });
  }
}
