import { BaseViewModel } from './BaseViewModel';
import api, { type Product } from '../services/api';
import eventBus from '../services/eventBus';

interface ProductData {
    products: Product[];
    isLoading: boolean;
}

export class ProductViewModel extends BaseViewModel<ProductData> {
    constructor(initialData?: ProductData) {
        super(initialData || { products: [], isLoading: false });
    }

    public override onMount() {
        eventBus.on('filterChanged', this.onFilterChanged);
    }

    public override onUnmount() {
        eventBus.off('filterChanged', this.onFilterChanged);
    }

    private onFilterChanged = async (payload: { filter: string }) => {
        this.setData({ isLoading: true });
        const products = await api.fetchProducts(payload.filter);
        this.setData({ products, isLoading: false });
    };
}
