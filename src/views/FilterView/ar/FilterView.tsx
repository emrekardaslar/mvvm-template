import React from "react";
import type { FilterViewProps } from "../../../models/filter";

const FilterView: React.FC<FilterViewProps> = ({ data, viewModel }) => {

  return (
    <div>
      <h3>المرشحات</h3>
      {data?.filters?.map((filter) => (
        <button
          key={filter}
          onClick={() => viewModel.runAttachedFunction("selectFilter", { filter })}
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
