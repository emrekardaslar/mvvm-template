import React from "react";

import { ProductViewModel } from "@application/viewmodels/ProductViewModel";
import type { ProductData } from "@domain/models/product";
import MvvmView from "@presentation/components/MvvmView";
import FilterView from "../../FilterView/ar/FilterView";
import ProductList from "../ProductList";
import HorizontalProductList from "../HorizontalProductList";

const ProductView: React.FC<{ viewModel: ProductViewModel }> = ({ viewModel }) => {
  return (
    <div className="product-view" dir="rtl">
      <FilterView viewModel={viewModel} />
      <HorizontalProductList viewModel={viewModel} heading="عروض مميزة" />
      <ProductList
        viewModel={viewModel}
        heading="المنتجات"
        errorPrefix="فشل تحميل المنتجات"
        renderCategory={(category) => <>({category})</>}
      />
    </div>
  );
};

// Island entry: constructs the ViewModel and renders this view.
const ProductViewIsland: React.FC<{ initialData: Partial<ProductData> }> = ({ initialData }) => (
  <MvvmView View={ProductView} ViewModelClass={ProductViewModel} initialData={initialData} />
);

export default ProductViewIsland;
