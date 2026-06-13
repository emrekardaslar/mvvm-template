import type { BaseViewModel } from "./BaseViewModel";

/**
 * Per-page ViewModel accessor.
 *
 * One ViewModel is active per page. MvvmView registers it on construction;
 * queries (and other non-React code) read it via getViewModel() to build their
 * params from the current state — without the ViewModel having to hand-assemble
 * and pass params at every call site.
 *
 * This is a plain accessor, NOT a React hook: it's called from event handlers,
 * query objects, and during SSR, where React hooks cannot run.
 */
let current: BaseViewModel<any, any> | null = null;

export function setViewModel(viewModel: BaseViewModel<any, any>): void {
  current = viewModel;
}

export function clearViewModel(viewModel: BaseViewModel<any, any>): void {
  // Only clear if it's still the one we registered (avoids a remount race
  // clearing a newer VM).
  if (current === viewModel) current = null;
}

export function getViewModel<T extends BaseViewModel<any, any>>(): T {
  if (!current) {
    throw new Error("getViewModel(): no active ViewModel. Is the page mounted?");
  }
  return current as T;
}
