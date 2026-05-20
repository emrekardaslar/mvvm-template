import type { CounterData } from "@domain/models/counter";
import { CounterEvents } from "@domain/events/counter";
import { LanguageEvents } from "@domain/events/language";
import eventBus from "../events/eventBus";
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

  public override onMount() {
    eventBus.on(LanguageEvents.Changed, this.onLanguageChanged);
  }

  public override onUnmount() {
    eventBus.off(LanguageEvents.Changed, this.onLanguageChanged);
  }

  private onLanguageChanged = (payload: { lang: "en" | "tr" | "ar" }) => {
    this.setData({ isLoading: true });
    setTimeout(() => {
      this.setData({
        isLoading: false,
        currentLang: payload.lang,
      });
    }, 500);
  };

  private handleIncrement = () => {
    this.setData({ count: this.data.count + 1 });
  };

  private handleDecrement = () => {
    this.setData({ count: this.data.count - 1 });
  };
}
