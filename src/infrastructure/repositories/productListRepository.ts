import api from '../../services/api';
import type { Product } from '../../domain/models/product';

const productListRepository = {
  getProducts: (
    lang: "en" | "tr" | "ar" = "en",
    filter: string | null = "All",
    pager: number = 1
  ): Promise<Product[]> => {
    return api.fetchProducts(lang, filter, pager);
  },
};

export default productListRepository;
