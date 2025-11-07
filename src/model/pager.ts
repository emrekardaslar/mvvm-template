import type { PagerViewModel } from "../viewmodels/PagerViewModel";

export interface PagerData {
    page: number;
    totalPages: number;
}

export interface PagerViewProps {
    initialData: PagerData
}
