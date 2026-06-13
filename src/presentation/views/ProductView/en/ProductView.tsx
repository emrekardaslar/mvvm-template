import React from "react";

import { ProductViewModel } from "@application/viewmodels/ProductViewModel";
import type { ProductData } from "@domain/models/product";
import MvvmView from "@presentation/components/MvvmView";
import FilterView from "../../FilterView/en/FilterView";
import ProductList from "../ProductList";
import HorizontalProductList from "../HorizontalProductList";
import CategoryStats from "../CategoryStats";

export const ProductView: React.FC<{ viewModel: ProductViewModel }> = ({ viewModel }) => {
  return (
    <div className="product-view">
      <FilterView viewModel={viewModel} />
      <CategoryStats
        viewModel={viewModel}
        heading="Category overview"
        labels={{ count: "Items", avg: "Avg price", total: "Total value" }}
      />
      <HorizontalProductList viewModel={viewModel} heading="Featured deals" />
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
