import React from "react";
import type { Product } from "../../services/api";
import { ProductViewModel } from "../../viewmodels/ProductViewModel";
import LangViewSwitcher from "../../components/LangViewSwitcher";

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
