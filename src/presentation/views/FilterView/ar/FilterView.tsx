import React from "react";

import "../Filter.css";
import type { ProductViewModel } from "@application/viewmodels/ProductViewModel";
import { FilterEvents } from "@domain/events/filter";
import { useViewModelSelector } from "@presentation/hooks/useViewModelSelector";

interface FilterViewProps {
  viewModel: ProductViewModel;
}

const FilterView: React.FC<FilterViewProps> = ({ viewModel }) => {
  const { filters, currentFilter, moreFiltersLoading, moreFiltersLoaded } = useViewModelSelector(viewModel, (vm) => vm.getFilters());

  return (
    <div className="filter-container" dir="rtl">
      <h3>المرشحات</h3>
      <div className="filter-buttons">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => viewModel.dispatchEvent(FilterEvents.Select, { filter })}
            className={`filter-button ${currentFilter === filter ? "selected" : ""}`}>
            {filter}
          </button>
        ))}
      </div>
      {!moreFiltersLoaded && (
        <button
          className="filter-load-more"
          onClick={() => viewModel.dispatchEvent(FilterEvents.LoadMore, undefined)}
          disabled={moreFiltersLoading}>
          {moreFiltersLoading ? "جارٍ التحميل…" : "تحميل المزيد من المرشحات"}
        </button>
      )}
    </div>
  );
};

export default FilterView;
