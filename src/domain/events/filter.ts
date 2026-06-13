export const FilterEvents = {
  Changed: 'filterChanged',
  Select: 'selectFilter',
  LoadMore: 'loadMoreFilters',
} as const;

export type FilterEvent = typeof FilterEvents[keyof typeof FilterEvents];
