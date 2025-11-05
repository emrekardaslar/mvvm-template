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

    public override async onMount() {
        eventBus.on('languageChanged', this.onLanguageChanged);
        // Fetch initial filters if they weren't provided via SSR
        if (this.data.filters.length === 0) {
            const filters = await api.fetchFilters(this.currentLang);
            this.setData({ filters, selectedFilter: filters[0] });
        }
    }

    public override onUnmount() {
        eventBus.off('languageChanged', this.onLanguageChanged);
    }

    private onLanguageChanged = async (payload: { lang: 'en' | 'tr' | 'ar' }) => {
        this.currentLang = payload.lang;
        const filters = await api.fetchFilters(payload.lang);
        this.setData({ filters, selectedFilter: filters[0] });
        // Now that the language has changed, dispatch an event with the new default filter
        eventBus.dispatch('filterChanged', { filter: filters[0] });
    };

    private selectFilter = (payload: { filter: string }) => {
        this.setData({ selectedFilter: payload.filter });
        eventBus.dispatch('filterChanged', { filter: payload.filter });
    };
}
