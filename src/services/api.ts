import type { Product } from "../models/product";
import type { SSRResponse } from "../models/ssr";

const mockData: SSRResponse = {
  en: {
    products: [
      { id: 1, name: "Laptop", category: "Electronics" },
      { id: 2, name: "T-Shirt", category: "Apparel" },
      { id: 3, name: "Coffee Mug", category: "Kitchen" },
      { id: 4, name: "Gaming Mouse", category: "Electronics" },
      { id: 5, name: "Jeans", category: "Apparel" },
      { id: 6, name: "Blender", category: "Kitchen" },
    ],
    filters: ["All", "Electronics", "Apparel", "Kitchen"],
  },
  tr: {
    products: [
      { id: 1, name: "Dizüstü Bilgisayar", category: "Elektronik" },
      { id: 2, name: "Tişört", category: "Giyim" },
      { id: 3, name: "Kahve Kupası", category: "Mutfak" },
      { id: 4, name: "Oyuncu Faresi", category: "Elektronik" },
      { id: 5, name: "Kot Pantolon", category: "Giyim" },
      { id: 6, name: "Blender", category: "Mutfak" },
    ],
    filters: ["Tümü", "Elektronik", "Giyim", "Mutfak"],
  },
  ar: {
    products: [
      { id: 1, name: "كمبيوتر محمول", category: "إلكترونيات" },
      { id: 2, name: "قميص", category: "ملابس" },
      { id: 3, name: "كوب قهوة", category: "مطبخ" },
      { id: 4, name: "فأرة الألعاب", category: "إلكترونيات" },
      { id: 5, name: "جينز", category: "ملابس" },
      { id: 6, name: "خلاط", category: "مطبخ" },
    ],
    filters: ["الكل", "إلكترونيات", "ملابس", "مطبخ"],
  },
  banner: {
    title: "Static Banner",
    subtitle: "Static component that wont rerender",
    backgroundColor: "#0078D4",
    textColor: "#FFFFFF",
  },
  banner2: {
    title: "Another Banner",
    subtitle: "Test if css is imported once",
    backgroundColor: "#008000",
    textColor: "#FFFFFF",
  }
};

const api = {
  fetchProducts: (
    lang: "en" | "tr" | "ar" = "en",
    filter: string | null = "All",
    pager: number = 1
  ): Promise<Product[]> => {
    console.log(`Fetching products with lang: ${lang} and filter: ${filter}`);
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = mockData[lang];
        const allFilter = data.filters[0];
        if (!filter || filter === allFilter) {
          resolve(data.products);
        } else {
          resolve(data.products.filter((p) => p.category === filter));
        }
      }, 500); // Simulate network delay
    });
  },

  fetchFilters: (lang: "en" | "tr" | "ar" = "en"): Promise<string[]> => {
    console.log(`Fetching filters with lang: ${lang}`);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockData[lang].filters);
      }, 300); // Simulate network delay
    });
  },

  fetchSSRData: (): Promise<SSRResponse> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockData);
      }, 300); // Simulate network delay
    })
  }
};

export default api;
