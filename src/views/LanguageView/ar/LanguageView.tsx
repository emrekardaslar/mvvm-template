import React from "react";
import type { LanguageViewProps } from "../../../model/language";

const LanguageView: React.FC<LanguageViewProps> = ({ data, viewModel }) => {
  const onLanguageClick = (lang: "en" | "tr" | "ar") => {
    viewModel.runAttachedFunction("changeLanguage", { lang });
  };

  return (
    <div>
      <h3>لغة</h3>
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

export default LanguageView;
