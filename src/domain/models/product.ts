import type { ProductViewModel } from "@application/viewmodels/ProductViewModel";


export interface ProductViewProps {
  data: ProductData;
  viewModel: ProductViewModel;
}

export interface ProductData {
  products: Product[];
  isLoading: boolean;
  currentLang: "en" | "tr" | "ar";
  currentFilter: string | null;
  currentPage: number;
}

export interface Product {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
}
