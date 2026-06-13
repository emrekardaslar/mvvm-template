import api from '../api/api';
import type { Product } from '@domain/models/product';
import type { GetProductsParams } from '@application/queries/GetProductsQuery';

// Maps the GetProducts query params to the data source.
export const getProducts = (params: GetProductsParams): Promise<Product[]> =>
  api.fetchProducts(params.lang, params.filter, params.page);
