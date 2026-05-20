export const PagerEvents = {
  Changed: 'pageChanged',
  Change: 'changePage',
} as const;

export type PagerEvent = typeof PagerEvents[keyof typeof PagerEvents];
