import { useEffect, useRef, useState } from 'react';
import type { BaseViewModel } from '@application/viewmodels/BaseViewModel';
import { shallowEqual } from './shallowEqual';

/**
 * Subscribe to a slice of a ViewModel and re-render only when that slice
 * changes. The selector receives the ViewModel, so it can call slice getters
 * (e.g. `v => v.getPager()`); those return fresh objects, which the default
 * shallow-equal comparator handles correctly.
 *
 * @param viewModel The ViewModel to subscribe to.
 * @param selector  Picks the slice this component cares about, from the VM.
 * @param isEqual   Compares previous/next slice. Defaults to shallow equality,
 *   correct for primitives and freshly-built one-level slice objects. Pass a
 *   custom comparator for deeper structures.
 * @returns The selected slice; the component re-renders only when it changes.
 */
export function useViewModelSelector<TViewModel extends BaseViewModel<any, any>, S>(
  viewModel: TViewModel,
  selector: (viewModel: TViewModel) => S,
  isEqual: (a: S, b: S) => boolean = shallowEqual,
): S {
  const [, forceRender] = useState(0);

  // Keep the latest selector/isEqual without re-subscribing on every render.
  const selectorRef = useRef(selector);
  const isEqualRef = useRef(isEqual);
  selectorRef.current = selector;
  isEqualRef.current = isEqual;

  // Hold the current slice in a ref so the subscription can compare against it
  // without the effect depending on it.
  const selectedRef = useRef<S>(selector(viewModel));

  useEffect(() => {
    const check = () => {
      const next = selectorRef.current(viewModel);
      if (!isEqualRef.current(selectedRef.current, next)) {
        selectedRef.current = next;
        forceRender((n) => n + 1);
      }
    };

    const unsubscribe = viewModel.subscribe(check);

    // Reconcile any change that happened between first render and subscription.
    check();

    return unsubscribe;
  }, [viewModel]);

  return selectedRef.current;
}
