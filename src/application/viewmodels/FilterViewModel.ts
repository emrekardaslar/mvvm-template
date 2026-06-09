import type { FilterData } from "@domain/models/filter";
import { FilterEvents } from "@domain/events/filter";
import { GetFiltersQuery, type GetFiltersParams } from "@application/queries/GetFiltersQuery";
import { runQuery } from "@infrastructure/runQuery";
import eventBus from "../events/eventBus";
import { BaseViewModel } from "./BaseViewModel";


export class FilterViewModel extends BaseViewModel<FilterData> {
  constructor(initialData?: Partial<FilterData>) {
    super({
      filters: initialData?.filters || [],
      selectedFilter: initialData?.selectedFilter || "All",
      currentLang: initialData?.currentLang || "en",
      error: null,
    });
    this.registerEvent(FilterEvents.Select, this.selectFilter);
  }

  public override async onMount() {
    if (this.data.filters.length === 0) {
      const filters = await this.fetchFilters();
      if (!filters) return;
      this.setData({ selectedFilter: filters[0] });
    }
  }

  private selectFilter = async (payload: { filter: string }) => {
    const filters = await this.fetchFilters();
    if (!filters) return;
    this.setData({ selectedFilter: payload.filter });
    eventBus.dispatch(FilterEvents.Changed, { filter: payload.filter });
  };

  private async fetchFilters(override: Partial<GetFiltersParams> = {}): Promise<string[] | null> {
    const params: GetFiltersParams = {
      lang: this.data.currentLang,
      ...override,
    };
    const fetchId = this.beginFetch();
    this.setData({ error: null });
    try {
      const filters = await runQuery(new GetFiltersQuery(params));
      if (!this.isCurrentFetch(fetchId)) return null;
      this.setData({ filters, currentLang: params.lang });
      return filters;
    } catch (e) {
      if (!this.isCurrentFetch(fetchId)) return null;
      this.setData({ error: e instanceof Error ? e.message : String(e) });
      return null;
    }
  }
}
