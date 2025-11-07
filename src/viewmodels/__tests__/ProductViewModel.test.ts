import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ProductViewModel } from '../ProductViewModel';
import eventBus from '../../services/eventBus';
import api from '../../services/api';

// Mock the api service
vi.mock('../../services/api', () => ({
  default: {
    fetchProducts: vi.fn((lang, filter, page) => {
      if (lang === 'en') {
        if (filter === 'All') return [{ id: 1, name: 'Product 1', category: 'Category A' }];
        if (filter === 'Category A') return [{ id: 1, name: 'Product 1', category: 'Category A' }];
      }
      if (lang === 'tr') {
        if (filter === 'Tümü') return [{ id: 2, name: 'Ürün 2', category: 'Kategori B' }];
        if (filter === 'Kategori B') return [{ id: 2, name: 'Ürün 2', category: 'Kategori B' }];
      }
      return [];
    }),
  },
}));

describe('ProductViewModel', () => {
  let viewModel: ProductViewModel;

  beforeEach(() => {
    vi.useFakeTimers();
    viewModel = new ProductViewModel();
    viewModel.onMount(); // Mount the view model to register event listeners
    vi.clearAllMocks();
  });

  it('should initialize with empty products, isLoading false, currentFilter "All", and currentPage 1', () => {
    expect(viewModel.getData().products).toEqual([]);
    expect(viewModel.getData().isLoading).toBe(false);
    expect(viewModel.getData().currentFilter).toBe("All");
    expect(viewModel.getData().currentPage).toBe(1);
  });

  it('should fetch products when filter changes', async () => {
    eventBus.dispatch('filterChanged', { filter: 'Category A' });
    await vi.runAllTimersAsync();

    expect(api.fetchProducts).toHaveBeenCalledWith('en', 'Category A', 1);
    expect(viewModel.getData().products).toEqual([{ id: 1, name: 'Product 1', category: 'Category A' }]);
    expect(viewModel.getData().currentFilter).toBe('Category A');
  });

  it('should set isLoading to true while fetching products', async () => {
    vi.mocked(api.fetchProducts).mockImplementationOnce(() => {
      return new Promise(resolve => setTimeout(() => resolve([]), 100));
    });

    eventBus.dispatch('filterChanged', { filter: 'Category A' });

    expect(viewModel.getData().isLoading).toBe(true);

    await vi.runAllTimersAsync(); // Ensure the setTimeout resolves
    expect(viewModel.getData().isLoading).toBe(false);
  });

  it('should fetch products when page changes', async () => {
    eventBus.dispatch('pageChanged', { page: 2 });
    await vi.runAllTimersAsync();

    expect(api.fetchProducts).toHaveBeenCalledWith('en', 'All', 2);
    expect(viewModel.getData().currentPage).toBe(2);
  });
});
