import React from "react";
import type { ProductViewProps } from "../../../models/product";
import "../ProductList.css";

const ProductView: React.FC<ProductViewProps> = ({ data, viewModel }) => {
  return (
    <div className={`product-list-container ${data.isLoading ? 'loading' : ''}`}>
      <h3>Ürünler</h3>
      <ul className="product-list">
        {data.products.map((product) => (
          <li key={product.id} className="product-item">
            {product.name} <span dir="ltr">({product.category})</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductView;
