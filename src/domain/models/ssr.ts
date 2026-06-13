import type { Product, HplProduct, CategoryStat } from "./product";

/**
 * Interface representing the localized data (products, filters, the horizontal
 * product list, and category stats) for a language code (e.g., 'en', 'tr', 'ar').
 */
interface LocalizedData {
    products: Product[];
    filters: string[];
    hpl: HplProduct[];
    categoryStats: CategoryStat[];
}

/**
 * The main interface for the entire mockData object,
 * keyed by language code.
 */
export interface SSRResponse {
    en: LocalizedData;
    tr: LocalizedData;
    ar: LocalizedData;
}
