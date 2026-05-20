import React from "react";

import "../Filter.css";
import type { FilterViewProps } from "@domain/models/filter";
import { FilterEvents } from "@domain/events/filter";

const FilterView: React.FC<FilterViewProps> = ({ data, viewModel }) => {
  return (
    <div className="filter-container">
      <h3>Filtreler</h3>
      <div className="filter-buttons">
        {data?.filters?.map((filter) => (
          <button
            key={filter}
            onClick={() => viewModel.runAttachedFunction(FilterEvents.Select, { filter })}
            className={`filter-button ${data.selectedFilter === filter ? "selected" : ""}`}>
            {filter}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterView;
