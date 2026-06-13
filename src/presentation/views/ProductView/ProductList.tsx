import React from "react";

import "./ProductList.css";
import type { ProductViewModel } from "@application/viewmodels/ProductViewModel";
import { useViewModelSelector } from "@presentation/hooks/useViewModelSelector";
import Pager from "../PagerView/Pager";

interface ProductListProps {
  viewModel: ProductViewModel;
  heading: string;
  errorPrefix: string;
  /** Wrap the category text (e.g. <span dir="ltr">) — varies by language. */
  renderCategory: (category: string) => React.ReactNode;
}

// Selects only the product slice (products / isLoading / error / currentLang),
// so it re-renders when products change but NOT when an unrelated slice such as
// `filters` updates (e.g. "Load more filters").
const ProductList: React.FC<ProductListProps> = ({ viewModel, heading, errorPrefix, renderCategory }) => {
  const { products, isLoading, error, currentLang } = useViewModelSelector(viewModel, (vm) => vm.getProductList());

  return (
    <div className={`product-list-container ${isLoading ? "loading" : ""}`}>
      <h3>{heading}</h3>
      {error && <p className="product-list-error">{errorPrefix}: {error}</p>}
      <ul className="product-list">
        {products.map((product) => (
          <li key={product.id} className="product-item">
            <a href={`/products/${product.id}?lang=${currentLang}`}>
              {product.name} {renderCategory(product.category)}
            </a>
          </li>
        ))}
      </ul>
      <Pager viewModel={viewModel} />
    </div>
  );
};

export default ProductList;
