import type { Product, HplProduct, CategoryStat } from "@domain/models/product";
import type { Lang } from "@domain/models/language";
import type { SSRResponse } from "@domain/models/ssr";

const timeoutForApis = 0;

// Horizontal product list mock — promo items per filter category. Keyed by the
// English category; other languages reuse the same set with localized names.
const hplByCategory: Record<string, HplProduct[]> = {
  All: [
    { id: 101, name: "Wireless Earbuds", category: "Electronics", price: 59, discountPercent: 20, rating: 4.6, badge: "Hot" },
    { id: 102, name: "Hoodie", category: "Apparel", price: 45, discountPercent: 10, rating: 4.2 },
    { id: 103, name: "Chef Knife", category: "Kitchen", price: 80, discountPercent: 15, rating: 4.8, badge: "Top rated" },
    { id: 104, name: "Smart Watch", category: "Electronics", price: 199, discountPercent: 25, rating: 4.4, badge: "Deal" },
  ],
  Electronics: [
    { id: 111, name: "Mechanical Keyboard", category: "Electronics", price: 120, discountPercent: 30, rating: 4.7, badge: "Deal" },
    { id: 112, name: "USB-C Hub", category: "Electronics", price: 35, discountPercent: 10, rating: 4.1 },
    { id: 113, name: "Noise-Cancel Headphones", category: "Electronics", price: 220, discountPercent: 18, rating: 4.9, badge: "Top rated" },
  ],
  Apparel: [
    { id: 121, name: "Running Shoes", category: "Apparel", price: 90, discountPercent: 20, rating: 4.5, badge: "Hot" },
    { id: 122, name: "Denim Jacket", category: "Apparel", price: 110, discountPercent: 15, rating: 4.3 },
  ],
  Kitchen: [
    { id: 131, name: "Espresso Machine", category: "Kitchen", price: 350, discountPercent: 12, rating: 4.6, badge: "Deal" },
    { id: 132, name: "Cast Iron Pan", category: "Kitchen", price: 55, discountPercent: 8, rating: 4.8, badge: "Top rated" },
  ],
};

// Derive per-category aggregates from a product list.
function computeCategoryStats(products: Product[]): CategoryStat[] {
  const byCategory = new Map<string, Product[]>();
  for (const p of products) {
    const list = byCategory.get(p.category) ?? [];
    list.push(p);
    byCategory.set(p.category, list);
  }
  return [...byCategory.entries()].map(([category, items]) => {
    const totalValue = items.reduce((sum, p) => sum + p.price, 0);
    return {
      category,
      count: items.length,
      averagePrice: Math.round(totalValue / items.length),
      totalValue,
    };
  });
}

const rawMockData: Record<Lang, { products: Product[]; filters: string[]; hpl: HplProduct[] }> = {
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
    hpl: hplByCategory.All,
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
    hpl: hplByCategory.All,
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
    hpl: hplByCategory.All,
  },
};

// Assemble the SSR payload, deriving category stats from each language's products.
const mockData: SSRResponse = {
  en: { ...rawMockData.en, categoryStats: computeCategoryStats(rawMockData.en.products) },
  tr: { ...rawMockData.tr, categoryStats: computeCategoryStats(rawMockData.tr.products) },
  ar: { ...rawMockData.ar, categoryStats: computeCategoryStats(rawMockData.ar.products) },
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

  // Aggregate stats per category, derived from the product mock for the language.
  fetchCategoryStats: (lang: Lang = "en"): Promise<CategoryStat[]> => {
    console.log(`Fetching category stats with lang: ${lang}`);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(computeCategoryStats(mockData[lang].products));
      }, timeoutForApis); // Simulate network delay
    });
  },

  // A separate "source" for additional filters, distinct from the SSR filters.
  fetchMoreFilters: (lang: Lang = "en"): Promise<string[]> => {
    console.log(`Fetching more filters with lang: ${lang}`);
    const extra: Record<Lang, string[]> = {
      en: ["Books", "Toys", "Garden"],
      tr: ["Kitaplar", "Oyuncaklar", "Bahçe"],
      ar: ["كتب", "ألعاب", "حديقة"],
    };
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(extra[lang]);
      }, timeoutForApis); // Simulate network delay
    });
  },

  // Horizontal product list, varying by the selected filter. The filter arrives
  // in the current language, so map it back to the English category key via the
  // language's filter list (filters[0] is the "All" entry).
  fetchHpl: (lang: Lang = "en", filter: string | null = null): Promise<HplProduct[]> => {
    console.log(`Fetching HPL with lang: ${lang} and filter: ${filter}`);
    const localizedFilters = mockData[lang].filters;
    const englishFilters = mockData.en.filters;
    const idx = filter ? localizedFilters.indexOf(filter) : 0;
    const key = idx > 0 ? englishFilters[idx] : "All";
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(hplByCategory[key] ?? hplByCategory.All);
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
