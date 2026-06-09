import React from "react";
import { ProductDetailViewModel } from "@application/viewmodels/ProductDetailViewModel";
import type { ProductDetailData } from "@domain/models/productDetail";
import MvvmView from "@presentation/components/MvvmView";
import ProductDetailView from "./ProductDetailView";


interface ProductDetailViewSwitcherProps {
  initialData: Partial<ProductDetailData>;
}

const ProductDetailViewSwitcher: React.FC<ProductDetailViewSwitcherProps> = ({
  initialData,
}) => {
  return (
    <MvvmView
      View={ProductDetailView}
      ViewModelClass={ProductDetailViewModel}
      initialData={initialData}
    />
  );
};

export default ProductDetailViewSwitcher;
