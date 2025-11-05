import React, { useState, useEffect } from "react";
import { viewMap } from "../../services/viewMap";
import { CounterViewModel } from "../../viewmodels/CounterViewModel";
import eventBus from "../../services/eventBus";

interface CounterViewProps {
  initialData: {
    count: number;
  };
}

const CounterViewSwitcher: React.FC<CounterViewProps> = ({ initialData }) => {
  const [currentLanguage, setCurrentLanguage] = useState<"en" | "tr" | "ar">(
    "en"
  );
  const [viewModel] = useState(() => new CounterViewModel(initialData));

  useEffect(() => {
    const handleLanguageChange = (payload: { lang: "en" | "tr" | "ar" }) => {
      setCurrentLanguage(payload.lang);
    };
    eventBus.on("languageChanged", handleLanguageChange);
    return () => {
      eventBus.off("languageChanged", handleLanguageChange);
    };
  }, []);

  const View = viewMap("CounterView", currentLanguage);

  return <View viewModel={viewModel} />;
};

export default CounterViewSwitcher;
