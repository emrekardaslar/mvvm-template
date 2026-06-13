import React from "react";

import "./CategoryStats.css";
import type { ProductViewModel } from "@application/viewmodels/ProductViewModel";
import { useViewModelSelector } from "@presentation/hooks/useViewModelSelector";

interface CategoryStatsProps {
  viewModel: ProductViewModel;
  heading: string;
  labels: { count: string; avg: string; total: string };
}

// Selects only the stats slice. These are whole-catalog aggregates, so they
// don't change with the filter — the component just renders the summary.
const CategoryStats: React.FC<CategoryStatsProps> = ({ viewModel, heading, labels }) => {
  const { categoryStats } = useViewModelSelector(viewModel, (vm) => vm.getStats());

  if (categoryStats.length === 0) return null;

  return (
    <section className="stats-container">
      <h3 className="stats-heading">{heading}</h3>
      <div className="stats-grid">
        {categoryStats.map((s) => (
          <div key={s.category} className="stats-card">
            <span className="stats-category">{s.category}</span>
            <div className="stats-rows">
              <div className="stats-row">
                <span className="stats-label">{labels.count}</span>
                <span className="stats-value">{s.count}</span>
              </div>
              <div className="stats-row">
                <span className="stats-label">{labels.avg}</span>
                <span className="stats-value">{s.averagePrice}</span>
              </div>
              <div className="stats-row">
                <span className="stats-label">{labels.total}</span>
                <span className="stats-value">{s.totalValue}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategoryStats;
