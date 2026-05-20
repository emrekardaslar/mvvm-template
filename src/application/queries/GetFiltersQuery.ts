import { QueryKeys } from "@domain/queries/keys";
import { BaseQuery } from "./BaseQuery";

export interface GetFiltersParams {
  lang: "en" | "tr" | "ar";
}

export class GetFiltersQuery extends BaseQuery<GetFiltersParams, string[]> {
  readonly key = QueryKeys.GetFilters;
}
