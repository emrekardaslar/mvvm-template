import React from "react";
import { ProductViewModel } from "@application/viewmodels/ProductViewModel";
import type { ProductData } from "@domain/models/product";
import type { Lang } from "@domain/models/language";
import MvvmView from "@presentation/components/MvvmView";
import ProductViewEn from "./en/ProductView";
import ProductViewTr from "./tr/ProductView";
import ProductViewAr from "./ar/ProductView";

const views: Record<Lang, typeof ProductViewEn> = {
  en: ProductViewEn,
  tr: ProductViewTr,
  ar: ProductViewAr,
};

interface ProductViewSwitcherProps {
  initialData: Partial<ProductData>;
}

const ProductViewSwitcher: React.FC<ProductViewSwitcherProps> = ({
  initialData,
}) => {
  const View = views[initialData.currentLang ?? "en"];
  return (
    <MvvmView
      View={View}
      ViewModelClass={ProductViewModel}
      initialData={initialData}
    />
  );
};

export default ProductViewSwitcher;
