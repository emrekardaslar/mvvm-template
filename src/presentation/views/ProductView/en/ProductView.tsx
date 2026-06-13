import React from "react";

import { ProductViewModel } from "@application/viewmodels/ProductViewModel";
import type { ProductData } from "@domain/models/product";
import MvvmView from "@presentation/components/MvvmView";
import FilterView from "../../FilterView/en/FilterView";
import ProductList from "../ProductList";

export const ProductView: React.FC<{ viewModel: ProductViewModel }> = ({ viewModel }) => {
  return (
    <div>
      <FilterView viewModel={viewModel} />
      <ProductList
        viewModel={viewModel}
        heading="Products"
        errorPrefix="Failed to load products"
        renderCategory={(category) => <span dir="ltr">({category})</span>}
      />
    </div>
  );
};

// Island entry: constructs the ViewModel and renders this view.
const ProductViewIsland: React.FC<{ initialData: Partial<ProductData> }> = ({ initialData }) => (
  <MvvmView View={ProductView} ViewModelClass={ProductViewModel} initialData={initialData} />
);

export default ProductViewIsland;
