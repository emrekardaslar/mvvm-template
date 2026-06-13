import type { CategoryStat, ProductData } from "@domain/models/product";
import type { Lang } from "@domain/models/language";
import { QueryKeys } from "@domain/queries/keys";
import { getViewModel } from "@application/viewmodels/viewModelRegistry";
import type { BaseViewModel } from "@application/viewmodels/BaseViewModel";
import { BaseQuery } from "./BaseQuery";

export interface GetCategoryStatsParams {
  lang: Lang;
}

/** Reads `lang` from the active page ViewModel. */
export class GetCategoryStatsQuery extends BaseQuery<GetCategoryStatsParams, CategoryStat[]> {
  readonly key = QueryKeys.GetCategoryStats;

  constructor() {
    super(undefined as unknown as GetCategoryStatsParams);
  }

  override getParams(): GetCategoryStatsParams {
    const d = getViewModel<BaseViewModel<ProductData, any>>().getData();
    return { lang: d.currentLang };
  }
}
