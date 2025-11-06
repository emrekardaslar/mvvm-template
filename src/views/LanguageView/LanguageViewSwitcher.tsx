import React, { useState } from "react";
import { useViewModel } from "../../hooks/useViewModel";
import { viewMap } from "../../services/viewMap";
import { LanguageViewModel } from "../../viewmodels/LanguageViewModel";

const LanguageViewSwitcher: React.FC = () => {
  const [viewModel] = useState(() => new LanguageViewModel());
  const data = useViewModel(viewModel);

  const View = viewMap("LanguageView", data.currentLanguage);

  return <View data={data} viewModel={viewModel} />;
};

export default LanguageViewSwitcher;
