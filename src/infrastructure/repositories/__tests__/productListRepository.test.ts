import { describe, it, expect, vi } from 'vitest';
import productListRepository from '../productListRepository';
import api from '../../../services/api';
import type { Product } from '../../../domain/models/product';
import type { Mock } from 'vitest';

vi.mock('../../../services/api', () => ({
  default: {
    fetchProducts: vi.fn(),
  },
}));

describe('productListRepository', () => {
  it('should call api.fetchProducts with the correct parameters', async () => {
    const lang = 'en';
    const filter = 'Electronics';
    const pager = 1;

    await productListRepository.getProducts(lang, filter, pager);
    expect(api.fetchProducts).toHaveBeenCalledWith(lang, filter, pager);
  });

  it('should return the products from the api', async () => {
    const products: Product[] = [
      { id: 1, name: 'Laptop', category: 'Electronics', description: 'A laptop', price: 1200 },
      { id: 4, name: 'Gaming Mouse', category: 'Electronics', description: 'A mouse', price: 70 },
    ];
    (api.fetchProducts as Mock).mockResolvedValue(products);

    const result = await productListRepository.getProducts('en', 'Electronics', 1);
    expect(result).toEqual(products);
  });
});
