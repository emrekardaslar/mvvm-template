import React from "react";

import "../LanguageSelector.css";
import type { LanguageSelectorViewProps } from "@domain/models/language";
import { LanguageEvents } from "@domain/events/language";

const LanguageSelectorView: React.FC<LanguageSelectorViewProps> = ({
  data,
  viewModel,
}) => {
  const onLanguageClick = (lang: "en" | "tr" | "ar") => {
    viewModel.runAttachedFunction(LanguageEvents.Change, { lang });
  };

  return (
    <div className="language-selector-container" dir="rtl">
      <h3>لغة</h3>
      <div className="language-selector-buttons">
        {data.availableLanguages.map((lang) => (
          <button
            key={lang}
            onClick={() => onLanguageClick(lang as "en" | "tr" | "ar")}
            className={`language-selector-button ${data.currentLang === lang ? "selected" : ""}`}>
            {lang.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSelectorView;
