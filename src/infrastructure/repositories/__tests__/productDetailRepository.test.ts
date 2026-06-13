import { describe, it, expect, vi } from 'vitest';
import { getProductDetail } from '../productDetailRepository';
import api from '../../api/api';
import type { Product } from '@domain/models/product';
import type { Mock } from 'vitest';

vi.mock('../../api/api', () => ({
  default: {
    fetchProductDetail: vi.fn(),
  },
}));

describe('productDetailRepository', () => {
  it('should call api.fetchProductDetail with the correct id and language', async () => {
    const id = 1;
    const lang = 'en';

    await getProductDetail({ id, lang });
    expect(api.fetchProductDetail).toHaveBeenCalledWith(id, lang);
  });

  it('should return the product detail from the api', async () => {
    const product: Product = { id: 1, name: 'Laptop', category: 'Electronics', description: 'A laptop', price: 1200 };
    (api.fetchProductDetail as Mock).mockResolvedValue(product);

    const result = await getProductDetail({ id: 1, lang: 'en' });
    expect(result).toEqual(product);
  });
});
