import React, { useState, useEffect } from "react";
import eventBus from "../../services/eventBus";
import { viewMap } from "../../services/viewMap";
import type { Product } from "../../services/api";

interface ProductViewProps {
  initialData: {
    products: Product[];
    isLoading: boolean;
  };
}

const ProductViewSwitcher: React.FC<ProductViewProps> = ({ initialData }) => {
  const [currentLang, setCurrentLang] = useState<"en" | "tr" | "ar">("en");
  const View = viewMap("ProductView", currentLang);

  useEffect(() => {
    const handleLanguageChange = (payload: { lang: "en" | "tr" | "ar" }) => {
      setCurrentLang(payload.lang);
    };

    eventBus.on("languageChanged", handleLanguageChange);
    return () => eventBus.off("languageChanged", handleLanguageChange);
  }, []);

  return <View initialData={initialData} />;
};

export default ProductViewSwitcher;
