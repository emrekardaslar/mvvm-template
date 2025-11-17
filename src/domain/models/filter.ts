import type { FilterViewModel } from "../../presentation/viewmodels/FilterViewModel";


export interface FilterViewProps {
  data: FilterData;
  viewModel: FilterViewModel;
}

export interface FilterData {
  filters: string[];
  selectedFilter: string | null;
  currentLang: "en" | "tr" | "ar";
}
