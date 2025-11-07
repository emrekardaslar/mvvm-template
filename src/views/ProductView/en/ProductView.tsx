import React from "react";
import type { ProductViewProps } from "../../../models/product";

const ProductView: React.FC<ProductViewProps> = ({ data, viewModel }) => {
  return (
    <div>
      <h3>Products</h3>
      {data.isLoading ? (
        <p>Loading...</p>
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
