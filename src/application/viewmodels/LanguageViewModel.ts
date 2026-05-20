import type { LanguageData } from '@domain/models/language';
import { LanguageEvents } from '@domain/events/language';
import eventBus from '../events/eventBus';
import { BaseViewModel } from './BaseViewModel';


export class LanguageViewModel extends BaseViewModel<LanguageData> {
    constructor(initialData?: Partial<LanguageData>) {
        super({
            availableLanguages: initialData?.availableLanguages || ['en', 'tr', 'ar'],
            currentLang: initialData?.currentLang || 'en',
        });
        this.registerEvent(LanguageEvents.Change, this.changeLanguage);
    }

    private changeLanguage = (payload: { lang: 'en' | 'tr' | 'ar' }) => {
        if (this.data.currentLang !== payload.lang) {
            this.setData({ currentLang: payload.lang });
            eventBus.dispatch(LanguageEvents.Changed, { lang: payload.lang });
        }
    };
}
