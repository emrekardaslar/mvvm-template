import type { FilterEvents } from "./filter";
import type { PagerEvents } from "./pager";

/** Events the product-page views may dispatch, with their payloads. */
export type ProductViewModelEvents = {
  [FilterEvents.Select]: { filter: string };
  [FilterEvents.LoadMore]: void;
  [PagerEvents.Change]: { page: number };
};
