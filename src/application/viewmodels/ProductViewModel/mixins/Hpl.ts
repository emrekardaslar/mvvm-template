import { FilterEvents } from "@domain/events/filter";
import { GetHplQuery } from "@application/queries/GetHplQuery";
import { runQuery } from "@infrastructure/runQuery";
import eventBus from "../../../events/eventBus";
import type { ProductViewModelInternals } from "@domain/viewmodels/ProductViewModelInternals";
import type { HplMixin as HplMixinContract } from "@domain/viewmodels/mixins";

// Horizontal product list behavior: a separate list that refetches when the
// filter changes. Its own loading flag (hplLoading) keeps it from dimming the
// main product list. The slice getter (getHpl) lives in the Components mixin.
export const HplMixin: HplMixinContract & ThisType<ProductViewModelInternals & HplMixinContract> = {
  initHpl() {
    this._onHplFilterChanged = () => this.fetchHpl();
    eventBus.on(FilterEvents.Changed, this._onHplFilterChanged);
  },

  disposeHpl() {
    if (this._onHplFilterChanged) eventBus.off(FilterEvents.Changed, this._onHplFilterChanged);
  },

  fetchHpl() {
    return runQuery(new GetHplQuery(), { loadingKey: "hplLoading" }).then((hplProducts) => {
      if (hplProducts) this.setData({ hplProducts });
    });
  },
};
