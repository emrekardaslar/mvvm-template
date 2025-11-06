import React from "react";
import LangViewSwitcher from "../../components/LangViewSwitcher";
import { FilterViewModel } from "../../viewmodels/FilterViewModel";

interface FilterViewProps {
  initialData: {
    filters: string[];
    selectedFilter: string | null;
  };
}

const FilterViewSwitcher: React.FC<FilterViewProps> = ({ initialData }) => {
  return (
    <LangViewSwitcher
      ViewModelClass={FilterViewModel}
      initialData={initialData}
      viewName="FilterView"
    />
  );
};

export default FilterViewSwitcher;
