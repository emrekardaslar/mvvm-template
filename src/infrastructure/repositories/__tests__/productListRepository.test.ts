import { describe, it, expect, vi } from 'vitest';
import { getProducts } from '../productListRepository';
import api from '../../api/api';
import type { Product } from '@domain/models/product';
import type { Mock } from 'vitest';

vi.mock('../../api/api', () => ({
  default: {
    fetchProducts: vi.fn(),
  },
}));

describe('productListRepository', () => {
  it('should call api.fetchProducts with the correct parameters', async () => {
    const lang = 'en';
    const filter = 'Electronics';
    const page = 1;

    await getProducts({ lang, filter, page });
    expect(api.fetchProducts).toHaveBeenCalledWith(lang, filter, page);
  });

  it('should return the products from the api', async () => {
    const products: Product[] = [
      { id: 1, name: 'Laptop', category: 'Electronics', description: 'A laptop', price: 1200 },
      { id: 4, name: 'Gaming Mouse', category: 'Electronics', description: 'A mouse', price: 70 },
    ];
    (api.fetchProducts as Mock).mockResolvedValue(products);

    const result = await getProducts({ lang: 'en', filter: 'Electronics', page: 1 });
    expect(result).toEqual(products);
  });
});
