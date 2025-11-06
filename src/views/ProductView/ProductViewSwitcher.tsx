import React, { useState, Suspense, useEffect } from "react";
import { viewMap } from "../../services/viewMap";
import { LanguageViewModel } from "../../viewmodels/LanguageViewModel";
import { useViewModel } from "../../hooks/useViewModel";
import type { Product } from "../../services/api";
import { ProductViewModel } from "../../viewmodels/ProductViewModel";
import eventBus from "../../services/eventBus";

interface ProductViewProps {
  initialData: {
    products: Product[];
    isLoading: boolean;
  };
}

const ProductViewSwitcher: React.FC<ProductViewProps> = ({ initialData }) => {
  const [currentLanguage, setCurrentLanguage] = useState<"en" | "tr" | "ar">(
    "en"
  );
  const [viewModel] = useState(() => new ProductViewModel(initialData));

  useEffect(()=>{
    const handleLanguageChange = (payload: { lang: "en" | "tr" | "ar" }) => {
      setCurrentLanguage(payload.lang);
    };
    eventBus.on("languageChanged", handleLanguageChange);
    return () => {
      eventBus.off("languageChanged", handleLanguageChange);
    };
  }, [])

  const View = viewMap("ProductView", currentLanguage);

  return <View viewModel={viewModel} />
};

export default ProductViewSwitcher;
