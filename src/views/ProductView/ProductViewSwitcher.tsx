import React from "react";
import { ProductViewModel } from "../../viewmodels/ProductViewModel";
import LangViewSwitcher from "../../services/LangViewSwitcher";
import type { Product } from "../../models/product";

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
