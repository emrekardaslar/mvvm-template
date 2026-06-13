import React from "react";

import "./HorizontalProductList.css";
import type { ProductViewModel } from "@application/viewmodels/ProductViewModel";
import { useViewModelSelector } from "@presentation/hooks/useViewModelSelector";

interface HorizontalProductListProps {
  viewModel: ProductViewModel;
  heading: string;
}

// Selects only the HPL slice (hplProducts / hplLoading), so it re-renders when
// the horizontal list changes — independently of the main product list.
const HorizontalProductList: React.FC<HorizontalProductListProps> = ({ viewModel, heading }) => {
  const { hplProducts, hplLoading } = useViewModelSelector(viewModel, (vm) => vm.getHpl());

  return (
    <section className={`hpl-container ${hplLoading ? "loading" : ""}`}>
      <h3 className="hpl-heading">{heading}</h3>
      <div className="hpl-track">
        {hplProducts.map((p) => {
          const finalPrice = (p.price * (1 - p.discountPercent / 100)).toFixed(2);
          return (
            <article key={p.id} className="hpl-card">
              {p.badge && <span className="hpl-badge">{p.badge}</span>}
              <div className={`hpl-card-body ${p.badge ? "has-badge" : ""}`}>
                <h4 className="hpl-name">{p.name}</h4>
                <span className="hpl-category">{p.category}</span>
                <div className="hpl-rating" aria-label={`Rating ${p.rating}`}>
                  ★ {p.rating.toFixed(1)}
                </div>
                <div className="hpl-pricing">
                  <span className="hpl-price">{finalPrice}</span>
                  {p.discountPercent > 0 && (
                    <>
                      <span className="hpl-original">{p.price.toFixed(2)}</span>
                      <span className="hpl-discount">-{p.discountPercent}%</span>
                    </>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default HorizontalProductList;
