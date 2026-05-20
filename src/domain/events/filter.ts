export const FilterEvents = {
  Changed: 'filterChanged',
  Select: 'selectFilter',
} as const;

export type FilterEvent = typeof FilterEvents[keyof typeof FilterEvents];
