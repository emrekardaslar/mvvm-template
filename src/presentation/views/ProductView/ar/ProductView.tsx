import React from "react";

import "../ProductList.css";
import type { ProductViewProps } from "@domain/models/product";
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

export default ProductView;
