import React from "react";

import "../ProductList.css";
import type { ProductViewProps } from "../../../../domain/models/product";

const ProductView: React.FC<ProductViewProps> = ({ data, viewModel }) => {
  return (
    <div className={`product-list-container ${data.isLoading ? 'loading' : ''}`}>
      <h3>المنتجات</h3>
      <ul className="product-list">
        {data.products.map((product) => (
          <li key={product.id} className="product-item">
            <a href={`/products/${product.id}?lang=${data.currentLang}`}>
            {product.name} <span dir="rlt">({product.category})</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductView;
