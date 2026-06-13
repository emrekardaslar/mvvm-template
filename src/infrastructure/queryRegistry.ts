import { QueryKeys, type QueryKey } from "@domain/queries/keys";
import productListRepository from "./repositories/productListRepository";
import filterRepository from "./repositories/filterRepository";
import productDetailRepository from "./repositories/productDetailRepository";

export const queryHandlers: Record<QueryKey, (params: any) => Promise<any>> = {
  [QueryKeys.GetProducts]: (params) => productListRepository.run(QueryKeys.GetProducts, params),
  [QueryKeys.GetFilters]: (params) => filterRepository.run(QueryKeys.GetFilters, params),
  [QueryKeys.GetProductDetail]: (params) => productDetailRepository.run(QueryKeys.GetProductDetail, params),
};
