import api from '../../services/api';
import type { Product } from '../../domain/models/product';

const productDetailRepository = {
  getProductDetail: (id: number, lang: "en" | "tr" | "ar" = "en"): Promise<Product | undefined> => {
    return api.fetchProductDetail(id, lang);
  },
};

export default productDetailRepository;
