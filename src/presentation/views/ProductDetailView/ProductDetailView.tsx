import React, { useState } from "react";
import { ProductDetailViewModel, type ProductDetailData } from "../../viewmodels/ProductDetailViewModel";
import { prTexts } from "./productTexts";
import { useViewModel } from "../../../hooks/useViewModel";

interface ProductDetailViewProps {
  initialData: ProductDetailData;
}

const ProductDetailView: React.FC<ProductDetailViewProps> = ({ initialData }) => { 
  const [viewModel] = useState(() => new ProductDetailViewModel(initialData));
  const data = useViewModel(viewModel);   

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
