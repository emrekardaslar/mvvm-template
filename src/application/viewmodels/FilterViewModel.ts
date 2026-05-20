import type { FilterData } from "@domain/models/filter";
import { FilterEvents } from "@domain/events/filter";
import { LanguageEvents } from "@domain/events/language";
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
    });
    this.registerEvent(FilterEvents.Select, this.selectFilter);
  }

  public override async onMount() {
    eventBus.on(LanguageEvents.Changed, this.onLanguageChanged);
    if (this.data.filters.length === 0) {
      const filters = await this.fetchFilters();
      this.setData({ selectedFilter: filters[0] });
    }
  }

  public override onUnmount() {
    eventBus.off(LanguageEvents.Changed, this.onLanguageChanged);
  }

  private onLanguageChanged = async (payload: { lang: "en" | "tr" | "ar" }) => {
    const filters = await this.fetchFilters({ lang: payload.lang });
    this.setData({ selectedFilter: filters[0] });
    eventBus.dispatch(FilterEvents.Changed, { filter: filters[0] });
  };

  private selectFilter = async (payload: { filter: string }) => {
    const filters = await this.fetchFilters();
    console.log(`selected ${payload.filter} filter, fetched filters`, filters);
    this.setData({ selectedFilter: payload.filter });
    eventBus.dispatch(FilterEvents.Changed, { filter: payload.filter });
  };

  private async fetchFilters(override: Partial<GetFiltersParams> = {}): Promise<string[]> {
    const params: GetFiltersParams = {
      lang: this.data.currentLang,
      ...override,
    };
    const filters = await runQuery(new GetFiltersQuery(params));
    this.setData({ filters, currentLang: params.lang });
    return filters;
  }
}
