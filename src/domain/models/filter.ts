import type { FilterViewModel } from "@application/viewmodels/FilterViewModel";


export interface FilterViewProps {
  data: FilterData;
  viewModel: FilterViewModel;
}

export interface FilterData {
  filters: string[];
  selectedFilter: string | null;
  currentLang: "en" | "tr" | "ar";
}
