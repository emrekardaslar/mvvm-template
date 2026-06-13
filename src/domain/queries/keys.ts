export const QueryKeys = {
  GetProducts: 'GetProducts',
  GetFilters: 'GetFilters',
  GetMoreFilters: 'GetMoreFilters',
  GetHpl: 'GetHpl',
  GetCategoryStats: 'GetCategoryStats',
  GetProductDetail: 'GetProductDetail',
} as const;

export type QueryKey = typeof QueryKeys[keyof typeof QueryKeys];
