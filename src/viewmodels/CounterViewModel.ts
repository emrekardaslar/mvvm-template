import { BaseViewModel } from './BaseViewModel';

interface CounterState {
    count: number;
}

export class CounterViewModel extends BaseViewModel<CounterState> {
    constructor(initialState?: CounterState) {
        super(initialState || { count: 0 });
        this.registerEvent('increment', this.handleIncrement);
        this.registerEvent('decrement', this.handleDecrement);
    }

    private handleIncrement = () => {
        this.setState({ count: this.state.count + 1 });
    };

    private handleDecrement = () => {
        this.setState({ count: this.state.count - 1 });
    };
}
