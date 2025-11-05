import { useState, useEffect } from 'react';
import { BaseViewModel } from '../viewmodels/BaseViewModel';

export function useViewModel<TData>(viewModel: BaseViewModel<TData>) {
    const [data, setData] = useState(viewModel.getData());

    useEffect(() => {
        const unsubscribe = viewModel.subscribe(() => {
            setData(viewModel.getData());
        });

        viewModel.onMount();

        return () => {
            unsubscribe();
            viewModel.onUnmount();
        };
    }, [viewModel]);

    return data;
}
