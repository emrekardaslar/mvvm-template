import React, { useState } from "react";
import { viewMap } from "../../services/viewMap";
import { LanguageViewModel } from "../../viewmodels/LanguageViewModel";
import { CounterViewModel } from "../../viewmodels/CounterViewModel";
import { useViewModel } from "../../hooks/useViewModel";

interface CounterViewProps {
  initialData: {
    count: number;
  };
}

const CounterViewSwitcher: React.FC<CounterViewProps> = ({ initialData }) => {
  const [languageViewModel] = useState(() => new LanguageViewModel());
  const [viewModel] = useState(() => new CounterViewModel(initialData));
  const languageData = useViewModel(languageViewModel);
  const View = viewMap("CounterView", languageData.currentLanguage);

  return <View viewModel={viewModel} />;
};

export default CounterViewSwitcher;
