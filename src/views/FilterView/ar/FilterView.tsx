import React, { useState } from "react";
import { useViewModel } from "../../../hooks/useViewModel";
import { FilterViewModel } from "../../../viewmodels/FilterViewModel";

interface FilterViewProps {
  initialData: ReturnType<FilterViewModel["getData"]>;
}

const FilterView: React.FC<FilterViewProps> = ({ initialData }) => {
  const [viewModel] = useState(() => new FilterViewModel(initialData));
  const data = useViewModel(viewModel);

  const onFilterClick = (filter: string) => {
    viewModel.runAttachedFunction("selectFilter", { filter });
  };

  return (
    <div>
      <h3>المرشحات</h3>
      {data.filters.map((filter) => (
        <button
          key={filter}
          onClick={() => onFilterClick(filter)}
          style={{
            fontWeight: data.selectedFilter === filter ? "bold" : "normal",
          }}
        >
          {filter}
        </button>
      ))}
    </div>
  );
};

export default FilterView;
