import type { ProductViewModel } from "@application/viewmodels/ProductViewModel";
import type { Lang } from "./language";


export interface ProductViewProps {
  data: ProductData;
  viewModel: ProductViewModel;
}

export interface ProductData {
  products: Product[];
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
