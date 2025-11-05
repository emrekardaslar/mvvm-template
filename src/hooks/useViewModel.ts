import { useState, useEffect } from 'react';
import { BaseViewModel } from '../viewmodels/BaseViewModel';

export function useViewModel<TState>(viewModel: BaseViewModel<TState>) {
    const [state, setState] = useState(viewModel.getState());

    useEffect(() => {
        const unsubscribe = viewModel.subscribe(() => {
            setState(viewModel.getState());
        });

        viewModel.onMount();

        return () => {
            unsubscribe();
            viewModel.onUnmount();
        };
    }, [viewModel]);

    return state;
}
