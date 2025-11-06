import React from "react";
import type { LanguageSelectorViewProps } from "../../../model/language";

const LanguageSelectorView: React.FC<LanguageSelectorViewProps> = ({
  data,
  viewModel,
}) => {
  const onLanguageClick = (lang: "en" | "tr" | "ar") => {
    viewModel.runAttachedFunction("changeLanguage", { lang });
  };

  return (
    <div>
      <h3>Dil</h3>
      {data.availableLanguages.map((lang) => (
        <button
          key={lang}
          onClick={() => onLanguageClick(lang as "en" | "tr" | "ar")}
          style={{
            fontWeight: data.currentLanguage === lang ? "bold" : "normal",
          }}
        >
          {lang.toUpperCase()}
        </button>
      ))}
    </div>
  );
};

export default LanguageSelectorView;
