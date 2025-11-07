import React from "react";
import type { LanguageSelectorViewProps } from "../../../models/language";
import "../LanguageSelector.css";

const LanguageSelectorView: React.FC<LanguageSelectorViewProps> = ({
  data,
  viewModel,
}) => {
  const onLanguageClick = (lang: "en" | "tr" | "ar") => {
    viewModel.runAttachedFunction("changeLanguage", { lang });
  };

  return (
    <div className="language-selector-container">
      <h3>Dil</h3>
      <div className="language-selector-buttons">
        {data.availableLanguages.map((lang) => (
          <button
            key={lang}
            onClick={() => onLanguageClick(lang as "en" | "tr" | "ar")}
            className={`language-selector-button ${data.currentLanguage === lang ? "selected" : ""}`}>
            {lang.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSelectorView;
