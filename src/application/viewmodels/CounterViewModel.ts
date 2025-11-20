import type { CounterData } from "../../domain/models/counter";
import eventBus from "../../services/eventBus";
import { BaseViewModel } from "./BaseViewModel";


export class CounterViewModel extends BaseViewModel<CounterData> {
  constructor(initialData?: Partial<CounterData>) {
    super({
      count: initialData?.count || 0,
      isLoading: false,
      currentLang: initialData?.currentLang || "en",
    });
    this.registerEvent("increment", this.handleIncrement);
    this.registerEvent("decrement", this.handleDecrement);
  }

  public override onMount() {
    eventBus.on("languageChanged", this.onLanguageChanged);
  }

  public override onUnmount() {
    eventBus.off("languageChanged", this.onLanguageChanged);
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
