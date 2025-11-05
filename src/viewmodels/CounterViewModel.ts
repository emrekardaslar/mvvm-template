import { BaseViewModel } from "./BaseViewModel";
import eventBus from "../services/eventBus";

interface CounterData {
  count: number;
}

export class CounterViewModel extends BaseViewModel<CounterData> {
  public currentLang: "en" | "tr" | "ar" = "en";

  constructor(initialData?: CounterData) {
    super(initialData || { count: 0 });
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
    console.log("lang: ", payload.lang);

    this.currentLang = payload.lang;
    // Re-render with current data to refresh the view
    this.setData({ count: this.data.count });
  };

  private handleIncrement = () => {
    this.setData({ count: this.data.count + 1 });
  };

  private handleDecrement = () => {
    this.setData({ count: this.data.count - 1 });
  };
}
