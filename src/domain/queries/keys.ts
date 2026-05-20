export const QueryKeys = {
  GetProducts: 'GetProducts',
  GetFilters: 'GetFilters',
  GetProductDetail: 'GetProductDetail',
} as const;

export type QueryKey = typeof QueryKeys[keyof typeof QueryKeys];
