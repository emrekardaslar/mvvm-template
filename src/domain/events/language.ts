export const LanguageEvents = {
  Changed: 'languageChanged',
  Change: 'changeLanguage',
} as const;

export type LanguageEvent = typeof LanguageEvents[keyof typeof LanguageEvents];
