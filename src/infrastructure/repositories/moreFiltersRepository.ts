import api from '../api/api';
import { QueryKeys } from '@domain/queries/keys';
import type { GetMoreFiltersParams } from '@application/queries/GetMoreFiltersQuery';

const handlers = {
  [QueryKeys.GetMoreFilters]: (params: GetMoreFiltersParams): Promise<string[]> =>
    api.fetchMoreFilters(params.lang),
};

type Key = keyof typeof handlers;
type ParamsOf<K extends Key> = Parameters<typeof handlers[K]>[0];
type ResultOf<K extends Key> = ReturnType<typeof handlers[K]>;

const moreFiltersRepository = {
  run<K extends Key>(key: K, params: ParamsOf<K>): ResultOf<K> {
    return handlers[key](params as any) as ResultOf<K>;
  },
};

export default moreFiltersRepository;
