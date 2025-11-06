import React from "react";
import type { ProductViewProps } from "../../../model/product";

const ProductView: React.FC<ProductViewProps> = ({ data, viewModel }) => {
  return (
    <div>
      <h3>المنتجات</h3>
      {data.isLoading ? (
        <p>جار التحميل...</p>
      ) : (
        <ul>
          {data.products.map((product) => (
            <li key={product.id}>
              {product.name} ({product.category})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProductView;
