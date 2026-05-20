import type { Product } from "@domain/models/product";
import { QueryKeys } from "@domain/queries/keys";
import { BaseQuery } from "./BaseQuery";

export interface GetProductDetailParams {
  id: number;
  lang: "en" | "tr" | "ar";
}

export class GetProductDetailQuery extends BaseQuery<GetProductDetailParams, Product | undefined> {
  readonly key = QueryKeys.GetProductDetail;
}
