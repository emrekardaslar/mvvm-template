import React, { useEffect, useState } from "react";
import { viewMap } from "../services/viewMap";
import { BaseViewModel } from "../viewmodels/BaseViewModel";
import eventBus from "../services/eventBus";

interface LangViewSwitcherProps<TData, TViewModel extends BaseViewModel<TData>> {
  ViewModelClass: new (initialData?: TData) => TViewModel;
  initialData: TData;
  viewName: string;
}

function LangViewSwitcher<TData, TViewModel extends BaseViewModel<TData>>({
  ViewModelClass,
  initialData,
  viewName,
}: LangViewSwitcherProps<TData, TViewModel>) {
  const [currentLanguage, setCurrentLanguage] = useState<"en" | "tr" | "ar">(
    "en"
  );
  const [viewModel] = useState(() => new ViewModelClass(initialData));
  useEffect(() => {

    const handleLanguageChange = (payload: { lang: "en" | "tr" | "ar" }) => {
      setCurrentLanguage(payload.lang);
    };
    eventBus.on("languageChanged", handleLanguageChange);
    return () => {
      eventBus.off("languageChanged", handleLanguageChange);
    };
  }, [])

  const View = viewMap(viewName, currentLanguage);

  return <View viewModel={viewModel} />
}

export default LangViewSwitcher;
