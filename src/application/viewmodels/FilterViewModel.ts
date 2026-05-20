import type { FilterData } from "@domain/models/filter";
import { FilterEvents } from "@domain/events/filter";
import { LanguageEvents } from "@domain/events/language";
import filterRepository from "@infrastructure/repositories/filterRepository";
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
    // Fetch initial filters if they weren't provided via SSR
    if (this.data.filters.length === 0) {
      const filters = await filterRepository.getFilters(this.data.currentLang);
      this.setData({ filters, selectedFilter: filters[0] });
    }
  }

  public override onUnmount() {
    eventBus.off(LanguageEvents.Changed, this.onLanguageChanged);
  }

  private onLanguageChanged = async (payload: { lang: "en" | "tr" | "ar" }) => {
    const filters = await filterRepository.getFilters(payload.lang);
    this.setData({
      filters,
      selectedFilter: filters[0],
      currentLang: payload.lang,
    });
    // Now that the language has changed, dispatch an event with the new default filter
    eventBus.dispatch(FilterEvents.Changed, { filter: filters[0] });
  };

  private selectFilter = async (payload: { filter: string }) => {
    const filters = await filterRepository.getFilters(this.data.currentLang); //TODO: burası böyle mi olmalı emin değilim.
    console.log(`selected ${payload.filter} filter, fetched filters`, filters);
    this.setData({ selectedFilter: payload.filter, filters: filters });
    eventBus.dispatch(FilterEvents.Changed, { filter: payload.filter });
  };
}
