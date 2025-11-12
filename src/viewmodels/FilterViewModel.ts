import { BaseViewModel } from "./BaseViewModel";
import api from "../services/api";
import eventBus from "../services/eventBus";
import type { FilterData } from "../models/filter";

export class FilterViewModel extends BaseViewModel<FilterData> {
  constructor(initialData?: Partial<FilterData>) {
    super({
      filters: initialData?.filters || [],
      selectedFilter: initialData?.selectedFilter || "All",
      currentLang: initialData?.currentLang || "en",
    });
    this.registerEvent("selectFilter", this.selectFilter);
  }

  public override async onMount() {
    eventBus.on("languageChanged", this.onLanguageChanged);
    // Fetch initial filters if they weren't provided via SSR
    if (this.data.filters.length === 0) {
      const filters = await api.fetchFilters(this.data.currentLang);
      this.setData({ filters, selectedFilter: filters[0] });
    }
  }

  public override onUnmount() {
    eventBus.off("languageChanged", this.onLanguageChanged);
  }

  private onLanguageChanged = async (payload: { lang: "en" | "tr" | "ar" }) => {
    const filters = await api.fetchFilters(payload.lang);
    this.setData({
      filters,
      selectedFilter: filters[0],
      currentLang: payload.lang,
    });
    // Now that the language has changed, dispatch an event with the new default filter
    eventBus.dispatch("filterChanged", { filter: filters[0] });
  };

  private selectFilter = async (payload: { filter: string }) => {
    const filters = await api.fetchFilters(this.data.currentLang); //TODO: burası böyle mi olmalı emin değilim.
    console.log(`selected ${payload.filter} filter, fetched filters`, filters);
    this.setData({ selectedFilter: payload.filter, filters: filters });
    eventBus.dispatch("filterChanged", { filter: payload.filter });
  };
}
