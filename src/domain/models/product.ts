import type { ProductViewModel } from "@application/viewmodels/ProductViewModel";
import type { Lang } from "./language";


export interface ProductViewProps {
  data: ProductData;
  viewModel: ProductViewModel;
}

export interface ProductData {
  products: Product[];
  hplProducts: HplProduct[];
  hplLoading: boolean;
  categoryStats: CategoryStat[];
  filters: string[];
  moreFiltersLoading: boolean;
  moreFiltersLoaded: boolean;
  isLoading: boolean;
  currentLang: Lang;
  currentFilter: string | null;
  currentPage: number;
  totalPages: number;
  error: string | null;
}

export interface Product {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
}

/**
 * A product for the horizontal product list (HPL): like a Product but with
 * promo-oriented extras (a discount, a star rating, and an optional badge).
 */
export interface HplProduct {
  id: number;
  name: string;
  category: string;
  price: number;
  discountPercent: number;
  rating: number;
  badge?: string;
}

/** View-facing slices: each is what one view component reads from the VM. */
export interface ProductListSlice {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  currentLang: Lang;
}

export interface FiltersSlice {
  filters: string[];
  currentFilter: string | null;
  moreFiltersLoading: boolean;
  moreFiltersLoaded: boolean;
}

export interface PagerSlice {
  currentPage: number;
  totalPages: number;
}

export interface HplSlice {
  hplProducts: HplProduct[];
  hplLoading: boolean;
  currentLang: Lang;
}

/** Aggregate stats for one product category (a summary, not a list). */
export interface CategoryStat {
  category: string;
  count: number;
  averagePrice: number;
  totalValue: number;
}

export interface StatsSlice {
  categoryStats: CategoryStat[];
}
