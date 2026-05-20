import React from "react";
import { LanguageViewModel } from "@application/viewmodels/LanguageViewModel";
import type { LanguageData } from "@domain/models/language";
import LangViewSwitcher from "@presentation/components/LangViewSwitcher";


interface LanguageSelectorViewSwitcherProps {
  initialData?: LanguageData;
}

const LanguageSelectorViewSwitcher: React.FC<LanguageSelectorViewSwitcherProps> = ({
  initialData,
}) => {
  // Ensure initialData is always a LanguageData object, even if not provided by props.
  // This satisfies LangViewSwitcher's requirement for a non-optional initialData prop.
  const resolvedInitialData: LanguageData = initialData || {
    availableLanguages: ['en', 'tr', 'ar'], // Default values matching LanguageViewModel's constructor
    currentLang: 'en',
  };

  return (
    <LangViewSwitcher
      viewName="LanguageSelectorView"
      ViewModelClass={LanguageViewModel}
      initialData={resolvedInitialData}
    />
  );
};

export default LanguageSelectorViewSwitcher;
