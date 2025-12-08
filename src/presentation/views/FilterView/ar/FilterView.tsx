import React from "react";

import "../Filter.css";
import type { FilterViewProps } from "../../../../domain/models/filter";

const FilterView: React.FC<FilterViewProps> = ({ data, viewModel }) => {

  return (
    <div className="filter-container" dir="rtl">
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
