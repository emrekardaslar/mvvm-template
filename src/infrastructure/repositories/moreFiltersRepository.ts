import api from '../api/api';
import type { GetMoreFiltersParams } from '@application/queries/GetMoreFiltersQuery';

// Maps the GetMoreFilters query params to the data source.
export const getMoreFilters = (params: GetMoreFiltersParams): Promise<string[]> =>
  api.fetchMoreFilters(params.lang);
