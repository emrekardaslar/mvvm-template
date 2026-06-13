import type { HplProduct, ProductData } from "@domain/models/product";
import type { Lang } from "@domain/models/language";
import { QueryKeys } from "@domain/queries/keys";
import { getViewModel } from "@application/viewmodels/viewModelRegistry";
import type { BaseViewModel } from "@application/viewmodels/BaseViewModel";
import { BaseQuery } from "./BaseQuery";

export interface GetHplParams {
  lang: Lang;
  filter: string | null;
}

/** Builds its params (lang + current filter) from the active page ViewModel. */
export class GetHplQuery extends BaseQuery<GetHplParams, HplProduct[]> {
  readonly key = QueryKeys.GetHpl;

  constructor() {
    super(undefined as unknown as GetHplParams);
  }

  override getParams(): GetHplParams {
    const d = getViewModel<BaseViewModel<ProductData, any>>().getData();
    return { lang: d.currentLang, filter: d.currentFilter };
  }
}
