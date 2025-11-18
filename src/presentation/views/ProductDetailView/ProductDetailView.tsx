import React from "react";
import type { ProductDetailData, ProductDetailViewModel } from "../../viewmodels/ProductDetailViewModel";
import { prTexts } from "./productTexts";

interface ProductDetailViewProps {
  data: ProductDetailData;
  viewModel: ProductDetailViewModel;
}

const ProductDetailView: React.FC<ProductDetailViewProps> = ({ data, viewModel }) => {    
  if (!data.product) {
    return <div>{prTexts.notFound[data.currentLang]}</div>;
  }

  return (
    <div className="product-detail-container">
      <h1>{data.product.name}</h1>
      <p><strong>{prTexts.category[data.currentLang]}</strong> {data.product.category}</p>
      <p><strong>{prTexts.price[data.currentLang]}</strong> ${data.product.price.toFixed(2)}</p>
      <p><strong>{prTexts.description[data.currentLang]}</strong> {data.product.description}</p>
    </div>
  );
};

export default ProductDetailView;
