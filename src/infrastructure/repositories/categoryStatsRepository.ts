import api from '../api/api';
import type { CategoryStat } from '@domain/models/product';
import type { GetCategoryStatsParams } from '@application/queries/GetCategoryStatsQuery';

// Maps the GetCategoryStats query params to the data source.
export const getCategoryStats = (params: GetCategoryStatsParams): Promise<CategoryStat[]> =>
  api.fetchCategoryStats(params.lang);
