export interface Product {
    id: number;
    name: string;
    category: string;
}

const mockProducts: Product[] = [
    { id: 1, name: 'Laptop', category: 'Electronics' },
    { id: 2, name: 'T-Shirt', category: 'Apparel' },
    { id: 3, name: 'Coffee Mug', category: 'Kitchen' },
    { id: 4, name: 'Gaming Mouse', category: 'Electronics' },
    { id: 5, name: 'Jeans', category: 'Apparel' },
    { id: 6, name: 'Blender', category: 'Kitchen' },
];

const mockFilters: string[] = ['All', 'Electronics', 'Apparel', 'Kitchen'];

const api = {
    fetchProducts: (filter: string | null = 'All'): Promise<Product[]> => {
        console.log(`Fetching products with filter: ${filter}`);
        return new Promise(resolve => {
            setTimeout(() => {
                if (!filter || filter === 'All') {
                    resolve(mockProducts);
                } else {
                    resolve(mockProducts.filter(p => p.category === filter));
                }
            }, 500); // Simulate network delay
        });
    },

    fetchFilters: (): Promise<string[]> => {
        console.log('Fetching filters');
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(mockFilters);
            }, 300); // Simulate network delay
        });
    },
};

export default api;
