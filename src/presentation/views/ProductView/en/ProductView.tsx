import React from "react";

import "../ProductList.css";
import type { ProductViewProps } from "@domain/models/product";

const ProductView: React.FC<ProductViewProps> = ({ data }) => {
  return (
    <div className={`product-list-container ${data.isLoading ? 'loading' : ''}`}>
      <h3>Products</h3>
      {data.error && <p className="product-list-error">Failed to load products: {data.error}</p>}
      <ul className="product-list">
        {data.products.map((product) => (
          <li key={product.id} className="product-item">
            <a href={`/products/${product.id}?lang=${data.currentLang}`}>
            {product.name} <span dir="ltr">({product.category})</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductView;
