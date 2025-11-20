import { describe, it, expect, vi } from 'vitest';
import productDetailRepository from '../productDetailRepository';
import api from '../../../services/api';
import type { Product } from '../../../domain/models/product';
import type { Mock } from 'vitest'; 

vi.mock('../../../services/api', () => ({
  default: {
    fetchProductDetail: vi.fn(),
  },
}));

describe('productDetailRepository', () => {
  it('should call api.fetchProductDetail with the correct id and language', async () => {
    const id = 1;
    const lang = 'en';

    await productDetailRepository.getProductDetail(id, lang);
    expect(api.fetchProductDetail).toHaveBeenCalledWith(id, lang);
  });

  it('should return the product detail from the api', async () => {
    const product: Product = { id: 1, name: 'Laptop', category: 'Electronics', description: 'A laptop', price: 1200 };
    (api.fetchProductDetail as Mock).mockResolvedValue(product);

    const result = await productDetailRepository.getProductDetail(1, 'en');
    expect(result).toEqual(product);
  });
});
