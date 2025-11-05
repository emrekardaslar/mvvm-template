import { BaseViewModel } from './BaseViewModel';
import eventBus from '../services/eventBus';

interface LanguageData {
    availableLanguages: string[];
    currentLanguage: 'en' | 'tr' | 'ar';
}

export class LanguageViewModel extends BaseViewModel<LanguageData> {
    constructor() {
        super({ 
            availableLanguages: ['en', 'tr', 'ar'],
            currentLanguage: 'en',
        });
        this.registerEvent('changeLanguage', this.changeLanguage);
    }

    private changeLanguage = (payload: { lang: 'en' | 'tr' | 'ar' }) => {
        if (this.data.currentLanguage !== payload.lang) {
            this.setData({ currentLanguage: payload.lang });
            eventBus.dispatch('languageChanged', { lang: payload.lang });
        }
    };
}
