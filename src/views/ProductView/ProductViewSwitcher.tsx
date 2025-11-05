import React, { useState, Suspense } from "react";
import { viewMap } from "../../services/viewMap";
import { LanguageViewModel } from "../../viewmodels/LanguageViewModel";
import { useViewModel } from "../../hooks/useViewModel";
import type { Product } from "../../services/api";

interface ProductViewProps {
  initialData: {
    products: Product[];
    isLoading: boolean;
  };
}

const ProductViewSwitcher: React.FC<ProductViewProps> = ({ initialData }) => {
  const [languageViewModel] = useState(() => new LanguageViewModel());
  const languageData = useViewModel(languageViewModel);
  const View = viewMap("ProductView", languageData.currentLanguage);

  return <View initialData={initialData} />;
};

export default ProductViewSwitcher;
