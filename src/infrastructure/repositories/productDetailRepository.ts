import api from '../api/api';
import type { Product } from '@domain/models/product';
import type { GetProductDetailParams } from '@application/queries/GetProductDetailQuery';

// Maps the GetProductDetail query params to the data source.
export const getProductDetail = (params: GetProductDetailParams): Promise<Product | undefined> =>
  api.fetchProductDetail(params.id, params.lang);
