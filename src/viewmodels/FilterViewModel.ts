import { BaseViewModel } from './BaseViewModel';
import api from '../services/api';
import eventBus from '../services/eventBus';

interface FilterData {
    filters: string[];
    selectedFilter: string | null;
}

export class FilterViewModel extends BaseViewModel<FilterData> {
    constructor(initialData?: FilterData) {
        super(initialData || { filters: [], selectedFilter: 'All' });
        this.registerEvent('selectFilter', this.selectFilter);
    }

    public override async onMount() {
        if (this.data.filters.length === 0) {
            const filters = await api.fetchFilters();
            this.setData({ filters });
        }
    }

    private selectFilter = (payload: { filter: string }) => {
        this.setData({ selectedFilter: payload.filter });
        eventBus.dispatch('filterChanged', { filter: payload.filter });
    };
}
