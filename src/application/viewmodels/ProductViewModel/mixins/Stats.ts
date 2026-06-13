import { GetCategoryStatsQuery } from "@application/queries/GetCategoryStatsQuery";
import { runQuery } from "@infrastructure/runQuery";
import type { ProductViewModelInternals } from "@domain/viewmodels/ProductViewModelInternals";
import type { StatsMixin as StatsMixinContract } from "@domain/viewmodels/mixins";

// Category stats behavior. These are whole-catalog aggregates, so (unlike the
// product list / HPL) they do NOT depend on the filter — no bus listener.
// The slice getter (getStats) lives in the Components mixin.
export const StatsMixin: StatsMixinContract & ThisType<ProductViewModelInternals> = {
  fetchStats() {
    return runQuery(new GetCategoryStatsQuery()).then((categoryStats) => {
      if (categoryStats) this.setData({ categoryStats });
    });
  },
};
