import type { Product } from "./product";

/**
 * Interface representing the structure for banner configuration.
 * This matches the 'banner' property in your mockData.
 */
interface BannerConfig {
    title: string;
    subtitle: string;
    backgroundColor: string;
    textColor: string;
}

/**
 * Interface representing the localized data (products and filters)
 * for a specific language code (e.g., 'en', 'tr', 'ar').
 */
interface LocalizedData {
    products: Product[];
    filters: string[];
}

/**
 * The main interface for the entire mockData object.
 * It uses a Record utility type for the language codes and includes the BannerConfig.
 */
export interface SSRResponse {
    en: LocalizedData;
    tr: LocalizedData;
    ar: LocalizedData;
    banner: BannerConfig;
}