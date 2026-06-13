import React from "react";
import type { ComponentType } from "react";

import type { BaseViewModel } from "@application/viewmodels/BaseViewModel";
import { setViewModel, clearViewModel } from "@application/viewmodels/viewModelRegistry";

/**
 * View ↔ ViewModel connector: constructs the page's ViewModel and owns its
 * lifecycle (onMount/onUnmount), then renders the given View ONCE.
 *
 * It deliberately does NOT subscribe to the ViewModel. The View and its leaf
 * components connect to the slices they read via `useViewModelSelector`, so a
 * state change re-renders only the components that read the changed slice —
 * not the whole page.
 */
interface MvvmViewProps<
  TData,
  TViewModel extends BaseViewModel<TData, any>
> {
  ViewModelClass: new (initialData?: Partial<TData>) => TViewModel;
  initialData: Partial<TData>;
  View: ComponentType<{ viewModel: TViewModel }>;
}

function MvvmView<
  TData,
  TViewModel extends BaseViewModel<TData, any>
>({
  ViewModelClass,
  initialData,
  View,
}: MvvmViewProps<TData, TViewModel>) {
  const [viewModel] = React.useState(() => new ViewModelClass(initialData));

  React.useEffect(() => {
    // Re-assert as the active page VM in case another VM was constructed since
    // (e.g. React Strict Mode double-invoke), then clear it on unmount.
    setViewModel(viewModel);
    viewModel.onMount();
    return () => {
      viewModel.onUnmount();
      clearViewModel(viewModel);
    };
  }, [viewModel]);

  return <View viewModel={viewModel} />;
}

export default MvvmView;
