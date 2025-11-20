import React from "react";

import { FilterViewModel } from "../../viewmodels/FilterViewModel";
import LangViewSwitcher from "../../../services/LangViewSwitcher";

interface FilterViewSwitcherProps {
  initialData: {
    filters: string[];
    selectedFilter: string | null;
  };
}

const FilterViewSwitcher: React.FC<FilterViewSwitcherProps> = ({
  initialData,
}) => {
  return (
    <LangViewSwitcher
      ViewModelClass={FilterViewModel}
      initialData={initialData}
      viewName="FilterView"
    />
  );
};

export default FilterViewSwitcher;
