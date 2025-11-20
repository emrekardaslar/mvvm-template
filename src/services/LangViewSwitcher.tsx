import React, { useState } from "react";
import { viewMap } from "./viewMap";

import { useViewModel } from "../hooks/useViewModel";
import type { BaseViewModel } from "../application/viewmodels/BaseViewModel";

interface LangViewSwitcherProps<
  TData extends { currentLang?: "en" | "tr" | "ar" },
  TViewModel extends BaseViewModel<TData>
> {
  ViewModelClass: new (initialData?: TData) => TViewModel;
  initialData: TData;
  viewName: string;
}

function LangViewSwitcher<
  TData extends { currentLang?: "en" | "tr" | "ar" },
  TViewModel extends BaseViewModel<TData>
>({
  ViewModelClass,
  initialData,
  viewName,
}: LangViewSwitcherProps<TData, TViewModel>) {
  const [viewModel] = useState(() => new ViewModelClass(initialData));
  const data = useViewModel(viewModel);
  const lang = data.currentLang || "en";
  const View = viewMap(viewName, lang);

  return <View viewModel={viewModel} data={data} />;
}

export default LangViewSwitcher;
