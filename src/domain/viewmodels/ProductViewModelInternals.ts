import type { ProductData } from "@domain/models/product";
import type { ProductViewModelEvents } from "@domain/events/productViewModelEvents";

/**
 * The surface mixin methods rely on from the composed ViewModel. Mixin objects
 * are typed `ThisType<ProductViewModelInternals>` so that inside their methods
 * `this` exposes the ViewModel state and the shared helpers — even though the
 * objects are merged onto the prototype with Object.assign rather than via
 * class inheritance.
 */
export interface ProductViewModelInternals {
  data: ProductData;
  setData(newData: Partial<ProductData>): void;
  registerEvent<K extends keyof ProductViewModelEvents>(
    eventName: K,
    handler: (payload: ProductViewModelEvents[K]) => void,
  ): void;
  // Product-list behavior owned by ProductViewModel; the Pager/Filters mixins
  // trigger a refetch through it.
  fetchProducts(override?: { filter?: string | null; page?: number }): void;
}
