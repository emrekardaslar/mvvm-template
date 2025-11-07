import React from "react";
import type { FilterViewProps } from "../../../models/filter";

const FilterView: React.FC<FilterViewProps> = ({ data, viewModel }) => {
  const onFilterClick = (filter: string) => {
    viewModel.runAttachedFunction("selectFilter", { filter });
  };

  return (
    <div>
      <h3>Filters</h3>
      {data?.filters?.map((filter) => (
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
