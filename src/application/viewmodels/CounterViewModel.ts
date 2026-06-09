import type { CounterData } from "@domain/models/counter";
import { CounterEvents } from "@domain/events/counter";
import { BaseViewModel } from "./BaseViewModel";


export class CounterViewModel extends BaseViewModel<CounterData> {
  constructor(initialData?: Partial<CounterData>) {
    super({
      count: initialData?.count || 0,
      isLoading: false,
      currentLang: initialData?.currentLang || "en",
    });
    this.registerEvent(CounterEvents.Increment, this.handleIncrement);
    this.registerEvent(CounterEvents.Decrement, this.handleDecrement);
  }

  private handleIncrement = () => {
    this.setData({ count: this.data.count + 1 });
  };

  private handleDecrement = () => {
    this.setData({ count: this.data.count - 1 });
  };
}
