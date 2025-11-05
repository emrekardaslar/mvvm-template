import { BaseViewModel } from "./BaseViewModel";
import eventBus from "../services/eventBus";

interface CounterData {
  count: number;
  isLoading: boolean;
  title: string;
  increment: string;
  decrement: string;
}

const translations = {
  en: {
    title: "Counter",
    increment: "Increment",
    decrement: "Decrement",
  },
  tr: {
    title: "SAYAÇ",
    increment: "Artır",
    decrement: "Azalt",
  },
  ar: {
    title: "العداد",
    increment: "زيادة",
    decrement: "إنقاص",
  },
};

export class CounterViewModel extends BaseViewModel<CounterData> {
  public currentLang: "en" | "tr" | "ar" = "en";

  constructor(initialData?: Partial<CounterData>) {
    super({
      count: initialData?.count || 0,
      isLoading: false,
      title: translations["en"].title,
      increment: translations["en"].increment,
      decrement: translations["en"].decrement,
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
        title: translations[payload.lang].title,
        increment: translations[payload.lang].increment,
        decrement: translations[payload.lang].decrement,
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
