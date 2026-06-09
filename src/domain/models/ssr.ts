import type { Product } from "./product";

/**
 * Interface representing the localized data (products and filters)
 * for a specific language code (e.g., 'en', 'tr', 'ar').
 */
interface LocalizedData {
    products: Product[];
    filters: string[];
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
