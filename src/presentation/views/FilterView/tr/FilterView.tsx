import React from "react";

import "../Filter.css";
import type { ProductViewProps } from "@domain/models/product";
import { FilterEvents } from "@domain/events/filter";

const FilterView: React.FC<ProductViewProps> = ({ data, viewModel }) => {
  return (
    <div className="filter-container">
      <h3>Filtreler</h3>
      <div className="filter-buttons">
        {data?.filters?.map((filter) => (
          <button
            key={filter}
            onClick={() => viewModel.dispatchEvent(FilterEvents.Select, { filter })}
            className={`filter-button ${data.currentFilter === filter ? "selected" : ""}`}>
            {filter}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterView;
