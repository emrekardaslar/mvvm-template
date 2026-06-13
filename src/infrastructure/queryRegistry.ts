import { QueryKeys, type QueryKey } from "@domain/queries/keys";
import { getProducts } from "./repositories/productListRepository";
import { getFilters } from "./repositories/filterRepository";
import { getMoreFilters } from "./repositories/moreFiltersRepository";
import { getHpl } from "./repositories/hplRepository";
import { getProductDetail } from "./repositories/productDetailRepository";

// Single dispatch table: each query key maps to the repository function that
// fulfills it. Adding a query means adding one entry here.
export const queryHandlers: Record<QueryKey, (params: any) => Promise<any>> = {
  [QueryKeys.GetProducts]: getProducts,
  [QueryKeys.GetFilters]: getFilters,
  [QueryKeys.GetMoreFilters]: getMoreFilters,
  [QueryKeys.GetHpl]: getHpl,
  [QueryKeys.GetProductDetail]: getProductDetail,
};
