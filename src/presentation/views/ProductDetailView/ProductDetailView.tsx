import React from "react";
import type { ProductDetailViewModel } from "@application/viewmodels/ProductDetailViewModel";
import { useViewModelSelector } from "@presentation/hooks/useViewModelSelector";
import { prTexts } from "./productTexts";

interface ProductDetailViewProps {
  viewModel: ProductDetailViewModel;
}

const ProductDetailView: React.FC<ProductDetailViewProps> = ({ viewModel }) => {
  // The detail view reads the whole record; select it as a single slice.
  const data = useViewModelSelector(viewModel, (vm) => vm.getData());

  if (data.error) {
    return <div dir={data.currentLang === 'ar' ? 'rtl' : 'ltr'}>{prTexts.loadError[data.currentLang]}: {data.error}</div>;
  }

  if (!data.product) {
    return <div dir={data.currentLang === 'ar' ? 'rtl' : 'ltr'}>{prTexts.notFound[data.currentLang]}</div>;
  }

  return (
    <div className="product-detail-container" dir={data.currentLang === 'ar' ? 'rtl' : 'ltr'}>
      <h1>{data.product.name}</h1>
      <p><strong>{prTexts.category[data.currentLang]}</strong> {data.product.category}</p>
      <p><strong>{prTexts.price[data.currentLang]}</strong> {data.product.price.toFixed(2)}</p>
      <p><strong>{prTexts.description[data.currentLang]}</strong> {data.product.description}</p>
    </div>
  );
};

export default ProductDetailView;
