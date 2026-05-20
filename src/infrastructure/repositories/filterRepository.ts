import api from '../api/api';
import { QueryKeys } from '@domain/queries/keys';
import type { GetFiltersParams } from '@application/queries/GetFiltersQuery';

const handlers = {
  [QueryKeys.GetFilters]: (params: GetFiltersParams): Promise<string[]> =>
    api.fetchFilters(params.lang),
};

type Key = keyof typeof handlers;
type ParamsOf<K extends Key> = Parameters<typeof handlers[K]>[0];
type ResultOf<K extends Key> = ReturnType<typeof handlers[K]>;

const filterRepository = {
  run<K extends Key>(key: K, params: ParamsOf<K>): ResultOf<K> {
    return handlers[key](params as any) as ResultOf<K>;
  },
};

export default filterRepository;
