
import type { PagerData } from "@domain/models/pager";
import { FilterEvents } from "@domain/events/filter";
import { PagerEvents } from "@domain/events/pager";
import eventBus from "../events/eventBus";
import { BaseViewModel } from "./BaseViewModel";


export class PagerViewModel extends BaseViewModel<PagerData> {
    constructor(initialData?: Partial<PagerData>) {
        super({
            page: initialData?.page || 1,
            totalPages: initialData?.totalPages || 32
        })
        this.registerEvent(PagerEvents.Change, this.changePage)
    }

    public override onMount(): void {
        eventBus.on(FilterEvents.Changed, this.onFilterChanged)
    }

    public override onUnmount() {
        eventBus.off(FilterEvents.Changed, this.onFilterChanged);
    }

    private onFilterChanged = () => {
        this.setData({page: 1})
    }

    private changePage =(payload: { page: number }) => {
        this.setData({page: payload.page})
        eventBus.dispatch(PagerEvents.Changed, {page: payload.page})
    }

}