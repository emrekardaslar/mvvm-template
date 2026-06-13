import api from '../api/api';
import type { HplProduct } from '@domain/models/product';
import type { GetHplParams } from '@application/queries/GetHplQuery';

// Maps the GetHpl query params to the data source.
export const getHpl = (params: GetHplParams): Promise<HplProduct[]> =>
  api.fetchHpl(params.lang, params.filter);
