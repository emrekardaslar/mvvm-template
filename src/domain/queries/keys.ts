export const QueryKeys = {
  GetProducts: 'GetProducts',
  GetMoreFilters: 'GetMoreFilters',
  GetHpl: 'GetHpl',
  GetCategoryStats: 'GetCategoryStats',
  GetProductDetail: 'GetProductDetail',
} as const;

export type QueryKey = typeof QueryKeys[keyof typeof QueryKeys];
