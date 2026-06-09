import type { Product } from "@domain/models/product";
import type { Lang } from "@domain/models/language";
import { QueryKeys } from "@domain/queries/keys";
import { BaseQuery } from "./BaseQuery";

export interface GetProductDetailParams {
  id: number;
  lang: Lang;
}

export class GetProductDetailQuery extends BaseQuery<GetProductDetailParams, Product | undefined> {
  readonly key = QueryKeys.GetProductDetail;
}
