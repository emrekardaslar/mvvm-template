import type { CounterViewModel } from "../../application/viewmodels/CounterViewModel";


export interface CounterViewProps {
  data: CounterData;
  viewModel: CounterViewModel;
}

export interface CounterData {
  count: number;
  isLoading: boolean;
  currentLang?: "en" | "tr" | "ar";
}
