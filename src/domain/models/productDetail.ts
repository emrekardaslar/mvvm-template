import type { ProductDetailViewModel } from "@application/viewmodels/ProductDetailViewModel";
import type { Product } from "./product";
import type { Lang } from "./language";


export interface ProductDetailViewProps {
  data: ProductDetailData;
  viewModel: ProductDetailViewModel;
}

export interface ProductDetailData {
  product: Product | undefined;
  isLoading: boolean;
  currentLang: Lang;
  error: string | null;
}
