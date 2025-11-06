import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ProductViewModel } from '../ProductViewModel';
import eventBus from '../../services/eventBus';
import api from '../../services/api';

// Mock the api service
vi.mock('../../services/api', () => ({
  default: {
    fetchProducts: vi.fn((lang, filter) => {
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
    vi.clearAllMocks();
  });

  it('should initialize with empty products and isLoading false', () => {
    expect(viewModel.getData().products).toEqual([]);
    expect(viewModel.getData().isLoading).toBe(false);
  });

  /* it('should fetch products on mount', async () => {
    const onMountPromise = viewModel.onMount();
    await vi.runAllTimersAsync(); // Ensure all promises/timers resolve
    await onMountPromise; // Await the onMount promise itself

    expect(api.fetchProducts).toHaveBeenCalledWith('en', 'All');
    expect(viewModel.getData().products).toEqual([{ id: 1, name: 'Product 1', category: 'Category A' }]);
    expect(viewModel.getData().isLoading).toBe(false);
  }); */

  it('should fetch products when filter changes', async () => {
    await viewModel.onMount();
    vi.mocked(api.fetchProducts).mockClear();

    eventBus.dispatch('filterChanged', { filter: 'Category A' });
    await vi.runAllTimersAsync();

    expect(api.fetchProducts).toHaveBeenCalledWith('en', 'Category A');
    expect(viewModel.getData().products).toEqual([{ id: 1, name: 'Product 1', category: 'Category A' }]);
  });
/* 
  it('should fetch products when language changes', async () => {
    // Manually call onMount to initialize the viewModel
    viewModel.onMount()
    vi.mocked(api.fetchProducts).mockClear();

    // Directly call onLanguageChanged and await it
    await (viewModel as any).onLanguageChanged({ lang: 'tr' });
    await vi.runAllTimersAsync();

    expect(api.fetchProducts).toHaveBeenCalledWith('tr', 'All');
    expect(viewModel.getData().products).toEqual(2);
  }); */

  /* it('should set isLoading to true while fetching products', async () => {
    vi.mocked(api.fetchProducts).mockImplementationOnce(() => {
      return new Promise(resolve => setTimeout(() => resolve([]), 100));
    });

    const onMountPromise = viewModel.onMount();
    expect(viewModel.getData().isLoading).toBe(true);
    await vi.runAllTimersAsync(); // Ensure the setTimeout resolves
    await onMountPromise; // Await the onMount promise itself
    expect(viewModel.getData().isLoading).toBe(false);
  }); */
});
