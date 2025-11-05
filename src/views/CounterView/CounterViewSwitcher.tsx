import React, { useState, Suspense } from "react";
import { viewMap } from "../../services/viewMap";
import { LanguageViewModel } from "../../viewmodels/LanguageViewModel";
import { useViewModel } from "../../hooks/useViewModel";

interface CounterViewProps {
  initialData: {
    count: number;
  };
}

const CounterViewSwitcher: React.FC<CounterViewProps> = ({ initialData }) => {
  const [languageViewModel] = useState(() => new LanguageViewModel());
  const languageData = useViewModel(languageViewModel);
  const View = viewMap("CounterView", languageData.currentLanguage);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <View initialData={initialData} />
    </Suspense>
  );
};

export default CounterViewSwitcher;
