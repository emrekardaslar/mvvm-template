import React from "react";
import type { FilterViewProps } from "../../../models/filter";
import "../Filter.css";

const FilterView: React.FC<FilterViewProps> = ({ data, viewModel }) => {

  return (
    <div className="filter-container">
      <h3>المرشحات</h3>
      <div className="filter-buttons">
        {data?.filters?.map((filter) => (
          <button
            key={filter}
            onClick={() => viewModel.runAttachedFunction("selectFilter", { filter })}
            className={`filter-button ${data.selectedFilter === filter ? "selected" : ""}`}>
            {filter}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterView;
