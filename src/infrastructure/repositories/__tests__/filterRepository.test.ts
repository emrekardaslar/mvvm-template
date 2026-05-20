import { describe, it, expect, vi } from 'vitest';
import filterRepository from '../filterRepository';
import type { Mock } from 'vitest';
import api from '../../api/api';
import { QueryKeys } from '@domain/queries/keys';

vi.mock('../../api/api', () => ({
  default: {
    fetchFilters: vi.fn(),
  },
}));

describe('filterRepository', () => {
  it('should call api.fetchFilters with the correct language', async () => {
    const lang = 'en';
    await filterRepository.run(QueryKeys.GetFilters,{ lang });
    expect(api.fetchFilters).toHaveBeenCalledWith(lang);
  });

  it('should return the filters from the api', async () => {
    const filters = ['All', 'Electronics', 'Apparel'];
    (api.fetchFilters as Mock).mockResolvedValue(filters);

    const result = await filterRepository.run(QueryKeys.GetFilters,{ lang: 'en' });
    expect(result).toEqual(filters);
  });
});
