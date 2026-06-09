import type { CounterViewModel } from "@application/viewmodels/CounterViewModel";
import type { Lang } from "./language";


export interface CounterViewProps {
  data: CounterData;
  viewModel: CounterViewModel;
}

export interface CounterData {
  count: number;
  isLoading: boolean;
  currentLang?: Lang;
}
