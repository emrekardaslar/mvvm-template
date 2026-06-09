
import type { Product } from "@domain/models/product";
import type { Lang } from "@domain/models/language";
import { GetProductDetailQuery, type GetProductDetailParams } from "@application/queries/GetProductDetailQuery";
import { runQuery } from "@infrastructure/runQuery";
import { BaseViewModel } from "./BaseViewModel";

export interface ProductDetailData {
  product: Product | undefined;
  isLoading: boolean;
  currentLang: Lang;
  error: string | null;
}

export class ProductDetailViewModel extends BaseViewModel<ProductDetailData> {
  constructor(initialData?: Partial<ProductDetailData>) {
    super({
      product: initialData?.product || undefined,
      isLoading: initialData?.isLoading || false,
      currentLang: initialData?.currentLang || "en",
      error: null,
    });
  }

  public async fetchProduct(override: Partial<GetProductDetailParams> = {}) {
    const params: GetProductDetailParams = {
      id: this.data.product?.id as number,
      lang: this.data.currentLang,
      ...override,
    };
    const fetchId = this.beginFetch();
    this.setData({ isLoading: true, error: null, currentLang: params.lang });
    try {
      const product = await runQuery(new GetProductDetailQuery(params));
      if (!this.isCurrentFetch(fetchId)) return;
      this.setData({ product, isLoading: false });
    } catch (e) {
      if (!this.isCurrentFetch(fetchId)) return;
      this.setData({ error: e instanceof Error ? e.message : String(e), isLoading: false });
    }
  }
}
