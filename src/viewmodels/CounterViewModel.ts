import { BaseViewModel } from "./BaseViewModel";
import eventBus from "../services/eventBus";

interface CounterData {
  count: number;
  isLoading: boolean;
}

export class CounterViewModel extends BaseViewModel<CounterData> {
  public currentLang: "en" | "tr" | "ar" = "en";

  constructor(initialData?: Partial<CounterData>) {
    super({
      count: initialData?.count || 0,
      isLoading: false,
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
    this.currentLang = payload.lang;
    this.setData({ isLoading: true });
    setTimeout(() => {
      this.setData({
        isLoading: false,
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
