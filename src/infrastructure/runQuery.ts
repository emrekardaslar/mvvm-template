import type { BaseQuery } from "@application/queries/BaseQuery";
import type { QueryKey } from "@domain/queries/keys";
import { queryHandlers } from "./queryRegistry";

export interface RunQueryOptions {
  /** Toggled true before the fetch and false after (success or failure). */
  onLoading?: (loading: boolean) => void;
  /** Called with a message if the query throws. Default: console.error. */
  onError?: (message: string) => void;
}

/**
 * Runs a query through its registered handler, owning the cross-cutting
 * concerns so call sites don't repeat them:
 *  - toggles loading via onLoading (true → fetch → false in a finally),
 *  - catches failures, reports via onError, and resolves to `undefined`.
 *
 * The caller's `.then` therefore only runs the success path and should guard
 * for `undefined` (the failure result).
 */
export async function runQuery<Q extends BaseQuery<any, any>>(
  query: Q,
  options: RunQueryOptions = {},
): Promise<Q["__result"] | undefined> {
  const { onLoading, onError } = options;
  const handler = queryHandlers[query.key as QueryKey];
  if (!handler) {
    throw new Error(`runQuery: no handler for "${query.key}"`);
  }

  onLoading?.(true);
  try {
    return (await handler(query.getParams())) as Q["__result"];
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    if (onError) onError(message);
    else console.error(`runQuery(${query.key}) failed:`, message);
    return undefined;
  } finally {
    onLoading?.(false);
  }
}
