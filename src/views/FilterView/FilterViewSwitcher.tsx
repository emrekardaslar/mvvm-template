import React, { useState, useEffect } from "react";
import { viewMap } from "../../services/viewMap";
import eventBus from "../../services/eventBus";
import { FilterViewModel } from "../../viewmodels/FilterViewModel";

interface FilterViewProps {
  initialData: {
    filters: string[];
    selectedFilter: string | null;
  };
}

const FilterViewSwitcher: React.FC<FilterViewProps> = ({ initialData }) => {  
  const [currentLanguage, setCurrentLanguage] = useState<"en" | "tr" | "ar">(
    "en"
  );
  const [viewModel] = useState(() => new FilterViewModel(initialData));

  useEffect(() => {
    const handleLanguageChange = (payload: { lang: "en" | "tr" | "ar" }) => {
      setCurrentLanguage(payload.lang);
    };
    eventBus.on("languageChanged", handleLanguageChange);
    return () => {
      eventBus.off("languageChanged", handleLanguageChange);
    };
  }, []);

  const View = viewMap("FilterView", currentLanguage);

  return <View viewModel={viewModel} />;
};

export default FilterViewSwitcher;
