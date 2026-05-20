import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ProductViewModel } from '../ProductViewModel';
import api from '@infrastructure/api/api';
import eventBus from '../../events/eventBus';
import { FilterEvents } from '@domain/events/filter';
import { PagerEvents } from '@domain/events/pager';


// Mock the api service
vi.mock('@infrastructure/api/api', () => ({
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
    const data = viewModel.getData();
    expect(data.products).toEqual([]);
    expect(data.isLoading).toBe(false);
    expect(data.currentFilter).toBe("All");
    expect(data.currentPage).toBe(1);
  });

  it('should fetch products when filter changes', async () => {
    eventBus.dispatch(FilterEvents.Changed, { filter: 'Category A' });
    await vi.runAllTimersAsync();

    expect(api.fetchProducts).toHaveBeenCalledWith('en', 'Category A', 1);
    const data = viewModel.getData();
    expect(data.products).toEqual([{ id: 1, name: 'Product 1', category: 'Category A' }]);
    expect(data.currentFilter).toBe('Category A');
    expect(data.currentLang).toBe('en');
  });

  it('should set isLoading to true while fetching products', async () => {
    vi.mocked(api.fetchProducts).mockImplementationOnce(() => {
      return new Promise(resolve => setTimeout(() => resolve([]), 100));
    });

    eventBus.dispatch(FilterEvents.Changed, { filter: 'Category A' });

    expect(viewModel.getData().isLoading).toBe(true);

    await vi.runAllTimersAsync(); // Ensure the setTimeout resolves
    expect(viewModel.getData().isLoading).toBe(false);
  });

  it('should fetch products when page changes', async () => {
    eventBus.dispatch(PagerEvents.Changed, { page: 2 });
    await vi.runAllTimersAsync();

    expect(api.fetchProducts).toHaveBeenCalledWith('en', 'All', 2);
    expect(viewModel.getData().currentPage).toBe(2);
  });
});
