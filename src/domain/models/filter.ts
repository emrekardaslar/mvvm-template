import type { FilterViewModel } from "@application/viewmodels/FilterViewModel";
import type { Lang } from "./language";


export interface FilterViewProps {
  data: FilterData;
  viewModel: FilterViewModel;
}

export interface FilterData {
  filters: string[];
  selectedFilter: string | null;
  currentLang: Lang;
  error: string | null;
}
