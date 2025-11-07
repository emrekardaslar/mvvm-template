import type { PagerData } from "../models/pager";
import eventBus from "../services/eventBus";
import { BaseViewModel } from "./BaseViewModel";


export class PagerViewModel extends BaseViewModel<PagerData> {
    constructor(initialData?: Partial<PagerData>) {
        super({
            page: initialData?.page || 1, 
            totalPages: initialData?.totalPages || 32
        })
        this.registerEvent("changePage", this.changePage)
    }
    
    public override onMount(): void {
        eventBus.on("filterChanged", this.onFilterChanged)
        eventBus.on("languageChanged", this.onLanguageChanged)
    }

    public override onUnmount() {
        eventBus.off("filterChanged", this.onFilterChanged);
    }

    private onFilterChanged = (payload: { filter: string }) => {        
        this.setData({page: 1})
    }

    private onLanguageChanged = (payload: {lang: string}) => {
        this.setData({page: 1})
    }

    private changePage =(payload: { page: number }) => {
        this.setData({page: payload.page})
        eventBus.dispatch("pageChanged", {page: payload.page})
    }

}