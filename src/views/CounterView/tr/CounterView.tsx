import React, { useState } from 'react';
import { useViewModel } from '../../../hooks/useViewModel';
import { CounterViewModel } from '../../../viewmodels/CounterViewModel';

interface CounterViewProps {
    initialData: ReturnType<CounterViewModel['getData']>;
}

const CounterView: React.FC<CounterViewProps> = ({ initialData }) => {
    const [viewModel] = useState(() => new CounterViewModel(initialData));
    const data = useViewModel(viewModel);

    return (
        <div>
            <h1>SAYAÇ: {data.count}</h1>
            <button onClick={() => viewModel.runAttachedFunction('increment')}>Arttır</button>
            <button onClick={() => viewModel.runAttachedFunction('decrement')}>Azalt</button>
        </div>
    );
};

export default CounterView;
