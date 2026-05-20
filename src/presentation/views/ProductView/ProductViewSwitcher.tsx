import React from "react";
import { ProductViewModel } from "@application/viewmodels/ProductViewModel";
import type { Product } from "@domain/models/product";
import LangViewSwitcher from "@presentation/components/LangViewSwitcher";


interface ProductViewSwitcherProps {
  initialData: {
    products: Product[];
    isLoading: boolean;
  };
}

const ProductViewSwitcher: React.FC<ProductViewSwitcherProps> = ({
  initialData,
}) => {
  return (
    <LangViewSwitcher
      viewName="ProductView"
      ViewModelClass={ProductViewModel}
      initialData={initialData}
    />
  );
};

export default ProductViewSwitcher;
