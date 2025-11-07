import React, { useState } from 'react'
import { useViewModel } from '../../hooks/useViewModel';
import { PagerViewModel } from '../../viewmodels/PagerViewModel';
import type { PagerViewProps } from '../../models/pager';

const Pager: React.FC<PagerViewProps> = ({
    initialData
}) =>
     {
    const [viewModel] = useState(() => new PagerViewModel());
    const { page, totalPages } = useViewModel(viewModel);
    
    return (
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <button
                onClick={() => viewModel.runAttachedFunction("changePage", {page: page-1}) }
                disabled={page === 1}
            >
                ◀
            </button>

            <span>
                {page} / {totalPages}
            </span>

            <button
                onClick={() => viewModel.runAttachedFunction("changePage", { page: page + 1 })}
                disabled={page === totalPages}
            >
                ▶
            </button>
        </div>
    );
}

export default Pager