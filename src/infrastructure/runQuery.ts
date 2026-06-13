import type { BaseQuery } from "@application/queries/BaseQuery";
import type { QueryKey } from "@domain/queries/keys";
import { queryHandlers } from "./queryRegistry";

export function runQuery<Q extends BaseQuery<any, any>>(query: Q): Promise<Q["__result"]> {
  const handler = queryHandlers[query.key as QueryKey];
  if (!handler) {
    throw new Error(`runQuery: no handler for "${query.key}"`);
  }
  return handler(query.getParams());
}
