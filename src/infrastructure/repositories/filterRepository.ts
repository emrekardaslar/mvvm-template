import api from '../api/api';
import type { GetFiltersParams } from '@application/queries/GetFiltersQuery';

// Maps the GetFilters query params to the data source.
export const getFilters = (params: GetFiltersParams): Promise<string[]> =>
  api.fetchFilters(params.lang);
