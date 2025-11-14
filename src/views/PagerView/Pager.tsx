import React, { useState } from 'react'
import { useViewModel } from '../../hooks/useViewModel';
import { PagerViewModel } from '../../viewmodels/PagerViewModel';
import type { PagerViewProps } from '../../models/pager';
import "./Pager.css";

const Pager: React.FC<PagerViewProps> = ({
    initialData
}) =>
     {
    const [viewModel] = useState(() => new PagerViewModel(initialData));
    const { page, totalPages } = useViewModel(viewModel);
    
    return (
        <div className="pager-container">
            <button
                className="pager-button"
                onClick={() => viewModel.runAttachedFunction("changePage", {page: page-1}) }
                disabled={page === 1}
            >
                ◀
            </button>

            <span className="pager-info">
                {page} / {totalPages}
            </span>

            <button
                className="pager-button"
                onClick={() => viewModel.runAttachedFunction("changePage", { page: page + 1 })}
                disabled={page === totalPages}
            >
                ▶
            </button>
        </div>
    );
}

export default Pager