import type { BaseQuery } from "@application/queries/BaseQuery";
import { QueryKeys, type QueryKey } from "@domain/queries/keys";
import productListRepository from "./repositories/productListRepository";
import filterRepository from "./repositories/filterRepository";
import productDetailRepository from "./repositories/productDetailRepository";

const handlers: Record<QueryKey, (params: any) => Promise<any>> = {
  [QueryKeys.GetProducts]: (params) => productListRepository.run(QueryKeys.GetProducts, params),
  [QueryKeys.GetFilters]: (params) => filterRepository.run(QueryKeys.GetFilters, params),
  [QueryKeys.GetProductDetail]: (params) => productDetailRepository.run(QueryKeys.GetProductDetail, params),
};

export function runQuery<Q extends BaseQuery<any, any>>(query: Q): Promise<Q["__result"]> {
  const handler = handlers[query.key as QueryKey];
  if (!handler) {
    throw new Error(`runQuery: no handler for "${query.key}"`);
  }
  return handler(query.getParams());
}
