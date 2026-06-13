import React from 'react'

import "./Pager.css";
import type { ProductViewModel } from '@application/viewmodels/ProductViewModel';
import { PagerEvents } from '@domain/events/pager';
import { useViewModelSelector } from '@presentation/hooks/useViewModelSelector';

interface PagerProps {
    viewModel: ProductViewModel;
}

// Pager selects only the paging slice, so its own subscription re-renders it
// when currentPage/totalPages change rather than on every unrelated VM update.
const Pager: React.FC<PagerProps> = ({ viewModel }) => {
    const { currentPage, totalPages } = useViewModelSelector(viewModel, (vm) => vm.getPager());

    return (
        <div className="pager-container">
            <button
                className="pager-button"
                onClick={() => viewModel.dispatchEvent(PagerEvents.Change, { page: currentPage - 1 })}
                disabled={currentPage === 1}
            >
                ◀
            </button>

            <span className="pager-info">
                {currentPage} / {totalPages}
            </span>

            <button
                className="pager-button"
                onClick={() => viewModel.dispatchEvent(PagerEvents.Change, { page: currentPage + 1 })}
                disabled={currentPage === totalPages}
            >
                ▶
            </button>
        </div>
    );
};

export default Pager
