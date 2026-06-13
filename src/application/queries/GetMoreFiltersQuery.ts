import type { Lang } from "@domain/models/language";
import type { ProductData } from "@domain/models/product";
import { QueryKeys } from "@domain/queries/keys";
import { getViewModel } from "@application/viewmodels/viewModelRegistry";
import type { BaseViewModel } from "@application/viewmodels/BaseViewModel";
import { BaseQuery } from "./BaseQuery";

export interface GetMoreFiltersParams {
  lang: Lang;
}

export class GetMoreFiltersQuery extends BaseQuery<GetMoreFiltersParams, string[]> {
  readonly key = QueryKeys.GetMoreFilters;

  constructor() {
    super(undefined as unknown as GetMoreFiltersParams);
  }

  override getParams(): GetMoreFiltersParams {
    const d = getViewModel<BaseViewModel<ProductData, any>>().getData();
    return { lang: d.currentLang };
  }
}
