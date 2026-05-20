import api from '../api/api';
import type { Product } from '@domain/models/product';
import { QueryKeys } from '@domain/queries/keys';
import type { GetProductDetailParams } from '@application/queries/GetProductDetailQuery';

const handlers = {
  [QueryKeys.GetProductDetail]: (params: GetProductDetailParams): Promise<Product | undefined> =>
    api.fetchProductDetail(params.id, params.lang),
};

type Key = keyof typeof handlers;
type ParamsOf<K extends Key> = Parameters<typeof handlers[K]>[0];
type ResultOf<K extends Key> = ReturnType<typeof handlers[K]>;

const productDetailRepository = {
  run<K extends Key>(key: K, params: ParamsOf<K>): ResultOf<K> {
    return handlers[key](params as any) as ResultOf<K>;
  },
};

export default productDetailRepository;
