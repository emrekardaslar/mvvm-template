import { BaseViewModel } from './BaseViewModel';
import api from '../services/api';
import eventBus from '../services/eventBus';

interface FilterData {
    filters: string[];
    selectedFilter: string | null;
}

export class FilterViewModel extends BaseViewModel<FilterData> {
    private currentLang: 'en' | 'tr' | 'ar' = 'en';

    constructor(initialData?: FilterData) {
        super(initialData || { filters: [], selectedFilter: 'All' });
        this.registerEvent('selectFilter', this.selectFilter);
    }

    public override onMount() {
        eventBus.on('languageChanged', this.onLanguageChanged);
        // Fetch initial filters if they weren't provided via SSR
        if (this.data.filters.length === 0) {
            this.fetchFilters(this.currentLang);
        }
    }

    public override onUnmount() {
        eventBus.off('languageChanged', this.onLanguageChanged);
    }

    private onLanguageChanged = (payload: { lang: 'en' | 'tr' | 'ar' }) => {
        this.currentLang = payload.lang;
        this.fetchFilters(payload.lang);
    };

    private async fetchFilters(lang: 'en' | 'tr' | 'ar') {
        const filters = await api.fetchFilters(lang);
        this.setData({ filters, selectedFilter: filters[0] });
        // Also notify the product list to update with the new default filter
        eventBus.dispatch('filterChanged', { filter: filters[0] });
    }

    private selectFilter = (payload: { filter: string }) => {
        this.setData({ selectedFilter: payload.filter });
        eventBus.dispatch('filterChanged', { filter: payload.filter });
    };
}
