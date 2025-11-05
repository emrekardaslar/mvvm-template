import React, { useState, useEffect, Suspense } from "react";
import eventBus from "../../services/eventBus";
import { viewMap } from "../../services/viewMap";

interface CounterViewProps {
  initialData: {
    count: number;
  };
}

const CounterViewSwitcher: React.FC<CounterViewProps> = ({ initialData }) => {
  const [currentLang, setCurrentLang] = useState<"en" | "tr" | "ar">("en");
  const View = viewMap("CounterView", currentLang);

  useEffect(() => {
    const handleLanguageChange = (payload: { lang: "en" | "tr" | "ar" }) => {
      setCurrentLang(payload.lang);
    };

    eventBus.on("languageChanged", handleLanguageChange);
    return () => eventBus.off("languageChanged", handleLanguageChange);
  }, []);

  return <View initialData={initialData} />;
};

export default CounterViewSwitcher;
