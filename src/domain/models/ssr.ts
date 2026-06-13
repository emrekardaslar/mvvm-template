import type { Product, HplProduct } from "./product";

/**
 * Interface representing the localized data (products, filters, and the
 * horizontal product list) for a specific language code (e.g., 'en', 'tr', 'ar').
 */
interface LocalizedData {
    products: Product[];
    filters: string[];
    hpl: HplProduct[];
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
