import React from "react";

import "../ProductList.css";
import { ProductViewModel } from "@application/viewmodels/ProductViewModel";
import type { ProductData, ProductViewProps } from "@domain/models/product";
import MvvmView from "@presentation/components/MvvmView";
import FilterView from "../../FilterView/ar/FilterView";
import Pager from "../../PagerView/Pager";

const ProductView: React.FC<ProductViewProps> = ({ data, viewModel }) => {
  return (
    <div dir="rtl">
      <FilterView data={data} viewModel={viewModel} />
      <div className={`product-list-container ${data.isLoading ? 'loading' : ''}`}>
        <h3>المنتجات</h3>
        {data.error && <p className="product-list-error">فشل تحميل المنتجات: {data.error}</p>}
        <ul className="product-list">
          {data.products.map((product) => (
            <li key={product.id} className="product-item">
              <a href={`/products/${product.id}?lang=${data.currentLang}`}>
              {product.name} ({product.category})
              </a>
            </li>
          ))}
        </ul>
        <Pager data={data} viewModel={viewModel} />
      </div>
    </div>
  );
};

// Island entry: constructs the ViewModel and renders this view.
const ProductViewIsland: React.FC<{ initialData: Partial<ProductData> }> = ({ initialData }) => (
  <MvvmView View={ProductView} ViewModelClass={ProductViewModel} initialData={initialData} />
);

export default ProductViewIsland;
