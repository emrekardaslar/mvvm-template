import React from "react";

import "../ProductList.css";
import type { ProductViewProps } from "@domain/models/product";
import FilterView from "../../FilterView/tr/FilterView";
import Pager from "../../PagerView/Pager";

const ProductView: React.FC<ProductViewProps> = ({ data, viewModel }) => {
  return (
    <div>
      <FilterView data={data} viewModel={viewModel} />
      <div className={`product-list-container ${data.isLoading ? 'loading' : ''}`}>
        <h3>Ürünler</h3>
        {data.error && <p className="product-list-error">Ürünler yüklenemedi: {data.error}</p>}
        <ul className="product-list">
          {data.products.map((product) => (
            <li key={product.id} className="product-item">
              <a href={`/products/${product.id}?lang=${data.currentLang}`}>
              {product.name} <span dir="ltr">({product.category})</span>
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
