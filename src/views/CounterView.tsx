import React, { useState } from 'react';
import { useViewModel } from '../hooks/useViewModel';
import { CounterViewModel } from '../viewmodels/CounterViewModel';

interface CounterViewProps {
    initialState: ReturnType<CounterViewModel['getState']>;
}

const CounterView: React.FC<CounterViewProps> = ({ initialState }) => {
    const [viewModel] = useState(() => new CounterViewModel(initialState));
    const state = useViewModel(viewModel);

    return (
        <div>
            <h1>Counter: {state.count}</h1>
            <button onClick={() => viewModel.dispatch('increment')}>Increment</button>
            <button onClick={() => viewModel.dispatch('decrement')}>Decrement</button>
        </div>
    );
};

export default CounterView;
