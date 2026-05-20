import React, { useState } from 'react'

import { PagerViewModel } from '@application/viewmodels/PagerViewModel';

import "./Pager.css";
import type { PagerViewProps } from '@domain/models/pager';
import { PagerEvents } from '@domain/events/pager';
import { useViewModel } from '@presentation/hooks/useViewModel';

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
                onClick={() => viewModel.runAttachedFunction(PagerEvents.Change, {page: page-1}) }
                disabled={page === 1}
            >
                ◀
            </button>

            <span className="pager-info">
                {page} / {totalPages}
            </span>

            <button
                className="pager-button"
                onClick={() => viewModel.runAttachedFunction(PagerEvents.Change, { page: page + 1 })}
                disabled={page === totalPages}
            >
                ▶
            </button>
        </div>
    );
}

export default Pager