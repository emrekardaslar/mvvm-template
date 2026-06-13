import type { Product } from "@domain/models/product";
import type { Lang } from "@domain/models/language";
import type { ProductDetailData } from "@domain/models/productDetail";
import { QueryKeys } from "@domain/queries/keys";
import { getViewModel } from "@application/viewmodels/viewModelRegistry";
import type { BaseViewModel } from "@application/viewmodels/BaseViewModel";
import { BaseQuery } from "./BaseQuery";

export interface GetProductDetailParams {
  id: number;
  lang: Lang;
}

/**
 * Reads `lang` from the active page ViewModel; `id` is a per-call argument
 * (it comes from the route, not from VM data).
 */
export class GetProductDetailQuery extends BaseQuery<GetProductDetailParams, Product | undefined> {
  readonly key = QueryKeys.GetProductDetail;

  constructor(private readonly id: number) {
    super(undefined as unknown as GetProductDetailParams);
  }

  override getParams(): GetProductDetailParams {
    const d = getViewModel<BaseViewModel<ProductDetailData, any>>().getData();
    return { id: this.id, lang: d.currentLang };
  }
}
