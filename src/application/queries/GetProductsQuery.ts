import type { Product, ProductData } from "@domain/models/product";
import type { Lang } from "@domain/models/language";
import { QueryKeys } from "@domain/queries/keys";
import { getViewModel } from "@application/viewmodels/viewModelRegistry";
import type { BaseViewModel } from "@application/viewmodels/BaseViewModel";
import { BaseQuery } from "./BaseQuery";

export interface GetProductsParams {
  lang: Lang;
  filter: string | null;
  page: number;
}

/** Per-call overrides (e.g. reset to page 1 on a filter change). */
export type GetProductsOverride = Partial<Pick<GetProductsParams, "filter" | "page">>;

/**
 * Builds its params from the active page ViewModel's current data, so callers
 * don't hand-assemble { lang, filter, page }. Pass overrides for the fields a
 * specific action changes.
 */
export class GetProductsQuery extends BaseQuery<GetProductsParams, Product[]> {
  readonly key = QueryKeys.GetProducts;

  constructor(private readonly override: GetProductsOverride = {}) {
    super(undefined as unknown as GetProductsParams);
  }

  override getParams(): GetProductsParams {
    const d = getViewModel<BaseViewModel<ProductData, any>>().getData();
    return {
      lang: d.currentLang,
      filter: this.override.filter ?? d.currentFilter,
      page: this.override.page ?? d.currentPage,
    };
  }
}
