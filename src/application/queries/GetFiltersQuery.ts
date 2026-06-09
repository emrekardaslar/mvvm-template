import type { Lang } from "@domain/models/language";
import { QueryKeys } from "@domain/queries/keys";
import { BaseQuery } from "./BaseQuery";

export interface GetFiltersParams {
  lang: Lang;
}

export class GetFiltersQuery extends BaseQuery<GetFiltersParams, string[]> {
  readonly key = QueryKeys.GetFilters;
}
