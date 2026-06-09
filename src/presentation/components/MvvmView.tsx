import React from "react";
import type { ComponentType } from "react";

import { useViewModel } from "../hooks/useViewModel";
import type { BaseViewModel } from "@application/viewmodels/BaseViewModel";

/**
 * View ↔ ViewModel connector: constructs the page's ViewModel, subscribes the
 * React tree to it, and renders the given View with the live data + viewModel.
 * The caller (a per-feature *ViewSwitcher) picks which View to pass in.
 */
interface MvvmViewProps<
  TData,
  TViewModel extends BaseViewModel<TData, any>
> {
  ViewModelClass: new (initialData?: Partial<TData>) => TViewModel;
  initialData: Partial<TData>;
  View: ComponentType<{ data: TData; viewModel: TViewModel }>;
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
  const data = useViewModel(viewModel);

  return <View viewModel={viewModel} data={data} />;
}

export default MvvmView;
