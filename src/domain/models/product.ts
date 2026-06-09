import type { ProductViewModel } from "@application/viewmodels/ProductViewModel";
import type { Lang } from "./language";


export interface ProductViewProps {
  data: ProductData;
  viewModel: ProductViewModel;
}

export interface ProductData {
  products: Product[];
  filters: string[];
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
