import React from "react";
import type { ProductViewProps } from "../../../model/product";

const ProductView: React.FC<ProductViewProps> = ({ data, viewModel }) => {
  return (
    <div>
      <h3>Ürünler</h3>
      {data.isLoading ? (
        <p>Yükleniyor...</p>
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
