
import type { ProductDetailData } from "@domain/models/productDetail";
import { GetProductDetailQuery } from "@application/queries/GetProductDetailQuery";
import { runQuery } from "@infrastructure/runQuery";
import { BaseViewModel } from "./BaseViewModel";

export class ProductDetailViewModel extends BaseViewModel<ProductDetailData> {
  constructor(initialData?: Partial<ProductDetailData>) {
    super({
      product: initialData?.product || undefined,
      isLoading: initialData?.isLoading || false,
      currentLang: initialData?.currentLang || "en",
      error: null,
    });
  }

  // `id` comes from the route; the query reads `lang` from this VM.
  public fetchProduct(id: number) {
    const fetchId = this.beginFetch();
    return runQuery(new GetProductDetailQuery(id)).then((product) => {
      if (this.isCurrentFetch(fetchId)) this.setData({ product, error: null });
    });
  }
}
