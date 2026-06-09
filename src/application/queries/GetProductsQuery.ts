import type { Product } from "@domain/models/product";
import type { Lang } from "@domain/models/language";
import { QueryKeys } from "@domain/queries/keys";
import { BaseQuery } from "./BaseQuery";

export interface GetProductsParams {
  lang: Lang;
  filter: string | null;
  page: number;
}

export class GetProductsQuery extends BaseQuery<GetProductsParams, Product[]> {
  readonly key = QueryKeys.GetProducts;
}
