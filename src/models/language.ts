import type { LanguageViewModel } from "../viewmodels/LanguageViewModel";

export interface LanguageSelectorViewProps {
  data: LanguageData;
  viewModel: LanguageViewModel;
}
export interface LanguageData {
    availableLanguages: string[];
    currentLang: 'en' | 'tr' | 'ar';
}