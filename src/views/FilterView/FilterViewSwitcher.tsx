import React, { useState, Suspense } from "react";
import { viewMap } from "../../services/viewMap";
import { LanguageViewModel } from "../../viewmodels/LanguageViewModel";
import { useViewModel } from "../../hooks/useViewModel";

interface FilterViewProps {
  initialData: {
    filters: string[];
    selectedFilter: string | null;
  };
}

const FilterViewSwitcher: React.FC<FilterViewProps> = ({ initialData }) => {
  const [languageViewModel] = useState(() => new LanguageViewModel());
  const languageData = useViewModel(languageViewModel);
  const View = viewMap("FilterView", languageData.currentLanguage);

  return <View initialData={initialData} />;
};

export default FilterViewSwitcher;
