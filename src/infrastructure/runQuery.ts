import type { BaseQuery } from "@application/queries/BaseQuery";
import type { QueryKey } from "@domain/queries/keys";
import { getViewModel } from "@application/viewmodels/viewModelRegistry";
import { queryHandlers } from "./queryRegistry";

export interface RunQueryOptions {
  /**
   * Which loading flag on the active ViewModel to toggle around the fetch.
   * Defaults to "isLoading". Pass another key for a flag that should not dim
   * other consumers (e.g. "moreFiltersLoading").
   */
  loadingKey?: string;
}

/**
 * Runs a query through its registered handler, owning the cross-cutting
 * concerns so call sites don't repeat them. Against the active ViewModel it:
 *  - toggles the loading flag (true → fetch → false in a finally),
 *  - on failure, writes the message to `error` and resolves to `undefined`.
 *
 * The caller's `.then` therefore only runs the success path and should guard
 * for `undefined` (the failure result).
 */
export async function runQuery<Q extends BaseQuery<any, any>>(
  query: Q,
  options: RunQueryOptions = {},
): Promise<Q["__result"] | undefined> {
  const handler = queryHandlers[query.key as QueryKey];
  if (!handler) {
    throw new Error(`runQuery: no handler for "${query.key}"`);
  }

  const vm = getViewModel();
  vm.setLoading(true, options.loadingKey as never);
  try {
    return (await handler(query.getParams())) as Q["__result"];
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    vm.setError(message);
    return undefined;
  } finally {
    vm.setLoading(false, options.loadingKey as never);
  }
}
