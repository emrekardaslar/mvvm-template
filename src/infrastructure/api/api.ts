import type { Product } from "@domain/models/product";
import type { Lang } from "@domain/models/language";
import type { SSRResponse } from "@domain/models/ssr";

let timeoutForApis = 0;

const mockData: SSRResponse = {
  en: {
    products: [
      { id: 1, name: "Laptop", category: "Electronics", description: "Powerful laptop for all your computing needs.", price: 1200 },
      { id: 2, name: "T-Shirt", category: "Apparel", description: "Comfortable cotton t-shirt for everyday wear.", price: 25 },
      { id: 3, name: "Coffee Mug", category: "Kitchen", description: "Ceramic coffee mug, perfect for your morning brew.", price: 10 },
      { id: 4, name: "Gaming Mouse", category: "Electronics", description: "High-precision gaming mouse with customizable buttons.", price: 70 },
      { id: 5, name: "Jeans", category: "Apparel", description: "Classic blue jeans, durable and stylish.", price: 60 },
      { id: 6, name: "Blender", category: "Kitchen", description: "High-speed blender for smoothies and shakes.", price: 90 },
    ],
    filters: ["All", "Electronics", "Apparel", "Kitchen"],
  },
  tr: {
    products: [
      { id: 1, name: "Dizüstü Bilgisayar", category: "Elektronik", description: "Tüm bilgisayar ihtiyaçlarınız için güçlü dizüstü bilgisayar.", price: 1200 },
      { id: 2, name: "Tişört", category: "Giyim", description: "Günlük kullanım için rahat pamuklu tişört.", price: 25 },
      { id: 3, name: "Kahve Kupası", category: "Mutfak", description: "Sabah kahveniz için mükemmel seramik kahve kupası.", price: 10 },
      { id: 4, name: "Oyuncu Faresi", category: "Elektronik", description: "Özelleştirilebilir tuşlara sahip yüksek hassasiyetli oyuncu faresi.", price: 70 },
      { id: 5, name: "Kot Pantolon", category: "Giyim", description: "Klasik mavi kot pantolon, dayanıklı ve şık.", price: 60 },
      { id: 6, name: "Blender", category: "Mutfak", description: "Smoothie ve shake'ler için yüksek hızlı blender.", price: 90 },
    ],
    filters: ["Tümü", "Elektronik", "Giyim", "Mutfak"],
  },
  ar: {
    products: [
      { id: 1, name: "كمبيوتر محمول", category: "إلكترونيات", description: "كمبيوتر محمول قوي لجميع احتياجاتك الحاسوبية.", price: 1200 },
      { id: 2, name: "قميص", category: "ملابس", description: "تي شيرت قطني مريح للارتداء اليومي.", price: 25 },
      { id: 3, name: "كوب قهوة", category: "مطبخ", description: "كوب قهوة سيراميك، مثالي لقهوتك الصباحية.", price: 10 },
      { id: 4, name: "فأرة الألعاب", category: "إلكترونيات", description: "فأرة ألعاب عالية الدقة مع أزرار قابلة للتخصيص.", price: 70 },
      { id: 5, name: "جينز", category: "ملابس", description: "بنطلون جينز أزرق كلاسيكي، متين وأنيق.", price: 60 },
      { id: 6, name: "خلاط", category: "مطبخ", description: "خلاط عالي السرعة للعصائر والمشروبات المخفوقة.", price: 90 },
    ],
    filters: ["الكل", "إلكترونيات", "ملابس", "مطبخ"],
  },
};

const api = {
  fetchProducts: (
    lang: Lang = "en",
    filter: string | null = "All",
    pager: number = 1
  ): Promise<Product[]> => {
    console.log(`Fetching products with lang: ${lang} and filter: ${filter}, page: ${pager}`);
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = mockData[lang];
        const allFilter = data.filters[0];
        if (!filter || filter === allFilter) {
          resolve(data.products);
        } else {
          resolve(data.products.filter((p) => p.category === filter));
        }
      }, timeoutForApis); // Simulate network delay
    });
  },

  fetchFilters: (lang: Lang = "en"): Promise<string[]> => {
    console.log(`Fetching filters with lang: ${lang}`);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockData[lang].filters);
      }, timeoutForApis); // Simulate network delay
    });
  },

  fetchProductDetail: (id: number, lang: Lang = "en"): Promise<Product | undefined> => {
    console.log(`Fetching product detail for id: ${id} with lang: ${lang}`);
    return new Promise((resolve) => {
      setTimeout(() => {
        const product = mockData[lang].products.find(p => p.id === id);
        resolve(product);
      }, timeoutForApis); // Simulate network delay
    });
  },

  fetchSSRData: (): Promise<SSRResponse> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockData);
      }, timeoutForApis); // Simulate network delay
    })
  }
};

export default api;
