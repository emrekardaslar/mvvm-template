import React from "react";

import "./ProductDetail.css";
import type { ProductDetailViewModel } from "@application/viewmodels/ProductDetailViewModel";
import { useViewModelSelector } from "@presentation/hooks/useViewModelSelector";
import { prTexts } from "./productTexts";

interface ProductDetailViewProps {
  viewModel: ProductDetailViewModel;
}

const ProductDetailView: React.FC<ProductDetailViewProps> = ({ viewModel }) => {
  // The detail view reads the whole record; select it as a single slice.
  const data = useViewModelSelector(viewModel, (vm) => vm.getData());
  const dir = data.currentLang === "ar" ? "rtl" : "ltr";

  if (data.error) {
    return (
      <div className="product-detail-message error" dir={dir}>
        {prTexts.loadError[data.currentLang]}: {data.error}
      </div>
    );
  }

  if (!data.product) {
    return (
      <div className="product-detail-message" dir={dir}>
        {prTexts.notFound[data.currentLang]}
      </div>
    );
  }

  return (
    <article className="product-detail-container" dir={dir}>
      <div className="product-detail-header">
        <h1>{data.product.name}</h1>
        <span className="product-detail-category">{data.product.category}</span>
      </div>

      <p className="product-detail-price">
        {prTexts.price[data.currentLang]}: {data.product.price.toFixed(2)}
      </p>

      <span className="product-detail-section-label">
        {prTexts.description[data.currentLang]}
      </span>
      <p className="product-detail-description">{data.product.description}</p>
    </article>
  );
};

export default ProductDetailView;
