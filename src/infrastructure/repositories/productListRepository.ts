import api from '../api/api';
import type { Product } from '@domain/models/product';
import { QueryKeys } from '@domain/queries/keys';
import type { GetProductsParams } from '@application/queries/GetProductsQuery';

const handlers = {
  [QueryKeys.GetProducts]: (params: GetProductsParams): Promise<Product[]> =>
    api.fetchProducts(params.lang, params.filter, params.page),
};

type Key = keyof typeof handlers;
type ParamsOf<K extends Key> = Parameters<typeof handlers[K]>[0];
type ResultOf<K extends Key> = ReturnType<typeof handlers[K]>;

const productListRepository = {
  run<K extends Key>(key: K, params: ParamsOf<K>): ResultOf<K> {
    return handlers[key](params as any) as ResultOf<K>;
  },
};

export default productListRepository;
