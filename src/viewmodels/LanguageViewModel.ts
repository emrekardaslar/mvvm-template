import { BaseViewModel } from './BaseViewModel';
import eventBus from '../services/eventBus';
import type { LanguageData } from '../models/language';

export class LanguageViewModel extends BaseViewModel<LanguageData> {
    constructor(initialData?: Partial<LanguageData>) {
        super({
            availableLanguages: initialData?.availableLanguages || ['en', 'tr', 'ar'],
            currentLang: initialData?.currentLang || 'en',
        });
        this.registerEvent('changeLanguage', this.changeLanguage);
    }

    private changeLanguage = (payload: { lang: 'en' | 'tr' | 'ar' }) => {
        if (this.data.currentLang !== payload.lang) {
            this.setData({ currentLang: payload.lang });
            eventBus.dispatch('languageChanged', { lang: payload.lang });
        }
    };
}
