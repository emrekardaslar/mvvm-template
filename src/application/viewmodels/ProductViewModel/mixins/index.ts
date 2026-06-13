import { PagerMixin } from "./Pager";
import { FiltersMixin } from "./Filters";
import { ComponentsMixin } from "./Components";
import type {
  PagerMixin as PagerMixinContract,
  FiltersMixin as FiltersMixinContract,
  ComponentsMixin as ComponentsMixinContract,
} from "@domain/viewmodels/mixins";

/**
 * Single registration point for the product-page mixins.
 *
 * To add a mixin: create its file, then add it here in BOTH places — the
 * runtime array (merged onto the prototype) and the type intersection (so its
 * methods are typed on the ViewModel). TypeScript can't derive the type from
 * the array, so both lines are required.
 */
export const productMixins = [PagerMixin, FiltersMixin, ComponentsMixin];

export type ProductMixins = PagerMixinContract &
  FiltersMixinContract &
  ComponentsMixinContract;
