import React, { useState, useEffect } from "react";
import eventBus from "../../services/eventBus";
import { viewMap } from "../../services/viewMap";

interface FilterViewProps {
  initialData: {
    filters: string[];
    selectedFilter: string | null;
  };
}

const FilterViewSwitcher: React.FC<FilterViewProps> = ({ initialData }) => {
  const [currentLang, setCurrentLang] = useState<"en" | "tr" | "ar">("en");
  const View = viewMap("FilterView", currentLang);

  useEffect(() => {
    const handleLanguageChange = (payload: { lang: "en" | "tr" | "ar" }) => {
      setCurrentLang(payload.lang);
    };

    eventBus.on("languageChanged", handleLanguageChange);
    return () => eventBus.off("languageChanged", handleLanguageChange);
  }, []);

  return <View initialData={initialData} />;
};

export default FilterViewSwitcher;
