import { BaseViewModel } from './BaseViewModel';

interface CounterData {
    count: number;
}

export class CounterViewModel extends BaseViewModel<CounterData> {
    constructor(initialData?: CounterData) {
        super(initialData || { count: 0 });
        this.registerEvent('increment', this.handleIncrement);
        this.registerEvent('decrement', this.handleDecrement);
    }

    private handleIncrement = () => {
        this.setData({ count: this.data.count + 1 });
    };

    private handleDecrement = () => {
        this.setData({ count: this.data.count - 1 });
    };
}
