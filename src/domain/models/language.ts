import type { LanguageViewModel } from "@application/viewmodels/LanguageViewModel";

export interface LanguageSelectorViewProps {
  data: LanguageData;
  viewModel: LanguageViewModel;
}
export interface LanguageData {
    availableLanguages: string[];
    currentLang: 'en' | 'tr' | 'ar';
}