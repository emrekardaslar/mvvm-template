import React from 'react'

import "./Pager.css";
import type { ProductViewProps } from '@domain/models/product';
import { PagerEvents } from '@domain/events/pager';

const Pager: React.FC<ProductViewProps> = ({ data, viewModel }) => {
    const { currentPage, totalPages } = data;

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
}

export default Pager
